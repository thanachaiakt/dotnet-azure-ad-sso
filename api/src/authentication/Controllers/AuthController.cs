using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Collections.Concurrent;
namespace authentication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        private static readonly ConcurrentDictionary<string, string> _refreshTokens = new();

        public AuthController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] LoginModel model)
        {
            if (model.Username == "admin" && model.Password == "password")
            {
                var token = GenerateJwtToken(model.Username);
                var refreshToken = GenerateRefreshToken();
                _refreshTokens[refreshToken] = model.Username;
                SetTokenCookies(token, refreshToken);
                return Ok(new authentication.Models.ApiResponse<object>(true, new { username = model.Username }, "Login successful"));
            }
            return Unauthorized(new authentication.Models.ApiResponse<object>(false, null, "Invalid credentials"));
        }

        /// <summary>
        /// Exchange a Microsoft MSAL access token (any scope from our tenant) for a
        /// local HttpOnly JWT session cookie.  Works with standard Graph scopes
        /// (openid / profile / email / User.Read) so no custom API scope registration
        /// is needed in Azure Portal.
        /// </summary>
        [HttpPost("exchange-token")]
        [AllowAnonymous]
        public async Task<IActionResult> ExchangeToken()
        {
            // 1. Extract the Bearer token from the Authorization header
            if (!Request.Headers.TryGetValue("Authorization", out var authHeader) ||
                !AuthenticationHeaderValue.TryParse(authHeader.ToString(), out var parsed) ||
                !string.Equals(parsed.Scheme, "Bearer", StringComparison.OrdinalIgnoreCase) ||
                string.IsNullOrWhiteSpace(parsed.Parameter))
            {
                return Unauthorized(new authentication.Models.ApiResponse<object>(false, null, "Missing or invalid Authorization header"));
            }

            var incomingToken = parsed.Parameter!;

            // 2. Decode the JWT without signature verification first — just to read claims
            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(incomingToken))
            {
                return Unauthorized(new authentication.Models.ApiResponse<object>(false, null, "Token is not a valid JWT"));
            }

            JwtSecurityToken jwtToken;
            try
            {
                jwtToken = handler.ReadJwtToken(incomingToken);
            }
            catch
            {
                return Unauthorized(new authentication.Models.ApiResponse<object>(false, null, "Could not parse token"));
            }

            // 3. Verify the token is from our trusted tenant (issuer check)
            var tenantId = _configuration["AzureAd:TenantId"] ?? string.Empty;
            var expectedIssuers = new[]
            {
                $"https://login.microsoftonline.com/{tenantId}/v2.0",  // v2 endpoint
                $"https://sts.windows.net/{tenantId}/"                  // v1 endpoint (legacy)
            };

            // Accept if the issuer contains our tenantId (handles both v1 and v2)
            bool issuerValid = expectedIssuers.Contains(jwtToken.Issuer, StringComparer.OrdinalIgnoreCase)
                            || (!string.IsNullOrEmpty(tenantId) && jwtToken.Issuer.Contains(tenantId, StringComparison.OrdinalIgnoreCase));

            if (!issuerValid)
            {
                return Unauthorized(new authentication.Models.ApiResponse<object>(
                    false, null,
                    $"Token issuer '{jwtToken.Issuer}' is not trusted for this tenant."));
            }

            // 4. Validate the token by calling Microsoft Graph /me
            //    Graph access tokens are not meant to be signature-validated by clients;
            //    the authoritative check is whether Graph accepts the token.
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", incomingToken);

            HttpResponseMessage graphResponse;
            try
            {
                graphResponse = await httpClient.GetAsync(
                    "https://graph.microsoft.com/v1.0/me",
                    HttpContext.RequestAborted);
            }
            catch
            {
                return StatusCode(503, new authentication.Models.ApiResponse<object>(
                    false, null, "Could not reach Microsoft Graph. Please try again."));
            }

            if (!graphResponse.IsSuccessStatusCode)
            {
                return Unauthorized(new authentication.Models.ApiResponse<object>(
                    false, null, "Token rejected by Microsoft Graph."));
            }

            // 5. Extract user identity — prefer JWT claims, fall back to Graph JSON
            string? username = jwtToken.Claims.FirstOrDefault(c => c.Type == "preferred_username")?.Value
                            ?? jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Upn)?.Value
                            ?? jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value
                            ?? jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
                            ?? jwtToken.Claims.FirstOrDefault(c => c.Type == "name")?.Value
                            ?? jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value
                            ?? jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrWhiteSpace(username))
            {
                // Last resort: parse displayName / userPrincipalName from Graph response
                var graphJson = await graphResponse.Content.ReadAsStringAsync();
                using var doc = System.Text.Json.JsonDocument.Parse(graphJson);
                username = doc.RootElement.TryGetProperty("userPrincipalName", out var upn) ? upn.GetString() :
                           doc.RootElement.TryGetProperty("mail", out var mail) ? mail.GetString() :
                           doc.RootElement.TryGetProperty("displayName", out var dn) ? dn.GetString() :
                           "AzureUser";
            }

            // 6. Issue local JWT + refresh cookie
            var localToken = GenerateJwtToken(username ?? "AzureUser");
            var refreshToken = GenerateRefreshToken();
            _refreshTokens[refreshToken] = username;
            SetTokenCookies(localToken, refreshToken);

            return Ok(new authentication.Models.ApiResponse<object>(
                true,
                new { username },
                "Token exchange successful"));
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public IActionResult Refresh()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken) || !_refreshTokens.TryGetValue(refreshToken, out var username))
            {
                return Unauthorized(new authentication.Models.ApiResponse<object>(false, null, "Invalid or expired refresh token"));
            }

            var newJwtToken = GenerateJwtToken(username);
            var newRefreshToken = GenerateRefreshToken();
            _refreshTokens.TryRemove(refreshToken, out _);
            _refreshTokens[newRefreshToken] = username;
            SetTokenCookies(newJwtToken, newRefreshToken);

            return Ok(new authentication.Models.ApiResponse<object>(true, new { username }, "Token refreshed successfully"));
        }

        [HttpPost("logout")]
        [AllowAnonymous]
        public IActionResult Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (!string.IsNullOrEmpty(refreshToken))
                _refreshTokens.TryRemove(refreshToken, out _);

            var opts = new CookieOptions { HttpOnly = true, Secure = false, SameSite = SameSiteMode.Lax, Path = "/" };
            Response.Cookies.Delete("jwt", opts);
            Response.Cookies.Delete("refreshToken", opts);

            return Ok(new authentication.Models.ApiResponse<object>(true, null, "Logout successful"));
        }

        [HttpGet("me")]
        [Authorize(AuthenticationSchemes = "CustomCookie")]
        public IActionResult GetCurrentUser()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.Identity?.Name;
            return Ok(new authentication.Models.ApiResponse<object>(true, new { username }, null));
        }

        // ── Helpers ─────────────────────────────────────────────────────────

        private string GenerateJwtToken(string username)
        {
            var secretKey = _configuration["JwtSettings:Secret"] ?? "this_is_a_very_long_secret_key_for_jwt_which_should_be_replaced_in_production";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(ClaimTypes.Name, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer:   _configuration["JwtSettings:Issuer"]   ?? "http://localhost:5000",
                audience: _configuration["JwtSettings:Audience"] ?? "http://localhost:5000",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string GenerateRefreshToken()
        {
            var bytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        private void SetTokenCookies(string jwtToken, string refreshToken)
        {
            var jwtOpts = new CookieOptions
            {
                HttpOnly = true, Secure = false, SameSite = SameSiteMode.Lax,
                Path = "/", Expires = DateTime.UtcNow.AddMinutes(15)
            };
            var refreshOpts = new CookieOptions
            {
                HttpOnly = true, Secure = false, SameSite = SameSiteMode.Lax,
                Path = "/", Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("jwt", jwtToken, jwtOpts);
            Response.Cookies.Append("refreshToken", refreshToken, refreshOpts);
        }
    }

    public class LoginModel
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}

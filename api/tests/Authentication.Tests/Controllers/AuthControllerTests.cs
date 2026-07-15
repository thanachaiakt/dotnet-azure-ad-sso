using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using authentication.Controllers;
using authentication.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Moq;
using Moq.Protected;
using Xunit;

namespace Authentication.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<IHttpClientFactory> _mockHttpClientFactory;
        private readonly AuthController _controller;
        
        private readonly Mock<HttpContext> _mockHttpContext;
        private readonly Mock<HttpRequest> _mockRequest;
        private readonly Mock<HttpResponse> _mockResponse;
        private readonly Mock<IResponseCookies> _mockResponseCookies;
        private readonly Mock<IRequestCookieCollection> _mockRequestCookies;
        private readonly HeaderDictionary _requestHeaders;

        private string? _capturedJwtCookie;
        private string? _capturedRefreshCookie;
        private bool _jwtCookieDeleted;
        private bool _refreshCookieDeleted;

        public AuthControllerTests()
        {
            _mockConfiguration = new Mock<IConfiguration>();
            _mockHttpClientFactory = new Mock<IHttpClientFactory>();

            // Setup Configuration Defaults
            _mockConfiguration.Setup(c => c["JwtSettings:Secret"]).Returns("my_very_long_test_secret_key_which_should_be_replaced_in_production");
            _mockConfiguration.Setup(c => c["JwtSettings:Issuer"]).Returns("http://localhost:5000");
            _mockConfiguration.Setup(c => c["JwtSettings:Audience"]).Returns("http://localhost:5000");
            _mockConfiguration.Setup(c => c["AzureAd:TenantId"]).Returns("test-tenant-id");

            _controller = new AuthController(_mockConfiguration.Object, _mockHttpClientFactory.Object);

            // Mock HttpContext & Response/Request
            _mockHttpContext = new Mock<HttpContext>();
            _mockRequest = new Mock<HttpRequest>();
            _mockResponse = new Mock<HttpResponse>();
            _mockResponseCookies = new Mock<IResponseCookies>();
            _mockRequestCookies = new Mock<IRequestCookieCollection>();
            _requestHeaders = new HeaderDictionary();

            _mockRequest.SetupGet(r => r.Cookies).Returns(_mockRequestCookies.Object);
            _mockRequest.SetupGet(r => r.Headers).Returns(_requestHeaders);
            
            _mockResponse.SetupGet(r => r.Cookies).Returns(_mockResponseCookies.Object);
            
            _mockHttpContext.SetupGet(h => h.Request).Returns(_mockRequest.Object);
            _mockHttpContext.SetupGet(h => h.Response).Returns(_mockResponse.Object);

            // Setup callbacks to capture cookie operations
            _mockResponseCookies.Setup(c => c.Append("jwt", It.IsAny<string>(), It.IsAny<CookieOptions>()))
                .Callback<string, string, CookieOptions>((key, val, opts) => _capturedJwtCookie = val);

            _mockResponseCookies.Setup(c => c.Append("refreshToken", It.IsAny<string>(), It.IsAny<CookieOptions>()))
                .Callback<string, string, CookieOptions>((key, val, opts) => _capturedRefreshCookie = val);

            _mockResponseCookies.Setup(c => c.Delete("jwt", It.IsAny<CookieOptions>()))
                .Callback<string, CookieOptions>((key, opts) => _jwtCookieDeleted = true);

            _mockResponseCookies.Setup(c => c.Delete("refreshToken", It.IsAny<CookieOptions>()))
                .Callback<string, CookieOptions>((key, opts) => _refreshCookieDeleted = true);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = _mockHttpContext.Object
            };
        }

        [Fact]
        public void Login_WithValidCredentials_ReturnsOkWithTokenAndCookies()
        {
            // Arrange
            var model = new LoginModel { Username = "admin", Password = "password" };

            // Act
            var result = _controller.Login(model);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<ApiResponse<object>>(okResult.Value);
            
            Assert.True(response.Success);
            Assert.Equal("Login successful", response.Message);
            Assert.NotNull(_capturedJwtCookie);
            Assert.NotNull(_capturedRefreshCookie);
        }

        [Fact]
        public void Login_WithInvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var model = new LoginModel { Username = "admin", Password = "wrongpassword" };

            // Act
            var result = _controller.Login(model);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            var response = Assert.IsType<ApiResponse<object>>(unauthorizedResult.Value);
            
            Assert.False(response.Success);
            Assert.Equal("Invalid credentials", response.Message);
            Assert.Null(_capturedJwtCookie);
            Assert.Null(_capturedRefreshCookie);
        }

        [Fact]
        public async Task ExchangeToken_WithMissingHeader_ReturnsUnauthorized()
        {
            // Act
            var result = await _controller.ExchangeToken();

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            var response = Assert.IsType<ApiResponse<object>>(unauthorizedResult.Value);
            Assert.False(response.Success);
            Assert.Equal("Missing or invalid Authorization header", response.Message);
        }

        [Fact]
        public async Task ExchangeToken_WithInvalidJwt_ReturnsUnauthorized()
        {
            // Arrange
            _requestHeaders["Authorization"] = "Bearer not-a-valid-jwt-token";

            // Act
            var result = await _controller.ExchangeToken();

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            var response = Assert.IsType<ApiResponse<object>>(unauthorizedResult.Value);
            Assert.False(response.Success);
            Assert.Equal("Token is not a valid JWT", response.Message);
        }

        [Fact]
        public async Task ExchangeToken_WithUntrustedIssuer_ReturnsUnauthorized()
        {
            // Arrange
            var invalidToken = CreateTestToken("https://untrusted-issuer.com");
            _requestHeaders["Authorization"] = $"Bearer {invalidToken}";

            // Act
            var result = await _controller.ExchangeToken();

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            var response = Assert.IsType<ApiResponse<object>>(unauthorizedResult.Value);
            Assert.False(response.Success);
            Assert.Contains("is not trusted for this tenant", response.Message);
        }

        [Fact]
        public async Task ExchangeToken_WithValidToken_ReturnsOkAndCookies()
        {
            // Arrange
            var tenantId = "test-tenant-id";
            var validIssuer = $"https://login.microsoftonline.com/{tenantId}/v2.0";
            var testToken = CreateTestToken(validIssuer);
            _requestHeaders["Authorization"] = $"Bearer {testToken}";

            // Mock downstream Graph call
            var mockHandler = new Mock<HttpMessageHandler>(MockBehavior.Strict);
            mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req => 
                        req.RequestUri != null && req.RequestUri.ToString() == "https://graph.microsoft.com/v1.0/me" &&
                        req.Method == HttpMethod.Get),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("{\"userPrincipalName\":\"testuser@domain.com\"}")
                });

            var httpClient = new HttpClient(mockHandler.Object);
            _mockHttpClientFactory.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(httpClient);

            // Act
            var result = await _controller.ExchangeToken();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<ApiResponse<object>>(okResult.Value);
            Assert.True(response.Success);
            Assert.Equal("Token exchange successful", response.Message);
            Assert.NotNull(_capturedJwtCookie);
            Assert.NotNull(_capturedRefreshCookie);
        }

        [Fact]
        public void Refresh_WithValidToken_ReturnsNewTokenAndCookies()
        {
            // Arrange
            // 1. Log in to register a refresh token in the static controller dictionary
            var loginModel = new LoginModel { Username = "admin", Password = "password" };
            _controller.Login(loginModel);
            var originalRefreshToken = _capturedRefreshCookie;
            Assert.NotNull(originalRefreshToken);

            // Reset captured cookies
            _capturedJwtCookie = null;
            _capturedRefreshCookie = null;

            // 2. Set the cookie on request mock
            _mockRequestCookies.SetupGet(c => c["refreshToken"]).Returns(originalRefreshToken);

            // Act
            var result = _controller.Refresh();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<ApiResponse<object>>(okResult.Value);
            Assert.True(response.Success);
            Assert.NotNull(_capturedJwtCookie);
            Assert.NotNull(_capturedRefreshCookie);
            Assert.NotEqual(originalRefreshToken, _capturedRefreshCookie); // should rotate refresh tokens
        }

        [Fact]
        public void Refresh_WithInvalidToken_ReturnsUnauthorized()
        {
            // Arrange
            _mockRequestCookies.SetupGet(c => c["refreshToken"]).Returns("non-existent-token");

            // Act
            var result = _controller.Refresh();

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            var response = Assert.IsType<ApiResponse<object>>(unauthorizedResult.Value);
            Assert.False(response.Success);
            Assert.Equal("Invalid or expired refresh token", response.Message);
        }

        [Fact]
        public void Logout_ClearsCookiesAndTokens()
        {
            // Arrange
            _mockRequestCookies.SetupGet(c => c["refreshToken"]).Returns("token-to-log-out");

            // Act
            var result = _controller.Logout();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<ApiResponse<object>>(okResult.Value);
            Assert.True(response.Success);
            Assert.True(_jwtCookieDeleted);
            Assert.True(_refreshCookieDeleted);
        }

        [Fact]
        public void GetCurrentUser_ReturnsUsername()
        {
            // Arrange
            var username = "testuser@domain.com";
            var claims = new[] { new Claim(ClaimTypes.Name, username) };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);
            _mockHttpContext.SetupGet(h => h.User).Returns(principal);

            // Act
            var result = _controller.GetCurrentUser();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<ApiResponse<object>>(okResult.Value);
            Assert.True(response.Success);
            
            // Extract username from anonymous object inside response.Data
            var dataJson = System.Text.Json.JsonSerializer.Serialize(response.Data);
            using var doc = System.Text.Json.JsonDocument.Parse(dataJson);
            var returnedUsername = doc.RootElement.GetProperty("username").GetString();
            Assert.Equal(username, returnedUsername);
        }

        // Helper to generate a test token
        private string CreateTestToken(string issuer, string preferredUsername = "testuser@domain.com")
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("preferred_username", preferredUsername),
                    new Claim("name", "Test User")
                }),
                Issuer = issuer,
                Audience = "http://localhost:5000",
                Expires = DateTime.UtcNow.AddMinutes(5),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes("my_very_long_test_secret_key_which_should_be_replaced_in_production")),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}

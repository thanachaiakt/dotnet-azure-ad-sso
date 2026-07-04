using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace identity_client_web_app.Controllers;

[Authorize(AuthenticationSchemes = "CustomCookie")]
[ApiController]
[Route("api/[controller]")]
public class HomeController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var username = User.Identity?.Name ?? User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
        return Ok(new authentication.Models.ApiResponse<object>(
            true,
            new { user = username, timestamp = DateTime.UtcNow, message = "Hello from the secured .NET API!" },
            "Success"
        ));
    }
}

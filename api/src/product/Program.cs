using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers();

// OpenAPI/Swagger
builder.Services.AddOpenApi();

// CORS — allow product-client on port 5174
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowProductClient", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5174",
                "http://localhost:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Azure AD JWT Bearer authentication (same tenant as the existing auth API)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRouting();

app.UseCors("AllowProductClient");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

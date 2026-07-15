---
description: Guide for building, extending, testing, and troubleshooting the .NET Backend APIs (Authentication and Product services) in this workspace.
---

# API Development Workflow Guide

This workspace contains two distinct ASP.NET Core Web API projects under `api/src/`:
1. **Authentication API** (`api/src/authentication`): Handles local JWT issuance, token exchange with Microsoft Entra ID (Azure AD), refresh tokens, cookies, and local session management.
2. **Product API** (`api/src/product`): A downstream catalogue service protected by Azure AD Bearer tokens.

---

## 📁 Architecture Overview

### 1. Authentication API (`api/src/authentication/`)
* **Port**: `5000` (HTTP) / `5001` (HTTPS)
* **Auth Schemes**: 
  - `AzureAd` - For verifying bearer tokens issued by Entra ID.
  - `CustomCookie` - Cookie-based scheme reading a `jwt` cookie for local sessions.
* **Global Filters**: [ResponseFilter.cs](file:///api/src/authentication/Filters/ResponseFilter.cs) wraps responses in a generic [ApiResponse.cs](file:///api/src/authentication/Models/ApiResponse.cs) envelope (`{ success: bool, data: T, message: string }`).
* **Error Handling**: Uses global [ExceptionHandlingMiddleware.cs](file:///api/src/authentication/Middleware/ExceptionHandlingMiddleware.cs) to catch exceptions, log them, and return a clean 500 error code formatted with `ApiResponse`.

### 2. Product API (`api/src/product/`)
* **Port**: `5001` / `7001`
* **Auth Schemes**: Pure JWT Bearer tokens from Microsoft Entra ID.
* **Data Sources**: Simple in-memory mock catalog located in `Data/MockProductData.cs`.

---

## 🛠️ Step-by-Step Backend Tasks

### 1. RESTORE & BUILD
Always restore packages and build prior to code modifications:
```powershell
# Restore dependencies and build Authentication API
cd api/src/authentication
dotnet restore
dotnet build

# Restore dependencies and build Product API
cd ../product
dotnet restore
dotnet build
```

### 2. CONFIGURATION MANAGEMENT (`appsettings.json`)
* **Local Settings**: Never edit settings files directly without cloning. Create `appsettings.json` using the local `appsettings-example.json`.
* **Important Settings**:
  - `AzureAd:Instance`: `https://login.microsoftonline.com/`
  - `AzureAd:TenantId` & `AzureAd:ClientId`: Retrieved from Azure Active Directory app registrations.
  - `JwtSettings:Secret`: Use a long, cryptographically secure key for JWT signature validation (local dev uses a default placeholder).
* **Git Safety**: Both `appsettings.json` and `appsettings.Development.json` are listed in `.gitignore`. Never force commit them.

### 3. ADDING A CONTROLLER OR ENDPOINT
When adding endpoints or new controllers:
1. **Conventions**:
   - Location: Place under the `Controllers/` directory of the target project.
   - Naming: Suffix the class with `Controller` (e.g. `OrdersController`).
   - Namespace: Match the folder structure (e.g., `authentication.Controllers` or `ProductStoreApi.Controllers`).
2. **Routing & Attributes**:
   - Class-level routing: `[Route("api/[controller]")]`
   - Attributes: `[ApiController]` and authorization (`[Authorize]` or `[AllowAnonymous]`).
3. **Response Schema (Authentication Service)**:
   - Since `ResponseFilter` is active, you don't need to manually wrap the return values with `ApiResponse<T>` unless you are specifying custom messages. The filter will automatically catch standard return types (`Ok()`, objects, status codes) and wrap them.
   - Example:
     ```csharp
     [HttpGet("greet")]
     public IActionResult Greet()
     {
         return Ok(new { text = "Hello World" }); // Automatically wrapped
     }
     ```

### 4. RUNNING & LOCAL DEV
Start both APIs using their `http` profiles for predictable port mappings:
```powershell
# In authentication terminal:
cd api/src/authentication
dotnet run --launch-profile http

# In product terminal:
cd api/src/product
dotnet run --launch-profile http
```

### 5. CORS COMPLIANCE
Ensure any new client apps or changes respect the CORS configurations in `Program.cs`:
* Authentication API: Allows `http://localhost:5173` (Vite Auth Client) with Credentials.
* Product API: Allows `http://localhost:5174` (Product Client) & `http://localhost:5173` (Auth Client).

---

## 🔒 Security Best Practices
1. **Secure Cookies**: In the Auth controller, ensure JWT cookie parameters are secure. Local dev does not enforce `Secure = true` to allow HTTP testing, but production MUST use `Secure = true; SameSite = SameSiteMode.None` (or `Lax` if on same domain).
2. **Error Leakage**: Do not expose internal raw details or exception stack traces directly in API responses. Let the global Exception Handling Middleware capture and return generic error summaries.
3. **Graph Validation**: In `AuthController.cs`, the verification of incoming MSAL Entra ID tokens is validated via a direct downstream endpoint test: `https://graph.microsoft.com/v1.0/me`. Do not change this unless an offline validation is specifically requested.

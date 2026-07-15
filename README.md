# Setup & Running Guide

This guide describes how to configure environment variables, project structure, and run all services in the system. The system is split into the **Frontend Client (React/Vite)** and the **Backend API (.NET Core)**.

![alt text](documents/overview-auth.png)
![alt text](documents/overview-product.png)

---

## 📁 Project Structure
```text
dotnet-azure-ad-sso/
├── api/                           # Backend APIs (.NET)
│   └── src/
│       ├── authentication/         # Authentication API (Port 5000/5001)
│       └── product/                # Product API (Port 5001/7001)
├── client/                        # Main Frontend folder (npm workspaces)
│   ├── auth/                      # Authentication/Main Client application (Port 5173)
│   ├── product/                   # Product Client application (Port 5174)
│   ├── shared/                    # Shared UI Components library
│   ├── package.json               # Configuration for npm workspaces
│   ├── package-lock.json
│   └── .gitignore
└── README.md                      # This guide file
```

---

## ⚙️ Environment Configuration

Before starting any services, copy the template files and fill in the configuration values correctly. **(Do not store passwords or sensitive keys in Git)**

### 1. Client App (client/auth/)
Create the file `client/auth/.env` from the template `client/auth/.env-example`:
```bash
VITE_APP_CLIENT_ID=<YOUR_AZURE_AD_CLIENT_ID>
VITE_APP_TENANT_ID=<YOUR_AZURE_AD_TENANT_ID>
VITE_APP_REDIRECT_URI=http://localhost:5173/signin-oidc
VITE_APP_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/logged-out
VITE_APP_API_ENDPOINT=http://localhost:5000
```

### 2. Product Client App (client/product/)
Create the file `client/product/.env` from the template `client/product/.env-example`:
```bash
VITE_APP_CLIENT_ID=<YOUR_AZURE_AD_CLIENT_ID>
VITE_APP_TENANT_ID=<YOUR_AZURE_AD_TENANT_ID>
VITE_APP_REDIRECT_URI=http://localhost:5174/signin-oidc
VITE_APP_POST_LOGOUT_REDIRECT_URI=http://localhost:5174/logged-out
VITE_APP_PRODUCT_API_ENDPOINT=http://localhost:5001
```

### 3. Authentication API (api/src/authentication/)
Create the file `api/src/authentication/appsettings.json` from the template `appsettings-example.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "TenantId": "<YOUR_AZURE_AD_TENANT_ID>",
    "ClientId": "<YOUR_AZURE_AD_CLIENT_ID>",
    "ClientCertificates": [
      {
        "SourceType": "StoreWithThumbprint",
        "CertificateStorePath": "CurrentUser/My",
        "CertificateThumbprint": "<YOUR_CERTIFICATE_THUMBPRINT>"
      }   
    ],
    "CallbackPath": "/signin-oidc",
    "SignedOutCallbackPath": "/signout-callback-oidc",
    "KnownAuthorities": ["login.contoso.com"]
  },
  "DownstreamApi": {
    "BaseUrl": "https://graph.microsoft.com/v1.0/",
    "RelativePath": "me",
    "Scopes": [ 
      "user.read" 
    ]
  }
}
```

### 4. Product API (api/src/product/)
Create the file `api/src/product/appsettings.json` from the template `appsettings-example.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "TenantId": "<YOUR_AZURE_AD_TENANT_ID>",
    "ClientId": "<YOUR_AZURE_AD_CLIENT_ID>",
    "Audience": "<YOUR_AZURE_AD_CLIENT_ID>"
  }
}
```

---

## 🚀 Installation & Run Guide

### 1. Install Dependencies for Frontend (npm workspaces)
Since the project uses npm workspaces to manage frontend projects, run the installation command from the `client/` folder of the project:
```bash
# Switch to client folder and install all dependencies
cd client
npm install
```

### 2. How to Run Frontend Client

You can start the project in Development Mode in two ways:

#### Option 1: Run from the Client Directory using npm workspace
```bash
cd client

# Run Main Client (Port 5173)
npm run dev --workspace=auth

# Run Product Client (Port 5174)
npm run dev --workspace=product
```

#### Option 2: Run directly in the application folder
*   **For Main Client:**
    ```bash
    cd client/auth
    npm run dev
    ```
*   **For Product Client:**
    ```bash
    cd client/product
    npm run dev
    ```

---

### 3. How to Run Backend API (.NET)

Run the .NET project in Development Mode using CLI or an IDE:

#### Run Authentication API (Port 5000 / 5001)
```bash
cd api/src/authentication
dotnet run
```
Or run with a specific profile from `launchSettings.json`:
```bash
dotnet run --launch-profile http
```

#### Run Product API (Port 5001 / 7001)
```bash
cd api/src/product
dotnet run
```
Or run with a specific profile from `launchSettings.json`:
```bash
dotnet run --launch-profile http
```

---

## 🔒 Security Guidelines
1. **Never Commit Secrets**: The `.env` and `appsettings.json` files are already specified in `.gitignore`. For security reasons, do not commit production values to Git.
2. **Azure AD Enterprise App Registration**: Verify that the **Redirect URIs** in Microsoft Entra ID (Azure Portal) match the ports actually used (e.g., `http://localhost:5173/signin-oidc` and `http://localhost:5174/signin-oidc`).
3. **Front-Channel Logout**: Ensure that the Front-channel logout URL is configured on Azure AD to fully support Single Sign-Out across applications.

## Azure AD Setup Example

![alt text](documents/azure-ad-redirect-uri.png)

![alt text](documents/azure-ad-logout-front-channel-uri.png)
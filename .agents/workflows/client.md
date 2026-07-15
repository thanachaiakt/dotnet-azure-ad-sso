---
description: Guide for building, extending, testing, and troubleshooting the React/Vite Frontend clients (Auth Client, Product Client, and Shared UI) in this workspace.
---

# Client Development Workflow Guide

This workspace organizes the frontend client applications under the `client/` directory as an npm workspace monorepo consisting of:
1. **Authentication/Main Client** (`client/auth`): Core app running on Port `5173`. Manages main authentication and issues token exchange cookies.
2. **Product Client** (`client/product`): Downstream application running on Port `5174` with the base path `/product`.
3. **Shared UI Library** (`client/shared`): Common React components, themes, routing guards, and authentication callback components shared between both clients.

---

## 📁 Architecture & Directory Structure

### 1. Monorepo Workspaces (`client/package.json`)
The root frontend package configures workspaces to allow shared dependency management and symlinking:
```json
{
  "name": "dotnet-azure-ad-sso",
  "private": true,
  "workspaces": [
    "auth",
    "product",
    "shared"
  ]
}
```

### 2. Main Authentication Client (`client/auth/`)
* **Vite Dev Port**: `5173`
* **Purpose**: Primary application hosting user homepages, interactive dashboards, login portals, and session setup.
* **API Interaction**: Proxies requests starting with `/api` to the Authentication API backend on port `5001`.
* **Important Files**:
  * [authConfig.ts](file:///client/auth/src/authConfig.ts): Sets MSAL options, cache location (`sessionStorage`), and backend authentication endpoints.
  * [App.tsx](file:///client/auth/src/App.tsx): Configures router pathways and wires in shared UI callbacks.

### 3. Product Client (`client/product/`)
* **Vite Dev Port**: `5174` (accessed via base path `/product`)
* **Purpose**: Displays product lists and product details, consuming catalogs from the downstream backend Product API.
* **Base Path Handling**: Runs under Vite base route `/product`. Wires in path base adjustments in `App.tsx` dynamically if proxied.
* **Important Files**:
  * [authConfig.ts](file:///client/product/src/authConfig.ts): Houses product-specific MSAL configurations and downstream token scopes.
  * [App.tsx](file:///client/product/src/App.tsx): Wires routing pages and registers SSO hooks.

### 4. Shared UI Library (`client/shared/`)
* **Package Name**: `@sso/shared` (referenced in workspaces and mapped via Vite alias paths)
* **Components Provided**:
  * [AutoLogin.tsx](file:///client/shared/src/components/AutoLogin.tsx): Manages automatic silent sign-in across apps using a shared cookie.
  * [ProtectedRoute.tsx](file:///client/shared/src/components/ProtectedRoute.tsx): Route guard redirecting unauthenticated users to the identity provider.
  * [Navbar.tsx](file:///client/shared/src/components/Navbar.tsx): Common application header bar.
  * [ThemeToggle.tsx](file:///client/shared/src/components/ThemeToggle.tsx): Light/Dark mode toggling hooks and components.
  * Pages: Includes standard [LoggedOut.tsx](file:///client/shared/src/pages/LoggedOut.tsx), [SigninCallback.tsx](file:///client/shared/src/pages/SigninCallback.tsx), and [SignoutCallback.tsx](file:///client/shared/src/pages/SignoutCallback.tsx).

---

## 🔑 Single Sign-On (SSO) & Single Sign-Out Flow

### 1. Silent SSO Mechanism
SSO is achieved silently using `ssoSilent` from MSAL:
* **Cookie-based loginHint sharing**: Once a user successfully logs in to one application, [AutoLogin.tsx](file:///client/shared/src/components/AutoLogin.tsx) sets a `sso_login_hint` cookie with the user's username (UPN/Email) onto the shared domain/localhost.
* **Silent Login**: When the user opens the other application, its `<AutoLogin />` component detects the cookie and triggers MSAL's `ssoSilent` with the login hint. If the IDP session is active, user session is established without prompt.
* **Fallback**: If silent login fails but the cookie is present, MSAL falls back to a redirect login (`loginRedirect`) to smoothly sign the user in with the active IDP session.

### 2. Front-Channel Logout (Single Sign-Out)
Single Sign-Out logs the user out from all clients when sign-out is triggered on one:
* Under `client/auth/src/App.tsx`, the logout callback points to:
  ```tsx
  <Route path="signout-callback-oidc" element={<SignoutCallback additionalLogoutUris={['http://localhost:5174/signout-callback-oidc']} />} />
  ```
* Under `client/product/src/App.tsx`, it mirrors back:
  ```tsx
  <Route path="signout-callback-oidc" element={<SignoutCallback additionalLogoutUris={['http://localhost:5173/signout-callback-oidc']} />} />
  ```
* The `<SignoutCallback />` component renders iframes referencing the additional logout URIs, clearing all local tokens and session states concurrently.

---

## 🛠️ Step-by-Step Frontend Tasks

### 1. ENVIRONMENT CONFIGURATION
Always configure `.env` variables before running applications:
* **Auth App**: Copy `client/auth/.env-example` to `client/auth/.env`
* **Product App**: Copy `client/product/.env-example` to `client/product/.env`

*Important Variable Rules*:
- `VITE_APP_CLIENT_ID` and `VITE_APP_TENANT_ID` must match the Microsoft Entra ID registration parameters.
- `VITE_APP_REDIRECT_URI` must match the respective app's `signin-oidc` route registration (e.g. `http://localhost:5173/signin-oidc` or `http://localhost:5174/signin-oidc`).

### 2. DEPENDENCY INSTALLATION
Run all npm actions from the `client/` root directory to maintain correct lockfiles:
```powershell
# Restore and install packages across workspaces
cd client
npm install
```

### 3. RUNNING IN DEVELOPMENT
You can launch development servers from the root workspace folder:
```powershell
# Start Auth application (Port 5173)
npm run dev --workspace=auth

# Start Product application (Port 5174)
npm run dev --workspace=product
```

### 4. BUILDING FOR PRODUCTION
Compile the workspace projects:
```powershell
# Build Auth application
npm run build --workspace=auth

# Build Product application
npm run build --workspace=product
```

### 5. CODE QUALITY & LINTING
We use **oxlint** for fast syntax and configuration linting:
```powershell
# Lint Auth client
npm run lint --workspace=auth

# Lint Product client
npm run lint --workspace=product
```

---

## 💻 Developer Guidelines

1. **Shared UI Modifications**:
   - Any reusable UI structure, shared theme properties, or SSO-related components must be created or modified inside `client/shared/src/`.
   - After updating `@sso/shared` files, the clients (auth and product) automatically pick up the modifications since Vite resolves them through aliases in their config files:
     ```ts
     alias: {
       '@sso/shared': fileURLToPath(new URL('../shared/src', import.meta.url))
     }
     ```
2. **Accessing Downstream APIs**:
   - Always acquire authorization headers before querying protected APIs. Ensure `ProtectedRoute` wraps any private paths so MSAL contexts are populated.
   - Use dynamic backend endpoints sourced from `import.meta.env` variables instead of hardcoding API URIs.

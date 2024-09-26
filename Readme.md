# Serverless Auth with GitHub and Google
### Table of Contents
- Overview
- [Configuration]([url](https://github.com/Arnab-Afk/serverless-auth/edit/main/Readme.md#configuration))
- [API Endpoints]([url](https://github.com/Arnab-Afk/serverless-auth/edit/main/Readme.md#api-endpoints))
- [GitHub Authentication]([url](https://github.com/Arnab-Afk/serverless-auth/edit/main/Readme.md#github-authentication))
- [Google Authentication]([url](https://github.com/Arnab-Afk/serverless-auth/edit/main/Readme.md#google-authentication))
- [Error Handling]([url](https://github.com/Arnab-Afk/serverless-auth/edit/main/Readme.md#error-handling))
- [Implementation Details]([url](https://github.com/Arnab-Afk/serverless-auth/edit/main/Readme.md#implementation-details))
- [Example Usage]([url](https://github.com/Arnab-Afk/serverless-auth/edit/main/Readme.md#example-usage))

## Overview

This documentation outlines the implementation of OAuth authentication with GitHub and Google using Cloudflare Workers. This authentication system can be directly implemented in any system or project by simply adding the redirect URL of the frontend from where the authentication request is initiated.
### Key Benefits
- Serverless Architecture : Built using Cloudflare Workers, this implementation provides a scalable, serverless architecture that eliminates the need for server management and reduces costs.
- Easy Integration : Seamlessly integrate OAuth authentication into your project by simply adding the redirect URL of your frontend.
- Enhanced Security : Leverage Cloudflare's robust security features to protect your authentication flow.
## Configuration
### Environment Variables
- GITHUB_CLIENT_ID: Your GitHub OAuth client ID
- GITHUB_CLIENT_SECRET: Your GitHub OAuth client secret
- GITHUB_REDIRECT_URI: The redirect URI for GitHub OAuth callbacks
- GOOGLE_CLIENT_ID: Your Google OAuth client ID
- GOOGLE_CLIENT_SECRET: Your Google OAuth client secret
- GOOGLE_REDIRECT_URI: The redirect URI for Google OAuth callbacks

## API Endpoints
### GitHub
- ```GET /github/auth: Initiates GitHub OAuth authentication```
- ```GET /github/callback: Handles GitHub OAuth callback```
### Google
- ```GET /google/auth: Initiates Google OAuth authentication```
- ```GET /google/callback: Handles Google OAuth callback```

## GitHub Authentication
### Initiating Authentication
To initiate GitHub authentication, send a GET request to ```/github/auth``` with the following query parameters:
- redirect_url: The URL to redirect the user to after authentication
Example: 
```bash
GET /github/auth?redirect_url=https://example.com/
```

#### Handling Callback
After the user authenticates with GitHub, the callback will be sent to ```/github/callback```. The implementation will exchange the authorization code for an access token and redirect the user to the original redirect_url with the access token appended.

## Google Authentication
### Initiating Authentication
To initiate Google authentication, send a GET request to ```/google/auth``` with the following query parameters:
- redirect_url: The URL to redirect the user to after authentication
Example: 
```bash
GET /google/auth?redirect_url=https://example.com/
```

#### Handling Callback
After the user authenticates with Google, the callback will be sent to ```/google/callback``` The implementation will exchange the authorization code for an access token, retrieve the user's information, and redirect the user to the original redirect_url with the user information appended.

## Error Handling
The implementation returns error responses with a 400 status code for the following cases:
- Missing or invalid redirect_url parameter
- Authorization code not found
- Error exchanging authorization code for access token
- Error retrieving user information
## Implementation Details

The implementation uses Cloudflare Workers to handle requests and responses.
### Example Usage

To use this implementation, create a Cloudflare Worker and add the provided code. Configure the environment variables with your OAuth client IDs, secrets, and redirect URIs.
Test the implementation by sending GET requests to the /github/auth and /google/auth endpoints with the required redirect_url parameter.
```bash
curl -X GET 'https://your-worker.com/github/auth?redirect_url=https://example.com/callback'
```

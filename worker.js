const githubClientId = 'GITHUB_CLIENT_ID';
const githubClientSecret = 'GITHUB_CLIENT_SECRET';
const githubRedirectUri = 'https://workers.dev/github/callback';

const googleClientId = 'GOOGLE_CLIENT_ID';
const googleClientSecret = 'GOOGLE_CLIENT_SECRET';
const googleRedirectUri = 'https://worker.dev/google/callback';

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/google/auth') {
    return googleAuth(url);
  } else if (path === '/google/callback') {
    return googleCallback(url);
  } else if (path === '/github/auth') {
    return githubAuth(url);
  } else if (path === '/github/callback') {
    return githubCallback(url);
  } else {
    return new Response('Not Found', { status: 404 });
  }
}

function githubAuth(url) {
  const finalRedirectUrl = url.searchParams.get('redirect_url');
  if (!finalRedirectUrl) {
    return new Response('Redirect URL is required', { status: 400 });
  }
  const state = encodeURIComponent(finalRedirectUrl);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(githubRedirectUri)}&state=${state}`;
  return Response.redirect(githubAuthUrl, 302);
}

async function githubCallback(url) {
  const code = url.searchParams.get('code');
  const state = decodeURIComponent(url.searchParams.get('state'));

  if (!code) {
    return new Response('Authorization code not found.', { status: 400 });
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: githubClientId,
      client_secret: githubClientSecret,
      code: code,
      redirect_uri: githubRedirectUri,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return new Response(`Error: ${tokenData.error_description}`, { status: 400 });
  }

  const finalUrl = new URL(state);
  finalUrl.searchParams.set('access_token', tokenData.access_token);

  return Response.redirect(finalUrl.toString(), 302);
}

function googleAuth(url) {
  const userRedirectUri = url.searchParams.get('redirect_url');
  if (!userRedirectUri) {
    return new Response('Missing redirect_url parameter.', { status: 400 });
  }

  const oauthURL = new URL('https://accounts.google.com/o/oauth2/auth');
  oauthURL.searchParams.set('client_id', googleClientId);
  oauthURL.searchParams.set('redirect_uri', googleRedirectUri);
  oauthURL.searchParams.set('response_type', 'code');
  oauthURL.searchParams.set('scope', 'email profile');
  oauthURL.searchParams.set('access_type', 'offline');
  oauthURL.searchParams.set('state', encodeURIComponent(userRedirectUri));

  return Response.redirect(oauthURL.toString(), 302);
}

async function googleCallback(url) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: code,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: googleRedirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenResponse.json();

  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  const userInfo = await userInfoResponse.json();

  const finalRedirectUri = decodeURIComponent(state);
  const finalUrl = new URL(finalRedirectUri);
  finalUrl.searchParams.set('user_info', btoa(JSON.stringify(userInfo)));

  return Response.redirect(finalUrl.toString(), 302);
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

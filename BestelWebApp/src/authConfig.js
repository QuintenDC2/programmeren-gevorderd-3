export const oidcConfig = {
  authority: "https://identityserver-auth-d4ckdtg9b5grggcj.westeurope-01.azurewebsites.net",
  client_id: "bestelwebapp-client",
  redirect_uri: "https://happy-sky-04c40e203.6.azurestaticapps.net/callback",
  response_type: "code",
  scope: "openid profile productbeheerapi offline_access",
  post_logout_redirect_uri: "https://happy-sky-04c40e203.6.azurestaticapps.net",
  response_mode: "query",
  automaticSilentRenew: true,
  silent_redirect_uri: "https://happy-sky-04c40e203.6.azurestaticapps.net/silent-renew.html",
  loadUserInfo: true,
  useRefreshToken: true,
};
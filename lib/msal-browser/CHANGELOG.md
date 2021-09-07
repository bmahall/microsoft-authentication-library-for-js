# Change Log - @azure/msal-browser

This log was last generated on Tue, 07 Sep 2021 23:47:36 GMT and should not be manually modified.

<!-- Start content -->

## 2.17.0

Tue, 07 Sep 2021 23:47:36 GMT

### Minor changes

- Refactor acquireToken logic into InteractionClients #3871 (thomas.norling@microsoft.com)
- Add SignedHttpRequest class #3058 (janutter@microsoft.com)
- Add API to sideload tokens to msal-browser #3895 (joarroyo@microsoft.com)
- Add configuration for popup window size and placement #3946 (joarroyo@microsoft.com)

### Patches

- Add correlationId to errors thrown #3930 (thomas.norling@microsoft.com)
- Fix clearing active account on logout #3948 (hemoral@microsoft.com)
- Remove token binding key from key store when refreshing pop token #3500 (hemoral@microsoft.com)
- Add correlationId to AuthenticationResult type #3947 (thomas.norling@microsoft.com)
- Only emit handleRedirect start event on first invocation of handleRedirectPromise #4013 (thomas.norling@microsoft.com)
- Throw interaction in progress if any msal instance has interaction in progress #4014 (thomas.norling@microsoft.com)
- Populate msal v2 loginHint from cached msal v1 id token #4027 (janutter@microsoft.com)
- added  comment (bmahal@microsoft.com)
- Update ADAL to MSAL SSO logic to use preferred_username instead of upn by default #3945 (ellymakuba@microsoft.com)
- Add pop params to request thumbprint #3973 (hemoral@microsoft.com)
- Clear cache before constructing logout url #3982 (thomas.norling@microsoft.com)
- Bump @azure/msal-common to v5.0.0 (hemoral@microsoft.com)

## 2.16.1

Wed, 11 Aug 2021 20:45:13 GMT

### Patches

- comments added (bmahal@microsoft.com)

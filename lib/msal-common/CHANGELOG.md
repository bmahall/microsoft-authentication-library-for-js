# Change Log - @azure/msal-common

This log was last generated on Tue, 07 Sep 2021 23:47:36 GMT and should not be manually modified.

<!-- Start content -->

## 5.0.0

Tue, 07 Sep 2021 23:47:36 GMT

### Major changes

- Remove token binding key from key store when refreshing pop token #3500 (hemoral@microsoft.com)
- Add pop params to request thumbprint #3973 (hemoral@microsoft.com)

### Minor changes

- Add SignedHttpRequest class #3058 (janutter@microsoft.com)
- Adds state param to logout url #3909 (bmahal@microsoft.com)

### Patches

- Add correlationId property to AuthError #3930 (thomas.norling@microsoft.com)
- Fixes unescaped backslash and inefficient regex patterns #3993 (thomas.norling@microsoft.com)
- added comment (bmahal@microsoft.com)
- Add external token server response type #3895 (joarroyo@microsoft.com)
- Fix accesstoken_with_authscheme implementation #3910 (hemoral@microsoft.com)
- Add correlationId to AuthenticationResult type #3947 (thomas.norling@microsoft.com)
- Fix logger constructor #3899 (hemoral@microsoft.com)

## 4.6.0

Wed, 11 Aug 2021 20:45:13 GMT

### Minor changes

- Adds state param to logout url #3909 (bmahal@microsoft.com)

### Patches

- Fix double encoding state #3903 (bmahal@microsoft.com)
- comments added in common (bmahal@microsoft.com)
- comment added (bmahal@microsoft.com)

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ClientApplication } from "./ClientApplication";
import { Configuration } from "../config/Configuration";
import { ClientAssertion } from "./ClientAssertion";
import { ApiId } from "../utils/Constants";
import { 
    ClientCredentialRequest, 
    ClientCredentialClient, 
    OnBehalfOfRequest, 
    OnBehalfOfClient, 
    AuthenticationResult, 
    StringUtils, 
    ClientAuthError } from "@azure/msal-common";

export class ConfidentialClientApplication extends ClientApplication {

    /**
     * @constructor
     * Constructor for the ConfidentialClientApplication
     *
     * Required attributes in the Configuration object are:
     * - clientID: the application ID of your application. You can obtain one by registering your application with our application registration portal
     * - authority: the authority URL for your application.
     * - client credential: Must set either client secret, certificate, or assertion for confidential clients. You can obtain a client secret from the application registration portal.
     *
     * In Azure AD, authority is a URL indicating of the form https://login.microsoftonline.com/{Enter_the_Tenant_Info_Here}.
     * If your application supports Accounts in one organizational directory, replace "Enter_the_Tenant_Info_Here" value with the Tenant Id or Tenant name (for example, contoso.microsoft.com).
     * If your application supports Accounts in any organizational directory, replace "Enter_the_Tenant_Info_Here" value with organizations.
     * If your application supports Accounts in any organizational directory and personal Microsoft accounts, replace "Enter_the_Tenant_Info_Here" value with common.
     * To restrict support to Personal Microsoft accounts only, replace "Enter_the_Tenant_Info_Here" value with consumers.
     *
     * In Azure B2C, authority is of the form https://{instance}/tfp/{tenant}/{policyName}/
     * Full B2C functionality will be available in this library in future versions.
     *
     * @param {@link (Configuration:type)} configuration object for the MSAL ConfidentialClientApplication instance
     */
    constructor(configuration: Configuration) {
        super(configuration);
        this.setClientCredential(this.config); // this is test comment.
    }

    /**
     * Acquires tokens from the authority for the application (not for an end user).
     */
    public async acquireTokenByClientCredential(request: ClientCredentialRequest): Promise<AuthenticationResult> {
        this.logger.info("acquireTokenByClientCredential called");
        const validRequest = this.initializeRequest(request) as ClientCredentialRequest;
        const serverTelemetryManager = this.initializeServerTelemetryManager(ApiId.acquireTokenByClientCredential, validRequest.correlationId!, validRequest.skipCache);
        try {
            const clientCredentialConfig = await this.buildOauthClientConfiguration(
                request.authority,
                serverTelemetryManager
            );
            this.logger.verbose("Auth client config generated");
            const clientCredentialClient = new ClientCredentialClient(clientCredentialConfig);
            return clientCredentialClient.acquireToken(request);
        } catch(e) {
            serverTelemetryManager.cacheFailedRequest(e);
            throw e;
        }
    }

    /**
     * Acquires tokens from the authority for the application.
     * 
     * Used in scenarios where the current app is a middle-tier service which was called with a token
     * representing an end user. The current app can use the token (oboAssertion) to request another 
     * token to access downstream web API, on behalf of that user.
     * 
     * The current middle-tier app has no user interaction to obtain consent.
     * See how to gain consent upfront for your middle-tier app from this article.
     * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow#gaining-consent-for-the-middle-tier-application
     */
    public async acquireTokenOnBehalfOf(request: OnBehalfOfRequest): Promise<AuthenticationResult> {
        this.logger.info("acquireTokenOnBehalfOf called");
        const clientCredentialConfig = await this.buildOauthClientConfiguration(
            request.authority
        );
        this.logger.verbose("Auth client config generated");
        const oboClient = new OnBehalfOfClient(clientCredentialConfig);
        return oboClient.acquireToken(this.initializeRequest(request) as OnBehalfOfRequest);
    }

    private setClientCredential(configuration: Configuration): void {

        const clientSecretNotEmpty = !StringUtils.isEmpty(configuration.auth.clientSecret!);
        const clientAssertionNotEmpty = !StringUtils.isEmpty(configuration.auth.clientAssertion!);
        const certificate = configuration.auth.clientCertificate!;
        const certificateNotEmpty = !StringUtils.isEmpty(certificate.thumbprint) || !StringUtils.isEmpty(certificate.privateKey);

        // Check that at most one credential is set on the application 
        if (
            clientSecretNotEmpty && clientAssertionNotEmpty ||
            clientAssertionNotEmpty && certificateNotEmpty ||
            clientSecretNotEmpty && certificateNotEmpty) {
            throw ClientAuthError.createInvalidCredentialError();
        }

        if (clientSecretNotEmpty) {
            this.clientSecret = configuration.auth.clientSecret!;
            return;
        }

        if (clientAssertionNotEmpty) {
            this.clientAssertion = ClientAssertion.fromAssertion(configuration.auth.clientAssertion!);
            return;
        }

        if (!certificateNotEmpty) {
            throw ClientAuthError.createInvalidCredentialError();
        } else {
            this.clientAssertion = ClientAssertion.fromCertificate(certificate.thumbprint, certificate.privateKey, configuration.auth.clientCertificate?.x5c);
        }
    }
}

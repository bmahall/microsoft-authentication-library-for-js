/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const credential = new DefaultAzureCredential();

const vaultName = "ADALTestInfo";
const url = "https://adaltestinfo.vault.azure.net/";

const client = new SecretClient(url, credential);

const secretName = "MSALJS-CDN-SAS-USWE";

async function getSecret() {
    try
    {
        const latestSecret = await client.getSecret(secretName);
        console.log(`Latest version of the secret ${secretName}: `, latestSecret);
        const specificSecret = await client.getSecret(secretName, { version: latestSecret.properties.version });
        console.log(`The secret ${secretName} at the version ${latestSecret.properties.version}: `, specificSecret);
    }
   
    catch (err) {
        console.log("error code: ", err.code);
        console.log("error message: ", err.message);
        console.log("error stack: ", err.stack);
    }
    
}

getSecret();

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AzureRegion } from "./AzureRegion";

/*
 * AzureRegionConfiguration
 * - preferredAzureRegion       - Preferred azure region from the user 
 * - environmentRegionFunc      - Environment specific way of fetching the region from the environment
 */
export type AzureRegionConfiguration = {
    azureRegion?: AzureRegion, /* specify the azure region*/
    environmentRegion: string | undefined; 
};

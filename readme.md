A CLI to view, transform or generate client libraries from HubSpot Open API specs.

## Usage

The CLI is not packaged up properly and must be ran from `/src/hubspot-client-generator`.  
The code is generated based on config in [`openapitools.json`](https://github.com/OpenAPITools/openapi-generator-cli#configuration).

### Examples

    node index.js <command> [filter]

**Generating a merged Open API spec**

    node index.js merge CRM.Contacts,CRM.Companies,CRM.Deals

will output a merged Open API spec for the three APIs.

**Generating a solution with clients for a set of APIs**

    node index.js csharp CRM.Contacts,CRM.Companies,CRM.Deals

### Help

    node index.js

shows help

    Usage: node index.html <action> [endpoints]
    Actions:
    endpoints: Lists all endpoints as JSON array
    download: Downloads all specs and outputs JSON array
    arm: Generates Logic App Connectors and outputs ARM template
    merge: Generates a merged OpenAPI spec and outputs a single JSON spec.
    csharp: Generates C# code and outputs a solution.
    Endpoints:
    May be omitted. Will then return all endpoints.
    Format is API group dot API name, separated by comma.
    For example CRM.Contacts,CRM.Companies,CRM.Deals

### Endpoints

    node index.js endpoints

lists all endpoints as a JSON array

    [
    {
        "openAPI": "https://api.hubspot.com/api-catalog-public/v1/apis/webhooks/v3",
        "stage": "LATEST",
        "api": "WEBHOOKS"
    },
    {
        "openAPI": "https://api.hubspot.com/api-catalog-public/v1/apis/events/v3/events",
        "stage": "DEVELOPER_PREVIEW",
        "api": "EVENTS"
    },
    {
        "openAPI": "https://api.hubspot.com/api-catalog-public/v1/apis/communication-preferences/v3",
        "stage": "DEVELOPER_PREVIEW",
        "api": "COMMUNICATION-PREFERENCES"
    },
    ...

### Download

    node index.js download

outputs an array of each specification

    [
        {
            "openApi": {
                "info": {
                    "title": "Contacts"
                },
                ...
            }
        },
            {
            "openApi": {
                "info": {
                    "title": "Companies"
                },
                ...
            }
        }
    ]

### Merge

    node index.js merge

outputs a merged Open API spec of all endpoints.

    {
        "openapi": "3.0.3",
        "info": {
            "title": "HubSpot",
            "version": "v3"
        },
        "servers": [
            {
            "url": "https://api.hubapi.com/"
            }
        ],
        "tags": [
            {
            "name": "Basic"
            },
            {
            "name": "Search"
            },
            ...

### OpenApi Generator

    node index.js generate

generates code using openapi-generator based on config in `./src/hubspot-client-generator/openapitools.json`.


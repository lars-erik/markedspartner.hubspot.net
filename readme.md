WIP to generate client libraries from HubSpot Open API specs.

All, or a filtered list of APIs can be downloaded with the node script.  
Next step is to merge them using https://www.npmjs.com/package/openapi-merge.  
Final step is to use https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/csharp.md
to generate a solution with all the filtered APIs.

Example usage without merge:

    node src/hubspot-client-generator/index.json download CRM.Contacts > output/contacts.json
    [manually remove array wrapper from contacts.json]
    npx openapi-generator-cli generate -g csharp -i ./output/contacts.json -o ./output --package-name Our.HubSpot


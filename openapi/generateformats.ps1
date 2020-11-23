get-content HubSpotV3.yml | convertfrom-yaml | convertto-json -depth 99 | set-content HubSpotV3.json
npm run generate
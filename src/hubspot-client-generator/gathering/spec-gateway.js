const fetch = require("node-fetch");

const getUrl = url => fetch(url).then(response => response.json());

const fetchEndpointGroups = (map) =>
    getUrl('https://api.hubspot.com/api-catalog-public/v1/apis')
        .then(data => data.results);

const groupInSpecs = specs => ep => specs.filter(s => s.group === ep.name).length;

const featureInSpecs = (ep, specs) => (feature) =>
    (specs || []).filter(s => s.group === ep.name && s.name === feature).length;

const filteredFeatureNames = (ep, specs) =>
    Object.keys(ep.features).filter(featureInSpecs(ep, specs));

const fetchEndpoints = (endpointDefinitions) =>
    fetchEndpointGroups()
        .then(apis => (endpointDefinitions || []).length > 0 ? apis.filter(groupInSpecs(endpointDefinitions)) : apis)
        .then(apis => apis.reduce((result, api) => {
            const featureNames = (endpointDefinitions || []).length > 0 ? filteredFeatureNames(api, endpointDefinitions) : Object.keys(api.features);
            result = result.concat(featureNames.map(feature => Object.assign({}, api.features[feature], { api: api.name, name: feature })));
            return result;
        }, []));

const fetchSpecs = (endpointDefinitions, convert) =>
    fetchEndpoints(endpointDefinitions)
        .then(endpoints => 
            Promise.all(
                endpoints.map(endpointDefinition =>
                    getUrl(endpointDefinition.openAPI)
                        .then(spec => { return { endpointDefinition, spec }; })
            )));

module.exports = {
    fetchEndpoints,
    fetchSpecs
};


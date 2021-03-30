const fetch = require("node-fetch");
const Converter = require('api-spec-converter');
const template = require("./base-arm-connector-resource.json");
const envelope = require("./arm-envelope.json");

const getUrl = url => fetch(url).then(response => response.json());

const fetchEndpoints = (map) => 
    getUrl('https://api.hubspot.com/api-catalog-public/v1/apis')
        .then(data => data.results);

const groupInSpecs = specs => ep => specs.filter(s => s.group === ep.name).length;

const featureInSpecs = (ep, specs) => (feature) => 
    specs.filter(s => s.group === ep.name && s.name === feature).length;

const filteredFeatureNames = (ep, specs) =>
    Object.keys(ep.features).filter(featureInSpecs(ep, specs));

const fetchSpecEndpoints = (specs) =>
    fetchEndpoints()
        .then(apis => apis.filter(groupInSpecs(specs)))
        .then(apis => apis.reduce((result, api) => {
            const featureNames = filteredFeatureNames(api, specs);
            result = result.concat(featureNames.map(feature => Object.assign({}, api.features[feature], {api:api.name})));
            return result;
        }, []));

const convert = spec => 
    Converter.convert({
        from: 'openapi_3',
        to: 'swagger_2',
        format: 'json',
        source: spec
    })
    .then(converted => converted.spec);

const compatibilize = spec => {
    for(const path in spec.paths) {
        for(const verb in spec.paths[path]) {
            spec.paths[path][verb].operationId = spec.paths[path][verb].operationId.replace(/[\{\}\x20\/-]/g, '')
        }
    }
    return spec;
}

const wrapInArm = ep => spec => {
    let name = spec.info.title;
    let fullName = "MP-HS-" + ep.api + "-" + name.replace(" ", "");
    let resource = Object.assign({}, template, {
        name: fullName
    });
    resource.properties = Object.assign({}, resource.properties, {
        displayName: "MP HubSpot " + ep.api + " " + name,
        description: "",
        swagger: spec
    });
    return resource;
}

const specs = [
    {'group':'CRM', 'name':'Contacts'},
    {'group':'CRM', 'name':'Deals'},
    {'group':'CRM', 'name':'Line Items'},
    {'group':'CRM', 'name':'Associations'},
];


fetchSpecEndpoints(specs)
    .then(endpoints => Promise.all(
        endpoints.map(ep => 
            getUrl(ep.openAPI)
                .then(convert)
                .then(compatibilize)
                .then(wrapInArm(ep))
        )))
    .then(resources => 
        Object.assign(envelope, {resources})    
    )
    .then(result => {
        console.log(JSON.stringify(result, null, '    '));
    });
    
const Converter = require('api-spec-converter');
const template = require("./base-arm-connector-resource.json");
const envelope = require("./arm-envelope.json");

const convert = ({ endpointDefinition, spec }) =>
    Converter.convert({
        from: 'openapi_3',
        to: 'swagger_2',
        format: 'json',
        source: spec
    })
    .then(converted => { return { endpointDefinition, spec: converted.spec }; });

const compatibilize = ({ endpointDefinition, spec }) => {
    for (const path in spec.paths) {
        for (const verb in spec.paths[path]) {
            spec.paths[path][verb].operationId = spec.paths[path][verb].operationId.replace(/[\{\}\x20\/-]/g, '')
        }
    }
    return { endpointDefinition, spec };
}

const swaggerToLogicAppConnector = ({ endpointDefinition: ep, spec }) => {
    let name = spec.info.title;
    let fullName = "MP-HS-" + ep.api + "-" + name.replace(" ", "");
    let resource = Object.assign({}, template, {
        name: `[concat('${fullName}', parameters('Suffix'))]`
    });
    resource.properties = Object.assign({}, resource.properties, {
        displayName: "[concat('MP HubSpot " + ep.api + " " + name + "', parameters('Suffix'))]",
        description: "",
        swagger: spec
    });
    return resource;
}

const wrapInArmTemplate = resources => {
    let enveloped = Object.assign(envelope, { resources });
    return JSON.stringify(enveloped, null, '  ');
}

const armAction = (epSpec) => 
    convert(epSpec)
        .then(compatibilize)
        .then(swaggerToLogicAppConnector);

module.exports = {
    itemAction: armAction,
    aggregateAction: wrapInArmTemplate
}
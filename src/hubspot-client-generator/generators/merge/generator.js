const {merge, MergeInput} = require("openapi-merge");
const proper = require('proper-case');

let collectedPaths = [];

const transformAction = ({endpointDefinition: ed, spec}) => {
    let alreadyCollected = Object.keys(spec.paths).filter(path => collectedPaths.includes(path));
    alreadyCollected.forEach(path => delete spec.paths[path]);
    collectedPaths = collectedPaths.concat(Object.keys(spec.paths));

    return {
        oas:spec,
        disputePrefix: ed.name,
        pathModification: {
            stripStart: '',
            prepend: ''
        },
        operationsSelection: {
            includeTags:[],
            excludeTags:[]
        }
    };
}

const fixRefs = (spec) => {
    let fixedRefs = [];

    Object.keys(spec.components.schemas).forEach(schemaName => {
        if (schemaName.includes(' ')) {
            let goodName = schemaName.replace(/ /g, '')
            let schema = spec.components.schemas[schemaName];
            delete spec.components.schemas[schemaName];
            spec.components.schemas[goodName] = schema;
            fixedRefs.push({schemaName, goodName});
        }
    });

    if (fixedRefs.length) {
        let json = JSON.stringify(spec);
        fixedRefs.forEach(fix => {
            json = json.replace(new RegExp(fix.schemaName, "g"), fix.goodName);
        });
        spec = JSON.parse(json);
    }

    return spec;
}

const cleanOperationIds = (spec) => {
    Object.keys(spec.paths).forEach(path => {
        // console.log(path);
        let ops = spec.paths[path];
        Object.keys(ops).forEach(opKey => {
            let op = ops[opKey];
            let properName = proper(op.summary || op.operationId).replace(/ /g, '');
            op.operationId = properName;
            // console.log('  ' + op.operationId);
        });
    });

    return spec;
}

const mergeAction = (resources) => {
    const result = merge(resources);
    let spec = result.output;
    spec.info.title = 'HubSpot';

    // TODO: Operation IDs suck, but there's no immediately obvious way to transform for the better.
    // spec = cleanOperationIds(spec);

    // This path has an invalid spec. 
    // TODO: figure out why and have HS fix it.
    delete spec.paths['/cms/v3/source-code/{environment}/validate/{path}'];

    // Some schema names are invalid. We replace spaces to fix it.
    spec = fixRefs(spec);

    return JSON.stringify(spec, null, '  ');
}

module.exports = {
    itemAction: transformAction,
    aggregateAction: mergeAction
}
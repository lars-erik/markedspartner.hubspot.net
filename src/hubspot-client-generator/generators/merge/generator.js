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

const mergeAction = (resources) => {
    const result = merge(resources);
    let spec = result.output;
    spec.info.title = 'HubSpot';

    let fixedRefs = [];

    // Object.keys(spec.paths).forEach(path => {
    //     // console.log(path);
    //     let ops = spec.paths[path];
    //     Object.keys(ops).forEach(opKey => {
    //         let op = ops[opKey];
    //         let properName = proper(op.summary || op.operationId).replace(/ /g, '');
    //         op.operationId = properName;
    //         // console.log('  ' + op.operationId);
    //     });
    // });

    delete spec.paths['/cms/v3/source-code/{environment}/validate/{path}'];

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

    return JSON.stringify(spec, null, '  ');
}

module.exports = {
    itemAction: transformAction,
    aggregateAction: mergeAction
}
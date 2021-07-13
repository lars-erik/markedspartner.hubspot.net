const fetch = require("node-fetch");
const specGateway = require("./gathering/spec-gateway");

const passThrough = x => x.spec;
const stringify = x => JSON.stringify(x, null, '  ')

const generators = {
    'download': { itemAction: passThrough, aggregateAction: stringify },
    'arm': require('./generators/logic-apps/generator'),
    'merge': require('./generators/merge/generator'),
    'generate': require('./generators/generate/generator'),
}

const args = process.argv.slice(2);
const action = args[0] || 'help';
const filterArg = args[1] || '';
let endpointDefinitions = filterArg.split(',').map(x => { var pair = x.split('.'); return {group:pair[0],name:pair[1]};});
if (endpointDefinitions.length === 1 && endpointDefinitions[0].group === '') {
    endpointDefinitions = [];
}

if (action === 'help') {
    console.log('Usage: node index.html <action> [endpoints]');
    console.log('Actions:');
    console.log('  endpoints: Lists all endpoints as JSON array');
    console.log('  download: Downloads all specs and outputs JSON array');
    console.log('  arm: Generates Logic App Connectors and outputs ARM template');
    console.log('  merge: Generates a merged OpenAPI spec and outputs a single JSON spec.');
    console.log('  generate: Generates code based on openapitools.json.');
    console.log('Endpoints:');
    console.log('  May be omitted. Will then return all endpoints.');
    console.log('  Format is API group dot API name, separated by comma.');
    console.log('  For example CRM.Contacts,CRM.Companies,CRM.Deals');
}
else if (action === 'endpoints') {

    specGateway.fetchEndpoints(endpointDefinitions)
        .then(stringify)
        .then(console.log);

} else {

    let generator = generators[action];

    specGateway.fetchSpecs(endpointDefinitions)
        .then((epSpecs) =>
            Promise.all(
                epSpecs.map(generator.itemAction)
            )
        )
        .then(generator.aggregateAction)
        .then(console.log);

}
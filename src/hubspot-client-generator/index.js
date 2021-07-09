const fetch = require("node-fetch");
const specGateway = require("./gathering/spec-gateway");

const passThrough = x => x;
const stringify = x => JSON.stringify(x, null, '  ')

const generators = {
    'default': { itemAction: passThrough, aggregateAction: stringify },
    'arm': require('./generators/logic-apps/generator')
}

const action = process.argv.slice(2)[0] || 'default';

if (action === 'endpoints') {

    specGateway.fetchEndpoints()
        .then(stringify)
        .then(console.log);

} else {

    let generator = generators[action];

    const endpointDefinitions = [
        { 'group': 'CRM', 'name': 'Contacts' },
        // { 'group': 'CRM', 'name': 'Deals' }
        // {'group':'CRM', 'name':'Line Items'},
        // {'group':'CRM', 'name':'Associations'},
    ];

    specGateway.fetchSpecs(endpointDefinitions)
        .then((epSpecs) =>
            Promise.all(
                epSpecs.map(generator.itemAction)
            )
        )
        .then(generator.aggregateAction)
        .then(console.log);

}
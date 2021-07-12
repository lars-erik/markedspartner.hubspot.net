const {merge, MergeInput} = require("openapi-merge");

const transformAction = ({endpointDefinition: ed, spec}) => {
    return {
        oas:spec,
        disputePrefix: 'HubSpot',
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
    result.output.info.title = 'HubSpot';
    return result.output;
}

module.exports = {
    itemAction: transformAction,
    aggregateAction: mergeAction
}
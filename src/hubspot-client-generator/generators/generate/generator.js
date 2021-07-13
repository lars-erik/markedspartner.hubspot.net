const mergeActions = require('../merge/generator');
const fs = require('fs');
const { exec } = require('child_process');

module.exports = {
    itemAction: x => mergeActions.itemAction(x),
    aggregateAction: x => {
        fs.rm('./../../output/api', { recursive: true }, err => { });
        fs.rm('./../../output/csharp', { recursive: true }, err => { });
        fs.mkdir('./../../output/api', { recursive: true }, err => { });
        fs.mkdir('./../../output/csharp', { recursive: true }, err => { });

        const singleSpec = mergeActions.aggregateAction(x);
        fs.writeFileSync('./../../output/api/merged.json', singleSpec);
       
        let proc = exec('npx openapi-generator-cli generate', (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(stdout);
        });
        proc.on('close', () => { console.log('Done'); });

        return "Started conversion";
    }
}
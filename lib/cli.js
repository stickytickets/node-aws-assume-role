var assumeRole = require('./assume-role');
var assert = require('assert');
var exec = require('child_process').exec;

exports.run = function(args) {

    var options = {};
    options.account = process.env.AWS_ACCOUNT;
    options.name = process.env.AWS_ROLE;

    assert.equal(typeof(options.account), 'string', "'AWS_ACCOUNT' environment variable must be set");
    assert.equal(typeof(options.name), 'string', "'AWS_ROLE' environment variable must be set");

    assumeRole(options, (e, r) => {
        if (e) {
            console.log(e);
            throw e;
        }

        console.log('Assumed Role: ' + options.name);
        console.log('Running: ' + args);

        exec(args.join(' '), (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });

    });
}
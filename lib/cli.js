var assumeRole = require('./assume-role');
var assert = require('assert');
var spawn = require('child_process').spawn;

exports.run = function(args) {

    var options = {};
    options.account = process.env.AWS_ACCOUNT;
    options.name = process.env.AWS_ROLE;

    if (options.name && options.account) {

        assert.equal(typeof(options.account), 'string', "'AWS_ACCOUNT' environment variable must be set");
        assert.equal(typeof(options.name), 'string', "'AWS_ROLE' environment variable must be set");

        assumeRole(options, (e, r) => {
            if (e) {
                console.log(e);
                throw e;
            }

            console.log('Assumed Role: ' + options.name);
            console.log('Running: ' + args);

            execCommand(args);
        });
    } else {
        console.warn("'AWS_ACCOUNT' And 'AWS_ROLE' environment variables NOT set. Command will execute with default credentials");
        execCommand(args);
    }
}

function execCommand(args) {

    var argCopy = args.slice();
    var cmd = argCopy.shift(1);

    var t = process.hrtime();
    console.log(`(Start: ${cmd}, args: ${argCopy} )\n`);
    
    var ps = spawn(cmd, argCopy, {stdio: 'inherit'});


    ps.on('exit', function(code) {

        t = process.hrtime(t);

        setTimeout(function(){
            console.log('\n(Finished, exit code: ' + code + ', in %s.%ss)', t[0], parseInt(t[1]/1000000))
            process.exit(code);
        }, 10);

    });
}

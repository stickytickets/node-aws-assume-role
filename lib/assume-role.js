var assert = require('assert');
var AWS = require('aws-sdk');
var os = require('os');

module.exports = (options, cb) => {

    assert.equal(typeof(options.name), 'string', "'name' must be provided in the options as a string");
    assert.equal(typeof(options.account), 'string', "'account' must be provided in the options as a string");
    assert.equal(typeof(cb), 'function', "'cb' function must be provided");

    var sts = new AWS.STS();
    sts.assumeRole({
        RoleArn: `arn:aws:iam::${options.account}:role/${options.name}`,
        RoleSessionName: options.sessionName || ('assuming-role-from-host-' + require("os").hostname()),
        //  SerialNumber: role.SerialNumber,
        //  TokenCode: token
    }, function(error, data) {

        if (error) return cb(error);

        var modEnv = process.env;

        modEnv.AWS_ACCESS_KEY_ID = data.Credentials.AccessKeyId;
        modEnv.AWS_SECRET_ACCESS_KEY = data.Credentials.SecretAccessKey;
        modEnv.AWS_SESSION_TOKEN = data.Credentials.SessionToken

        cb(null, {
            AWS_ACCESS_KEY_ID: data.Credentials.AccessKeyId,
            AWS_SECRET_ACCESS_KEY: data.Credentials.SecretAccessKey,
            AWS_SESSION_TOKEN: data.Credentials.SessionToken
        });


    });
}

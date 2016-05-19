var assumeRole = require('../lib/assume-role');
var assert = require('assert');



function createValidRequest() {
    return {
        account: 'test',
        name: 'test'
    };
}

describe('assumeRole', function() {

    beforeEach(function() {
        request = createValidRequest();
    });

    describe('validation', function() {

        it('should require name', function(cb) {

            delete request.name;

            assert.throws(
                () => {
                    assumeRole(request);
                    cb();
                },
                /name/
            );
            cb();
        });

        it('should require account', function(cb) {

            delete request.account;

            assert.throws(
                () => {
                    assumeRole(request);
                    cb();
                },
                /account/
            );
            cb();
        });

    });

});

const {expect} = require('chai');
const {handler} = require('./index');
const log = console.log;
const TIMEOUT = 10 * 1000;

describe('#index', function()
{
    this.timeout(TIMEOUT);
    describe('#handler', function()
    {
        this.timeout(TIMEOUT);
        it('should get data', (done)=>
        {
            handler({}, {}, (err, data)=>
            {
                log("data:", data);
                done(err);
            });
        });
    });
});
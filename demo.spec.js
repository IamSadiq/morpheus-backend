var assert = require('assert');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
        assert.equal(-1, [1,2,3].indexOf(4));
    });
});

describe('timestamp check', () => {
    it('should ensure timestamp is in positive millisecond', (done) => {
        assert.ok(Date.now() > 0);
        done();
    })
})
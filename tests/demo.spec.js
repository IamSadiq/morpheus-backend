var assert = require('assert');

describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
        assert.equal(-1, [1,2,3].indexOf(4));
    });
});

describe('timestamp check', () => {
    it('should ensure timestamp is in positive millisecond', (done) => {
        assert.ok(Date.now() > 0);
        done();
    });
});

describe('timestamp', () => {
    it('should estimate date from task duration', (done) => {
        let now = Date.now();
        let duration = 4;

        assert.ok(now + 60 * 60 * 24 * 4 * 1000 > now);

        console.log("Current date: " + new Date(now));
        console.log("Duration: " + duration + " days");
        console.log("Estimated Date: " + new Date(now + 60 * 60 * 24 * duration * 1000));

        done();
    });
});
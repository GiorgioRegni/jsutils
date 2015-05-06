var jsutils = require("../index.js");

describe('Context', function () {
    var ctx = new jsutils.LogCtx("unittest");
    
    beforeEach(function () {
    });

    describe('basic', function () {
        it('should create a hit', function () {
            hit = ctx.newHit("42");
            hit.error("error message");
            hit.log("normal message");
            hit.debug("debug message");
        });
    });
});
var jsutils = require("../index.js");

describe('Context', function () {
    var ctx = new jsutils.LogCtx("unittest");

    beforeEach(function () {
    });

    describe('basic', function () {
        it('should create a hit', function () {
            var hit = ctx.newHit();
            hit.error("error message");
            hit.info("normal message", { some: "extra", param: "cool" });
            hit.log({ some: "extra" }, "normal log message");
            hit.debug("debug message");
        });
    });

    describe('advanced logs', function () {
        it('should create a child log', function () {
            var hit = ctx.newHit();

            var petitfils = hit.stack("chord", { "cmd": "fs" });
            petitfils.error("error message");
            petitfils.info({ some: "extra", param: "cool" }, "normal message");
            petitfils.debug("debug message");
        });

        it('should dump all traces', function () {
            ctx.dumpTraces();
        });
    });
});
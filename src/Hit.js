/*
 * Hit represents a logical sequence of operations, like for example a http request
 * server interaction and answer.
 * The goal is to log all interactions on a logical entity such as a web query under the same
 * Hit object and use it for real time logging as well as longer time archiving.
*/

module.exports = Hit;

function Hit(appCtx, id) {
    this.ctx = appCtx; // Application context that this hit is attached to
    this.id = id; // ID is a text that represents a unique identifier for a request
    this.events = [];
    this.errorHappened = false;
    this.ts_start = Date.now();
}

Hit.LOG_LVL_DBG = 5;
Hit.LOG_LVL_NORM = 3;
Hit.LOG_LVL_ERR = 1;

Hit.prototype.done = function () {
    this.ts_end = Date.now();
    // TODO report back to context
};

Hit.prototype.debug = function (msg, o) {
    o = o || {}; // o is an optional JSON object to be stored alongside message
    var now = Date.now();
    var lvl = Hit.LOG_LVL_DBG;

    if (this.ctx.logLvl >= lvl)
        this.ctx.emit(this, lvl, now, msg, o);

    this.events.push({ "msg": msg, o: o, ts: now, lvl: lvl });
};

Hit.prototype.log = function (msg, o) {
    o = o || {}; // o is an optional JSON object to be stored alongside message
    var now = Date.now();
    var lvl = Hit.LOG_LVL_NORM;
    
    console.log(this.ctx.logLvl, lvl);

    if (this.ctx.logLvl >= lvl)
        this.ctx.emit(this, lvl, now, msg, o);

    this.events.push({ "msg": msg, o: o, ts: now, lvl: lvl });
};

Hit.prototype.error = function (msg, o) {
    o = o || {}; // o is an optional JSON object to be stored alongside message
    var now = Date.now();
    var lvl = Hit.LOG_LVL_ERR;
    
    if (this.ctx.logLvl >= lvl)
        this.ctx.emit(this, lvl, now, msg, o);

    this.events.push({ "msg": msg, o: o, ts: now, lvl: lvl });

    this.errorHappened = true;
};

Hit.prototype.isError = function () {
    return this.errorHappened;
};


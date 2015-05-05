/*
 * Hit represents a logical sequence of operations, like for example a http request
 * server interaction and answer.
 * The goal is to log all interactions on a logical entity such as a web query under the same
 * Hit object and use it for real time logging as well as longer time archiving.
*/

module.exports = Hit;

function Hit(appCtx, id) {
    this.ctx = appCtx; // Application context that this hit is attached to
    this.id; // ID is a text that represents a unique identifier for a request
    this.events = [];
    this.errorHappened = false;
    this.ts_start= Date.now();
}

Hit.prototype.LOG_LVL_DBG  = "debug";
Hit.prototype.LOG_LVL_NORM = "norm";
Hit.prototype.LOG_LVL_ERR  = "err";

Hit.prototype.done = function() {
    this.ts_end = Date.now();
    // TODO report back to context
};

Hit.prototype.log = function(msg, o) {
    o = o || {}; // o is an optional JSON object to be stored alongside message
    
    this.events.push({"msg": msg, o: o, ts: Date.now(), lvl: this.LOG_LVL_NORM});  
};

Hit.prototype.error = function(msg, o) {
    o = o || {}; // o is an optional JSON object to be stored alongside message
    
    this.events.push({"msg": msg, o: o, ts: Date.now(), lvl: this.LOG_LVL_ERR});  
    this.errorHappened = true;
};

Hit.prototype.debug = function(msg, o) {
    o = o || {}; // o is an optional JSON object to be stored alongside message
    
    this.events.push({"msg": msg, o: o, ts: Date.now(), lvl: this.LOG_LVL_DBG});  
};

Hit.prototype.isError = function() {
    return this.errorHappened;
};


var Hit = require("./Hit.js");
var bunyan = require("bunyan")

/*
 * LogCtx represents an application or service
 * Hits derive from a LogCtx
 * LogCtx is used to setup where logs actually go
*/

module.exports = LogCtx;

function LogCtx(name, logLvl, showSrc) {
    this.name = name;
	this.logLvl = logLvl || Hit.LOG_LVL_NORM;
	this.history = [];
	this.ringbuffer = new bunyan.RingBuffer({ limit: 1000 }); // Keep lines in memory for debugging

	showSrc = showSrc || false;

	this.logger = bunyan.createLogger({ name: name, src: showSrc, 
	serializers: { req: bunyan.stdSerializers.req },
	streams: [{
        path: "./"+name+'.log',
    },
	{
            level: 'info',
            stream: process.stdout
        },
        {
            level: 'trace',
            type: 'raw',    // use 'raw' to get raw log record objects
            stream: this.ringbuffer
        }
	]
	 });
};

LogCtx.prototype.newHit = function (id) {
	var id = id || gen_uniq_id();

	var childLog = this.logger.child({ req_id: id }, true);
	// Temporary fix until every dependent file switches to info instead of log
	childLog.log = function () {
		childLog.info.apply(childLog, arguments);
	};
	
	// Creates another child log
	childLog.stack = function (action, extra) {
		extra = extra || {};
		extra.action = action; // May be unclean as it modifies the parameter dict
		var childLog = this.child(extra, true);
		// Temporary fix until every dependent file switches to info instead of log
		childLog.log = function () {
			childLog.info.apply(childLog, arguments);
		};
		return childLog;
	};
	
	return childLog;
	//return new Hit(this, id);
};

// Dumps the content of the ring buffer
LogCtx.prototype.dumpTraces = function() {
	console.log(this.ringbuffer.records);
};

//LogCtx.prototype.emitError = function (hit, now, msg, o) {
//	this.logger.error({ req: hit.id }, msg, o);
//};
//
//LogCtx.prototype.emitInfo = function (hit, now, msg, o) {
//	this.logger.info({ req: hit.id }, o, msg);
//};
//
//LogCtx.prototype.emitDebug = function (hit, now, msg, o) {
//	this.logger.debug({ req: hit.id }, o, msg);
//};

function gen_uniq_id() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + s4();
}
  


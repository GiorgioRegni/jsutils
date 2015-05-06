var Hit = require("./Hit.js");
var winston = require("winston")
/*
 * LogCtx represents an application or service
 * Hits derive from a LogCtx
 * LogCtx is used to setup where logs actually go
*/

module.exports = LogCtx;

function LogCtx(name, logLvl) {
    this.name = name;
	this.logLvl = logLvl || Hit.LOG_LVL_NORM;
	this.history = [];
	this.logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)({
				colorize: true,
				level: "debug",
				timestamp: true,
				prettyPrint: true
			}),
			new (winston.transports.File)({ filename: name + '.log' })
		]
	});

	this.lvl_to_winston = {
		3: this.logger.info,
		1: this.logger.error,
		5: this.logger.debug
	};

};

LogCtx.prototype.newHit = function (id) {
	id = id || gen_uniq_id();
	return new Hit(this, id);
};

LogCtx.prototype.emit = function (hit, lvl, now, msg, o) {
	this.lvl_to_winston[lvl](msg, o)
};

function gen_uniq_id() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + s4();
}
  


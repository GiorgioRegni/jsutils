Hit = require("./Hit.js");

/*
 * Context represents an application or service
 * Hits derive from a context
 * Context is used to setup where logs actually go
*/

module.export = Context;

function Context(name) {
    this.name = name;
	this.logLvl = Hit.LOG_LVL_NORM;
	this.history = [];
};

Context.prototype.newHit = function(id) {
	return new Hit(this, id);
};

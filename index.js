var History = require('history-component'),
		emitter = require('events').EventEmitter,
		events = require('dom-events'),
		util = require('util');

module.exports = Editable;

function Editable(element, stack) {
	var self = this instanceof Editable;
	if (!self) return new Editable(element, stack);
	if (!element) throw new TypeError('expects an element');

	this.history = new History(stack || []);
	this.history.max(100);
	this.element = element;
}

util.inherits(Editable, emitter);

Editable.prototype.contents = function() {
	return this.element.innerHTML;
};

Editable.prototype.toggle = function() {
	return 'true' == this.element.contentEditable ? this.disable() : this.enable();
};

Editable.prototype.enable = function() {
	this.element.contentEditable = true;
	events.on(this.element, 'keyup', this.onstatechange.bind(this));
	events.on(this.element, 'click', this.onstatechange.bind(this));
	events.on(this.element, 'focus', this.onstatechange.bind(this));
	events.on(this.element, 'paste', this.onchange.bind(this));
	events.on(this.element, 'input', this.onchange.bind(this));
	this.emit('enable');
	return this;
};

Editable.prototype.disable = function() {
	this.element.contentEditable = false;
	events.off(this.element, 'keyup', this.onstatechange.bind(this));
	events.off(this.element, 'click', this.onstatechange.bind(this));
	events.off(this.element, 'focus', this.onstatechange.bind(this));
	events.off(this.element, 'paste', this.onchange.bind(this));
	events.off(this.element, 'input', this.onchange.bind(this));
	this.emit('disable');
	return this;
};

Editable.prototype.range = function() {
	return document.createRange();
};

Editable.prototype.selection = function() {
	return window.getSelection();
};

Editable.prototype.undo = function() {
	var buf = this.history.prev(),
			curr = this.element.innerHTML;

	this.element.innerHTML = buf || curr;
	buf || this.emit('state');
	return this;
};

Editable.prototype.redo = function() {
	var buf = this.history.next(),
			curr = this.element.innerHTML;

	this.element.innerHTML = buf || curr;
	buf || this.emit('state');
	return this;
};

Editable.prototype.execute = function(cmd, val) {
	document.execCommand(cmd, false, val);

	this.onstatechange();

	return this;
};

Editable.prototype.state = function(cmd) {
	var length = this.history.vals.length - 1,
			stack = this.history;

	if ('undo' == cmd) return 0 < stack.i;
	if ('redo' == cmd) return length > stack.i;

	return document.queryCommandState(cmd);
};

Editable.prototype.onstatechange = function(e) {
	this.emit('state', e);
	return this;
};

Editable.prototype.onchange = function(e) {
	this.history.add(this.contents());
	return this.emit('change', e);
};
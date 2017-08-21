
var contexts = require('../lib/contexts');
var types = require('../lib/types');

exports['get unknown type'] = function (test) {
	var ctx = contexts.context();
	
	test.equal(ctx.type('Id'), null);
}

exports['set and get Int type'] = function (test) {
	var ctx = contexts.context();
	
	ctx.type('Id', types.Int)
	test.strictEqual(ctx.type('Id'), types.Int);
}

exports['get type from unknown value'] = function (test) {
	var ctx = contexts.context();
	
	test.equal(ctx.value('answer'), null);
}

exports['set and get Int value'] = function (test) {
	var ctx = contexts.context();
	
	ctx.value('answer', types.Int)
	test.strictEqual(ctx.value('answer'), types.Int);
}


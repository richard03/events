var events = require('../src/events.js');

/**
 * Test simple event listener and trigger
 * @param test
 */
exports.simpleEvent = function(test) {
	var passed = false;
	events.listen('testEvent', function () {
		passed = true;
	});
	events.trigger('testEvent');
	test.ok(passed, "trigger should call the event listener.")
	test.done();
};

/**
 * Test, if multiple event listeners don't affect each other
 * @param test
 */
exports.multipleEvents = function(test) {
	var firstPassed = false;
	var secondPassed = false;

	events.listen('firstEvent', function () {
		firstPassed = true;
	});

	events.listen('secondEvent', function () {
		secondPassed = true;
	});
	test.strictEqual(firstPassed, false, "Listeners shall not run before triggered");
	test.strictEqual(secondPassed, false, "Listeners shall not run before triggered");

	events.trigger("secondEvent");
	test.strictEqual(firstPassed, false, "Trigger shall call only related event listener");
	test.strictEqual(secondPassed, true, "Trigger shall call only related event listener");
	
	test.done();
};

/**
 * Test if normal listener is triggered every time
 * and if listenOnce listener is triggered only once
 * @param test
 */
exports.multipleCalls = function(test) {
	var firstCounter = 0;
	var secondCounter = 0;
	var thirdCounter = 0;

	events.listen('firstEvent', function () {
		firstCounter++;
	});

	events.listen('secondEvent', function () {
		secondCounter++;
	});

	events.listenOnce('thirdEvent', function () {
		thirdCounter++;
	});

	events.trigger("firstEvent");
	events.trigger("firstEvent");
	events.trigger("thirdEvent");
	events.trigger("secondEvent");
	events.trigger("thirdEvent");
	events.trigger("thirdEvent");
	events.trigger("firstEvent");
	events.trigger("secondEvent");

	test.strictEqual(firstCounter, 3, "Trigger shall call the listener each time");
	test.strictEqual(secondCounter, 2, "Trigger shall call the listener each time");
	test.strictEqual(thirdCounter, 1, "Trigger shall call the listenOnce listener only once, after that the listener is ignored");

	test.done();
};

exports.removeEvent = function(test) {
	var counter = 0;

	events.listen("testEvent", function () {
		counter++;
	});

	events.trigger("testEvent");
	events.removeListeners("testEvent");
	events.trigger("testEvent");
	events.trigger("testEvent");

	test.strictEqual(counter, 1, "Removed listener shall not be triggered any more.");

	test.done();
};
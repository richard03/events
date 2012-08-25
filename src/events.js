/**
 * The event manager.
 * Use it to trigger events and to bind event listeners.
 */

var eventListeners = [];

/**
 * Start listening to the event.
 *
 * @param eventName
 * @param listenerFunction
 */
function addEventListener(eventName, listenerFunction) {
	eventListeners.push({
		name: eventName,
		listener: listenerFunction
	});
	return listenerFunction;
}

/**
 * Start listening to the event.
 *
 * @param eventName
 * @param listenerFunction
 */
function addOneTimeEventListener(eventName, listenerFunction) {
	eventListeners.push({
		name: eventName,
		listener: listenerFunction,
		isOneTimeListener: true
	});
	return listenerFunction;
}

/**
 * Stop listening to the event.
 * This may unbind more than one listener, if they match the identifier.
 *
 * @param listenerIdentifier - you can use both listener function reference and event name.
 */
function removeEventListeners(listenerIdentifier) {
	var newQueue = [];
	for (var i = 0, l = eventListeners.length; i < l; i++) {
		switch (typeof listenerIdentifier) {
			case "number":
				if (i !== listenerIdentifier) {
					newQueue.push(eventListeners[i]);
				}
				break;
			case "string":
				if (eventListeners[i].name !== listenerIdentifier) {
					newQueue.push(eventListeners[i]);
				}
				break;
			case "function":
				if (eventListeners[i].listener !== listenerIdentifier) {
					newQueue.push(eventListeners[i]);
				}
				break;
		}
	}
	eventListeners = newQueue;
}


/**
 * Calls all listeners of the event.
 * Allows to send some parameters to the event listener.
 *
 * @param eventName
 * @param params for the listener
 */
function triggerEvent(eventName, params) {
	for (var i = 0, l = eventListeners.length; i < l; i++) {
		if (eventListeners[i].name === eventName) {
			eventListeners[i].listener.apply(null, params);
			if (eventListeners[i].isOneTimeListener) {
				removeEventListeners(i);
			}
		}
	}
}

/**
 * Helper function
 * - creates a callback that triggers an event
 * @param eventName - name of event for the trigger
 * @param params - array of parameters for the event trigger
 */
function createTriggerCallback(eventName, params) {
	return function() {
		triggerEvent(eventName, params);
	}
}

exports.listen = addEventListener;
exports.listenOnce = addOneTimeEventListener;
exports.removeListeners = removeEventListeners;
exports.trigger = triggerEvent;
exports.triggerCallback = createTriggerCallback;

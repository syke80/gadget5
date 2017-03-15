function EventHandler() {
    var events = [];

    function createNewEvent(eventId) {
        var newEvent = {
            subscribers: []
        };

        events[eventId] = newEvent;
    }

    /**
     * @param eventId
     * @param callback
     * @param parametersToPass  parameters will be passed to the callback.
     *                          it is useful if the subscriber wants to identify itself in the callback function.
     */
    this.subscribe = function(eventId, callback, parametersToPass) {
        if (!events[eventId]) {
            createNewEvent.call(this, eventId);
        }

        if (events[eventId].subscribers.indexOf(callback) === -1) {
            events[eventId].subscribers.push({
                callback: callback,
                parametersToPass: parametersToPass
            });
        }
    }

    this.trigger = function(eventId, data, sourceObject) {
        var event = events[eventId];

        if (!!event) {
            event.subscribers.forEach( function(subscriber) {
                subscriber.callback(data, sourceObject, subscriber.parametersToPass);
            });
        }
    }
}

define( function() {
    var events = [],
        eventHandler;

    function createNewEvent(eventId) {
        var newEvent = {
            subscribers: []
        };

        events[eventId] = newEvent;
    }

    eventHandler = {
        /**
         * @param eventId
         * @param callback
         * @param parametersToPass  parameters will be passed to the callback.
         *                          it is useful if the subscriber wants to identify itself in the callback function.
         */
        subscribe: function (eventId, callback, parametersToPass) {
            if (!events[eventId]) {
                createNewEvent.call(this, eventId);
            }

            if (events[eventId].subscribers.indexOf(callback) === -1) {
                console.log("subscribe", eventId);
                events[eventId].subscribers.push(callback);
            }
        },

        trigger: function (eventId, data, sourceObject) {
            var event = events[eventId];

            if (!!event) {
                console.log("trigger", eventId);
                event.subscribers.forEach(function (callback) {
                    callback(data, sourceObject);
                });
            }
        }
    }

    return eventHandler;
})
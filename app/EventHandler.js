function EventHandler() {
    var events = [];

    function createNewEvent(eventId) {
        var newEvent = {
            subscribers: []
        };

        events[eventId] = newEvent;
    }

    this.subscribe = function(eventId, callback) {
        if (!events[eventId]) {
            createNewEvent.call(this, eventId);
        }

        if (events[eventId].subscribers.indexOf(callback) === -1) {
            events[eventId].subscribers.push(callback);
        }
    }

    this.trigger = function(eventId, data, sourceObject) {
        var event = events[eventId];

        if (!!event) {
            event.subscribers.forEach( function(subscriber) {
                subscriber(data, sourceObject);
            });
        }
    }
}

class CollectionDispatcher {
    events = {};

    dispatch(event) {
        if (!this.events[event.type]) {
            this.events[event.type] = [];
        }
        this.events[event.type].push(event.item);
    }

    dispatchEvents(dispatch) {
        Object.keys(this.events).forEach(eventType => {
            dispatch({
                type: eventType,
                item: this.events[eventType],
            });
        })
    }
}
export default CollectionDispatcher;
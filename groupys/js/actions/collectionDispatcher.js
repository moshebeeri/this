import * as actions from "../reducers/reducerActions";
class CollectionDispatcher {
    events = {};

    dispatch(event) {
        if (!this.events[event.type]) {
            this.events[event.type] = [];
        }
        this.events[event.type].push(event.item);
    }

    dispatchEvents(dispatch,updateFunc,token) {
        Object.keys(this.events).forEach(eventType => {

            dispatch({
                type: eventType,
                item: this.events[eventType],
            });
            if(eventType === actions.UPSERT_BUSINESS){
                if(updateFunc) {
                    updateFunc(token, this.events[eventType], dispatch)
                }
            }
        })
    }
}

export default CollectionDispatcher;
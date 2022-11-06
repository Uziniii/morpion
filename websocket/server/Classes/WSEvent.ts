type eventFunc = ({
    type
}) => any;

class WSEvent {
    public typeEvent: string;
    protected event: eventFunc;

    constructor({
        typeEvent,
        event
    }: {
        typeEvent: string;
        event: eventFunc;
    }) {
        this.typeEvent = typeEvent;
        this.event = event;
    }

    public fire() {
        this.event({
            type: this.typeEvent
        });
    }
}

export default WSEvent;
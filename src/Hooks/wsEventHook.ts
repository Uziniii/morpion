function wsEventHook(ws: WebSocket, token: string) {
    return function sendEvent(event: string, data: any) {
        ws.send(JSON.stringify({
            token,
            event,
            data
        }))
    }
}

export type sendEventFunc<Events> = <Event extends keyof Events>(event: Event, data: Events[Event]) => void

export default wsEventHook;

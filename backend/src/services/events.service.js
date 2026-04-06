const clients = new Set();

export function addSseClient(res) {
    clients.add(res);
}

export function removeSseClient(res) {
    clients.delete(res);
}

export function sendSseEvent(res, event, payload) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

export function broadcastEvent(event, payload) {
    for (const client of clients) {
        sendSseEvent(client, event, payload);
    }
}

export function getSseClientsCount() {
    return clients.size;
}
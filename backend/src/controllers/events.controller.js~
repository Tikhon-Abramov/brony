import {
    addSseClient,
    removeSseClient,
    sendSseEvent,
} from '../services/events.service.js';

export function streamEvents(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    res.flushHeaders?.();

    sendSseEvent(res, 'connected', {
        ok: true,
        timestamp: new Date().toISOString(),
    });

    addSseClient(res);

    const heartbeat = setInterval(() => {
        sendSseEvent(res, 'heartbeat', {
            timestamp: new Date().toISOString(),
        });
    }, 25000);

    req.on('close', () => {
        clearInterval(heartbeat);
        removeSseClient(res);
        res.end();
    });
}
import * as http from 'http';
import * as socketIO from 'socket.io';
import PeersManager from './peers.manager';
import * as cors from 'cors';
const server: any = http.createServer();
const io = new socketIO.Server(server, { cors: { origin: '*', }});
import * as UAParser from 'ua-parser-js';

// Event handler for new connections
io.on('connection', (socket) => {
    console.log('New device connected');
    if (socket.handshake.headers.host != null) {
        const publicIp = socket.handshake.headers.host.split(":")[0];
        console.log('publicIp', publicIp);

        const userAgent = new UAParser(socket.request.headers['user-agent']).getOS();
        console.log('userAgent', userAgent);

        PeersManager.addPeer(publicIp, socket);

        const peers = PeersManager.getPeersByPublicIp(publicIp).filter((p: any) => p.socketId !== socket.id);
        console.log('peers', peers);
        socket.emit('connected-devices-list', {devices: peers});
        if (peers.length > 0) {
            for (const peer of peers) {
                const s: any = PeersManager.getPeerBySocketId(peer.socketId);
                s.emit('new-device-connected', {socketId: socket.id});
            }
        }

        socket.on('signal', (data: any) => {
            console.log('signal', data);
            const s = PeersManager.getPeerBySocketId(data.socketId);
            s.emit('signal', {socketId: socket.id, signal: data.signal});
        });

        // Event handler for disconnections
        socket.on('disconnect', () => {
            if (socket.handshake.headers.host != null) {
                const publicIp = socket.handshake.headers.host.split(":")[0];
                PeersManager.removePeer(publicIp, socket);
                const peers = PeersManager.getPeersByPublicIp(publicIp);
                if (peers.length > 0) {
                    for (const peer of peers) {
                        const s: any = PeersManager.getPeerBySocketId(peer.socketId);
                        s.emit('new-device-disconnected', {socketId: socket.id});
                    }
                }
            }
        });
    }
});

// Start the server
const port = 43594;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

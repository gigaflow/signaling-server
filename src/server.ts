import * as http from 'http';
import * as socketIO from 'socket.io';

import PeerHandler from './peer.handler';

const server: any = http.createServer();
const io = new socketIO.Server(server, {cors: {origin: '*',}});

// Event handler for new connections
io.on('connection', PeerHandler.onNewConnection);

// Start the server
const port = 43594;
server.listen(port, () => {
    console.log(`Signaling Server is running on port ${port}`);
});

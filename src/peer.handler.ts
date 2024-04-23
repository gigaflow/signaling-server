import PeersManager from "./peers.manager";
import {Peer} from "./peer";
import {OutgoingEvents} from "./enums/outgoing-events.enum";
import {
    TransformPeerDisconnectedResponse,
    TransformPeerToDeviceListResponse,
    TransformPeerToSignalResponse
} from "./transformers/peer.transformer";

class PeerHandler {

    onNewConnection = (socket: any) => {
        console.log('New device connected');

        try {
            const peer = new Peer(socket);
            peer.onInit();
            PeersManager.addPeer(peer);


            const peers: Peer[] = PeersManager.getPeersByPublicIp(peer.getPublicIPAddress())
                .filter((p: any) => p.getID() !== peer.getID());

            // Send list of devices to self
            peer.sendEvent(OutgoingEvents.DEVICES_LIST, {
                devices: peers.map(TransformPeerToDeviceListResponse)
            });

            // Update other devices of this device's new connection
            if (peers.length > 0) {
                const myPeerData = TransformPeerToDeviceListResponse(peer);
                for (const otherPeer of peers) {
                    otherPeer.sendEvent(OutgoingEvents.NEW_DEVICE_CONNECTED, myPeerData);
                }
            }

            socket.on('signal', (data: any) => {
                console.log('signal', data);
                const foundPeer = PeersManager.getPeerBySocketId(data.socketId);
                foundPeer?.sendEvent(OutgoingEvents.SIGNAL, TransformPeerToSignalResponse(foundPeer, data.signal));
            });

            // Event handler for disconnections
            socket.on('disconnect', () => {
                this.onPeerDisconnect(socket);
            });

        } catch (err) {
            console.log('error');
            // todo disconnect peer
        }
    }

    onPeerDisconnect = (socket: any) => {
        if (socket.handshake.headers.host == null) {
            return;
        }
        const peer = PeersManager.getPeerBySocketId(socket.id);
        if (!peer) {
            return;
        }
        const publicIp = peer.getPublicIPAddress();
        PeersManager.removePeer(peer);

        const peers = PeersManager.getPeersByPublicIp(publicIp);
        if (peers.length > 0) {
            for (const otherPeer of peers) {
                otherPeer.sendEvent(OutgoingEvents.NEW_DEVICE_DISCONNECTED, TransformPeerDisconnectedResponse(peer));
            }
        }
    }

}
export default new PeerHandler() as PeerHandler;

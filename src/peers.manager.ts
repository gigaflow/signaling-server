import {Peer} from "./peer";

class PeersManager {
    private peersLocalNetworkGroups: any = {};
    private peers: {[key: string]: Peer | undefined} = {};

    public addPeer(peer: Peer) {
        const publicIp = peer.getPublicIPAddress();

        if (!this.peersLocalNetworkGroups[publicIp]) {
            this.peersLocalNetworkGroups[publicIp] = [];
        }
        this.peersLocalNetworkGroups[publicIp].push({socketId: peer.getID()});
        this.peers[peer.getID()] = peer;
    }

    public removePeer(peer: Peer) {
        const publicIp = peer.getPublicIPAddress();

        if (!this.peersLocalNetworkGroups[publicIp]) {
            return;
        }
        this.peersLocalNetworkGroups[publicIp] = this.peersLocalNetworkGroups[publicIp].filter((p: any) => p.socketId !== peer.getID());
        this.peers[peer.getID()] = undefined;
    }

    getPeersByPublicIp(publicIp: string): Peer[] {
        if (!this.peersLocalNetworkGroups[publicIp]) {
            return [];
        }
        return this.peersLocalNetworkGroups[publicIp];
    }

    getPeerBySocketId(id: string) {
        return this.peers[id];
    }

}
export default new PeersManager() as PeersManager;

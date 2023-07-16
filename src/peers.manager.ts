class PeersManager {
    private peersLocalNetworkGroups: any = {};
    private sockets: any = {};

    public addPeer(publicIp: string, peer: any) {
        if (!this.peersLocalNetworkGroups[publicIp]) {
            this.peersLocalNetworkGroups[publicIp] = [];
        }
        this.peersLocalNetworkGroups[publicIp].push({socketId: peer.id});
        this.sockets[peer.id] = peer;
    }

    public removePeer(publicIp: string, peer: any) {
        if (!this.peersLocalNetworkGroups[publicIp]) {
            return;
        }
        this.peersLocalNetworkGroups[publicIp] = this.peersLocalNetworkGroups[publicIp].filter((p: any) => p.socketId !== peer.id);
        this.sockets[peer.id] = undefined;
    }

    getPeersByPublicIp(publicIp: string) {
        return this.peersLocalNetworkGroups[publicIp];
    }

    getPeerBySocketId(id: string) {
        return this.sockets[id];
    }

}
export default new PeersManager() as PeersManager;

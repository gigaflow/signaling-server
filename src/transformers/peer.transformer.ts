import {Peer} from "../peer";
import {IDeviceListPeer} from "../interfaces/device-list-peer.interface";
import {ISignalResponse} from "../interfaces/signal-response.interface";
import {IPeerDisconnectedResponse} from "../interfaces/peer-disconnected-response.interface";

export const TransformPeerToDeviceListResponse = (peer: Peer): IDeviceListPeer => {
    return {
        socketId: peer.getID(),
        os: peer.getOS(),
    }
}

export const TransformPeerToSignalResponse = (peer: Peer, signalData: any): ISignalResponse => {
    return {
        socketId: peer.getID(),
        signal: signalData
    }
}

export const TransformPeerDisconnectedResponse = (peer: Peer): IPeerDisconnectedResponse => {
    return {
        socketId: peer.getID(),
    }
}
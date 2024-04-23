import * as UAParser from "ua-parser-js";
import {OutgoingEvents} from "./enums/outgoing-events.enum";
import PeersManager from "./peers.manager";

export class Peer {

    private os: any;

    constructor(private readonly socket: any) {}

    onInit = () => {
        if (this.socket.handshake.headers.host === null) {
           throw new Error('No socket host');
        }

        this.os = new UAParser(this.socket.request.headers['user-agent']).getOS();
    }

    sendEvent = (event: OutgoingEvents, data: any) => {
        this.socket.emit(event, data);
    }

    getID = (): string => {
        return this.socket.id;
    }

    getPublicIPAddress() {
        let publicIp = this.socket.handshake.address;
        if (publicIp === '::1') {
            publicIp = 'localhost';
        }
        return publicIp;
    }

    getOS = () => {
        return this.os;
    }
}
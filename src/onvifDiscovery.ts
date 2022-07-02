import { OnvifComponent } from "./onvifComponent";
import { Socket, createSocket, RemoteInfo } from "dgram";
import { randomUUID } from "crypto";
import { xml2js } from "xml-js";

const parser = xml2js


/**
 * 
 */
export interface DeviceDescription {
    host: string;
    port: number;
    https: boolean;
}

/**
 * 
 */
export interface DeviceListener {
    function: (device: DeviceDescription) => Promise<void>;
}

/**
 * Provides event subscription for new devices being discovered.
 */
export class DiscoveryComponent extends OnvifComponent {

    private _socket: Socket;
    private _intervalHandle?: ReturnType<typeof setInterval> = undefined;

    /**
    * 
    */
    constructor() {
        super();
        this._socket = createSocket('udp4');
        this._socket.on('message', this.processUdpMessage.bind(this));
        this._socket.on('error', this.processError.bind(this));
        this._intervalHandle = setInterval(this.sendDiscoveryRequest.bind(this), 15000);
    }


    /**
     * @return {Promise<void>}
     */
    dispose(): Promise<void> {
        this._socket.close();
        if(this._intervalHandle) clearInterval(this._intervalHandle);
        return Promise.resolve();
    }

    /**
     * 
     * @param {Error} error 
     */
    private processError(error: Error): void { 
        console.error(error);
    }

    /**
     * 
     * @param {Buffer} message 
     * @param {RemoteInfo} remoteInfo 
     */
    private processUdpMessage(message: Buffer, remoteInfo: RemoteInfo): void {
        this.processWsMessage(message.toString('utf-8'));
    }

    /**
     * 
     * @param {string} message 
     */
    private processWsMessage(message: string): void {
        const deviceProfile = xml2js(message, {compact: true, ignoreComment: true, ignoreDeclaration: true, ignoreInstruction: true, ignoreDoctype: true, trim: true, nativeType: true});
        console.log(deviceProfile);
    }

    /**
     * 
     */
    private sendDiscoveryRequest(): void {
        const buffer = this.buildDiscoveryRequest();
        this._socket.send(buffer, 0, buffer.length, 3702, '239.255.255.250');
    }

    /**
     * 
     * @return {Buffer}
     */
    private buildDiscoveryRequest(): Buffer {
        const uuid = `urn:uuid:${randomUUID()}`;
        return Buffer.from(
            '<Envelope xmlns="http://www.w3.org/2003/05/soap-envelope" xmlns:dn="http://www.onvif.org/ver10/network/wsdl">' +
                '<Header>' +
                    '<wsa:MessageID xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">' + uuid + '</wsa:MessageID>' +
                    '<wsa:To xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">urn:schemas-xmlsoap-org:ws:2005:04:discovery</wsa:To>' +
                    '<wsa:Action xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2005/04/discovery/Probe</wsa:Action>' +
                '</Header>' +
                '<Body>' +
                    '<Probe xmlns="http://schemas.xmlsoap.org/ws/2005/04/discovery" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
                        '<Types>dn:NetworkVideoTransmitter</Types>' +
                        '<Scopes />' +
                    '</Probe>' +
                '</Body>' +
            '</Envelope>'
        )
    }

    /**
     * 
     * @param {DeviceListener} listener 
     */
    public addListener(listener: DeviceListener): void {
        throw new Error("Method not implemented.");
    }

    /**
     * 
     * @param {DeviceListener} listener 
     */
    public removeListener(listener: DeviceListener): void {
        throw new Error("Method not implemented.");
    }
    
}
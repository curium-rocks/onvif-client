// What will this be?
// it will, target Node.JS with no compromises made for browser compatibility
// it will, give access to sub component funcitonality in a extendable way to allow easy incremental additions of onvif profiles
// it will, give provide single point for clean up of timers etc
// it will, provide a single spot for connectivity configuration
// it will, provide a single spot for error propagation if desired
// it will, provide a single spot for logging
// it will, be log library agnostic but will be tested against winston
// it will, provide a single spot for state change events
// it will, not make assumptions about being a singleton, consumer will be reponsible for creating and destroying one or many instances
// it will provide typescript bindings
// it will, not bring in a ton of dependencies
// it will, not do runtime code generation against the wsdl
// it will, not use any gpl libraries
// it will, abstract away complications of the onvif spec to improve use experience where possible
// it will, not provide rtsp support beyond getting the stream uri
// it will, maintain a collection of devices discovered, based on a allow/deny list
// it will, allow all devices to be added by default
// it will, support providing credentials, default and matched by hostname:port
// it will, ping devices to determine if they are alive and send events if they are not
// it will, support motion events 
// it will, support ptz 
// it will, support general configuration, including video, audio, motion detection, etc

import { DiscoveryComponent } from "./onvifDiscovery";

/**
 * 
 */
export class OnvifClient {

    public readonly Discovery: DiscoveryComponent;

    /**
     * 
     */
    constructor() { 
        this.Discovery = new DiscoveryComponent();
    }


    /**
     * 
     * @return {Promise<void>} 
     */
     public async dispose(): Promise<void> {
        await this.Discovery.dispose();
        return Promise.resolve();
    }
}
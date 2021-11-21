import { OnvifClient } from './onvifClient';

const onvifClient = new OnvifClient();

process.on('SIGINT', () => {
    onvifClient.dispose();
})
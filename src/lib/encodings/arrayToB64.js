export default function arrayToB64( buffer ) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
}

//import { bytesToBase64 } from './b64';

//export default function arrayToB64(buff) { return bytesToBase64(buff) }
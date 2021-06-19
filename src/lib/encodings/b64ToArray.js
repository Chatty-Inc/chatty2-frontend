export default function b64ToArray(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i);
    return bytes.buffer;
}

//import { base64ToBytes } from './b64';

//export default function b64ToArray(base64) { return base64ToBytes(base64) }
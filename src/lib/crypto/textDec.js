import b64ToArray from '../encodings/b64ToArray';
import log from '../logger';

const textDec = async (msg, derivedKey) => {
    try {
        const text = msg.data;
        const iv = new TextEncoder().encode(msg.iv);

        const uintArray = b64ToArray(text);
        const algorithm = {
            name: 'AES-GCM',
            iv: iv,
        };
        const decryptedData = await window.crypto.subtle.decrypt(
            algorithm,
            derivedKey,
            uintArray
        );

        return new TextDecoder().decode(decryptedData);
    } catch(e) {
        // console.log(e);
        log('textDec', 'Decryption error', e.msg);
        return null;
    }
};

export default textDec;
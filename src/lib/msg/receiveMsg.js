import b64ToArray from '../encodings/b64ToArray';
import * as lzString from 'lz-string';
import textDec from '../crypto/textDec';

const receiveMsg = async (d, keys, signPubKeys) => {
    // Decrypt AES key
    const priKey = await window.crypto.subtle.importKey(
        'jwk', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
        keys.current.pri,
        {   //these are the algorithm options
            name: 'RSA-OAEP',
            hash: {name: 'SHA-512'}, //can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ['decrypt'] //'encrypt' or 'wrapKey' for public key import or
        //'decrypt' or 'unwrapKey' for private key imports
    );
    const decKey = await window.crypto.subtle.decrypt(
        {
            name: 'RSA-OAEP'
        },
        priKey,
        b64ToArray(lzString.decompressFromUTF16(d.key))
    );

    // Import the key
    const k = await window.crypto.subtle.importKey(
        'raw',
        decKey,
        'AES-GCM',
        true, [
            'encrypt',
            'decrypt'
        ]
    );

    const raw = await textDec({
        data: d.data,
        iv: lzString.decompressFromUTF16(d.iv)
    }, k);

    // Check signature
    // First see if the public key is present
    if (!signPubKeys || !signPubKeys[d.uid])
        return 'The public keys required to verify this message are missing. Please recreate this chat.'

    const signPub = await window.crypto.subtle.importKey(
        'jwk', //can be 'jwk' (public or private), "spki" (public only), or "pkcs8" (private only)
        signPubKeys[d.uid],
        {   //these are the algorithm options
            name: 'ECDSA',
            namedCurve: 'P-521', //can be "P-256", "P-384", or "P-521"
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ['verify'] //"verify" for public key import, "sign" for private key imports
    );
    const ok = await window.crypto.subtle.verify(
        {
            name: 'ECDSA',
            hash: {name: 'SHA-512'}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        signPub, //from generateKey or importKey above
        b64ToArray(lzString.decompressFromUTF16(d.sig)), //ArrayBuffer of the signature
        new TextEncoder().encode(JSON.stringify({
            data: d.data,
            iv: d.iv,
            gid: d.gid,
            id: d.target,

            key: d.key,
            act: 'sendTxt',
        })) //ArrayBuffer of the data
    );
    if (!ok) return 'Failed to verify authenticity of this message';

    // Finally, decompress message
    return lzString.decompressFromUTF16(raw);
}

export default receiveMsg;
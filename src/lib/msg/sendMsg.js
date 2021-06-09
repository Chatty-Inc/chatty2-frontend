import textEnc from '../crypto/textEnc';
import * as lzString from 'lz-string';
import arrayToB64 from '../encodings/arrayToB64';

const sendMsg = async (gID, target, msg, signKeys, pubKeys, awaitingSend, send) => {
    const k = await window.crypto.subtle.generateKey({
            name: 'AES-GCM',
            length: 256
        },
        true, [
            'encrypt',
            'decrypt'
        ]
    );

    // Compress and Encrypt message payload
    const {data, iv} = await textEnc(lzString.compressToUTF16(msg.trim()), k);

    // Encrypt AES key
    // First export it
    const e = await window.crypto.subtle.exportKey(
        'raw',
        k
    );

    // The below code requires the public key
    const requirement = async (k) => {
        // Then encrypt it with RSA
        const pubKey = await window.crypto.subtle.importKey(
            'jwk', // can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
            k,
            {   // these are the algorithm options
                name: 'RSA-OAEP',
                hash: {name: 'SHA-512'}, //can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
            },
            false, //whether the key is extractable (i.e. can be used in exportKey)
            ['encrypt'] //'encrypt' or 'wrapKey' for public key import or
            //'decrypt' or 'unwrapKey' for private key imports
        )

        const encKey = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP'
            },
            pubKey,
            e
        );

        const partial = {
            data: data,
            iv: lzString.compressToUTF16(iv),
            gid: gID,
            id: target,

            key: lzString.compressToUTF16(arrayToB64(encKey)),
            act: 'sendTxt',
        }

        const signPri = await window.crypto.subtle.importKey(
            'jwk', //can be 'jwk' (public or private), "spki" (public only), or "pkcs8" (private only)
            signKeys.current.priSign,
            {   //these are the algorithm options
                name: 'ECDSA',
                namedCurve: 'P-521', //can be "P-256", "P-384", or "P-521"
            },
            false, //whether the key is extractable (i.e. can be used in exportKey)
            ['sign'] //"verify" for public key import, "sign" for private key imports
        );
        const signature = await window.crypto.subtle.sign(
            {
                name: 'ECDSA',
                hash: {name: 'SHA-512'}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            },
            signPri, //from generateKey or importKey above
            new TextEncoder().encode(JSON.stringify(partial)) //ArrayBuffer of data you want to sign
        )

        await send(JSON.stringify({...partial, sig: lzString.compressToUTF16(arrayToB64(signature))}));
    }

    // Retrieve private key if not already downloaded
    if (!pubKeys.current[target]) {
        await send(JSON.stringify({
            act: 'getPub',
            uid: target
        }));
        awaitingSend.current[target] = requirement;
    } else await requirement(pubKeys.current[target]);
}

export default sendMsg;
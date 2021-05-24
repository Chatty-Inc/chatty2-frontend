import arrayToB64 from '../encodings/arrayToB64';

const textEnc = async (text, derivedKey) => {
    const encodedText = new TextEncoder().encode(text);

    const iv = btoa(window.crypto.getRandomValues(new Uint8Array(12)));

    const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: new TextEncoder().encode(iv) },
        derivedKey,
        encodedText
    );

    const uintArray = new Uint8Array(encryptedData);

    const string = arrayToB64(uintArray);

    return {
        data: string,
        iv: iv
    };
};

export default textEnc;

// window.crypto.getRandomValues(new Uint8Array(12));
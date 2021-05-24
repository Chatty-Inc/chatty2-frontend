import localforage from 'localforage';

import b64ToArray from './encodings/b64ToArray';
import arrayToB64 from './encodings/arrayToB64';

import textEnc from './crypto/textEnc';
import textDec from './crypto/textDec';

// Compression/decompression
import * as lzString from 'lz-string';

export default class SecureStorage {
    constructor() {
        this.contents = {};
    }

    async isInit() {
        return await localforage.getItem('iv') && await localforage.getItem('salt') && await localforage.getItem('data')
    }

    async genKey(pw) {
        const salt = await localforage.getItem('salt');

        const importedPw = await window.crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(pw),
            {'name': 'PBKDF2'},
            false,
            ['deriveKey']
        );

        console.log(importedPw)

        this.key = await window.crypto.subtle.deriveKey(
            {
                'name': 'PBKDF2',
                'salt': b64ToArray(salt),
                'iterations': 100000,
                'hash': 'SHA-512'
            },
            importedPw,
            {
                'name': 'AES-GCM',
                'length': 256
            },
            false,
            ['encrypt', 'decrypt']
        );
    }

    async unlock(pw) {
        const iv = await localforage.getItem('iv');

        await this.genKey(pw);

        const encData = await localforage.getItem('data');

        const dec = await textDec({ data: lzString.decompress(encData), iv: lzString.decompress(iv) }, this.key);

        if (!dec) return false;

        this.contents = JSON.parse(lzString.decompressFromUTF16(dec));
        console.log(this.contents)
        return true;
    }

    async sync() {
        const enc = await textEnc(lzString.compressToUTF16(JSON.stringify(this.contents)), this.key);
        await localforage.setItem('data', lzString.compress(enc.data));
        await localforage.setItem('iv', lzString.compress(enc.iv));
    }

    async init(pw) {
        const salt = arrayToB64(await window.crypto.getRandomValues(new Uint8Array(128)));
        await localforage.setItem('salt', salt);
        await this.genKey(pw);
        await this.sync();
    }

    async setVal(key, val) {
        this.contents[key] = val;
        await this.sync();
    }
    async getVal(key) {
        return this.contents[key];
    }
}
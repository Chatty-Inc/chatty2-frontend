export default async function getHexHash(message) {
    const msgUint8 = new TextEncoder().encode(message); // Encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // Hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
    // Convert bytes to hex string
    return hashArray.map(b => b.toString(16).padStart(2, '0'));
}
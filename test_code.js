import CryptoJS from "crypto-js"; // ✅ correct import

const key = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012"); // 32-byte key for AES-256
const iv = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16-byte IV

const encrypted = CryptoJS.AES.encrypt("Password@123", key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
});

console.log("Encrypted:", encrypted.toString());

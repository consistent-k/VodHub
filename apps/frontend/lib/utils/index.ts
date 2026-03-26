import CryptoJS from 'crypto-js';

//encrypt
export const encryptBase64 = (rawStr: string) => {
    const wordArray = CryptoJS.enc.Utf8.parse(rawStr);
    const base64 = CryptoJS.enc.Base64.stringify(wordArray);
    return base64;
};

//decrypt
export const decryptBase64 = (base64: string) => {
    const parsedWordArray = CryptoJS.enc.Base64.parse(base64);
    const parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
    return parsedStr;
};

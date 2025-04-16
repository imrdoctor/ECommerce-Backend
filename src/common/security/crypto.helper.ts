import * as CryptoJS from 'crypto-js';


const defaultSecretKey = "rw/hdf$si%n^m&p,!l@6(5)`*";
export const Encrypt = (plainText: string , SECRET_KEY : string = defaultSecretKey): string => {    
    return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
};

export const Decrypt = (encryptedText: string , SECRET_KEY : string = defaultSecretKey): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

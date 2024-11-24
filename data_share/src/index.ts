import express from 'express';
import router from './data-share.route';
import { DatabaseAdapter, PORT } from './database.adapter';
import bodyParser from 'body-parser';

DatabaseAdapter.connect();
const app = express();

app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
    console.log('Service SHARE DATA start SUCCESS!!!');
});

// import crypto from 'crypto';
// import zlib from 'zlib';

// const cccd = '019203001503';

// const generateMd5Buffer = (inputString: string): Buffer => {
//     const hash = crypto.createHash('md5');
//     hash.update(inputString);
//     return hash.digest();
// };

// const generateSha256Buffer = (inputString: string): Buffer => {
//     const hash = crypto.createHash('sha256');
//     hash.update(inputString);
//     return hash.digest();
// };

// // Sinh cặp khóa RSA duy nhất (public và private)
// const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//     modulusLength: 2048, // Độ dài khóa RSA
//     publicKeyEncoding: { type: 'spki', format: 'pem' },
//     privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
// });

// /**
//  * Hàm mã hóa và nén dữ liệu
//  * @param {string} data - Dữ liệu cần mã hóa và nén
//  * @param {string} publicKey - Khóa công khai RSA để mã hóa
//  * @returns {string} - Dữ liệu mã hóa đã nén dưới dạng Base64
//  */
// function encryptAndCompress(data, publicKey): Buffer {
//     const compressedData = zlib.gzipSync(data);
//     const encryptedData = crypto.publicEncrypt(publicKey, compressedData);
//     return encryptedData;
// }

// function decryptAndDecompress(encryptedData, privateKey) {
//     console.log(encryptedData);
//     console.log('====');
//     console.log(Buffer.from(encryptedData, 'base64'));
//     const decryptedData = crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64'));
//     const decompressedData = zlib.gunzipSync(decryptedData).toString('utf-8');
//     return decompressedData;
// }

// // Dữ liệu gốc
// const originalData = JSON.stringify({
//     'chup-x-quang': 'ko ls',
//     'sieu-am': 'ko ls',
//     'sieu con cac': 'hahaha',
//     cccd: '1212',
// });

// // Mã hóa và nén dữ liệu
// const encryptedData = encryptAndCompress(originalData, publicKey);

// // Giải mã và giải nén dữ liệu
// const decryptedData = decryptAndDecompress(encryptedData, privateKey);
// console.log('Decrypted and Decompressed Data:', decryptedData);

// // Kiểm tra tính toàn vẹn của dữ liệu
// console.log('Original Data Matches Decrypted Data:', originalData === decryptedData);

import express, { Request, Response, NextFunction } from 'express';
import { HospitalModel } from './hospital';
import crypto from 'crypto';
import { Web3Service } from './web3';
import zlib from 'zlib';

export class DataShareController {
    public static shareData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (req.user) {
                const { patient_data } = req.body;

                if (patient_data && patient_data.cccd && req.user.hospital_id) {
                    const hospital = (await HospitalModel.findById(req.user.hospital_id)).transform();
                    if (hospital) {
                        const publicKey = hospital.publicKey;
                        const base64_data = JSON.stringify(patient_data);
                        const encode = DataShareController.encryptAndCompress(base64_data, publicKey);

                        const accounts = await Web3Service.getAccounts();
                        const account = accounts[0];
                        const transaction = Web3Service.getConstract().methods.shareData(patient_data.cccd, encode);

                        const gas = await transaction.estimateGas({ from: account });

                        const gasPrice = await Web3Service.getWeb3().eth.getGasPrice();

                        const data = await transaction.send({
                            from: account,
                            gas: gas,
                            gasPrice: gasPrice,
                        });

                        res.json({
                            message: 'Chia se len blockchain thanh cong',
                            data: {
                                transactionHash: data.transactionHash,
                                blockHash: data.blockHash,
                                from: data.from,
                                to: data.to,
                            },
                        });
                        res.status(200);
                        res.end();
                        return;
                    }
                }
            }

            throw new Error('Khong the chia se data');
        } catch (err) {
            res.json({
                message: 'That bai khoong the send data',
            });
            res.status(404);
            res.end();
        }
    };

    private static encryptAndCompress(data, publicKey: string) {
        const compressedData = zlib.gzipSync(data);
        const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(compressedData));
        console.log(encryptedData);
        return encryptedData;
    }
    private static decryptAndDecompress(encryptedData, privateKey: string) {
        try {
            console.log(encryptedData);
            const decryptedData = crypto.privateDecrypt(privateKey, encryptedData);
            const decompressedData = zlib.gunzipSync(decryptedData).toString('utf-8');
            return decompressedData;
        } catch (err) {
            console.error(err);
        }
    }

    public static receiveData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { patient_cccd } = req.body;
            if (req.user && patient_cccd) {
                const hospital = await HospitalModel.findById(req.user.hospital_id);

                if (hospital) {
                    const privateKey = hospital.privateKey;
                    if (privateKey) {
                        const accounts = await Web3Service.getAccounts();
                        const account = accounts[0];
                        const data = await Web3Service.getConstract()
                            .methods.getData(patient_cccd)
                            .call({ from: account });

                        if (!data || data === '0x') {
                            throw new Error('Khong ton tai du lieu nay');
                        }

                        const buffreBase64 = Buffer.from(data.slice(2), 'hex');
                        // const decryptedData = DataShareController.decryptAndDecompress(
                        //     buffreBase64,
                        //     privateKey.toString(),
                        // );
                        // console.log(buffreBase64);
                        // const decryptedData = crypto.privateDecrypt(privateKey.toString(), buffreBase64);
                        // const decompressedData = zlib.gunzipSync(decryptedData).toString('utf-8');
                        // console.log(decryptedData);

                        // console.log(decompressedData);

                        res.json({
                            messgae: 'Da tim thay du lieu',
                            data: data,
                        });
                        res.status(200);
                        res.end();
                        return;
                    }
                }
            }

            throw new Error('Khong tha nan data');
        } catch (err) {
            console.log(err);
            res.json({
                message: 'That bai khoong the receive data',
            });
            res.status(404);
            res.end();
        }
    };
}

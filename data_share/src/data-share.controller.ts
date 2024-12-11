import eventbus from './event';
import express, { Request, Response, NextFunction } from 'express';
import { HospitalModel } from './hospital';
import crypto from 'crypto';
import { Web3Service } from './web3';
import zlib from 'zlib';
import { EventRegister } from './event';

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
                        const transaction = Web3Service.getContract().methods.shareData(patient_data.cccd, hospital.id,encode);

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

                        eventbus.emit(EventRegister.EVENT_SHARE_DATA, {
                            admin_id: req.user.id,
                            admin_name: req.user.name,
                            patient_cccd: patient_data.cccd,
                            hospital_id: req.user.hospital_id,
                        });
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
        return encryptedData.toString('base64');
    }
    private static decryptAndDecompress(encryptedData, privateKey: string) {
        try {
            const result = encryptedData.map((item) => {
                const deBase64 = Buffer.from(item, 'base64');
                const decode = crypto.privateDecrypt(privateKey.toString(), deBase64);
                const decompressedData = zlib.gunzipSync(decode).toString('utf-8');
                return JSON.parse(decompressedData);
            });

            return result;
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

                        const datas = await Web3Service.getContract().methods.getRecordsByAddress(patient_cccd, hospital.transform().id).call({from: account, gas: 6000000});

                        if (datas?.length <= 0) {
                            throw new Error('Khong ton tai du lieu nay');
                        }

                        const result = DataShareController.decryptAndDecompress(datas, privateKey.toString());

                        res.json({
                            messgae: 'Da tim thay du lieu',
                            data: result,
                        });
                        res.status(200);
                        res.end();

                        eventbus.emit(EventRegister.EVENT_RECEIVE_DATA, {
                            admin_id: req.user.id,
                            admin_name: req.user.name,
                            patient_cccd: patient_cccd,
                            hospital_id: req.user.hospital_id,
                        });
                        return;
                    }
                }
            }

            throw new Error('Khong tha nan data');
        } catch (err) {
            console.error(err);
            res.json({
                message: 'That bai khoong the receive data',
            });
            res.status(404);
            res.end();
        }
    };
}

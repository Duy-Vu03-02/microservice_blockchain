import { Web3 } from 'web3';
import fs from 'fs';
import path from "path"
import { BUILD_URL, GANACHE_URL } from './infrastructure/database.adapter';

export class Web3Service {
    private static web3: Web3;
    private static constract;
    private static constractABI = JSON.parse(
        fs.readFileSync( BUILD_URL ||
           path.join(__dirname ,  '../build/contracts/MedicalDataSharing.json'),
            'utf-8',
        ),
    ).abi;

    private static constractAddress: string = '0x681FDc1d70aAAC58b5566A8d7c91A1Be19fFA5Ba';

    public static getWeb3 = () => {
        if (!Web3Service.web3) {
            Web3Service.web3 = new Web3(GANACHE_URL ||'http://127.0.0.1:7545');
        }
        return Web3Service.web3;
    };

    public static getConstract = () => {
        if (!Web3Service.constract) {
            Web3Service.constract = new (Web3Service.getWeb3().eth.Contract)(
                Web3Service.constractABI,
                Web3Service.constractAddress,
            );
        }
        return Web3Service.constract;
    };

    public static getAccounts = async (): Promise<string[]> => {
        try {
            const accounts = await Web3Service.getWeb3().eth.getAccounts();
            return accounts;
        } catch (error) {
            console.error('Error fetching accounts: ', error);
            throw new Error('Could not fetch accounts');
        }
    };
}

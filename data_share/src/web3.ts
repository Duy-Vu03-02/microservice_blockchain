import { Web3 } from 'web3';
import fs from 'fs';
import { ethers } from 'ethers';

export class Web3Service {
    private static web3: Web3;
    private static constract;
    private static provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');
    private static constractABI = JSON.parse(
        fs.readFileSync(
            'C:\\Users\\PC\\Desktop\\Kì 7 năm 2024\\Mot So Cong Nghe\\microservice_blockchain\\data_share\\build\\contracts\\MedicalDataSharing.json',
            'utf-8',
        ),
    ).abi;

    private static constractAddress: string = '0x8F86F75a45df5712b8098E77620192a0C59F0b7B';

    public static getWeb3 = () => {
        if (!Web3Service.web3) {
            Web3Service.web3 = new Web3('http://127.0.0.1:7545');
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

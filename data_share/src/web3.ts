import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';
import { BUILD_URL, GANACHE_URL } from './infrastructure/database.adapter';

export class Web3Service {
    private static web3: Web3;
    private static constract;
    private static constractABI;
    public static constractAddress: string;

    public static register = async () => {
        const maxRetries = 5;
        const retryDelay = 1000;
        let retries = 0;

        while (retries < maxRetries) {
            try {
                if (!Web3Service.web3) {
                    Web3Service.web3 = new Web3(GANACHE_URL);
                }

                if (!Web3Service.constractABI) {
                    Web3Service.constractABI = JSON.parse(
                        fs.readFileSync(
                            BUILD_URL || path.join(__dirname, '../build/contracts/MedicalDataSharing.json'),
                            'utf-8',
                        ),
                    ).abi;

                    if (Web3Service.constractAddress && !Web3Service.constract) {
                        Web3Service.constract = new (Web3Service.getWeb3().eth.Contract)(
                            Web3Service.constractABI,
                            Web3Service.constractAddress,
                        );
                    }
                }

                if (Web3Service.constractAddress && !Web3Service.constract) {
                    Web3Service.constract = new (Web3Service.getWeb3().eth.Contract)(
                        Web3Service.constractABI,
                        Web3Service.constractAddress,
                    );
                }

                console.log('Connect GANACHE :: SUCCESS');
                return;
            } catch (err) {
                retries++;
                console.error(`Failed to connect to GANACHE. Attempt ${retries}/${maxRetries}`, err);
                if (retries >= maxRetries) {
                    console.error('Max retries reached. Exiting...');
                    process.exit(1);
                }
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            }
        }
    };

    public static getWeb3 = () => {
        if (!Web3Service.web3) {
            Web3Service.web3 = new Web3(GANACHE_URL);
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

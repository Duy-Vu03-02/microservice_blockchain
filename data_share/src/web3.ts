import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';
import { BUILD_URL, GANACHE_URL } from './infrastructure/database.adapter';

export class Web3Service {
    private static web3: Web3;
    private static contract;
    private static contractABI;
    public static contractAddress: string = null;

    public static register = async () => {
        const maxRetries = 5;
        const retryDelay = 1000;
        let retries = 0;

        
        while (retries < maxRetries) {
            try {
                if (!Web3Service.web3) {
                    Web3Service.web3 = new Web3(GANACHE_URL);
                }
                
                if (!Web3Service.contractABI) {
                    const abiPath = BUILD_URL || path.join(__dirname, '../build/contracts/MedicalDataSharing.json');
                    console.log('Loading ABI from: ', abiPath);
                    
                    const contractData = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
                    Web3Service.contractABI = contractData.abi;
                    
                    const loadAddress = Web3Service.loadContractAddress();
                    if (!loadAddress) {
                        await Web3Service.deployContract();
                    }

                    if (Web3Service.contractAddress && !Web3Service.contract) {
                        Web3Service.contract = new Web3Service.web3.eth.Contract(
                            Web3Service.contractABI,
                            Web3Service.contractAddress,
                        );
                    }
                }

                const loadAddress = Web3Service.loadContractAddress();
                if (!loadAddress) {
                    await Web3Service.deployContract();
                }

                if (Web3Service.contractAddress && !Web3Service.contract) {
                    Web3Service.contract = new Web3Service.web3.eth.Contract(
                        Web3Service.contractABI,
                        Web3Service.contractAddress,
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

    private static loadContractAddress(): string | false {
        try {
            if(!Web3Service.contractAddress){
                const filePath = path.join(__dirname, 'contractAddress.json');
                if(fs.existsSync(filePath)){
                    const contractData = fs.readFileSync(filePath, 'utf-8');
                    const parsedData = JSON.parse(contractData);
                    Web3Service.contractAddress = parsedData.contractAddress;
                    return Web3Service.contractAddress;
                }
                return false;
            }

            console.log(Web3Service.contractAddress)
            return Web3Service.contractAddress;
        } catch (err) {
            console.warn('No contract address found in file, deploying new contract...');
            return false;
        }
    }

    public static deployContract = async (): Promise<string> => {
        try {
            if (Web3Service.contractAddress) {
                return Web3Service.contractAddress;
            }

            if (!Web3Service.web3) {
                Web3Service.web3 = new Web3(GANACHE_URL);
            }

            const accounts = await Web3Service.getWeb3().eth.getAccounts();
            const deployer = accounts[0];

            const contractData = JSON.parse(
                fs.readFileSync(
                    BUILD_URL || path.join(__dirname, '../build/contracts/MedicalDataSharing.json'),
                    'utf-8',
                ),
            );

            const contractBytecode = contractData.bytecode;
            Web3Service.contractABI = contractData.abi;

            const contractInstance = new Web3Service.web3.eth.Contract(Web3Service.contractABI);
            const deployment = contractInstance.deploy({
                data: contractBytecode,
            });

            const gasEstimate = await deployment.estimateGas();

            const deployedContract = await deployment.send({
                from: deployer,
                gas: gasEstimate.toString(),
            });

            Web3Service.contractAddress = deployedContract.options.address;

            fs.writeFileSync(
                path.join(__dirname, 'contractAddress.json'),
                JSON.stringify({ contractAddress: Web3Service.contractAddress }, null, 2),
            );
            console.log('Contract deployed at address:', Web3Service.contractAddress);

            return Web3Service.contractAddress;
        } catch (error) {
            console.error('Error deploying contract:', error);
            throw new Error('Contract deployment failed');
        }
    };

    public static getWeb3 = () => {
        if (!Web3Service.web3) {
            Web3Service.web3 = new Web3(GANACHE_URL);
        }
        return Web3Service.web3;
    };

    public static getContract = () => {
        if (!Web3Service.contract) {
            Web3Service.contract = new Web3Service.web3.eth.Contract(
                Web3Service.contractABI,
                Web3Service.contractAddress,
            );
        }
        return Web3Service.contract;
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

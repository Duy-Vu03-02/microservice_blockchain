// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalDataSharing {
    struct PatientData {
        address hospital;
        string hospitalId;
        string base64EncryptedData;
        bytes32 prevHash;
        uint nonce;
        bytes32 hash;
    }

    struct BlockChain {
        uint difficulty;
        PatientData[] chain;
    }

    mapping(string => BlockChain) public blockChains;

    event DataShared(string patientCccd, address indexed hospital);

    constructor() {
        PatientData memory genesisBlock = PatientData({
            hospital: address(0),
            hospitalId: 'genesis',
            base64EncryptedData: '',
            prevHash: bytes32(0),
            nonce: 0,
            hash: bytes32(0)
        });

        blockChains['genesis'].chain.push(genesisBlock);
    }

    function calculateHash(
        address hospital,
        string memory hospitalId,
        string memory base64EncryptedData,
        bytes32 prevHash,
        uint nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(hospital, hospitalId, base64EncryptedData, prevHash, nonce));
    }

    function mineBlock(
        uint difficulty,
        address hospital,
        string memory hospitalId,
        string memory base64EncryptedData,
        bytes32 prevHash
    ) public pure returns (bytes32 hash, uint nonce) {
        uint nonce = 0;
        while (true) {
            bytes32 hash = calculateHash(hospital, hospitalId, base64EncryptedData, prevHash, nonce);

            if (isValidDifficulty(hash, difficulty)) {
                return (hash, nonce);
            }

            nonce++;
        }
    }

    function isValidDifficulty(bytes32 hash, uint difficulty) public pure returns (bool) {
        for (uint i = 0; i < difficulty; i++) {
            if (hash[i] != 0) {
                return false;
            }
        }
        return true;
    }

    function shareData(string memory patientCccd, string memory hospitalId, string memory base64EncryptedData) public {
        bytes32 prevHash = blockChains[patientCccd].chain.length > 0
            ? blockChains[patientCccd].chain[blockChains[patientCccd].chain.length - 1].hash
            : bytes32(0);

        (bytes32 hash, uint nonce) = mineBlock(1, msg.sender, hospitalId, base64EncryptedData, prevHash);

        PatientData memory newRecord = PatientData({
            hospital: msg.sender,
            hospitalId: hospitalId,
            base64EncryptedData: base64EncryptedData,
            prevHash: prevHash,
            nonce: nonce,
            hash: hash
        });

        blockChains[patientCccd].chain.push(newRecord);
        emit DataShared(patientCccd, msg.sender);
    }

    function getRecordsByAddress(
        string memory patientCccd,
        string memory hospitalId
    ) public view returns (string[] memory) {
        PatientData[] memory records = blockChains[patientCccd].chain;

        string[] memory tempResults = new string[](records.length);
        uint count = 0;
        for (uint i = 0; i < records.length; i++) {
            if (keccak256(abi.encodePacked(records[i].hospitalId)) == keccak256((abi.encodePacked((hospitalId))))) {
                tempResults[count] = records[i].base64EncryptedData;
                count++;
            }
        }

        string[] memory matchedRecords = new string[](count);
        for (uint i = 0; i < count; i++) {
            matchedRecords[i] = tempResults[i];
        }

        return matchedRecords;
    }
}

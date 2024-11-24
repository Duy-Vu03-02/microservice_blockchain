// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalDataSharing {
    struct PatientData {
        address hospital; 
        bytes encryptedData;
    }

    mapping(string => PatientData) public patientRecords;

    event DataShared(string patientCccd, address indexed hospital);

    function shareData(string memory patientCccd, bytes memory encryptedData) public {
        patientRecords[patientCccd] = PatientData(msg.sender, encryptedData);
        emit DataShared(patientCccd, msg.sender);
    }

    function getData(string memory patientCccd) public view returns (bytes memory) {
        return patientRecords[patientCccd].encryptedData;
    }
}

pragma solidity ^0.8.0;

contract MedicalDataSharing {
    struct PatientData {
        address hospital;
        string hospital_id;
        string base64EncryptedData;
    }

    mapping(string => PatientData[]) public patientRecords;

    event DataShared(string patientCccd, address indexed hospital);

    function shareData(string memory patientCccd, string memory hospital_id, string memory base64EncryptedData) public {
        PatientData memory newRecord = PatientData({
            hospital: msg.sender,
            hospital_id: hospital_id,
            base64EncryptedData: base64EncryptedData
        });

        patientRecords[patientCccd].push(newRecord);
        emit DataShared(patientCccd, msg.sender);
    }

    function getData(string memory patientCccd) public view returns (PatientData[] memory) {
        return patientRecords[patientCccd];
    }

    function getRecordsByAddress(
        string memory patientCccd,
        string memory hospital_id
    ) public view returns (string[] memory) {
        PatientData[] memory records = patientRecords[patientCccd];

        uint count = 0;
        for (uint i = 0; i < records.length; i++) {
            if (keccak256(abi.encodePacked(records[i].hospital_id)) == keccak256((abi.encodePacked((hospital_id))))) {
                count++;
            }
        }

        string[] memory matchedRecords = new string[](count);
        uint index = 0;
        for (uint i = 0; i < records.length; i++) {
            if (keccak256(abi.encodePacked(records[i].hospital_id)) == keccak256((abi.encodePacked((hospital_id))))) {
                matchedRecords[index] = records[i].base64EncryptedData;
                index++;
            }
        }

        return matchedRecords;
    }
}

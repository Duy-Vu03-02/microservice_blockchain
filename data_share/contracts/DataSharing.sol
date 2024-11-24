pragma solidity ^0.8.0;



contract DataSharing{
    struct AccessLop {
        address requester;
        string dataHash;
        uint256 timestamp;
    }

    mapping(address => bool) public authorizedUsers;

}
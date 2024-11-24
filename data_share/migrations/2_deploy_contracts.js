const MedicalDataSharing = artifacts.require('MedicalDataSharing');

module.exports = function (deployer) {
    deployer.deploy(MedicalDataSharing);
};

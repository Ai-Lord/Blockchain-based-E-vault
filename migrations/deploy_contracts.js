// migrations/2_deploy_contracts.js

const DocumentVerification = artifacts.require("DocumentRegistry");

module.exports = function(deployer) {
  deployer.deploy(DocumentVerification);
};

const {Web3} = require('web3');
const fs = require('fs');
const path = require('path');
const ganache = require('ganache');

// Create an instance of Web3 connected to a Ganache provider
const web3 = new Web3(ganache.provider(), null, { transactionConfirmationBlocks: 1 });

// Read the contract ABI and bytecode from the build directory
const contractPath = path.join(__dirname, './build/contracts/DocumentRegistry.json');

let contractABI;
let contractBytecode;

try {
    const contractJSON = fs.readFileSync(contractPath, 'utf8');
    const contractData = JSON.parse(contractJSON);

    contractABI = contractData.abi;
    contractBytecode = contractData.bytecode;
} catch (error) {
    console.error('Error reading or parsing contract JSON file:', error);
    process.exit(1); // Exit the process with an error code
}

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const deployerAccount = accounts[0];

    const contract = new web3.eth.Contract(contractABI);

    const deployedContract = await contract.deploy({ data: contractBytecode }).send({ from: deployerAccount, gas: '1000000' });

    console.log('Contract deployed to address:', deployedContract.options.address);
};

deploy().catch(error => {
    console.error('Deployment failed:', error);
    process.exit(1); // Exit the process with an error code
});

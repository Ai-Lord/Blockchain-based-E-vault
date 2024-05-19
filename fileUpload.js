// backend file (server.js)
require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const { jwtAuthMiddleware } = require('./jwt');
const User = require('./models/user');
const File = require('./models/file');
const multer = require('multer');
const {Web3} = require('web3'); // Import Web3 library
const ganache = require('ganache');

const router = express.Router();
const uploadDirectory = path.join(__dirname, 'uploads');

// Set up Web3 provider (Ganache)
const web3 = new Web3(ganache.provider(), null, { transactionConfirmationBlocks: 1 });

// Load contract ABI and address
const contractAbi = require('./build/contracts/DocumentRegistry.json').abi;
const contractAddress = process.env.CONTRACT_ADDRESS; // Update with your contract address

// Get contract instance
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Get list of accounts from Ganache
let accounts;
web3.eth.getAccounts().then(acc => {
    accounts = acc;
    console.log('Accounts:', accounts);
}).catch(err => {
    console.error('Error fetching accounts:', err);
});

// Check if the upload directory exists, create it if not
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

// Set up Multer storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Initialize Multer with the storage engine
const upload = multer({ storage: storage }).single('fileToUpload');

// Upload endpoint
router.post('/upload', jwtAuthMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Multer middleware handles file upload
        upload(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(500).json({ error: 'An error occurred while uploading the file' });
            }

            const { originalname: filename } = req.file;

            // Add document hash to the blockchain
            const docHash = web3.utils.sha3(filename);
            const senderAddress = accounts[0]; // Use the first account from Ganache
            
            contract.methods.addDocument(docHash).send({ from: senderAddress })
                .on('receipt', async () => {
                    const newFile = new File({
                        filename: filename,
                        profile: userId
                    });
                    await newFile.save();
                    res.json({ filename: filename });
                })
                .on('error', (error) => {
                    console.error('Error adding document to blockchain:', error);
                    res.status(500).json({ error: 'An error occurred while adding the document to the blockchain' });
                });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Fetch uploaded documents for a specific profile
router.get('/files', jwtAuthMiddleware, async (req, res) => {
    const profileId = req.user.id;

    try {
        const user = await User.findById(profileId);
        if (!user) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const files = await File.find({ profile: profileId });

        if (files.length === 0) {
            return res.status(404).json({ error: 'No files found for this profile' });
        }

        const fileNames = files.map(file => file.filename);

        res.json({ files: fileNames });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching files' });
    }
});

// Route to download a document
router.get('/files/download', jwtAuthMiddleware, async (req, res) => {
    const profileId = req.user.id;
    const filename = req.query.filename;

    try {
        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        const user = await User.findById(profileId);
        if (!user) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const file = await File.findOne({ filename, profile: profileId });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const filePath = path.join(uploadDirectory, filename);

        // Set headers to force download
        res.download(filePath, filename);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while downloading the document' });
    }
});

module.exports = router;

const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
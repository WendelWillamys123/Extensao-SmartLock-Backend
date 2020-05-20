const mongoose = require ("mongoose");

const LockSchema = new mongoose.Schema
(
    {
        name: String,
        holder: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }]
    }
);

module.exports = mongoose.model ("Lock", LockSchema);
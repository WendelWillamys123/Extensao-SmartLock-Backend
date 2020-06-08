const mongoose = require ("mongoose");

const GroupSchema = new mongoose.Schema
(
    {
        name: String,
        holder: [{
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Group',
            default: null
        }],

        content: [{
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Group',
            default: null
        }],
        locks: [{ type: mongoose.Schema.Types.ObjectId,
            ref: 'Lock',
            default: null
        }],

        holderLocalFisico: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LocalFisico',
            default: null
        }, 

        localFisico: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'LocalFisico',
             default: null
            }]
    }
);

module.exports = mongoose.model ("Group", GroupSchema);
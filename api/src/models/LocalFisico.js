const mongoose = require ("mongoose");
const PointSchema = require("./utils/PointSchema")

const LocalSchema = new mongoose.Schema ({

        name: String,
        holder: [{
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Group'
        }],
        groups: [{
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Group',
            default: null
        }],
        locks: [{ type: mongoose.Schema.Types.ObjectId,
            ref: 'Lock',
            default: null
        }],
        location : {
            type: PointSchema,
            index: '2dsphere'
        }
    }
);

module.exports = mongoose.model ("LocalFisico", LocalSchema);
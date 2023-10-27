const mongoose = require('mongoose');

const CatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // no repeating names
        trim: true, // removes beginning and trailing white spaces
                    // does not remove spaces between words
    },
    bedsOwned: {
        type: Number,
        min: 0,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }
});

const CatModel = mongoose.model('Cat', CatSchema);

module.exports = CatModel;

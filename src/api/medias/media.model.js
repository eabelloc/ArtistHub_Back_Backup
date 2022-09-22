const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    mediaTitle: {type: String, require: true},
    mediaDescription: {type: String, require: false},
    mediaSpotify: {type: String, require: false},
    mediaImage: {type: String, require: false},
    mediaVideo: {type: String, require: false},
    users: { type: Schema.Types.ObjectId, ref:"users"},
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('medias', schema);
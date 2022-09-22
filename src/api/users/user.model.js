const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");
const {validationPassword} = require("../../helpers/utils/util");
const {setError} = require("../../helpers/utils/error");
const {USERTYPE} = require("../../helpers/constants/usertype")

const schema = new Schema({
   username: {type: String, required: true, unique: true},
   password: {type: String, required: true},
   email: {type: String, required: true, unique: true},
   avatar: {type: String, required: false},
   userType: {type: String, enum: USERTYPE, required: true},
   projects: [{type: Schema.Types.ObjectId, ref:"projects"}],
   favProjects: [{type: Schema.Types.ObjectId, ref:"projects"}],
   medias: [{type: Schema.Types.ObjectId, ref:"medias"}],
   userIntro: {type: String, required: false},
   
   company: {type: String, required: false},
   location: {type: String, required: false},
   website: {type: String, required: false},
   twitter: {type: String, required: false},
   linkedin: {type: String, required: false},
}, 
    {
        timestamps: true
    }
);

schema.pre('save', function(next) {
    if(!validationPassword(this.password)) return next(setError('404', "Invalid password"));
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

module.exports = mongoose.model('users', schema)
'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
    loginCode: String,
    openid: String,
    session_key: String,
    user_id: String,
    create_time: String,
    encryptedData: String,
    iv: String,
    rawData: String,
    signature: String
})

userSchema.index({id: 1});

const User = mongoose.model('User', userSchema);

export default User

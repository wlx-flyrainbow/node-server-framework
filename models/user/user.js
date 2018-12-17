'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
    loginCode: String,
    openid: String,
    session_key: String,
    user_id: String,
    token: String,
    create_time: String,
    userInfo: {}
})

userSchema.index({id: 1});

const User = mongoose.model('User', userSchema);

export default User

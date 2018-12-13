'use strict';

import mongoose from 'mongoose'

const quizSchema = new mongoose.Schema({

})

quizSchema.index({id: 1});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz

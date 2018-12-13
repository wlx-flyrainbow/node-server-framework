'use strict';

import mongoose from 'mongoose'

const idsSchema = new mongoose.Schema({
	admin_id: Number,
	user_id: Number,
	quizList_id: Number,
	quiz_id: Number
});

const Ids = mongoose.model('Ids', idsSchema);

Ids.findOne((err, data) => {
	if (!data) {
		const newIds = new Ids({
			admin_id: 0,
			user_id: 0,
			quizList_id: 0,
			quiz_id: 0
		});
		newIds.save();
	}
})
export default Ids
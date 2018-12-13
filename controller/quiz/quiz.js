'use strict';

import QuizModel from '../../models/quiz/quiz'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Quiz extends BaseComponent{
	constructor(){
		super();
		this.defaultData = []
	}
}

export default new Quiz()
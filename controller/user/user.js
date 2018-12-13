'use strict';

import MettingModel from '../../models/metting/metting'
import ScheduleModel from '../../models/metting/schedule'
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
'use strict';

import admin from './admin'
import metting from './metting'

export default app => {
	app.use('/admin', admin);
	app.use('/metting', metting);
}
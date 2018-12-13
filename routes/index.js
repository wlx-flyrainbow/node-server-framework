'use strict';

import admin from './admin'
import metting from './metting'

export default app => {
	app.use('/admin', admin);
	app.use('/metting', metting);
	// 定制404页面
	app.use(function(req, res){
		res.type('text/plain');
		res.status(404);
		res.send('404 - Not Found');
	});
	//定制500页面
	app.use(function(err, req, res, next){
		console.error(err.stack);
		res.type('text/plain');
		res.status(500);
		res.send('500 - Server Error');
	});
}
'use strict';

import admin from './admin';
import user from './user';
import quiz from './quiz';

export default app => {
	app.use('/admin', admin);
	app.use('/user', user);
	app.use('/quiz', quiz);
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
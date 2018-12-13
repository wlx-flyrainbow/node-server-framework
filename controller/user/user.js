'use strict';

import UserModel from '../../models/user/user'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import timestamp from 'time-stamp'

class User extends BaseComponent{
	constructor(){
		super();
		this.AppSecret = '1962e2593193a4aebddc1138077b18aa';
		this.defaultData = [];
		this.login = this.login.bind(this);
		this.saveUserInfo = this.saveUserInfo.bind(this);
	}
	// 获取openId
	async getOpenId(appid, loginCode){
		try{
			const resObj = await this.fetch('https://api.weixin.qq.com/sns/jscode2session', {
				appid: appid,
				secret: this.AppSecret,
				js_code: loginCode,
				grant_type: 'authorization_code',
			});
			console.log(resObj);
			if (resObj.openid) {
				return resObj
			}else{
				throw new Error('获取openId失败');
			}
		}catch(err){
			throw new Error(err);
		}
	}
	async login(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			console.log(fields);
			if (err) {
				res.send({
					status: 1,
					type: 'FORM_DATA_ERROR',
					message: 'login信息错误'
				})
				return
			}
			const {appid, code} = fields;
			try {
				if(!appid) {
					throw new Error('appid 缺失')
				} else if(!code) {
					throw new Error('code 缺失')
				}
			} catch (error) {
				console.log(error.message, error);
				res.send({
					status: 1,
					type: 'GET_ERROR_PARAM',
					message: error.message,
				})
				return
			}
			try {
				let {openid, session_key} = await this.getOpenId(fields.appid, fields.code);
				const user = await UserModel.findOne({openid});
				if (!user) {
					const user_id = await this.getId('user_id');
					const newUser = {
						user_id,
						openid,
						session_key,
						create_time: timestamp('YYYY-MM-DD HH:mm:ss')
					}
					await UserModel.create(newUser);
					res.send({
						status: 0,
						success: '登录成功',
						data: {
							"token": 'token', // 登录token, sha1字符串约40位  本地存储
        					"signature": 'zmSignature', // 签名，防止token泄漏 sha1字符串约40位 本地存储
        					"isAuthorized": false   // 用户之前是否授权过获取基本信息/亦或是后台否有用户基本信息  本地存储
						}
					})
				} else {
					res.send({
						status: 0,
						success: '登录成功',
						data: {
							"token": 'token', // 登录token, sha1字符串约40位  本地存储
        					"signature": 'zmSignature', // 签名，防止token泄漏 sha1字符串约40位 本地存储
        					"isAuthorized": false   // 用户之前是否授权过获取基本信息/亦或是后台否有用户基本信息  本地存储
						}
					})
				}
			} catch (error) {
				console.log(error);
				res.send({
					status: 1,
					success: '登录异常',
					data: {
						"token": 'token', // 登录token, sha1字符串约40位  本地存储
						"signature": 'zmSignature', // 签名，防止token泄漏 sha1字符串约40位 本地存储
						"isAuthorized": false   // 用户之前是否授权过获取基本信息/亦或是后台否有用户基本信息  本地存储
					}
				})
			}
		})
	}
	async saveUserInfo(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				res.send({
					status: 1,
					type: 'FORM_DATA_ERROR',
					message: '表单信息错误'
				})
				return
			}
			const {user_name, password, status = 0} = fields;
			try{
				if (!user_name) {
					throw new Error('用户名错误')
				}else if(!password){
					throw new Error('密码错误')
				}
			}catch(err){
				console.log(err.message, err);
				res.send({
					status: 1,
					type: 'GET_ERROR_PARAM',
					message: err.message,
				})
				return
			}
			try{
				const admin = await AdminModel.findOne({user_name})
				if (admin) {
					console.log('该用户已经存在');
					res.send({
						status: 0,
						type: 'USER_HAS_EXIST',
						message: '该用户已经存在',
					})
				}else{
					const adminTip = status == 1 ? '管理员' : '超级管理员'
					const admin_id = await this.getId('admin_id');
					const newpassword = this.encryption(password);
					const newAdmin = {
						user_name, 
						password: newpassword, 
						id: admin_id,
						admin: adminTip,
						status,
					}
					await AdminModel.create(newAdmin)
					req.session.admin_id = admin_id;
					res.send({
						status: 1,
						message: '注册管理员成功',
					})
				}
			}catch(err){
				console.log('注册管理员失败', err);
				res.send({
					status: 0,
					type: 'REGISTER_ADMIN_FAILED',
					message: '注册管理员失败',
				})
			}
		})
	}
}

export default new User()
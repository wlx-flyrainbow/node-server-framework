'use strict';

import UserModel from '../../models/user/user'
import BaseComponent from '../../prototype/baseComponent'
import WXBizDataCrypt from '../../prototype/WXBizDataCrypt'
import crypto from 'crypto'
import formidable from 'formidable'
import timestamp from 'time-stamp'
import chalk from 'chalk';

class User extends BaseComponent{
	constructor(){
		super();
		this.AppSecret = '1962e2593193a4aebddc1138077b18aa';
		this.session_key = '';
		this.appId = '';
		this.defaultData = [];
		this.encryption = this.encryption.bind(this)
		this.login = this.login.bind(this);
		this.saveUserInfo = this.saveUserInfo.bind(this);
	}
	// 获取openId
	async getOpenId(appid, loginCode){
		try{
			let resObj = await this.fetch('https://api.weixin.qq.com/sns/jscode2session', {
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
	// md5加密
	encryption(data){
		const md5 = crypto.createHash('md5');
		const time = Date.parse(new Date()).toString();
		md5.update(time);
		const encryptedData = md5.update(data).digest('base64');
		console.log(chalk.blue(`md5 hash：${encryptedData}`));
		return encryptedData
	}
	async login(req, res, next){
		let form = new formidable.IncomingForm();
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
			let {appid, code} = fields;
			this.appId = appid;
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
				this.session_key = session_key;
				let user = await UserModel.findOne({openid});
				let token = this.encryption(openid);
				if (!user) {
					let user_id = await this.getId('user_id');
					let newUser = {
						user_id,
						openid,
						session_key,
						token,
						create_time: timestamp('YYYY-MM-DD HH:mm:ss')
					}
					await UserModel.create(newUser);
					res.send({
						status: 0,
						success: '登录成功',
						data: {
							"token": token, // 登录token
        					"signature": 'zmSignature', // 签名，防止token泄漏
        					"isAuthorized": true   // 用户之前是否授权过获取基本信息/亦或是后台否有用户基本信息  本地存储
						}
					})
				} else {
					// 如果用户存在，更新token信息
					await UserModel.findOneAndUpdate({openid}, {$set: {token, session_key}});
					res.send({
						status: 0,
						success: '登录成功',
						data: {
							"token": token, // 登录token
        					"signature": 'zmSignature', // 签名，防止token泄漏 
        					"isAuthorized": true   // 用户之前是否授权过获取基本信息/亦或是后台否有用户基本信息  本地存储
						}
					})
				}
			} catch (error) {
				console.log(error);
				res.send({
					status: 1,
					success: '登录异常',
					data: {
						"token": 'token', // 登录token
						"signature": 'zmSignature', // 签名，防止token泄漏
						"isAuthorized": false   // 用户之前是否授权过获取基本信息/亦或是后台否有用户基本信息  本地存储
					}
				})
			}
		})
	}
	async saveUserInfo(req, res, next){
		let form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			let token = req.headers['zm-token'];
			if (err || !token) {
				res.send({
					status: 1,
					type: 'FORM_DATA_ERROR',
					message: 'saveUserInfo信息错误'
				})
				return
			}
			try{
				let {encryptedData, iv} = fields;
				let pc = new WXBizDataCrypt(this.appId, this.session_key);
				let userInfo = pc.decryptData(encryptedData , iv);
				console.log('userInfo解密后 data: ', userInfo);
				// 更新用户信息
				let query = {token};
				let userUpdate = await UserModel.findOneAndUpdate(query, {$set: userInfo},{new: true});
				res.send({
					status: 0,
					message: '保存用户信息成功',
				})
			}catch(err){
				console.log('保存用户信息失败', err);
				res.send({
					status: 1,
					type: 'SAVEUSERINFO_FAILED',
					message: '保存用户信息失败',
				})
			}
		})
	}
	async saveTel(req, res, next){
		let form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			let token = req.headers['zm-token'];
			if (err || !token) {
				res.send({
					status: 1,
					type: 'FORM_DATA_ERROR',
					message: 'saveTel 信息错误'
				})
				return
			}
			try{
				let {encryptedData, iv} = fields;
				let queryUserInfo = await UserModel.findOne({token});
				let appid = queryUserInfo.userInfo.watermark.appid;
				let session_key = queryUserInfo.session_key;
				let pc = new WXBizDataCrypt(appid, session_key);
				let phoneInfo = pc.decryptData(encryptedData , iv);
				// 更新手机号
				const userInfo = {...queryUserInfo.userInfo, tel: phoneInfo.purePhoneNumber};
				let phoneUpdate = await UserModel.findOneAndUpdate({token}, {$set: userInfo},{new: true});
				res.send({
					status: 0,
					data: {
						isAuthorizedTel: true
					},
					message: '保存手机号成功',
				})
			}catch(err){
				console.log('保存手机号失败', err);
				res.send({
					status: 1,
					type: 'SAVETEL_FAILED',
					message: '保存手机号失败',
				})
			}
		})
	}
}

export default new User()
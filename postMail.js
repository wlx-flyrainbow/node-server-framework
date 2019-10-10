const nodemailer = require("nodemailer");

// 开启一个 SMTP 连接池
const transport = nodemailer.createTransport(
  {
    // host: "smtp.qq.com", // 主机，各服务商的主机地址不同，比如qq的是smtp.qq.com
    service: 'qq',
    port: 465, // 网易的SMTP端口，各个服务商端口号不同，比如qq的是465
    auth: {
      user: "2370564267@qq.com", // 账号
      pass: "jyvfgpupmcfydhje" // 授权码
    }
  }
);
// 设置邮件内容
let mailOptions = {
  from: "2370564267@qq.com", // 发件人地址
  to: "2370564267@qq.com", // 收件人列表,逗号分隔，可以放多个
  subject: "预约提醒", // 标题
  html: "<b>有人预约了</b> 你好啊！" // html 内容
};
// 发送邮件
transport.sendMail(mailOptions, (error, response)=> {
  if (error) {
    console.log(error);
  }
  console.log(response, 'message send ok !!!');
  transport.close(); // 如果没用，关闭连接池
});

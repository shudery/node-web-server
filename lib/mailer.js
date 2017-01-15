const nodemailer = require('nodemailer');
// const credentials = require('./credentials.js')

/**
 * mail server
 * @param  {[String]} credentials [user info file]
 * @return {send,sendError}           
 */
module.exports = function(credentials) {
    let mailTransport = nodemailer.createTransport('smtps://' + credentials.gmail.user + '%40gmail.com:' + credentials.gmail.password + '@smtp.gmail.com');
    let from = 'node-web-server-mailer<shudery@gamil.com>';
    let masterEmail = '125153450@qq.com'
    return {
    	/**
    	 * send a email
    	 * @param  {[String]} subject [email title]
    	 * @param  {[String]} html    [email content for email]
    	 * @param  {[String]} to      [recevier]
    	 */
        send(subject, html, to) {
            mailTransport.sendMail({
                to: to ? to : masterEmail,
                from,
                subject,
                html,
            }, (err, info) => {
                if (err) {
                    return console.log('send email error:' + err);
                };
                console.log('send email info:' + info.response);
            });
        },
        /**
         * send a error mail to master
         * @param  {[String]} message   [desc error]
         * @param  {[String]} filename  [error belong]
         * @param  {[String]} exception [error stack]
         */
        sendError(message, filename, exception) {
            let html = `<h1>site error:</h1>message:${message}<br>`;
            if (filename) {
                html += `filename:${filename}<br>`;
            }
            if (exception) {
                html += `exception;${exception}`;
            }
            mailTransport.sendMail({
                from,
                to: masterEmail,
                subject: 'site error',
                html,
            })
        },
    }
}

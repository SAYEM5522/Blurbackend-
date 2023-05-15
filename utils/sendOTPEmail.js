const nodemailer = require('nodemailer');

const temp = (
  CODE
) => `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
<div style="margin:50px auto;width:70%;padding:20px 0">
  <div style="border-bottom:1px solid #eee">
    <a href="https://app.tweetsy.io" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Replie.io</a>
  </div>
  <p style="font-size:1.1em">Hello,</p>
  <p>Thank you for choosing replie.io. Use the following OTP to complete your Sign Up procedures. OTP is valid for 15 minutes</p>
  <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${CODE}</h2>
  <p style="font-size:0.9em;">Regards,<br />Team Replie</p>
  <hr style="border:none;border-top:1px solid #eee" />
  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    <p>replie.io</p>
    <p>1600 Amphitheatre Parkway</p>
    <p>California</p>
  </div>
</div>
</div>`;
const sendEmail = async (CODE, sendTo) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: sendTo,
      subject: 'Verification code from Replie',
      html: temp(CODE),
    };
    return transporter.sendMail(mailOptions);
  } catch (err) {
    return { isSuccess: false, message: err.message };
  }
};

module.exports = { sendEmail };

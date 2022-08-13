const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport(
    smtpTransport({
      server: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: "memestagram7@gmail.com",
        pass: "Memes@123",
      },
    })
  );

  const mailOption = {
    from: "memestagram7@gmail.com",
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  transporter.sendMail(mailOption, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;

// const nodemailer = require("nodemailer");
// // const smtpTransport = require("nodemailer-smtp-transport");

// const sendEmail = (options) => {
//   const transporter = nodemailer.createTransport({
//     server: "gmail",
//     // host: "smtp.gmail.com",
//     // port: 465,
//     // secure: true,
//     auth: {
//       user: "memestagram7@gmail.com",
//       pass: "Memes@123",
//     },
//   });

//   const mailOption = {
//     from: "memestagram7@gmail.com",
//     to: options.to,
//     subject: options.subject,
//     html: options.text,
//   };

//   transporter.sendMail(mailOption, function (err, info) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(info);
//     }
//   });
// };

// module.exports = sendEmail;

const sgMail = require("@sendgrid/mail");

const sendEmail = (options) => {
  const email = "memestagram7@gmail.com";
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log(process.env.SENDGRID_API_KEY);
  console.log(options);
  const msg = {
    from: email, // Change to your verified sender
    to: options.to, // Change to your recipient
    subject: options.subject,
    html: options.text,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendEmail;

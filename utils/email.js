const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//   //1) create transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   //2) define the email options
//   const mailOptions = {
//     from: "admin <TechTrack@admin.com>",
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   await transporter.sendMail(mailOptions);
// };
// module.exports = sendEmail;

async function sendEmail(dest, subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDEREMAIL,
        pass: process.env.SENDEREMAILPASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: `Tech-Track support team <${process.env.SENDEREMAIL}>`,
      to: dest,
      subject,
      html: message,
    });

    console.log(info);
  } catch (error) {
    console.log("error while sending the email");
    console.log(error);
  }
}

module.exports = sendEmail;

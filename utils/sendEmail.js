import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
      },
    });

    
    const mailOptions = {
      from: SMTP_FROM,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("sent email successfully");
  } catch (error) {
    console.error("Failed to send email", error);
  }
};

export default sendEmail;

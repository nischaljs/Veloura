import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const renderEmailTemplate = async (
  templateName: string,
  data: Record<string, any>,
): Promise<string> => {
  const tempaltePath = path.join(
    process.cwd(),
    "src",
    "utils",
    "email-templates",
    `${templateName}.ejs`,
  );

  return await ejs.renderFile(tempaltePath, data);
};

//send an email using nodemailer

export const sendEmail = async (
  to: string,
  subject: string,
  template: string,
  data: Record<string, any>,
) => {
  try {
    const html = await renderEmailTemplate(template, data);

    await transporter.sendMail({
      from: `"Veloura" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.log("error sending email", error);
    return false;
  }
};

export default sendEmail;

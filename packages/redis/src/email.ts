import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { ValidationError } from "@veloura/response-handler";

/**
 * SMTP configuration for email service
 */
export interface EmailConfig {
  host: string;      // SMTP server host
  port: number;      // SMTP server port
  secure: boolean;   // Use TLS
  auth: {
    user: string;    // SMTP username
    pass: string;    // SMTP password
  };
  from: string;      // From email address
}

/**
 * Email template configuration
 */
export interface EmailTemplate {
  name: string;      // Template file name
  subject: string;   // Email subject
  data: Record<string, any>; // Template data
}

/**
 * Manages email sending and template rendering
 */
export class EmailManager {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
  }

  /**
   * Renders an email template with the given data
   */
  private async renderTemplate(templateName: string, data: Record<string, any>): Promise<string> {
    try {
      const templatePath = path.join(
        process.cwd(),
        "src",
        "utils",
        "email-templates",
        `${templateName}.ejs`
      );
      return await ejs.renderFile(templatePath, data);
    } catch (error:any) {
      throw new ValidationError(`Failed to render email template: ${error.message}`);
    }
  }

  /**
   * Sends an email using the specified template
   */
  async sendEmail(to: string, template: EmailTemplate): Promise<void> {
    try {
      const html = await this.renderTemplate(template.name, template.data);

      await this.transporter.sendMail({
        from: this.config.from,
        to,
        subject: template.subject,
        html,
      });
    } catch (error:any) {
      throw new ValidationError(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Sends a verification email with OTP
   */
  async sendVerificationEmail(to: string, verificationLink: string, otp: string): Promise<void> {
    await this.sendEmail(to, {
      name: "user-activation-mail",
      subject: "Verify your Veloura account",
      data: { verificationLink, otp },
    });
  }

  /**
   * Sends a password reset email
   */
  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    await this.sendEmail(to, {
      name: "password-reset-mail",
      subject: "Reset your Veloura password",
      data: { resetLink },
    });
  }
} 
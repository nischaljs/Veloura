// src/lib/response/AppSuccess.ts
export class AppSuccess {
  public readonly data: any;
  public readonly message: string;
  public readonly statusCode: number;

  constructor(data: any, message = 'Operation successful', statusCode = 200) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }

  send(res: any) {
    return res.status(this.statusCode).json({
      success: true,
      message: this.message,
      data: this.data,
      statusCode: this.statusCode,
    });
  }
}

export default AppSuccess;
/**
 * Operational error thrown intentionally by controllers/services.
 * Distinguished from programmer errors so the error middleware knows
 * it is safe to expose `message` (in Arabic) to the client.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational = true;
  public readonly errors: unknown[];

  constructor(message: string, statusCode = 400, errors: unknown[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message = "طلب غير صالح", errors: unknown[] = []) {
    return new AppError(message, 400, errors);
  }
  static unauthorized(message = "يجب تسجيل الدخول للوصول إلى هذا المورد") {
    return new AppError(message, 401);
  }
  static forbidden(message = "ليس لديك صلاحية للوصول إلى هذا المورد") {
    return new AppError(message, 403);
  }
  static notFound(message = "العنصر المطلوب غير موجود") {
    return new AppError(message, 404);
  }
  static conflict(message = "يوجد تعارض في البيانات") {
    return new AppError(message, 409);
  }
  static internal(message = "حدث خطأ غير متوقع في الخادم") {
    return new AppError(message, 500);
  }
}

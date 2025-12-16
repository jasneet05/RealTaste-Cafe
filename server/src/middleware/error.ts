import { Request, Response, NextFunction } from 'express';

interface MongooseError extends Error {
  code?: number;
  errors?: { [key: string]: { message: string } };
}

export const errorHandler = (
  err: MongooseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const message = Object.values(err.errors).map((val: any) => val.message);
    return res.status(400).json({
      success: false,
      message: message
    });
  }

  res.status((error as any).statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

import { StatusCodes } from 'http-status-codes'
import { customError } from '../interface/io.interface'
import { Response } from 'express'
export const errorHandlingMiddleware = (err: any, res: Response) => {
  const responseError: customError = new customError(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, err.message)
  console.error(responseError)
  res.status(responseError.statusCode).json({ message: responseError.message })
}
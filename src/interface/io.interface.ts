import { StatusCodes } from "http-status-codes";
class customeSuccessfulResponse{
    status: number;
    message: string;
    data?: any;
    constructor(status: number = StatusCodes.OK, message: string = StatusCodes[status], data?: any){
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
class customError extends Error {
    statusCode: number
    constructor(statusCode : number, message : string) {
      super(message)
      this.name = 'ApiError'
      this.statusCode = statusCode
      Error.captureStackTrace(this, this.constructor)
    }
}
export { customeSuccessfulResponse, customError }
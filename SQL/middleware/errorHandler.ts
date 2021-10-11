import express from 'express';
export class ErrorHandler {
    private _messageStatus: string = '';
    constructor(private _status? : number, private _message? : string)
    {
        this._status = _status || 500;
        for (let enumMember in StatusCode) {
            if(parseInt(StatusCode[enumMember]) === this._status)
            {
                this._messageStatus = enumMember;
            }
        }
    }
    get messageStatus(){
        return this._messageStatus;
    }
    set messageStatus(messageStatus){
        this._messageStatus = messageStatus;
    }
    get message(){
        return this._message;
    }
    set message(message){
        this._message = message;
    }
    get status(){
        return this._status;
    }
}

enum StatusCode {
    BadRequest = "400",
    Conflict = "409",
    Forbidden = "403",
    NonAuthoritativeInformation = "401",
    NotFound = "404",
    MethodNotAllowed = "405",
    InternalServerError = "500"
}
export function errHandler(error : ErrorHandler, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(error.status as number);
    if(error.message)
        return res.json({ error : error.message });
    return res.json({ status : error.messageStatus });
}
module.exports = { ErrorHandler, errHandler}
import { CustomError, ErrorField } from './custom-error';

export class DBConnectionError extends CustomError {
    statusCode = 500;

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, DBConnectionError.prototype);
    }

    serializeErrors(): ErrorField {
        return { message: this.message }
    }
}

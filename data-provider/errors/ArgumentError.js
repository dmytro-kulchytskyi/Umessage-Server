function ArgumentError(errorCode, errorMessage) {
    Error.call(this, errorMessage) ;
    this.errorCode = errorCode;
    this.message =  errorMessage;
    Error.captureStackTrace(this, ArgumentError);
}

require('util').inherits(ArgumentError, Error);
ArgumentError.prototype.name = 'ArgumentError';

module.exports = ArgumentError;
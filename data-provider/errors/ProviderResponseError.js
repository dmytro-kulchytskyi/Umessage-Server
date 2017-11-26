function ProviderResponseError(errorCode, errorMessage) {
    Error.call(this, errorMessage);
    this.errorCode = errorCode;
    this.message = errorMessage;
    Error.captureStackTrace(this, ProviderResponseError);
}

require('util').inherits(ProviderResponseError, Error);
ProviderResponseError.prototype.name = 'ProviderResponseError';

module.exports = ProviderResponseError;
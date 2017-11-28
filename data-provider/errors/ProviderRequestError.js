function ProviderRequestError(errorMessage) {
    Error.call(this, errorMessage) ;

    this.message =  errorMessage;
    Error.captureStackTrace(this, ProviderRequestError);
}

require('util').inherits(ProviderRequestError, Error);
ProviderRequestError.prototype.name = 'ProviderRequestError';

module.exports = ProviderRequestError;
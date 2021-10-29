// Handle errors appropriately
exports.errorResponse = ( res, message = "Internal server error. Please contact administrator", statusCode = 500, error = {} ) => {
    res.status( statusCode ).send( {
        success: false,
        message,
        error: {
            statusCode,
            message,
            error,
        },
    } );
};
// https://blog.idrisolubisi.com/global-error-handling-in-node-js
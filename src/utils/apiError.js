// Custom API Error class for handling application-specific errors
class ApiError extends Error {
    constructor(
        statusCode, // HTTP status code for the error (e.g., 400, 401, 500)
        message = 'Something went wrong', // Default error message
        errors = [], // Array to store additional error details (if any)
        stack = "", // Optional stack trace
    ) {
        super(message); // Call the parent Error class constructor with the error message

        this.statusCode = statusCode; // Store the HTTP status code
        this.data = null; // Placeholder for any additional response payload (if needed)
        this.message = message; // Store the error message
        this.success = false; // Indicate that the request was unsuccessful
        this.errors = errors; // Store any additional error payload details

        // If a stack trace is provided, use it; otherwise, capture the current stack trace
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError }; // Export the class for use in other parts of the application

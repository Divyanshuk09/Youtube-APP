// Custom API Response class for sending standardized API responses
class ApiResponse {
    constructor(
        statusCode, // HTTP status code (e.g., 200 for success, 400 for bad request)
        data, // The response payload containing the requested data
        message = "Success" // Default success message
    ) {
        this.statusCode = statusCode; // Store the HTTP status code
        this.data = data; // Store the actual response payload (data to be sent)
        this.message = message; // Store a response message (default: "Success")
        this.success = statusCode < 400; // Set success to true if the status code is below 400
    }
}

export { ApiResponse }; // Export the class for use in other parts of the application

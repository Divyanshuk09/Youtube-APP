
// const asyncHandler = ()=>{}
// const asyncHandler = (func)=>{()=>{}}
// const asyncHandler = (func)=> async ()=>{}
    
// Middleware to handle asynchronous route handlers and catch errors automatically
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next); // Execute the provided async function
    } catch (error) {
        // Handle any errors thrown inside the async function
        res.status(error.statusCode || 500).json({ // Send an error response
            success: false, // Indicate failure
            message: error.message // Provide error details
        });
    }
}

export { asyncHandler }; // Export the function for use in other parts of the application

// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(req, res, next)
//             .catch((err) => next(err))
//     }
// }

// export { asyncHandler };
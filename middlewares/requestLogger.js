// Request logger middleware
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Override the res.end method to capture response time
    const originalEnd = res.end;
    
    res.end = function(...args) {
        const responseTime = Date.now() - startTime;
        
        // Log request details
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`);
        
        // Call the original end method
        originalEnd.apply(this, args);
    };
    
    next();
};

module.exports = requestLogger;

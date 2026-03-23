const errorHandler = (err,req,res,next) =>{
    res.status(err.status||500).json({
        success: "Failed like yor GPA dammit ",
        message : err.message || "Internal Server Error !!" 
    })
}

module.exports = errorHandler 
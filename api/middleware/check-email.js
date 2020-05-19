module.exports = (req, res, next) => {
    if(validateEmail(req.body.email)){
        next();
    } else {
        return res.status(400).json({
            message: 'Invalid Email',
            error: 'You Entered Invalid Email'
        })
    }    
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
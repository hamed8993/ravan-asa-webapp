const autoBind = require('auto-bind');
const {validationResult} = require("express-validator/check");

module.exports = class controller {
    constructor(){
        autoBind(this);
    }
        failed(msg, res, statusCode = 500){
            res.status(statusCode).json({
                data : msg,
                status : 'error'
            });
        }
    async validationData(req, res){
        const result = validationResult(req);
        if(!result.isEmpty()) {// true: ERROR NOT Exist.   /   false:ERROR Exist.
            const errors = result.array();
            if (errors.length == 0) return true;
            const messages = [];
            errors.forEach(er => messages.push(er.msg));
            this.failed(messages, res, 403);
            return false;
        }
        return true // -> result is NOT Exist
    }
}
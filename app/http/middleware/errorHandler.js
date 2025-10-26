module.exports = new class errorHandler {

    async error404(req, res, next){
        try {
            res.statusCode = 404;
            throw new Error('چنین صفحه ای یافت می نشود همی ای رند خرابات مست!')
        } catch (error) {
            next(error);
        }
    }
    async handler(error, req, res, next){
        const statusCode = error.statusCode || '500';
        const message = error.message || '**مسیجی وجود نداشت**';
        const stack = error.stack || '**استکی وجود نداشت**';
        const layouts = {
            layout : 'errors/master.ejs',
            extractScripts: false,
            extractStyles: false
        }
        if(config.debug) return res.render('errors/stack', {message, stack, ...layouts});
        return res.render(`errors/${statusCode}`, {message, stack, ...layouts});
    }
}
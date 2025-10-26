module.exports = new class csrfErrorHandler {

    async handle(error, req, res, next){
        if (error.code !== 'EBADCSRFTOKEN') return next(error)

        // handle CSRF token errors here
        res.status(403)
        res.send('form tampered with')
    }
}
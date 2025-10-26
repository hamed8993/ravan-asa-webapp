const path = require('path');
const autoBind = require('auto-bind');
const moment = require('moment-jalaali');
// const moment = require('moment');
moment.loadPersian({usePersianDigits: true});

module.exports = class Helpers {
    constructor(req,res) {
        autoBind(this);
        this.req = req;
        this.res = res;
        this.formData = req.flash('formData')[0];
    }
    //چگونه بدون bind میشه؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟
    getObjects() {
        return {
            auth: this.auth(),
            viewPath: this.viewPath,
            ...this.getGlobalVariables(),
            old : this.old,
            date : this.date,
            req : this.req,
        }
    }
    auth() {
        return {
            check: this.req.isAuthenticated(),
            user: this.req.user
        }
    }
    viewPath(dir){
        return path.resolve(config.layout.view_dir + '/' + dir);
    }
    getGlobalVariables() {
        return {
            errors: this.req.flash('errors')
        }
    }
    old(field, defaultValue=''){
        return this.formData && this.formData.hasOwnProperty(field) ? this.formData[field] : defaultValue
    }
    date(time){
            return moment(time);
    }
}
//goes to app/index.js .
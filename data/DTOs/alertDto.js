const moment = require('moment-timezone')

export default class AlertDto{
    seen;
    title;
    description;
    alertDate;
    alertType;

    constructor(data){
        this.seen = false;
        this.title = data.title;
        this.description = data.description;
        this.alertDate = moment().tz("Europe/Warsaw").toISOString(true);
        this.alertType = data.alertType;
    }
}
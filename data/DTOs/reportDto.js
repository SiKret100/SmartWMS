const moment = require('moment-timezone')

export default class ReportDto{
    reportPeriod;
    reportType;
    reportDate;

    constructor(data){
        this.reportPeriod = data.reportPeriod;
        this.reportType = data.reportType;
        this.reportDate = moment().tz("Europe/Warsaw").toISOString(true);
    }
}
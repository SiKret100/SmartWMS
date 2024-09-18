export default class AlertDto{
    seen;
    alertDate;
    alertType;

    constructor(data){
        this.seen = false;
        this.alertDate = data.alertDate;
        this.alertType = data.alertType;
    }
}
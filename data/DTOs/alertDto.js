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
        this.alertDate = data.alertDate;
        this.alertType = data.alertType;
    }
}
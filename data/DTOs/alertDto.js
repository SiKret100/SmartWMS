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
        this.alertDate = "2024-09-30T12:54:06.275Z";
        this.alertType = 0;
    }
}
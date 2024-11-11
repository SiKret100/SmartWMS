export default class RackDto{
    rackNumber;
    lanesLaneId;

    constructor(data){
        this.rackNumber = data.title;
        this.lanesLaneId = data.lanesLaneId;
    }
}
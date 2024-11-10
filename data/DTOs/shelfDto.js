export default class ShelfDto {
    level;
    maxQuant;
    currentQuant;
    racksRackId;

    constructor(shelfData){
        console.log(`Current quant: ${shelfData.currentQuant}`)
        this.level = shelfData.title;
        this.maxQuant = shelfData.maxQuant;
        this.currentQuant = shelfData.currentQuant;
        this.racksRackId = shelfData.racksRackId;
        console.log(`This current quant: ${this.currentQuant}`);
    }
}
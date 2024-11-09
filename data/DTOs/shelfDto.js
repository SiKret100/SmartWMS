export default class ShelfDto {
    level;
    maxQuant;
    currentQuant;
    racksRackId;
    productId;

    constructor(shelfData){
        this.level = shelfData.title;
        this.maxQuant = shelfData.maxQuant;
        this.currentQuant = shelfData.currentQuant;
        this.racksRackId = shelfData.racksRackId;
        this.currentQuant = shelfData.productId;
    }
}
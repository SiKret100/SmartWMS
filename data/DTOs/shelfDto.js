export default class ShelfDto {
    level;
    max_quant;
    current_quant
    product_product_id

    constructor(shelfData){
        this.level = shelfData.title;
        this.maxQuant = shelfData.maxQuant;
        this.current_quant = shelfData.currentQuant;
        this.product_product_id = shelfData.productId;
    }
}
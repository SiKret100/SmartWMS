export default class productDto {
    productName;
    productDescription;
    price;
    quantity;
    barcode;
    subcategoriesSubcategoryId;

    constructor(data) {
        this.productName = data.productName;
        this.productDescription = data.productDescription;
        this.price = data.price;
        this.quantity = data.quantity;
        this.barcode = data.barcode;
        this.subcategoriesSubcategoryId = data.subcategoriesSubcategoryId;
    }
}
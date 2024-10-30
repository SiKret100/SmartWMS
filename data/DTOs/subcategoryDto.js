
export default class SubcategoryDto{
    subcategoryName;
    categoriesCategoryId;

    constructor(data){
        this.subcategoryName = data.subcategoryName;
        this.categoriesCategoryId = data.categoriesCategoryId;
    }
}
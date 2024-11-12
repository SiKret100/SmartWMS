import {KeyboardAvoidingView, SafeAreaView, Text, View} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import TextFormField from "../form_fields/TextFormField";
import NumberFormField from "../form_fields/NumberFormField";
import subcategoryService from "../../services/dataServices/subcategoryService";
import {useFocusEffect} from "expo-router";
import CustomButton from "../buttons/CustomButton";
import CustomSelectList from "../selects/CustomSelectList";
import shelfService from "../../services/dataServices/shelfService";

const ProductsMobileForm = () => {

    //PROPS====================================================================================================
    const [form, setForm] = useState({
        productName: "",
        productDescription: "",
        price: "",
        quantity: "",
        barcode: "",
        subcategoriesSubcategoryId: -1,
    })

    const [subcategoryTypeMap, setsubcategoryTypeMap] = useState([]);
    const [shelvesTypeMap, setShelvesTypeMap] = useState([]);
    const [productNameError, setProductNameError] = useState(false);
    const [productDescriptionError, setProductDescriptionError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [quantityError, setQuantityError] = useState(false);
    const [barcodeError, setBarcodeError] = useState(false);
    const [subcategoriesSubcategoryIdError, setSubcategoriesSubcategoryIdError] = useState(false);
    const [errors, setErrors] = useState({});
    

    //FUNCTIONS=====================================================================================key========
    const fetchSubcategories = async () => {
        try{
            const result = await subcategoryService.GetAll();
            setsubcategoryTypeMap(result.data.map(subcategory => ({
                key: subcategory.subcategoryId,
                value: subcategory.subcategoryName,
            })));
        }
        catch(err){
            console.log(`Bledy fetchSubcategories: ${JSON.stringify(err)}`)
            setErrors(err)
        }
    }

    const fetchShelves = async () => {
        try{
            const result = await shelfService.GetAll()
            let filteredShelves = result.data.filter(shelf => shelf.productsProductId === null)

            setShelvesTypeMap(filteredShelves.map(shelf => ({
                key: shelf.shelfId,
                value: shelf.level
            })))

        }catch(err){
            console.log(`Bledy fetchShelves: ${JSON.stringify(err)}`)
            setErrors(err)
        }
    }

    const handleProductName = (e) => {
        const productNameVar = e.nativeEvent.text;
        productNameVar.length > 0 ? setProductNameError(false) : setProductNameError(true);
    }

    const handleProductDescription = (e) => {
        const productDescriptionVar = e.nativeEvent.text;
        productDescriptionVar.length > 0 ? setProductDescriptionError(false) : setProductDescriptionError(true);

    }

    const handlePrice = (e) => {
        const price = e.nativeEvent.text;
        const regexp = new RegExp("^[1-9]{1}\\d*(\\.\\d{1,2})?$")

        if (price.length >= 1 && regexp.test(price)) {

            const parsedPrice =  parseFloat(price);
            console.log(parsedPrice);

            if (isNaN(parsedPrice)) {
                setPriceError(true);
                console.log('Error: not a number');
            } else {
                if ( parsedPrice <= 999999999 ) {
                    setPriceError(false);
                    console.log('No error');
                }else{
                    setPriceError(true);
                    console.log('Error');
                }
            }
        } else {
            setPriceError(true);
            console.log('No error');
        }
    }

    const handleQuantity = (e) => {
        const quantity = e.nativeEvent.text;
        const regexp = new RegExp("^[1-9]{1}\\d*$");
        if (regexp.test(quantity)) {
            const parsedMaxQuantity = parseInt(quantity);
            console.log(parsedMaxQuantity);

            if (isNaN(parsedMaxQuantity)) {
                setQuantityError(true);
                console.log('Error: not a number');
            } else {
                if (parsedMaxQuantity <= 999 ) {
                    setQuantityError(false);
                    console.log('No error');
                }else{
                    setQuantityError(true);
                    console.log('Error');
                }
            }
        } else {
            setQuantityError(true);
            console.log('No error');
        }
    }

    const handleBarcode = (e) => {
        const regexp = new RegExp("^[A-za-z\\d]{8}$")
        const barcodeVar = e.nativeEvent.text;
        console.log(barcodeVar);

        if(regexp.test(barcodeVar)){
            setBarcodeError(false)
        } else setBarcodeError(true);
    }

    const handleSubcategoryId = () => {
        form.subcategoriesSubcategoryId === -1 ? setSubcategoriesSubcategoryIdError(true) : setSubcategoriesSubcategoryIdError(false);
    }



    //USE EFFECT HOOKS=========================================================================================
    useFocusEffect(
        useCallback(() => {
            fetchSubcategories()
        }, [])
    );


    return (
        <SafeAreaView>

            <KeyboardAvoidingView>

                <Text className="absolute left-1/2 transform -translate-x-1/2 my-5 text-3xl font-bold">Add</Text>

                <TextFormField
                    title={"Product name"}
                    value={form.productName}
                    handleChangeText={(e) => setForm({...form, productName: e})}
                    onChange={e => handleProductName(e)}
                    isError={productNameError}
                    iconsVisible={true}
                />

                <TextFormField
                    title={"Product description"}
                    value={form.productDescription}
                    handleChangeText={(e) => setForm({...form, productDescription: e})}
                    onChange={e => handleProductDescription(e)}
                    isError={productDescriptionError}
                    iconsVisible={true}
                />

                <NumberFormField
                    title={"Price"}
                    value={form.price}
                    handleChangeText={(e) => setForm({...form, price: e})}
                    onChange={e => handlePrice(e)}
                    isError={priceError}
                    iconsVisible={true}
                />

                <NumberFormField
                    title={"Quantity"}
                    value={form.quantity}
                    handleChangeText={(e) => setForm({...form, quantity: e})}
                    onChange={e => handleQuantity(e)}
                    isError={quantityError}
                    iconsVisible={true}
                />

                <TextFormField
                    title={"Barcode"}
                    value={form.barcode}
                    handleChangeText={(e) => setForm({...form, barcode: e})}
                    onChange={e => handleBarcode(e)}
                    isError={barcodeError}
                    iconsVisible={true}
                />

                <CustomSelectList
                    setSelected={val => setForm({...form, subcategoriesSubcategoryId: val})}
                    typeMap={subcategoryTypeMap}
                    defaultOption={{key: -1, value: "Choose subcategory"}}
                    onSelect={() => handleSubcategoryId()}

                />

                <CustomButton handlePress={() => fetchShelves() }></CustomButton>
                <Text>SubcategoryID: {form.subcategoriesSubcategoryId}</Text>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default ProductsMobileForm;
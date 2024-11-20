import React, {useEffect, useState} from "react";
import {KeyboardAvoidingView, Modal, Platform, SafeAreaView, Text, View} from "react-native"
import CancelButton from "../buttons/CancelButton";
import {ScrollView} from "react-native-gesture-handler";
import TextFormField from "../form_fields/TextFormField";
import CustomButton from "../buttons/CustomButton";
import NumberFormField from "../form_fields/NumberFormField";
import productErrorMessages from "../../data/ErrorMessages/productErrorMessages";
import BarcodeScanner from "../barcode_scanner/BarcodeScanner";
import subcategoryService from "../../services/dataServices/subcategoryService";
import CustomSelectList from "../selects/CustomSelectList";
import productService from "../../services/dataServices/productService";

const ProductMobileEditForm = ({object={}, setIsModalVisible}) => {

    //PROPS====================================================================================================
    const [productNameError, setProductNameError] = useState(false);
    const [productDescriptionError, setProductDescriptionError] = useState(false);
    const [priceErrorMessage, setPriceErrorMessage] = useState("");
    const [priceError, setPriceError] = useState(false);
    const [quantityError, setQuantityError] = useState(false);
    const [quantityErrorMessage, setQuantityErrorMessage] = useState("");
    const [barcodeModalVisible, setIsBarcodeModalVisible] = useState(false);
    const [barcodeError, setBarcodeError] = useState(false);
    const [barcodeErrorMessage, setBarcodeErrorMessage] = useState("");
    const [subcategoryTypeMap, setsubcategoryTypeMap] = useState([]);
    const [selectKey, setSelectKey] = useState(0);
    const [subcategoriesSubcategoryIdError, setSubcategoriesSubcategoryIdError] = useState(false);
    const [errors, setErrors] = useState({});
    const [defaultOption, setDefaultOption] = useState({});
    const [isSubcategoriesLoaded, setIsSubcategoriesLoaded] = useState(false);

    const [form, setForm] = useState({
        productName: object?.productName || "",
        productDescription: object?.productDescription || "",
        price: object?.price.toString() || "0",
        quantity: object?.quantity.toString() || "0",
        barcode: object?.barcode || "",
        subcategoriesSubcategoryId: object?.subcategoryId || -1,
    })


    //FUNCTIONS=============================================================================================
    const fetchSubcategories = async () => {
        try {
            const result = await subcategoryService.GetAll();
            const subcategoryData = result.data.map(subcategory => ({
                key: subcategory.subcategoryId,
                value: subcategory.subcategoryName,
            }));

            setsubcategoryTypeMap(subcategoryData);
            const defaultOption = subcategoryData.find(subcategory => subcategory.key === form.subcategoriesSubcategoryId)
            setDefaultOption(defaultOption);

            setIsSubcategoriesLoaded(true);
        } catch (err) {
            console.error("Error fetching subcategories:", err);
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

            const parsedPrice = parseFloat(price);
            console.log(parsedPrice);

            if (isNaN(parsedPrice)) {
                setPriceError(true);
                setPriceErrorMessage(productErrorMessages.invalidPrice);
                console.log('Error: not a number');
            } else {
                if (parsedPrice <= 999999999) {
                    setPriceErrorMessage("");
                    setPriceError(false);
                    console.log('No error');
                } else {
                    setPriceErrorMessage(productErrorMessages.excessiveValue);
                    setPriceError(true);
                    console.log('Error');
                }
            }
        } else {
            setPriceError(true);
            setPriceErrorMessage(productErrorMessages.invalidPrice);
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
                setQuantityErrorMessage(productErrorMessages.invalidQuantity);
                console.log('Error: not a number');
            } else {
                //setAssignedShelvesError(false);
                if (parsedMaxQuantity <= 999) {
                    setQuantityError(false)
                    if (assignedShelves.length > 0) {

                        const summedQuantity = assignedShelves.reduce((acc, shelf) => acc + parseInt(shelf.currentQuant), 0);
                        console.log("Summed quantity: " + summedQuantity);
                        if (summedQuantity === parsedMaxQuantity) {
                            setAssignedShelvesError(false);
                            setQuantityErrorMessage("");
                            console.log('No error');
                        } else {
                            setQuantityErrorMessage(productErrorMessages.quantityToShelvesMismatch);
                            setAssignedShelvesError(true);
                            console.log('Error');
                        }
                    } else {
                        setAssignedShelvesError(true);
                        setQuantityErrorMessage("");
                        console.log('No error');
                    }

                } else {
                    setQuantityError(true);
                    setQuantityErrorMessage(productErrorMessages.excessiveQuantity)
                    console.log('Error');
                }
            }
        } else {
            setQuantityError(true);
            setQuantityErrorMessage(productErrorMessages.invalidQuantity);
            console.log('error');
        }
    }

    const handleSubcategoryId = () => {
        form.subcategoriesSubcategoryId === -1 ? setSubcategoriesSubcategoryIdError(true) : setSubcategoriesSubcategoryIdError(false);
    }

    const handleEdit = async () => {
        try{
            const result = await productService.Update(object.productId, form);
            setIsModalVisible(false);
        }
        catch(err) {
            console.log(`Errors: ${JSON.stringify(err)}`);
        }
    }


    //USE EFFECT HOOKS=========================================================================================
    useEffect(() => {
        fetchSubcategories();
    }, []);


    return (
        <SafeAreaView>


            <ScrollView className={"h-full mx-2"}>
                <KeyboardAvoidingView className={"h-full px-4"} behavior={"padding"}>
                    <View className="flex flex-col items-start justify-between mt-2 px-2">
                        <CancelButton onPress={() => setIsModalVisible(false)}/>
                        <Text className="my-5 text-3xl font-bold">Edit</Text>
                    </View>
                    <TextFormField
                        title={"Product name"}
                        value={form.productName}
                        handleChangeText={(e) => setForm({...form, productName: e})}
                        onChange={e => handleProductName(e)}
                        isError={!!productNameError}
                        iconsVisible={true}
                    />

                    <TextFormField
                        title={"Product description"}
                        value={form.productDescription}
                        handleChangeText={(e) => setForm({...form, productDescription: e})}
                        onChange={e => handleProductDescription(e)}
                        isError={!!productDescriptionError}
                        iconsVisible={true}
                        otherStyles={"mt-7"}
                    />

                    <NumberFormField
                        title={"Price"}
                        value={form.price}
                        handleChangeText={(e) => setForm({...form, price: e})}
                        onChange={e => handlePrice(e)}
                        isError={!!priceError}
                        iconsVisible={true}
                        otherStyles={"mt-7"}
                    />

                    {form.price.length === 0 ? null : priceError ?

                        <Text className="text-red-500">{priceErrorMessage}</Text>
                        :
                        null
                    }

                    {/*<NumberFormField*/}
                    {/*    title={"Quantity"}*/}
                    {/*    value={form.quantity.toString()}*/}
                    {/*    handleChangeText={(e) => setForm({...form, quantity: e})}*/}
                    {/*    onChange={e => handleQuantity(e)}*/}
                    {/*    isError={!!quantityError}*/}
                    {/*    iconsVisible={true}*/}
                    {/*    otherStyles={"mt-7"}*/}
                    {/*/>*/}

                    {form.quantity.length === 0 ? null : quantityError ?

                        <Text className="text-red-500">{quantityErrorMessage}</Text>
                        :
                        null
                    }

                    <TextFormField
                        title={"Barcode"}
                        value={form.barcode}
                        handleChangeText={(e) => setForm({...form, barcode: e})}
                        onChange={e => handleBarcode(e)}
                        isError={!!barcodeError}
                        iconsVisible={true}
                        otherStyles={"mt-7"}
                        editable={false}
                        iconName={"maximize"}
                        isModalVisible={setIsBarcodeModalVisible}
                    />

                    <Modal
                        visible={barcodeModalVisible}
                        animationType={Platform.OS !== "ios" ? "" : "slide"}
                        presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                        onRequestClose={() => setIsBarcodeModalVisible(false)}
                    >
                        <BarcodeScanner form={form} setForm={setForm} setIsModalVisible={setIsBarcodeModalVisible} />
                    </Modal>

                    {form.barcode.length === 0 ? null : barcodeError ?


                        <Text className="text-red-500">{barcodeErrorMessage}</Text>
                        :
                        null
                    }

                    <View className={"mt-12"}>
                        <CustomSelectList
                            selectKey={selectKey}
                            setSelected={val => setForm({...form, subcategoriesSubcategoryId: val})}
                            typeMap={subcategoryTypeMap}
                            defaultOption={defaultOption}
                            onSelect={() => handleSubcategoryId()}
                        />
                    </View>

                    <CustomButton
                        title="Save"
                        handlePress={() => handleEdit()}
                        containerStyles="w-full mt-7"
                        textStyles={"text-white"}
                        isLoading={productNameError || productDescriptionError || priceError || quantityError || barcodeError || subcategoriesSubcategoryIdError}
                        showLoading={false}
                    />

                </KeyboardAvoidingView>

            </ScrollView>


        </SafeAreaView>




    )
}

export default ProductMobileEditForm;
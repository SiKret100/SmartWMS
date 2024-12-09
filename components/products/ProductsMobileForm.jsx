import {KeyboardAvoidingView, Modal, Platform, SafeAreaView, Text, View} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import TextFormField from "../form_fields/TextFormField";
import NumberFormField from "../form_fields/NumberFormField";
import {useFocusEffect} from "expo-router";
import CustomButton from "../buttons/CustomButton";
import CustomSelectList from "../selects/CustomSelectList";
import ShelfAssignForm from "components/products/ShelfAssignForm.jsx";
import {ScrollView} from "react-native-gesture-handler";
import ShelfAssignDisplayer from "./ShelfAssignDisplayer";
import productErrorMessages from "../../data/ErrorMessages/productErrorMessages";
import BarcodeScanner from "../barcode_scanner/BarcodeScanner";
import crudService from "../../services/dataServices/crudService";
import {router} from "expo-router";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";
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

    const [selectKey, setSelectKey] = useState(0);
    const [subcategoryTypeMap, setsubcategoryTypeMap] = useState([]);

    const [priceErrorMessage, setPriceErrorMessage] = useState("");
    const [quantityErrorMessage, setQuantityErrorMessage] = useState("");
    const [barcodeErrorMessage, setBarcodeErrorMessage] = useState("");

    const [productNameError, setProductNameError] = useState(true);
    const [productDescriptionError, setProductDescriptionError] = useState(true);
    const [priceError, setPriceError] = useState(true);
    const [quantityError, setQuantityError] = useState(true);
    const [barcodeError, setBarcodeError] = useState(false);
    const [assignedShelvesError, setAssignedShelvesError] = useState(true);
    const [subcategoriesSubcategoryIdError, setSubcategoriesSubcategoryIdError] = useState(true);
    const [errors, setErrors] = useState({});

    const [barcodeModalVisible, setIsBarcodeModalVisible] = useState(false);
    const [isShelfAssignmentModalVisible, setIsShelfAssignmentModalVisible] = useState(false);
    const [isModalAssignesShelvesVisible, setIsModalAssignesShelvesVisible] = useState(false);
    const [shelvesList, setShelvesList] = useState([]);
    const [assignedShelves, setAssignedShelves] = useState([]);
    const [productQuantity, setProductQuantity] = useState(form.quantity);
    const [request, setRequest] = useState({
        productDto: {},
        shelves: [],
    })

    const defaultOption = {key: -1, value: "Choose subcategory"};


    //FUNCTIONS=============================================================================================
    const fetchSubcategories = async () => {
        try {
            const result = await crudService.GetAll("Subcategory");
            setsubcategoryTypeMap(result.data.map(subcategory => ({
                key: subcategory.subcategoryId,
                value: subcategory.subcategoryName,
            })));
        } catch (err) {
            CustomAlert("Error fetching data.");
            setErrors(err);
        }
    }

    const fetchShelves = async () => {
        try {
            const result = await crudService.GetAll("Shelf/withRackLane");

            let filteredShelves = result.data.filter(shelf => shelf.productId === null);
            setShelvesList(filteredShelves);

        } catch (err) {
            CustomAlert("Error fetching data.");
            setErrors(err);
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
        const regexp = new RegExp("^[1-9]{1}\\d*(\\.\\d{1,2})?$");

        if (price.length >= 1 && regexp.test(price)) {

            const parsedPrice = parseFloat(price);

            if (isNaN(parsedPrice)) {
                setPriceError(true);
                setPriceErrorMessage(productErrorMessages.invalidPrice);
            } else {
                if (parsedPrice <= 999999999) {
                    setPriceErrorMessage("");
                    setPriceError(false);
                } else {
                    setPriceErrorMessage(productErrorMessages.excessiveValue);
                    setPriceError(true);
                }
            }
        } else {
            setPriceError(true);
            setPriceErrorMessage(productErrorMessages.invalidPrice);
        }
    }

    const handleQuantity = (e) => {
        const quantity = e.nativeEvent.text;
        const regexp = new RegExp("^[1-9]{1}\\d*$");
        if (regexp.test(quantity)) {
            const parsedMaxQuantity = parseInt(quantity);

            if (isNaN(parsedMaxQuantity)) {
                setQuantityError(true);
                setQuantityErrorMessage(productErrorMessages.invalidQuantity);
            } else {
                if (parsedMaxQuantity <= 999) {
                    setQuantityError(false)
                    if (assignedShelves.length > 0) {

                        const summedQuantity = assignedShelves.reduce((acc, shelf) => acc + parseInt(shelf.currentQuant), 0);
                        if (summedQuantity === parsedMaxQuantity) {
                            setAssignedShelvesError(false);
                            setQuantityErrorMessage("");
                        } else {
                            setQuantityErrorMessage(productErrorMessages.quantityToShelvesMismatch);
                            setAssignedShelvesError(true);
                        }
                    } else {
                        setAssignedShelvesError(true);
                        setQuantityErrorMessage("");
                    }

                } else {
                    setQuantityError(true);
                    setQuantityErrorMessage(productErrorMessages.excessiveQuantity)
                }
            }
        } else {
            setQuantityError(true);
            setQuantityErrorMessage(productErrorMessages.invalidQuantity);
        }
    }

    const handleBarcode = (barcode) => {
        const regexp = new RegExp("^[\\d]{8,14}$");
        setBarcodeError(false);

        if (regexp.test(barcode)) {
            setBarcodeErrorMessage("");
        } else {
            setBarcodeError(true);
            setBarcodeErrorMessage(productErrorMessages.barcodeError);
        }
    }

    const handleSubcategoryId = () => {
        form.subcategoriesSubcategoryId === -1 ? setSubcategoriesSubcategoryIdError(true) : setSubcategoriesSubcategoryIdError(false);
    }

    const handleAssignedShelves = () => {
        assignedShelves.length > 0 ? setAssignedShelvesError(false) : setAssignedShelvesError(true);
    }

    const handleCreateProduct = async () => {
        try{
            const result = await crudService.Post(request, "Product/createAndAssignToShelves");

            if(result.errors){
                setErrors(result.errors);
            }else{
                setForm({
                    productName: "",
                    productDescription: "",
                    price: "",
                    quantity: "",
                    barcode: "",
                    subcategoriesSubcategoryId: -1,
                });
                setErrors({});

                setForm({
                    productName: "",
                        productDescription: "",
                    price: "",
                    quantity: "",
                    barcode: "",
                    subcategoriesSubcategoryId: -1,
                });

                setAssignedShelves([]);

                setSelectKey((prevKey) => prevKey + 1);
                router.push("/home/products");
            }
        }
        catch(err){
            CustomAlert("Error creating product.");
            setErrors(err);
        }

    }


    //USE EFFECT HOOKS=========================================================================================
    useFocusEffect(
        useCallback(() => {
            fetchSubcategories();
            fetchShelves();
        }, [])
    );

    useEffect(() => {
        handleAssignedShelves();
        if(!isNaN(parseInt(form.quantity)) && assignedShelves.length > 0) {
            const summedQuantity = assignedShelves.reduce((acc, shelf) => acc + parseInt(shelf.currentQuant), 0);
            if (summedQuantity === parseInt(form.quantity)) {
                setQuantityError(false);
            } else {
                setQuantityError(true);
            }
        }
    }, [isShelfAssignmentModalVisible])

    useEffect(() => {
        if(assignedShelves.length > 0){
            setRequest({
                productDto: {
                    productName: form.productName,
                    productDescription: form.productDescription,
                    price: form.price,
                    quantity: form.quantity,
                    barcode: form.barcode,
                    subcategoriesSubcategoryId: form.subcategoriesSubcategoryId,
                },
                shelves: assignedShelves.map(shelf => ({
                    shelfId: shelf.shelfId,
                    level: shelf.level,
                    maxQuant: shelf.maxQuant,
                    currentQuant: shelf.currentQuant,
                    productsProductId: shelf.productsProductId,
                    racksRackId: shelf.rackId,
                }))
            })
        }
    },[assignedShelves])

    useEffect(() => {

        if(form.barcode.length > 0)
            handleBarcode(form.barcode);

    }, [barcodeModalVisible])


    return (
        <SafeAreaView>

            <ScrollView className={"h-full mx-2"}>


                <KeyboardAvoidingView className={"h-full px-4"} behavior={"padding"}>

                    <Text className="absolute left-1/2 transform -translate-x-1/2 my-5 text-3xl font-bold">Add</Text>

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

                    <NumberFormField
                        title={"Quantity"}
                        value={form.quantity.toString()}
                        handleChangeText={(e) => setForm({...form, quantity: e})}
                        onChange={e => handleQuantity(e)}
                        isError={!!quantityError}
                        iconsVisible={true}
                        otherStyles={"mt-7"}
                    />

                    {form.quantity.length === 0 ? null : quantityError || assignedShelvesError ?

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



                    <View className={"space-y-6 mt-6 mb-2"}>
                        <Text
                            className='text-base font-pmedium'> Subcategory
                        </Text>
                        <CustomSelectList
                            selectKey={selectKey}
                            setSelected={val => setForm({...form, subcategoriesSubcategoryId: val})}
                            typeMap={subcategoryTypeMap}
                            defaultOption={defaultOption}
                            onSelect={() => handleSubcategoryId()}
                        />
                    </View>

                    <CustomButton title={"Assign shelves"}
                                  handlePress={() => setIsShelfAssignmentModalVisible(true)}
                                  containerStyles={"mt-7"}
                                  isLoading={!!quantityError}
                                  showLoading={false}
                                  textStyles={"text-white"}></CustomButton>

                    {
                        assignedShelves.length > 0 ?
                        <CustomButton title={"Show assigned shelves"}
                                      handlePress={() => setIsModalAssignesShelvesVisible(true)}
                                      containerStyles={"mt-7"}
                                      textStyles={"text-white"}
                        /> : null
                    }

                    <CustomButton title={"Save"}
                                  handlePress={() => handleCreateProduct()}
                                  containerStyles={"mt-7"}
                                  isLoading={!!subcategoriesSubcategoryIdError || !!quantityError || !!productNameError || !!productDescriptionError || !!priceError || !!barcodeError || !!assignedShelvesError}
                                  showLoading={false}
                                  textStyles={"text-white"}
                    />

                    <Modal
                        visible={!!isShelfAssignmentModalVisible}
                        animationType={Platform.OS !== "ios" ? "" : "slide"}
                        presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                        onRequestClose={() => setIsShelfAssignmentModalVisible(false)}
                    >
                        <ShelfAssignForm productQuantity={form.quantity}
                                         shelvesList={shelvesList}
                                         setIsModalVisible={setIsShelfAssignmentModalVisible}
                                         assignedShelves={assignedShelves}
                                         setAssignedShelves={setAssignedShelves}
                        />

                    </Modal>

                    <Modal
                        visible = {!!isModalAssignesShelvesVisible}
                        animationType={Platform.OS !== "ios" ? "" : "slide"}
                        presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                        onRequestClose={() => setIsModalAssignesShelvesVisible(false)}
                    >
                        <ShelfAssignDisplayer assignedShelves={assignedShelves} setIsModalVisible={setIsModalAssignesShelvesVisible}/>
                    </Modal>

                </KeyboardAvoidingView>

            </ScrollView>

        </SafeAreaView>
    )
}

export default ProductsMobileForm;
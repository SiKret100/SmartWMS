import {KeyboardAvoidingView, Modal, Platform, SafeAreaView, Text, View} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import TextFormField from "../form_fields/TextFormField";
import NumberFormField from "../form_fields/NumberFormField";
import subcategoryService from "../../services/dataServices/subcategoryService";
import {useFocusEffect} from "expo-router";
import CustomButton from "../buttons/CustomButton";
import CustomSelectList from "../selects/CustomSelectList";
import shelfService from "../../services/dataServices/shelfService";
import ShelfAssignForm from "components/products/ShelfAssignForm.jsx";
import {ScrollView} from "react-native-gesture-handler";
import ShelfAssignDisplayer from "./ShelfAssignDisplayer";
import productService from "../../services/dataServices/productService";

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
    // const [shelvesTypeMap, setShelvesTypeMap] = useState([]);
    const [productNameError, setProductNameError] = useState(true);
    const [productDescriptionError, setProductDescriptionError] = useState(true);
    const [priceError, setPriceError] = useState(true);
    const [quantityError, setQuantityError] = useState(true);
    const [barcodeError, setBarcodeError] = useState(true);
    const [assignedShelvesError, setAssignedShelvesError] = useState(true);
    const [subcategoriesSubcategoryIdError, setSubcategoriesSubcategoryIdError] = useState(true);
    const [errors, setErrors] = useState({});
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
            const result = await subcategoryService.GetAll();
            setsubcategoryTypeMap(result.data.map(subcategory => ({
                key: subcategory.subcategoryId,
                value: subcategory.subcategoryName,
            })));
        } catch (err) {
            console.log(`Bledy fetchSubcategories: ${JSON.stringify(err)}`)
            setErrors(err)
        }
    }

    const fetchShelves = async () => {
        try {
            const result = await shelfService.GetShelfWithRackLane()

            let filteredShelves = result.data.filter(shelf => shelf.productId === null)
            setShelvesList(filteredShelves)

            // setShelvesTypeMap(filteredShelves.map(shelf => ({
            //     key: shelf.shelfId,
            //     value: "Lane: " + shelf.rackLane.lane.laneCode + " Rack: "+ shelf.rackLane.rackNumber + " Level: " + shelf.level
            // })))


        } catch (err) {
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

            const parsedPrice = parseFloat(price);
            console.log(parsedPrice);

            if (isNaN(parsedPrice)) {
                setPriceError(true);
                console.log('Error: not a number');
            } else {
                if (parsedPrice <= 999999999) {
                    setPriceError(false);
                    console.log('No error');
                } else {
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
                setAssignedShelvesError(false)
                if (parsedMaxQuantity <= 999) {
                    if (assignedShelves.length > 0) {
                        const summedQuantity = assignedShelves.reduce((acc, shelf) => acc + parseInt(shelf.currentQuant), 0);
                        console.log("Summed quantity: " + summedQuantity);
                        if (summedQuantity === parsedMaxQuantity) {
                            setQuantityError(false);
                            console.log('No error');
                        } else {
                            setQuantityError(true);
                            console.log('Error');
                        }
                    } else {
                        setQuantityError(false);
                        console.log('No error');
                    }

                } else {
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
        const regexp = new RegExp("^[A-za-z\\d]{8}$");
        const barcodeVar = e.nativeEvent.text;
        console.log(barcodeVar);

        if (regexp.test(barcodeVar)) {
            setBarcodeError(false);
        } else setBarcodeError(true);
    }

    const handleSubcategoryId = () => {
        form.subcategoriesSubcategoryId === -1 ? setSubcategoriesSubcategoryIdError(true) : setSubcategoriesSubcategoryIdError(false);
    }

    const handleAssignedShelves = () => {
        assignedShelves.length > 0 ? setAssignedShelvesError(false) : setAssignedShelvesError(true);
    }

    const handleCreateProduct = async () => {

        // console.log("Form: " + JSON.stringify(form))
        // console.log("Assignes shelces " + JSON.stringify(assignedShelves))




        try{
            const result = await productService.AddProductAndAssignShelves(request);
            if(result.errors){
                setErrors(result.errors);
                //console.log(`Błędy przechwycone: ${JSON.stringify(result.errors)}`);
            }else{
                setForm({
                    productName: "",
                    productDescription: "",
                    price: "",
                    quantity: "",
                    barcode: "",
                    subcategoriesSubcategoryId: -1,
                })
                setErrors({})
                // setForm({
                //     laneCode: ""
                // })
                setSelectKey((prevKey) => prevKey + 1);
            }
        }
        catch(err){
            setErrors(err);
            //console.log(`Bledy w komponencie: ${JSON.stringify(err)}`);
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
            console.log("Summed quantity: " + summedQuantity);
            if (summedQuantity === parseInt(form.quantity)) {
                setQuantityError(false);
                //console.log('No error');
            } else {
                setQuantityError(true);
                //console.log('Error');
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

                    <NumberFormField
                        title={"Quantity"}
                        value={form.quantity.toString()}
                        handleChangeText={(e) => setForm({...form, quantity: e})}
                        onChange={e => handleQuantity(e)}
                        isError={!!quantityError}
                        iconsVisible={true}
                        otherStyles={"mt-7"}
                    />

                    <TextFormField
                        title={"Barcode"}
                        value={form.barcode}
                        handleChangeText={(e) => setForm({...form, barcode: e})}
                        onChange={e => handleBarcode(e)}
                        isError={!!barcodeError}
                        iconsVisible={true}
                        otherStyles={"mt-7"}
                    />


                    <View className={"mt-12"}>
                        <CustomSelectList
                            selectKey={selectKey}
                            setSelected={val => setForm({...form, subcategoriesSubcategoryId: val})}
                            typeMap={subcategoryTypeMap}
                            defaultOption={defaultOption}
                            onSelect={() => handleSubcategoryId()}
                        />
                    </View>


                    {/*//przycisk do przechodzenia do modala musi byc wlaczony jesli pole quantity w formularzu jestustawione i przeszlo waldiacje*/}

                    <CustomButton title={"Assign shelves"}
                                  handlePress={() => setIsShelfAssignmentModalVisible(true)}
                                  containerStyles={"mt-7"}
                                  isLoading={!!assignedShelvesError}
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

                    {/*<CustomButton handlePress={() => console.log(JSON.stringify(assignedShelves))}></CustomButton>*/}


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
import {Platform, Modal, SafeAreaView, Text, View} from "react-native";
import CancelButton from "../buttons/CancelButton";
import React, {useState, useEffect} from "react";
import CustomSelectList from "../selects/CustomSelectList";
import NumberFormField from "../form_fields/NumberFormField";
import ProductDeliveryDistributionForm from "./ProductDeliveryDistributionForm";
import CustomButton from "../buttons/CustomButton";
import productErrorMessages from "../../data/ErrorMessages/productErrorMessages";
import {router} from "expo-router";
import crudService from "../../services/dataServices/crudService";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";


const ProductMobileTakeDeliveryModal = ({setIsModalVisible}) => {

    //PROPS
    const [form, setForm] = useState({
        productsProductId: -1,
        currentQuant: ""
    });
    const [shelvesList, setShelvesList] = useState([]);
    const [productTypeMap, setProductTypeMap] = useState([]);
    const [selectKey, setSelectKey] = useState(0);
    const [isModalShelfAssignFormVisible, setIsModalShelfAssignFormVisible] = useState(false);
    const [assignedShelves, setAssignedShelves] = useState([]);

    const [quantityError, setQuantityError ] = useState(true);
    const [quantityErrorMessage, setQuantityErrorMessage] = useState("");
    const [errors,setErrors] = useState([]);
    const [productIdError, setProductIdError] = useState(true);
    const [assignedShelvesError, setAssignedShelvesError] = useState(true);
    const [request, setRequest] = useState({});
    const [productList, setProductList] = useState([]);


    //FUNCS
    const fetchData = async () => {
        try {
            const result = await crudService.GetAll("Product");
            setProductList(result.data);

            setProductTypeMap(result.data.map(product => ({
                key: product.productId,
                value: product.productName,
            })));
        } catch (err) {
            CustomAlert("Error fetching data.");
            setErrors(err);
        }
    }

    const fetchShelves = async () => {
        try{
            const result = await crudService.GetAll("Shelf/withRackLane");

            let filteredShelves = result.data.filter(shelf => shelf.productId === null || shelf.productId === form.productsProductId);
            setShelvesList(filteredShelves);
        }
        catch(err){
            CustomAlert("Error fetching data.");
            setErrors(err);
        }
    }

    const handleDeliveryAndDistribution = async () => {
        try{
            const result = await crudService.Post(request, "Product/takeDeliveryAndDistribute")
            if(result.errors){
                setErrors(result.errors);
            }
            else {
                setIsModalVisible(false);
                router.push("/home/products")
            }
        }
        catch(err){
            CustomAlert("Error taking delivery.");
            setErrors(err);
        }
    }

    const handleProduct = () => {
        form.productsProductId === -1 ? setProductIdError(true) : setProductIdError(false);
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


    //USE EFFECT HOOKS=========================================================================================
    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if(form.productsProductId !== -1){
            fetchShelves()
        }
    },[form.productsProductId]);

    useEffect(() => {
        let prodForRequest = productList.filter(item => item.productId === form.productsProductId);

        let product = prodForRequest.length > 0 ? prodForRequest[0] : null;

        if (!isNaN(parseInt(form.currentQuant)) && assignedShelves.length > 0) {
            const summedQuantity = assignedShelves.reduce((acc, shelf) => {
                const oldShelf = shelvesList.find((item) => item.shelfId === shelf.shelfId);
                const oldQuantity = parseInt(oldShelf.currentQuant);
                const netQuantity = parseInt(shelf.currentQuant) - oldQuantity;
                return acc + netQuantity;
            }, 0);

            if (summedQuantity === parseInt(form.currentQuant)) {
                const tempError = false;
                setAssignedShelvesError(tempError);
            } else {
                const tempError = true;
                setAssignedShelvesError(tempError);
            }
        }
        else {
            const tempError = true;
            setAssignedShelvesError(tempError);
        }

        setRequest({
            productDto: {
                productId: form.productsProductId,
                quantity: form.currentQuant,
                productName: product ? product.productName : null,
                barcode: product ? product.barcode : null,
            },
            shelves: assignedShelves.map(shelf => ({
                shelfId: shelf.shelfId,
                level: shelf.level,
                maxQuant: shelf.maxQuant,
                currentQuant: shelf.currentQuant,
                productsProductId: shelf.productsProductId,
                racksRackId: shelf.rackId,
            }))
        });
    }, [assignedShelves]);


    return (
        <View>
            <View className="flex flex-col items-start justify-between mt-2 px-2">
                <CancelButton onPress={() => setIsModalVisible(false)} />
                <Text className={"text-3xl font-bold mt-4"}>Choose product for delivery:</Text>
            </View>

            <SafeAreaView className={"mx-2 px-4 shadow py-2"}>

                <View className = {"mt-8"}>
                    <Text>Select product</Text>
                    <CustomSelectList
                        selectKey={selectKey}
                        setSelected={(val) => setForm((prevForm) => ({...prevForm, productsProductId: val}))}
                        typeMap={productTypeMap}
                        defaultOption={{key: -1, value: "Choose product for delivery"}}
                        onSelect = {() => handleProduct()}
                    />
                </View>

                <NumberFormField
                    title = "Quantity"
                    value = {form.currentQuant.toString()}
                    handleChangeText={(e) => setForm({...form, currentQuant: e})}
                    onChange = {e => handleQuantity(e)}
                    isError={!!quantityError}
                    iconsVisible={true}
                    otherStyles={"mt-7"}
                />

                {form.currentQuant.length === 0 ? null : quantityError || assignedShelvesError ?

                    <Text className="text-red-500">{quantityErrorMessage}</Text>
                    :
                    null
                }


                <CustomButton title={"Distribute"}
                              handlePress={() =>setIsModalShelfAssignFormVisible(true)}
                              containerStyles={"mt-7"}
                              isLoading={!!productIdError || !!quantityError}
                              showLoading={false}
                              textStyles={"text-white"}
                />



                <CustomButton title="Save"
                              handlePress={() => handleDeliveryAndDistribution()}
                              containerStyles={"mt-7"}
                              isLoading={!!assignedShelvesError || !!quantityError || !!productIdError}
                              showLoading={false}
                              textStyles={"text-white"}
                />

                <Modal
                    visible={isModalShelfAssignFormVisible}
                    animationType={Platform.OS !== "ios" ? "" : "slide"}
                    presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                    onRequestClose={() => setIsModalShelfAssignFormVisible(false)}
                >
                    <ProductDeliveryDistributionForm productQuantity={form.currentQuant} shelvesList={shelvesList}
                                     setIsModalVisible={setIsModalShelfAssignFormVisible} assignedShelves={assignedShelves}
                                     setAssignedShelves={setAssignedShelves}
                                                     setError={setAssignedShelvesError}
                    />
                </Modal>

            </SafeAreaView>
        </View>
    )
}

export default ProductMobileTakeDeliveryModal

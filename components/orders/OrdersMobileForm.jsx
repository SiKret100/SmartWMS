import React, {useCallback, useEffect, useState} from "react";
import {SafeAreaView, View, Text, Modal, Platform, FlatList, RefreshControl, ActivityIndicator} from "react-native";
import CustomButton from "../buttons/CustomButton";
import TextFormField from "../form_fields/TextFormField";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import {Divider} from "react-native-elements";
import orderErrorMessages from "../../data/ErrorMessages/orderErrorMessages";
import AddProductModal from "./AddProductModal";
import productService from "../../services/dataServices/productService";
import {router, useFocusEffect} from "expo-router";
import FallingTiles from "../FallingTiles";
import EditButton from "../buttons/EditButton";
import DeleteButton from "../buttons/DeleteButton";
import EditProductModal from "./EditProductModal";
import CustomSelectList from "../selects/CustomSelectList";
import CountryService from "../../services/dataServices/countryService";
import orderHeaderService from "../../services/dataServices/orderHeaderService";
import {post} from "axios";
import supplierTypeMap from "../../data/Mappers/supplierType";

const OrdersMobileForm = () => {

    //PROPS====================================================================================================
    const [allProducts, setAllProducts] = useState([]);
    const [assignedProducts, setAssignedProducts] = useState([]);

    const [addressError, setAddressError] = useState(true);
    const [addressErrorMessage, setAddressErrorMessage] = useState("");

    const [postalCodeError, setPostalCodeError] = useState(true);
    const [postalCodeErrorMessage, setPostalCodeErrorMessage] = useState("");

    const [countryError, setCountryError] = useState(true);
    const [countryErrorMessage, setCountryErrorMessage] = useState("");

    const [townError, setTownError] = useState(true);
    const [townErrorMessage, setTownErrorMessage] = useState("");

    const [supplierNameError, setSupplierNameError] = useState(true);
    const [supplierNameErrorMessage, setSupplierNameErrorMessage] = useState("");

    const [addProductModalVisible, setAddProductModalVisible] = useState(false);
    const [isProductEditModalVisible, setIsProductEditModalVisible] = useState(false);

    const [productTypeMap, setProductTypeMap] = useState([]);
    const [countryTypeMap, setCountryTypeMap] = useState([]);

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentlyEditedItem, setCurrentlyEditedItem] = useState({});
    const [selectKey, setSelectKey] = useState(0);
    const [selectKeyForSupplier, setSelectKeyForSupplier] = useState(0);
    // const defaultOption = {key : -1, value: "Choose country..."};
    const [defaultOption, setDefaultOption] = useState({});
    const [defaultOptionForSupplier, setDefaultOptionForSupplier] = useState({});


    const [form, setForm] = useState({
        address: "",
        countryId: -1,
        postalCode: "",
        supplierName: "",
        town: ""
    });


    //FUNCTIONS=============================================================================================
    const handleAddressChange = (e) => {
        const address = e.nativeEvent.text;
        const regexp = new RegExp("^([A-ZŁŚŹŻ][A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]{2,}\\s){1,5}\\d{1,5}(([A-Za-z](/\\d{1,5})?)|(/\\d{1,5}))?$");

        if (address.length >= 5 && regexp.test(address)) {
            setAddressError(false);
            setAddressErrorMessage("");
        } else {
            setAddressError(true);
            setAddressErrorMessage(orderErrorMessages.wrongAddressFormat);
        }
    }

    const fetchProducts = async () => {
        try {
            const result = await productService.GetProductsWithQuantityAbove0();
            setAllProducts(result.data);
            setProductTypeMap(result.data.map(product => ({key: product.productId, value: product.productName})));
        } catch (err) {
            console.log(`Errory w komponencie: ${JSON.stringify(err)}`);
        }
    }

    const fetchCountries = async () => {
        try {
            const result = await CountryService.GetAll();
            setCountryTypeMap(result.data.map(country => ({key: country.countryId, value: country.countryName})))
        } catch (err) {
            console.log(err);
        }
    }

    const handleEditProduct = (product) => {
        setCurrentlyEditedItem(product);
        setIsProductEditModalVisible(true);
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        //fetchData();
        setRefreshing(false);
    }, []);

    const handleDeleteProduct = (id) => {
        const productToRemove = allProducts.find(product => product.productId === id);
        console.log("Assigned: " + JSON.stringify(productToRemove));
        setProductTypeMap([...productTypeMap, {key: productToRemove.productId, value: productToRemove.productName}]);
        setAssignedProducts(assignedProducts.filter(item => item.productId !== id));
        console.log("Type map " + JSON.stringify(productTypeMap));
        // const newAssignedProduct = assignedProducts.filter(item => item.productId !== id);
        // setAssignedProducts(newAssignedProduct);
        // setIsDeletedItem(true);
    }

    const handleCountryType = () => {
        form.countryId === -1 ? setCountryError(true) : setCountryError(false);
    }

    const handlePostalCode = (e) => {
        const postalCode = e.nativeEvent.text;
        const regexp = new RegExp("^\\d{5}$");

        if (regexp.test(postalCode)) {
            setPostalCodeError(false);
            setPostalCodeErrorMessage("")
        } else {
            setPostalCodeError(true)
            setPostalCodeErrorMessage(orderErrorMessages.wrongPostalCodeFormat)
        }

    }

    const handleSupplierName = () => {
        form.supplierName === -1 ? setSupplierNameError(true) : setSupplierNameError(false);
    }

    const handleTown = (e) => {
        const town = e.nativeEvent.text;
        const regexp = new RegExp("^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż]{2,20}$");
        if (regexp.test(town)) {
            setTownError(false);
            setTownErrorMessage("");
        } else {
            setTownError(true);
            setTownErrorMessage(orderErrorMessages.wrongCountry);
        }

    }

    const handleAddOrder = async () => {
        // const tempReq = ({
        //     orderHeader: {
        //         town: form.town,
        //         address: form.address,
        //         countryId: form.countryId,
        //         postalCode: form.postalCode,
        //         supplierName: form.supplierName,
        //
        //     },
        //     products: assignedProducts.map(item => ({productId: item.productId, quantity: item.quantity}))
        // })
        //

        const request = ({
            orderHeader: {
                destinationAddress: form.town + ", " + form.address
            },
            waybill: {
                countryId: form.countryId,
                postalCode: form.postalCode,
                supplierName: form.supplierName
            },
            products: assignedProducts.map(item => ({productId: item.productId, quantity: item.quantity}))
        });


        try{
            await orderHeaderService.Add(request);
            setForm({
                address: "",
                countryId: -1,
                postalCode: "",
                supplierName: "",
                town: ""
            });

            setAssignedProducts([]);

            setSelectKey(prev => prev + 1);
            setSelectKeyForSupplier(prev => prev + 1);

            router.push("/home/orders");
        }
        catch(err){
            console.log(err);
        }

        console.log("Request: " + JSON.stringify(request));


    }

    const renderItem = ({item}) => (
        <FallingTiles>


            <View
                className={"flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>

                <EditButton onEdit={() => handleEditProduct(item)}/>

                <View className={"px-2 py-2 mx-4"}>
                    <Text
                        className={"text-center"}>{allProducts.find(val => val.productId === item.productId).productName}</Text>
                    <Text className={"text-center"}>Quantity: {item.quantity}</Text>

                </View>


                <DeleteButton onDelete={() => handleDeleteProduct(item.productId)}/>

            </View>


        </FallingTiles>
    );


    //USE EFFECT HOOKS=========================================================================================
    useFocusEffect(
        useCallback(() => {
            fetchCountries();
            fetchProducts();
            setSelectKey(prev => prev+1);
            setDefaultOption({key: -1, value: "Choose country..."});
            console.log("Wywolanie useFocusEffect")
        }, [])
    );

    useEffect(() => {
        fetchProducts();
        fetchCountries();
    }, [])

    useEffect(() => {
        if (assignedProducts.length > 0) {
            //setAssignedProductsError(false);
            const filteredProductTypeMap = productTypeMap.filter(product => assignedProducts.find(assignedProduct => assignedProduct.productId === product.key) === undefined);
            console.log(`Przefiltrowane produkty: ${filteredProductTypeMap}`);
            setProductTypeMap(filteredProductTypeMap)
        }
        //else setAssignedProducts(true);
        console.log(`Przefiltorwana mapa produktow: ${JSON.stringify(productTypeMap)}`);

    }, [assignedProducts]);

    useEffect(() => {
        if (isProductEditModalVisible)
            setCurrentlyEditedItem({});
    }, [isProductEditModalVisible]);

    // useEffect(() => {
    //     fetchProducts();
    //     if (isDeletedItem) setIsDeletedItem(false);
    // }, [isDeletedItem]);


    return (
        <ScrollView>
            <View className={"mx-2"}>

                <TextFormField
                    title={"Town"}
                    value={form.town}
                    handleChangeText={(e) => setForm({...form, town: e})}
                    onChange={e => handleTown(e)}
                    iconsVisible={true}
                    isError={!!townError}
                />

                {townError && form.town.length > 0 && (
                    <Text className="text-red-500">{townErrorMessage}</Text>
                )}

                <TextFormField
                    title={"Address"}
                    value={form.address}
                    handleChangeText={(e) => setForm({...form, address: e})}
                    onChange={e => handleAddressChange(e)}
                    iconsVisible={true}
                    isError={!!addressError}
                />

                {addressError && form.address.length > 0 && (
                    <Text className="text-red-500">{addressErrorMessage}</Text>
                )}

                <TextFormField
                    title={"Postal code"}
                    value={form.postalCode}
                    handleChangeText={(e) => setForm({...form, postalCode: e})}
                    onChange={e => handlePostalCode(e)}
                    iconsVisible={true}
                    isError={!!postalCodeError}
                />

                {postalCodeError && form.postalCode.length > 0 && (
                    <Text className="text-red-500">{postalCodeErrorMessage}</Text>
                )}


                <View className="space-y-2 mb-2">
                    <Text
                        className='text-base font-pmedium'> Country
                    </Text>

                    <CustomSelectList
                        selectKey={selectKey}
                        setSelected={(val) => setForm((prevForm) => ({...prevForm, countryId: val}))}
                        typeMap={countryTypeMap}
                        form={form}
                        defaultOption={{key: -1, value: "Select country..."}}
                        onSelect={() => handleCountryType()}

                    />
                </View>

                <View className="space-y-2 mb-2">
                    <Text
                        className='text-base font-pmedium'> Supplier
                    </Text>
                    <CustomSelectList
                        selectKey={selectKeyForSupplier}
                        setSelected={(val) => setForm((prevForm) => ({...prevForm, supplierName: val}))}
                        typeMap={supplierTypeMap}
                        form={form}
                        defaultOption={{key: -1, value: "Select supplier..."}}
                        onSelect={() => handleSupplierName()}
                        saveKey={"value"}

                    />
                </View>


                <Divider width={5} className={"mt-5 color-gray-800 rounded"}/>
                <Text className="mt-2 text-xl font-bold">Assigned products:</Text>

                <ScrollView>


                    <FlatList
                        data={assignedProducts}
                        keyExtractor={(item) => item.productId.toString()}
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                        }
                        ListEmptyComponent={
                            (
                                <View className={"justify-center align-center"}>
                                    <Text className={"text-center my-5"}>No products</Text>
                                </View>
                            )
                        }

                    />
                </ScrollView>

                <Divider width={5} className={" color-gray-800 rounded"}/>

                <CustomButton title={assignedProducts.length > 0 ? "Add another product" : "Add product"}
                              handlePress={() => setAddProductModalVisible(true)}
                              containerStyles={"mt-7"} isLoading={!!addressError || productTypeMap.length === 0}
                              showLoading={false}
                              textStyles={"text-white"}></CustomButton>

                {productTypeMap.length === 0 && (
                    <Text className={"mt-2"} style={{color: '#3E86D8'}}> No products available in the
                        warehouse </Text>
                )}

                <CustomButton title={"Create order"} handlePress={() => handleAddOrder()}
                              containerStyles={"mt-7"}
                              isLoading={assignedProducts.length === 0 || !!addressError || !!countryError || !!townError || !!postalCodeError || !!supplierNameError}
                              showLoading={false}
                              textStyles={"text-white"}></CustomButton>

                {/*<CustomButton title={"Get assigned products"} handlePress={() => console.log("Assigned products: " + JSON.stringify(assignedProducts))}*/}
                {/*              containerStyles={"mt-7"} isLoading={false} showLoading={false}*/}
                {/*              textStyles={"text-white"}></CustomButton>*/}

                {/*<CustomButton handlePress={() => console.log(JSON.stringify(form))} containerStyles={"mt-7"} ></CustomButton>*/}

                <Modal
                    visible={!!addProductModalVisible}
                    animationType={Platform.OS !== "ios" ? "" : "slide"}
                    presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                    onRequestClose={() => setAddProductModalVisible(false)}
                >

                    <AddProductModal setIsModalVisible={setAddProductModalVisible} productTypeMap={productTypeMap}
                                     setAssignedProducts={setAssignedProducts}
                                     allProducts={allProducts}></AddProductModal>

                </Modal>

                <Modal
                    visible={!!isProductEditModalVisible}
                    animationType={Platform.OS !== "ios" ? "" : "slide"}
                    presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                    onRequestClose={() => setIsProductEditModalVisible(false)}
                >
                    <EditProductModal
                        setIsModalVisible={setIsProductEditModalVisible}
                        setAssignedProducts={setAssignedProducts}
                        assignedProducts={assignedProducts}
                        object={currentlyEditedItem}
                        allProducts={allProducts}
                    />

                </Modal>

            </View>
        </ScrollView>
    );

}

export default OrdersMobileForm;
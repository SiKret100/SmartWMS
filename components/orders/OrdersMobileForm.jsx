import React, {useCallback, useEffect, useState} from "react";
import {SafeAreaView, View, Text, Modal, Platform, FlatList, RefreshControl, ActivityIndicator} from "react-native";
import CustomButton from "../buttons/CustomButton";
import TextFormField from "../form_fields/TextFormField";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import {Divider} from "react-native-elements";
import orderErrorMessages from "../../data/ErrorMessages/orderErrorMessages";
import AddProductModal from "./AddProductModal";
import productService from "../../services/dataServices/productService";
import {useFocusEffect} from "expo-router";
import FallingTiles from "../FallingTiles";
import EditButton from "../buttons/EditButton";
import DeleteButton from "../buttons/DeleteButton";
import EditProductModal from "./EditProductModal";

const OrdersMobileForm = () => {

    //PROPS====================================================================================================
    const [allProducts, setAllProducts] = useState([]);
    const [assignedProducts, setAssignedProducts] = useState([]);
    const [assignedProductsError, setAssignedProductsError] = useState(true);
    const [addressError, setAddressError] = useState(true);
    const [addressErrorMessage, setAddressErrorMessage] = useState("");
    const [addProductModalVisible, setAddProductModalVisible] = useState(false);
    const [productTypeMap, setProductTypeMap] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentlyEditedItem, setCurrentlyEditedItem] = useState({});
    const [isProductEditModalVisible, setIsProductEditModalVisible] = useState(false);
    const [isDeletedItem, setIsDeletedItem] = useState(false);


    const [form, setForm] = useState({
        address: ""
    });


    //FUNCTIONS=============================================================================================
    const handleAddressChange = (e) => {
        const address = e.nativeEvent.text;
        const regexp = new RegExp("^([A-ZŁŚŹŻ][A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]{2,}\\s){1,5}\\d{1,5}(([A-Za-z](/\\d{1,5})?)|(/\\d{1,5}))?$");

        if(address.length >= 5 && regexp.test(address)){
            setAddressError(false);
            setAddressErrorMessage("");
        }
        else {
            setAddressError(true);
            setAddressErrorMessage(orderErrorMessages.wrongAddressFormat);
        }
    }

    const fetchProducts = async() => {
        try{
            const result = await productService.GetProductsWithQuantityAbove0();
            setAllProducts(result.data);
            setProductTypeMap(result.data.map(product => ({key: product.productId, value: product.productName})));
        }
        catch(err){
            console.log(`Errory w komponencie: ${JSON.stringify(err)}`);
        }
    }

    const handleEditProduct = (product) => {
        setCurrentlyEditedItem(product);
        setIsProductEditModalVisible(true);
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    }, []);

    const handleDeleteProduct = (id) => {
        const productToRemove = allProducts.find(product => product.productId === id);
        console.log("Assigned: " +  JSON.stringify(productToRemove));
        setProductTypeMap([...productTypeMap, {key: productToRemove.productId, value: productToRemove.productName}]);
        setAssignedProducts(assignedProducts.filter(item => item.productId !== id));
        console.log("Type map " + JSON.stringify(productTypeMap));
        // const newAssignedProduct = assignedProducts.filter(item => item.productId !== id);
        // setAssignedProducts(newAssignedProduct);
        // setIsDeletedItem(true);
    }

    const renderItem = ({item}) => (
        <FallingTiles>


            <View
                className={"flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>

                <EditButton onEdit={() => handleEditProduct(item) }/>

                <View className={"px-2 py-2 mx-4"}>
                    <Text className={"text-center"}>{allProducts.find(val => val.productId === item.productId).productName}</Text>
                    <Text className={"text-center"}>Quantity: {item.quantity}</Text>

                </View>


                <DeleteButton onDelete={() => handleDeleteProduct(item.productId) }/>

            </View>


        </FallingTiles>
    );


    //USE EFFECT HOOKS=========================================================================================
    useFocusEffect(
        useCallback(() => {
            fetchProducts();
            console.log("Wywolanie useFocusEffect")
        }, [])
    );


    useEffect(() => {
        if(assignedProducts.length > 0) {
            //setAssignedProductsError(false);
            const filteredProductTypeMap = productTypeMap.filter(product => assignedProducts.find(assignedProduct => assignedProduct.productId === product.key) === undefined);
            console.log(`Przefiltrowane produkty: ${filteredProductTypeMap}`);
            setProductTypeMap(filteredProductTypeMap);
        }
        //else setAssignedProducts(true);
        console.log(`Przefiltorwana mapa produktow: ${JSON.stringify(productTypeMap)}`);

    }, [assignedProducts]);

    useEffect(() => {
        if(isProductEditModalVisible)
            setCurrentlyEditedItem({});
    }, [isProductEditModalVisible]);

    // useEffect(() => {
    //     fetchProducts();
    //     if (isDeletedItem) setIsDeletedItem(false);
    // }, [isDeletedItem]);



    return (
        <SafeAreaView>
            <View className={"mx-2"}>

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

                <Divider width={5} className={"mt-5 color-gray-800 rounded"}/>
                <Text className="mt-2 text-xl font-bold">Assigned products:</Text>

                <ScrollView>


                    <FlatList
                        data = {assignedProducts}
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

                <CustomButton title={assignedProducts.length > 0  ? "Add another product" : "Add product"} handlePress={() => setAddProductModalVisible(true)}
                              containerStyles={"mt-7"} isLoading={!!addressError || productTypeMap.length === 0} showLoading={false}
                              textStyles={"text-white"}></CustomButton>

                {productTypeMap.length === 0 && (
                    <Text className={"mt-2"} style={{color: '#3E86D8'}}> No products available in the warehouse </Text>
                )}

                <CustomButton title={"Create order"} handlePress={() => console.log("Create order")}
                              containerStyles={"mt-7"} isLoading={assignedProducts.length === 0 || !!addressError} showLoading={false}
                              textStyles={"text-white"}></CustomButton>

                {/*<CustomButton handlePress={() => console.log(JSON.stringify(assignedProducts))} containerStyles={"mt-7"} ></CustomButton>*/}

                <Modal
                    visible={!!addProductModalVisible}
                    animationType={Platform.OS !== "ios" ? "" : "slide"}
                    presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                    onRequestClose={() => setAddProductModalVisible(false)}
                >

                    <AddProductModal setIsModalVisible = {setAddProductModalVisible} productTypeMap={productTypeMap} setAssignedProducts={setAssignedProducts} allProducts={allProducts}></AddProductModal>

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
        </SafeAreaView>
    );

}

export default OrdersMobileForm;
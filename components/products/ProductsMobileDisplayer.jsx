import React, {useState, useCallback, useEffect, useContext} from "react";
import {TouchableOpacity} from "react-native-gesture-handler";
import {Platform, ActivityIndicator, FlatList, Modal, RefreshControl, SafeAreaView, Text, View} from "react-native";
import CustomButton from "../buttons/CustomButton";
import FallingTiles from "../FallingTiles";
import ProductsMobileDetailDisplayer from "./ProductsMobileDetailDisplayer";
import {router, useFocusEffect} from "expo-router";
import ProductMobileTakeDeliveryModal from "./ProductMobileTakeDeliveryModal";
import ProductMobileEditForm from "./ProductMobileEditForm";
import {UserDataContext} from "../../app/home/_layout";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";
import {Feather} from "@expo/vector-icons";
import CustomDeleteButtonFlatList from "../buttons/CustomDeleteButtonFlatList";
import CustomEditButtonFlatList from "../buttons/CustomEditButtonFlatList";
import crudService from "../../services/dataServices/crudService";

const ProductsMobileDisplayer = () => {

    //PROPS====================================================================================================
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isProductDetailModalVisible, setIsProductDetailModalVisible] = useState(false);
    const [currentProductDetail, setCurrentProductDetail] = useState(null);
    const [isTakeDeliveryModalVisible, setIsTakeDeliveryModalVisible] = useState(false);
    const [isEditProductModalVisible, setIsEditProductModalVisible] = useState(false);
    const [currentlyEditItem, setCurrentlyEditItem] = useState(null);
    const [isDeletedItem, setIsDeletedItem] = useState(false);
    const userData = useContext(UserDataContext);


    //FUNCTIONS================================================================================================
    const fetchData = async () => {
        try {

            const result = await crudService.GetAll("Product/withShelves")
            setData([...result.data])
        } catch (err) {
            CustomAlert("Error fetching data.");
            console.log(err);
        }
    }

    const handleProductDetailDisplay = (product) => {
        setCurrentProductDetail(product);
        setIsProductDetailModalVisible(true);
    }

    const handleDelete = async (id) => {

        try {
            await crudService.Delete(id, "Product");
            setIsDeletedItem(true);

        } catch (err) {
            CustomAlert("Error deleting product.");
            console.log(err);
        }
    }

    const handleEdit = (object) => {
        setCurrentlyEditItem(object);
        setIsEditProductModalVisible(true);
    }

    const renderItem = ({item}) => (
        <FallingTiles>


            <View className={"flex flex-col justify-start bg-slate-200 pt-2 rounded-lg mt-5 mx-4 shadow"}>


                <TouchableOpacity onPress={() => handleProductDetailDisplay(item)}
                                  hitSlop={{top: 15, bottom: 15, left: 25, right: 25}}>
                    <View className={"flex-row items-center ml-2"}>

                        <Feather color="#3E86D8" className={"mr-2"} name={"package"} size={45}/>

                        <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"} />


                        <View className={"flex-col"}>
                            <Text className={"text-smartwms-blue text-2xl font-bold"}>{item.productName}</Text>
                            <Text className={"text-xl color-gray-500"}>{item.barcode}</Text>
                        </View>

                    </View>
                </TouchableOpacity>


                <View className="mt-2 flex-row  justify-center items-cente">

                    <CustomDeleteButtonFlatList onDelete={() => userData.role === "Employee" ? CustomAlert("You can't delete product.") : (handleDelete(item.productId))} icon={"trash-2"} title={"Delete"} containerStyles={"flex-1 bg-red-500 rounded-bl-lg "} textStyles={"text-white "}></CustomDeleteButtonFlatList>
                    <CustomEditButtonFlatList onEdit={() => userData.role === "Employee" ? CustomAlert("You can't edit product.") : (handleEdit(item)) } icon={"edit"} title={"Edit" } containerStyles={"flex-1 bg-smartwms-blue rounded-br-lg"} textStyles={"text-white"}></CustomEditButtonFlatList>

                </View>

            </View>


        </FallingTiles>
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    }, []);


    //USE EFFECT HOOKS=========================================================================================
    useFocusEffect((
        useCallback(
            () => {
                fetchData()
            }, [])
    ));

    useEffect(() => {
        fetchData();
        if (isDeletedItem) setIsDeletedItem(false);

    }, [isTakeDeliveryModalVisible, isEditProductModalVisible]);

    useEffect(() => {
        fetchData();
        if (isDeletedItem) setIsDeletedItem(false);
    }, [isDeletedItem]);

    return (
        <SafeAreaView className={"flex-1 justify-start align-center"}>
            <FlatList
                data={data.reverse()}
                keyExtractor={(item) => item.productId.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
                ListEmptyComponent={
                    !loading ? (
                        <View className={"justify-center align-center"}>
                            <ActivityIndicator size="small" color="#000"/>
                        </View>
                    ) : (
                        <View className={"justify-center align-center"}>
                            <Text className={"text-center my-5"}>No products</Text>
                        </View>
                    )
                }
            />

            <CustomButton iconName={"truck"} title={"Take new delivery"} textStyles={"text-white"} containerStyles={"px-2 mb-2 mx-2"}
                          handlePress={() => setIsTakeDeliveryModalVisible(true)}/>

            <Modal
                visible={isProductDetailModalVisible}
                animationType={Platform.OS !== "ios" ? "" : "slide"}
                presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                onRequestClose={() => setIsProductDetailModalVisible(false)}
            >
                <View className="flex-auto mt-5 bg-background-light">

                    <ProductsMobileDetailDisplayer product={currentProductDetail}
                                                   setIsModalVisible={setIsProductDetailModalVisible}
                    />

                </View>

            </Modal>

            <Modal
                visible={isTakeDeliveryModalVisible}
                animationType={Platform.OS !== "ios" ? "" : "slide"}
                presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                onRequestClose={() => setIsTakeDeliveryModalVisible(false)}
            >
                <ProductMobileTakeDeliveryModal setIsModalVisible={setIsTakeDeliveryModalVisible}/>

            </Modal>

            <Modal
                visible={isEditProductModalVisible}
                animationType={Platform.OS !== "ios" ? "" : "slide"}
                presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                onRequestClose={() => setIsEditProductModalVisible(false)}
            >
                <ProductMobileEditForm setIsModalVisible={setIsEditProductModalVisible}
                                       object={currentlyEditItem}
                />

            </Modal>

        </SafeAreaView>

    )
}

export default ProductsMobileDisplayer
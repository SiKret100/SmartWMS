import {useState, useCallback, useEffect} from "react";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import {Platform, ActivityIndicator, FlatList, Modal, RefreshControl, SafeAreaView, Text, View} from "react-native";
import CustomButton from "../buttons/CustomButton";
import productService from "../../services/dataServices/productService";
import FallingTiles from "../FallingTiles";
import Feather from "react-native-vector-icons/Feather";
import DeleteButton from "../buttons/DeleteButton";
import EditButton from "../buttons/EditButton";
import ProductsMobileDetailDisplayer from "./ProductsMobileDetailDisplayer";
import {useFocusEffect} from "expo-router";
import ProductMobileTakeDeliveryModal from "./ProductMobileTakeDeliveryModal";
import ProductMobileEditForm from "./ProductMobileEditForm";

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

    //FUNCTIONS================================================================================================
    const fetchData = async () => {
        try {
            // const result = await productService.GetAll();
            //console.log(JSON.stringify(result.data));
            const result = await productService.GetAllWithShelves();
            setData([...result.data])

            console.log("wywolanie")

        } catch (err) {
            console.log(err);
        }
    }

    const handleProductDetailDisplay = (product) => {
        setCurrentProductDetail(product);
        setIsProductDetailModalVisible(true);
    }

    const handleDelete = (id) => {

        try {
            productService.Delete(id)
            setIsDeletedItem(true)

        } catch (err) {
            console.log(err);
        }
    }

    const handleEdit = (object) => {
        setCurrentlyEditItem(object);
        setIsEditProductModalVisible(true)
        console.log(JSON.stringify(object));
    }

    const renderItem = ({item}) => (
        <FallingTiles>


            <View
                className={"flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>

                <EditButton onEdit={() =>(handleEdit(item)) }/>

                <TouchableOpacity onPress={() => handleProductDetailDisplay(item)}
                                  hitSlop={{top: 15, bottom: 15, left: 25, right: 25}}>
                    <View className={"px-2 py-2 mx-4"}>
                        <Text className={"text-center"}>{item.productName}</Text>
                    </View>
                </TouchableOpacity>


                <DeleteButton onDelete={() => (handleDelete(item.productId))}/>

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

        console.log("Modala nie ma ")
        if (isDeletedItem) setIsDeletedItem(false);

    }, [isTakeDeliveryModalVisible, isEditProductModalVisible])

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

            <CustomButton title={"Take new delivery"} textStyles={"text-white"} containerStyles={"px-2 mb-2 mx-2"}
                          handlePress={() => setIsTakeDeliveryModalVisible(true)}/>

            <Modal
                visible={isProductDetailModalVisible}
                animationType={Platform.OS !== "ios" ? "" : "slide"}
                presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                onRequestClose={() => setIsProductDetailModalVisible(false)}
            >
                <View className="flex-auto mt-5 bg-background-light">
                    <ProductsMobileDetailDisplayer product={currentProductDetail}
                                                   setIsModalVisible={setIsProductDetailModalVisible}/>
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
                <ProductMobileEditForm setIsModalVisible={setIsEditProductModalVisible} object={currentlyEditItem}></ProductMobileEditForm>

            </Modal>
        </SafeAreaView>


    )
}

export default ProductsMobileDisplayer
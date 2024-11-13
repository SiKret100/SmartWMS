import {useState, useCallback} from "react";
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

const ProductsMobileDisplayer = () => {

    //PROPS====================================================================================================
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isProductDetailModalVisible, setIsProductDetailModalVisible] = useState(false);
    const [currentProductDetail, setCurrentProductDetail] = useState(null);
    const [isTakeDeliveryModalVisible, setIsTakeDeliveryModalVisible] = useState(false);

    //FUNCTIONS================================================================================================
    const fetchData = async () => {
        try {
            // const result = await productService.GetAll();
            //console.log(JSON.stringify(result.data));
            const result = await productService.GetAllWithShelves();
            setData(result.data)

        } catch (err) {
            console.log(err);
        }
    }

    const handleProductDetailDisplay = (product) => {
        setCurrentProductDetail(product);
        setIsProductDetailModalVisible(true);
    }

    const renderItem = ({item}) => (
        <FallingTiles>


            <View className={"flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>

                <EditButton/>

                <TouchableOpacity onPress={() => handleProductDetailDisplay(item)} hitSlop={{ top: 15, bottom: 15, left: 60, right: 60 }}>
                    <View className={"px-2 py-2 mx-4"}>
                        <Text className={"text-center"}>{item.productName}</Text>
                    </View>
                </TouchableOpacity>


                <DeleteButton onDelete={() => {console.log()}}/>

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
            },[])
    ));

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

            <CustomButton title={"Take new delivery"}  textStyles={"text-white"} containerStyles={"px-2 mb-2 mx-2"} handlePress={() => setIsTakeDeliveryModalVisible(true) }/>

            <Modal
                visible = {isProductDetailModalVisible}
                animationType={Platform.OS !== "ios" ? "" : "slide"}
                presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                onRequestClose={() => setIsProductDetailModalVisible(false)}
            >
                <View className="flex-auto mt-5 bg-background-light">
                    <ProductsMobileDetailDisplayer product={currentProductDetail} setIsModalVisible={setIsProductDetailModalVisible}/>
                </View>

            </Modal>

            <Modal
                visible = {isTakeDeliveryModalVisible}
                animationType={Platform.OS !== "ios" ? "" : "slide"}
                presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                onRequestClose={() => setIsTakeDeliveryModalVisible(false)}
            >
                <ProductMobileTakeDeliveryModal setIsModalVisible={setIsTakeDeliveryModalVisible}/>

            </Modal>
        </SafeAreaView>


    )
}

export default ProductsMobileDisplayer
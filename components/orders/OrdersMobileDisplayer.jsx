import {
    ActivityIndicator,
    Animated, Modal,
    RefreshControl,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    Platform
} from "react-native";
import React, {useCallback, useEffect, useRef, useState} from "react";
import DeleteButton from "../buttons/DeleteButton";
import FallingTiles from "../FallingTiles";
import {useFocusEffect} from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import orderStatusTypeMap from "../../data/Mappers/orderStatusType";
import CustomSelectList from "../selects/CustomSelectList";
import OrderDetailModalDisplayer from "./OrderDetailModalDisplayer";
import crudService from "../../services/dataServices/crudService";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";

const OrdersMobileDisplayer = () => {

    //PROPS====================================================================================================
    const [data, setData] = useState([]);
    const [currentOrderDetail, setCurrentOrderDetail] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [flatListHeight, setFlatListHeight] = useState(0);
    const [selected, setSelected] = useState(undefined);
    const [filteredData, setFilteredData] = useState([]);
    const [selectKey, setSelectKey] = useState(0);
    const [isDeletedItem, setIsDeletedItem] = useState(false);
    const [isOrderDetailModalVisible, setIsOrderDetailModalVisible] = useState(false);


    //FUNCTIONS================================================================================================
    const fetchData = async () => {
        try {
            const result = await crudService.GetAll("OrderHeader");
            const updatedData = result.data.map(order => ({
                ...order,
                statusName: orderStatusTypeMap.find(status => status.key === order.statusName)?.value
            }));
            setData(updatedData);
            const noCancelledOrders = updatedData.filter(order => order.statusName !== "Cancelled")
            setFilteredData(noCancelledOrders);

        } catch (err) {
            CustomAlert("Error fetching data.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (item) => {

        try {
            console.log(item)
            if (item.statusName === "Planned") {
                try {
                    await crudService.Delete(item.ordersHeaderId, "OrderHeader/cancelOrder");
                } catch (err) {
                    console.log(err);
                    CustomAlert("You can't delete this order.")
                }
                setIsDeletedItem(true);
            } else {
                CustomAlert("You can't delete order other than planned.")
            }
        } catch (err) {
            CustomAlert("Error deleting data.");
        }


    };

    const handleOrderDetailDisplay = (id) => {
        crudService.Get(id, "OrderDetail/byOrderHeader")
            .then(result => {
                Promise.all(
                    result.data.map(order =>
                        crudService.Get(order.productsProductId, "Product")
                            .then(product => ({
                                quantity: order.quantity,
                                productName: product.data.productName,
                            }))
                            .catch(err => {
                                CustomAlert("Error fetching data.");
                            })
                    )
                )
                    .then(data => {
                        const tempData = data;
                        setCurrentOrderDetail(tempData)
                        setIsOrderDetailModalVisible(true)
                    })
                    .catch(err => {
                        CustomAlert("Error fetching data.");
                        console.log(err);
                    });
            })
            .catch(err => {
                    CustomAlert("Error fetching data.");
                    console.log(err)
                }
            )
    }


    const renderItem = ({item}) => (
        <FallingTiles>
            <View
                className={"flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>

                <View className={"px-2"}>
                    <Feather name="truck" size={24} color={"black"}/>=
                </View>

                <TouchableOpacity onPress={() => handleOrderDetailDisplay(item.ordersHeaderId)}
                                  hitSlop={{top: 15, bottom: 15, left: 25, right: 25}}>


                    <View className={"px-2 py-2 mx-4"}>
                        <Text className={"text-center"}>{item.destinationAddress}</Text>

                        <Text className={"text-center"}>
                            {new Date(item.orderDate).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                        <Text className={"text-center"}>Status: {item.statusName}</Text>

                    </View>
                </TouchableOpacity>


                <DeleteButton onDelete={() => (handleDelete(item))}/>

            </View>
        </FallingTiles>
    );


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
        setSelectKey(prev => prev + 1)
        setSelected({key: -1, value: "All"});
        setRefreshing(false);
    }, []);

    const scrollY = useRef(new Animated.Value(0)).current;

    const handleScroll = Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollY}}}],
        {useNativeDriver: true}
    );

    const animatedTranslateY = scrollY.interpolate({
        inputRange: [0, flatListHeight],
        outputRange: [60, -flatListHeight + 20],
        extrapolate: 'clamp',
    });


    //USE EFFECT HOOKS=========================================================================================
    useFocusEffect((
        useCallback(
            () => {
                setSelectKey(prev => prev + 1)
                setSelected({key: -1, value: "All"});
                fetchData();
            }, [])
    ));

    useEffect(() => {
        if ((selected === undefined || selected === -1) && selected !== 3) {
            setFilteredData(data.filter(record => record.statusName !== "Cancelled"));
        } else {
            const choice = orderStatusTypeMap.find((status) => status.key === selected)?.value;
            if (choice) {
                setFilteredData(data.filter((order) => order.statusName === choice));
            }
        }
        setLoading(false);
    }, [selected]);

    useEffect(() => {
        fetchData();
        setSelectKey(prev => prev + 1)
        setSelected({key: -1, value: "All"});
        if (isDeletedItem) setIsDeletedItem(false);
    }, [isDeletedItem]);


    return (
        <SafeAreaView className={"flex-1 justify-start align-center"}>

            <Animated.View
                style={{
                    transform: [
                        {
                            translateY: scrollY.interpolate({
                                inputRange: [0, 90],
                                outputRange: [0, -130],
                            }),
                        },
                    ],
                    position: 'absolute',
                    top: 0,
                    left: 5,
                    right: 5,
                    zIndex: 1
                }}
            >
                <CustomSelectList
                    selectKey={selectKey}
                    typeMap={[{key: -1, value: 'All'}, ...orderStatusTypeMap]}
                    defaultOption={{key: -1, value: 'All'}}
                    setSelected={setSelected}
                />

            </Animated.View>

            <Animated.FlatList
                data={filteredData}
                keyExtractor={(item) => item.ordersHeaderId}
                renderItem={renderItem}
                onScroll={handleScroll}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
                onLayout={(e) => {
                    const {height} = e.nativeEvent.layout;
                    setFlatListHeight(height);
                }}
                style={{
                    transform: [{translateY: animatedTranslateY}],
                }}
                ListEmptyComponent={
                    loading ? (
                        <View className={"justify-center align-center"}>
                            <ActivityIndicator size="small" color="#000"/>
                        </View>
                    ) : (
                        filteredData.length === 0 && (
                            <View className={"justify-center align-center"}>
                                <Text className={"text-center font-bold color-red-600 my-5"}>No orders</Text>
                            </View>
                        )
                    )
                }
            />

            {/*<CustomButton title={"Pokaz"} handlePress={() => console.log(currentOrderDetail)}/>*/}

            <Modal
                visible={isOrderDetailModalVisible}
                animationType={Platform.OS !== "ios" ? "" : "slide"}
                presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                onRequestClose={() => setIsOrderDetailModalVisible(false)}
            >
                <OrderDetailModalDisplayer currentOrderDetail={currentOrderDetail}
                                           setIsModalVisible={setIsOrderDetailModalVisible}></OrderDetailModalDisplayer>

            </Modal>

        </SafeAreaView>
    )
}

export default OrdersMobileDisplayer
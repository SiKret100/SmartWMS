import {ActivityIndicator, Platform, Text, View, Modal, Alert} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {router, useFocusEffect} from "expo-router";
import CustomButton from "../buttons/CustomButton";
import taskService from "../../services/dataServices/taskService";
import {ScrollView} from "react-native-gesture-handler";
import {Divider} from "react-native-elements";
import {Feather} from "@expo/vector-icons";
import BarcodeScanner from "../barcode_scanner/BarcodeScanner";
import productService from "../../services/dataServices/productService";

const YourTaskMobileDisplayer = props => {


    //PROPS====================================================================================================
    const [hasUserTask, setHasUserTask] = useState(false);
    const [userTask, setUserTask] = useState(null);
    const [product, setProduct] = useState({productName: null, barcode: null, quantityAll: null});
    const [shelves, setShelves] = useState([]);
    const [quantityCollected, setQuantityCollected] = useState(0);
    const [quantityAllocated, setQuantityAllocated] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isBarcodeModalVisible, setIsBarcodeModalVisible] = useState(false);
    const [scannedBarcode, setIsScannedBarcode] = useState({barcode: null});
    const [userTaskId, setUserTaskId] = useState(null);

    //FUNCTIONS================================================================================================
    const fetchData = async () => {
        try {
            const userTasksResponse = await taskService.UserTasks();

            if (userTasksResponse === "User has no tasks") {
                setHasUserTask(false);
            } else {
                setHasUserTask(true);
                const taskId = (userTasksResponse.data)[0].taskId;
                setUserTaskId(taskId);
                const taskOrderInfoResponse = await taskService.TaskOrderInfo(taskId);
                setProduct({
                    productName: taskOrderInfoResponse.data.productName,
                    barcode: taskOrderInfoResponse.data.barcode,
                    quantityAll: taskOrderInfoResponse.data.quantityAll
                });
                // console.log("TaskOrderInfo: " + JSON.stringify(taskOrderInfoResponse.data));
                setShelves(taskOrderInfoResponse.data.shelves);
                const getTaskResponse = await taskService.Get(taskId);

                setQuantityCollected(getTaskResponse.data.quantityCollected);
                setQuantityAllocated(getTaskResponse.data.quantityAllocated);

            }
        } catch (err) {
            console.log("Err from func: " + JSON.stringify(err));
        }
    }

    //USE EFFECT HOOKS=========================================================================================
    useFocusEffect(
        useCallback(async () => {
            await fetchData()
                .then(_ => setLoading(false))
                .catch(err => console.log(err));
        }, [])
    );

    useEffect(() => {
        if (product.barcode !== null && scannedBarcode.barcode !== null)
            handleBarcodeScanned();
    }, [scannedBarcode]);

    const handleBarcodeScanned = async () => {
        if (scannedBarcode.barcode === product.barcode) {
            const response = await productService.GetByBarcode(scannedBarcode.barcode);
            if (response === "Product with specified barcode hasn't been found") {
                Alert.alert('Warning', 'Wrong product', [
                    {
                        text: 'Ok',
                        onPress: () => {},
                        style: 'destructive',
                    },
                ]);
            } else {
                console.log("Endpoint!");

                setQuantityCollected((prev) => {
                    const updatedValue = prev + 1;
                    const remaining = quantityAllocated - updatedValue;

                    if (remaining === 0) {
                        fetchData();
                        router.push("/home/tasks")
                        Alert.alert('Completed', 'Task is done, take another one!', [
                            { text: 'Ok', onPress: () => {}, style: 'destructive' },
                        ]);
                    }
                    return updatedValue;
                });

                const taskResponse = await taskService.TaskUpdateQuantity(userTaskId);
                console.log("Task response: " + JSON.stringify(taskResponse));
            }
        } else {
            Alert.alert('Warning', 'Wrong product', [
                {
                    text: 'Ok',
                    onPress: () => {},
                    style: 'destructive',
                },
            ]);
        }
    };



    return (
        loading ? (
            <View className={"flex-1 justify-center items-center"}>
                <ActivityIndicator size="large" color="#000"/>
            </View>
        ) : (
            <ScrollView className={"px-2"}>
                {hasUserTask ? (
                    <View>
                        <View className={"mb-5 mx-2 px-2 flex-col bg-slate-200 p-2 rounded-lg shadow mt-2"}>

                            <View className={"flex-row justify-between"}>
                                <Text className={"text-2xl font-bold text-gray-800"}>Product:</Text>
                                <Text
                                    className={"text-2xl ml-5 mr-10"}>{product.productName ? product.productName.toUpperCase() : ""}</Text>
                            </View>

                            <View className={"flex-row justify-between"}>
                                <Text className={"text-2xl font-bold text-gray-800"}>Barcode:</Text>
                                <Text className={"text-2xl ml-5 mr-10"}>{product.barcode}</Text>
                            </View>

                        </View>

                        <View className={"flex-row justify-between"}>
                            <Text className={"text-2xl font-bold text-gray-800"}>Pieces remained:</Text>
                            <Text className={"text-2xl ml-5 mr-10"}>{quantityAllocated - quantityCollected}</Text>
                        </View>

                        <Divider width={5} className={"mb-5 color-gray-800 rounded"}/>
                        {shelves.map(shelf => (
                            <View key={shelf.id} className={"px-2 shadow mb-5"}>

                                <View className={"flex-row bg-slate-200 p-2 rounded-lg justify-between items-center "}>

                                    <View className={"flex-row items-center"}>
                                        <Feather color="#3E86D8" className={"mr-2"} name={"box"} size={24}/>

                                        <View className="flex-2 flex-col">
                                            <Text className={"font-bold text-2xl text-gray-800"}>Lane:</Text>
                                            <Text className={"font-bold text-2xl text-gray-800"}>Rack:</Text>
                                            <Text className={"font-bold text-2xl text-gray-800"}>Level:</Text>
                                            <Text className={"font-bold text-2xl text-gray-800"}>Quantity to
                                                collect:</Text>

                                        </View>
                                    </View>


                                    <View className={"flex-col mr-10"}>
                                        <Text
                                            className={" text-2xl text-gray-800"}>{shelf.rackLane.lane.laneCode}</Text>
                                        <Text className={"text-2xl text-gray-800"}>{shelf.rackLane.rackNumber}</Text>
                                        <Text className={"text-2xl text-gray-800"}>{shelf.level}</Text>
                                        <Text className={" text-2xl text-gray-800"}>{shelf.currentQuant}</Text>
                                    </View>

                                </View>

                            </View>
                        ))}
                        <CustomButton textStyles={"text-white"} title={`Scan`}
                                      handlePress={() => setIsBarcodeModalVisible(true)} iconName={"maximize"}/>

                    </View>
                ) : (
                    <Text className={"text-2xl font-bold"}>You have no task assigned</Text>
                )}


                <Modal visible={isBarcodeModalVisible}
                       animationType={Platform.OS !== "ios" ? "" : "slide"}
                       presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                       onRequestClose={() => setIsBarcodeModalVisible(false)}>
                    <BarcodeScanner form={scannedBarcode} setForm={setIsScannedBarcode}
                                    setIsModalVisible={setIsBarcodeModalVisible}/>
                </Modal>


            </ScrollView>
        )
    );
}

export default YourTaskMobileDisplayer;

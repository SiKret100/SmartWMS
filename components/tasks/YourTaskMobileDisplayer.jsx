import {ActivityIndicator, Platform, Text, View, Modal, Alert} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {router, useFocusEffect} from "expo-router";
import CustomButton from "../buttons/CustomButton";
import taskService from "../../services/dataServices/taskService";
import {ScrollView} from "react-native-gesture-handler";
import {Feather} from "@expo/vector-icons";
import BarcodeScanner from "../barcode_scanner/BarcodeScanner";
import productService from "../../services/dataServices/productService";
import * as Progress from "react-native-progress";

const YourTaskMobileDisplayer = props => {

    //PROPS====================================================================================================
    const [hasUserTask, setHasUserTask] = useState(false);
    const [product, setProduct] = useState({productName: null, barcode: null, quantityAll: null});
    const [shelves, setShelves] = useState([]);
    const [quantityCollected, setQuantityCollected] = useState(0);
    const [quantityAllocated, setQuantityAllocated] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isBarcodeModalVisible, setIsBarcodeModalVisible] = useState(false);
    const [scannedBarcode, setIsScannedBarcode] = useState({barcode: null});
    const [userTaskId, setUserTaskId] = useState(null);
    const progress = quantityAllocated > 0 ? quantityCollected / quantityAllocated : 0;


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
                        onPress: () => {
                        },
                        style: 'destructive',
                    },
                ]);
            } else {

                setQuantityCollected((prev) => {
                    const updatedValue = prev + 1;
                    const remaining = quantityAllocated - updatedValue;

                    if (remaining === 0) {
                        fetchData();
                        router.push("/home/tasks")
                        Alert.alert('Completed', 'Task is done, take another one!', [
                            {
                                text: 'Ok', onPress: () => {
                                }, style: 'destructive'
                            },
                        ]);
                    }
                    return updatedValue;
                });

                await taskService.TaskUpdateQuantity(userTaskId);
            }
        } else {
            Alert.alert('Warning', 'Wrong product', [
                {
                    text: 'Ok',
                    onPress: () => {
                    },
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
            <ScrollView className={"px-4"}>
                {hasUserTask ? (
                    <View>

                        <View className={"flex-row mt-2 gap-5"}>

                            <View className={" flex-auto px-2 flex-col bg-slate-200 rounded-lg shadow "}>

                                <View className={"flex-col justify-between py-1 ml-3 mt-3"}>
                                    <Text className={"text-2xl font-bold text-gray-800 text-smartwms-blue"}>Product</Text>
                                    <Text
                                        className={"text-xl color-gray-500"}>{product.productName ? product.productName.toUpperCase() : ""}</Text>
                                </View>

                                <View className={"flex-col justify-between ml-3 mt-3"}>
                                    <Text className={"text-2xl font-bold text-gray-800 text-smartwms-blue"}>Barcode</Text>
                                    <Text className={"text-xl color-gray-500"}>{product.barcode}</Text>
                                </View>

                            </View>

                            <View className="flex-auto flex-col bg-slate-200 p-2 rounded-lg shadow items-center justify-center">

                                <Text className="text-center font-bold color-gray-500">
                                    Collected
                                </Text>

                                <Text className="text-2xl text-center font-bold text-smartwms-blue">
                                    {quantityCollected}/{quantityAllocated}
                                </Text>

                                <Progress.Circle
                                    className={"px-2 shadow py-2"}
                                    size={80}
                                    progress={progress}
                                    thickness={19}
                                    color="#FFB50C"
                                    unfilledColor="#d9dbdf"
                                    borderWidth={5}
                                    borderColor={"#475f9c"}
                                />
                            </View>

                        </View>


                        {shelves.map(shelf => (
                            <View key={shelf.id} className={"shadow mt-5"}>

                                <View className={"flex-col bg-slate-200 rounded-lg p-4 gap-5"}>



                                    <View className={"flex-row bg-blue-200  items-center rounded-lg w-fit"}>

                                        <View className="flex-row bg-smartwms-blue rounded-lg justify-center items-center p-2">
                                            <Feather color="#ffffff"  name={"box"} size={40}/>
                                        </View>

                                        <View className={"flex-col mx-2"}>
                                            <Text className={"text-smartwms-blue text-2xl font-bold"}>To collect</Text>
                                            <Text className={"text-xl color-gray-500"}>{shelf.currentQuant}</Text>
                                        </View>

                                    </View>


                                    <View className={"flex-row gap-5 my-2"}>
                                        <View className={"flex-row"}>
                                            <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"} />
                                            <View className={"flex-col"}>
                                                <Text className={"text-smartwms-blue text-xl font-bold"}>Lane</Text>
                                                <Text className={" color-gray-500"}>{shelf.rackLane.lane.laneCode}</Text>
                                            </View>
                                        </View>

                                        <View className={"flex-row"}>
                                            <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"} />
                                            <View className={"flex-col"}>
                                                <Text className={"text-smartwms-blue text-xl font-bold"}>Rack</Text>
                                                <Text className={" color-gray-500"}>{shelf.rackLane.rackNumber}</Text>
                                            </View>
                                        </View>

                                        <View className={"flex-row"}>
                                            <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"} />
                                            <View className={"flex-col"}>
                                                <Text className={"text-smartwms-blue text-xl font-bold"}>Level</Text>
                                                <Text className={"color-gray-500"}>{shelf.level}</Text>
                                            </View>
                                        </View>

                                    </View>

                                </View>

                            </View>
                        ))}
                        <CustomButton containerStyles={"shadow mt-5"} textStyles={"text-white"} title={`Scan`}
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

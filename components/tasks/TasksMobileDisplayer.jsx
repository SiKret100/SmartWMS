import React, {useCallback, useContext, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    Text,
    View
} from "react-native";
import taskService from "../../services/dataServices/taskService";
import {router, useFocusEffect} from "expo-router";
import FallingTiles from "../FallingTiles";

import {Button} from "react-native-elements";
import {Feather} from "@expo/vector-icons";
import orderDetailService from "../../services/dataServices/orderDetailService";
import productService from "../../services/dataServices/productService";
import {UserDataContext} from "../../app/home/_layout";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";

const TasksMobileDisplayer = () => {
    //PROPS====================================================================================================
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const userData = useContext(UserDataContext);

    //FUNCTIONS================================================================================================
    const fetchData = () => {

        taskService.GetAll()
            .then(result => {
                setLoading(false);
                const filteredTasks = result.data.filter(item => item.taken === false);


                return Promise.all(
                    filteredTasks.map(task =>
                        orderDetailService.Get(task.orderDetailsOrderDetailId)
                            .then(orderDetail => {

                                    return productService.Get(orderDetail.data.productsProductId)
                                        .then(result => {
                                                return {
                                                    ...task,
                                                    productName: result.data.productName
                                                }
                                            }
                                        )
                                }
                            )
                            .catch(err => {
                                setLoading(false);
                                return {...task, products: []};
                            })
                    )
                );
            })
            .then(enrichedTasks => {
                setData(enrichedTasks);
            })
            .catch(err => {
                setLoading(false);
            });
    };

    const checkIfUserHasTask = async (taskId) => {
        try {
            const response = await taskService.UserTasks()
            if (response === "User has no tasks") {
                const response = await taskService.TakeTask(taskId);
                router.push("./yourTask", {relativeToDirectory: true});

            } else {
                CustomAlert("You already have task taken.")
            }
        } catch (err) {
        }
    }

    const renderItem = ({item}) => (
        <FallingTiles>


            <View
                className={"flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>

                <Feather className={"pl-2"} name="clipboard" size={24} color="#3E86D8"/>


                <View className="px-2 py-2 mx-4  rounded  ">

                    <View className={"flex-row justify-center align-items-center align-middle"}>
                        <Text className={"text-center font-bold"}>Product: </Text>
                        <Text className={"text-center"}>{item.productName}</Text>

                    </View>

                    <View className={"flex-row justify-center align-items-center align-middle"}>
                        <Text className={"text-center font-bold"}>Quantity: </Text>
                        <Text className={"text-center"}>{item.quantityAllocated}</Text>

                    </View>


                    <View className={"flex-row justify-center align-items-center align-middle"}>
                        <Text className={"text-center font-bold"}>Priority: </Text>

                        <Text
                            className={`text-center ${item.priority === 5 ? "text-red-500" : (item.priority >= 2 && item.priority <= 4) ? "text-yellow-600" : "text-green-500"}`}>{item.priority}</Text>

                    </View>

                </View>


                <Button onPress={() => userData.role !== "Employee" ? CustomAlert("Admin nor Manager can't take task.") : checkIfUserHasTask(item.taskId)} type='clear' icon={
                    <Feather name="plus-circle" size={24} color="#32a856"/>
                }
                />


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

    return (
        <SafeAreaView className={"flex-1 justify-start align-center"}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.taskId.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
                ListEmptyComponent={
                    loading ? (
                        <View className={"justify-center align-center"}>
                            <ActivityIndicator size="small" color="#000"/>
                        </View>
                    ) : (
                        <View className={"justify-center align-center"}>
                            <Text className={"text-center my-5 text-red-600 font-bold"}>No tasks</Text>
                        </View>
                    )
                }

            />
        </SafeAreaView>
    )
}

export default TasksMobileDisplayer
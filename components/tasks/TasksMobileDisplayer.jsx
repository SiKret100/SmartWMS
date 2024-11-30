import React, {useCallback, useState} from "react";
import {
    Platform,
    ActivityIndicator,
    FlatList,
    Modal,
    RefreshControl,
    SafeAreaView,
    Text,
    View,
    TouchableOpacity
} from "react-native";

import taskService from "../../services/dataServices/taskService";
import CustomButton from "../buttons/CustomButton";
import {useFocusEffect} from "expo-router";
import FallingTiles from "../FallingTiles";
import EditButton from "../buttons/EditButton";
import DeleteButton from "../buttons/DeleteButton";
import {Button} from "react-native-elements";
import {Feather} from "@expo/vector-icons";
import orderDetailService from "../../services/dataServices/orderDetailService";
import productService from "../../services/dataServices/productService";

const TasksMobileDisplayer = () => {
    //PROPS====================================================================================================
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);


    //FUNCTIONS================================================================================================
    const fetchData = () => {

        taskService.GetAll()
            .then(result => {
                const filteredTasks = result.data.filter(item => item.taken === false);

                console.log("Filtered task: " + JSON.stringify(filteredTasks));

                return Promise.all(
                    filteredTasks.map(task =>
                        orderDetailService.Get(task.orderDetailsOrderDetailId)
                            .then(orderDetail => {
                                console.log("Order detail: " + JSON.stringify(orderDetail.data));

                                return productService.Get(orderDetail.data.productsProductId)
                                    .then(result => {
                                        console.log("Product: " + JSON.stringify(result.data));
                                        return {
                                            ...task,
                                            productName: result.data.productName
                                        }
                                        }
                                    )
                                }
                            )
                            .catch(err => {
                                console.error(`Błąd pobierania szczegółów zamówienia: ${err}`);
                                return {...task, products: []};
                            })
                    )
                );
            })
            .then(enrichedTasks => {
                console.log("Endriched tasks: " + JSON.stringify(enrichedTasks));
                setData(enrichedTasks);
            })
            .catch(err => {
                console.error(`Błąd w procesie fetchData: ${err}`);
            });
    };

    const checkIfUserHasTask = async (taskId) => {
        console.log("Checking if user");
        try{
            const response = await taskService.UserTasks()
            if (response === "User has no tasks"){
                console.log("USER HAS NO TASKS but its being taken")

                const response = await taskService.TakeTask(taskId);
                // console.log("Response from func " + response)
                router.push("./yourTask",  { relativeToDirectory: true });

            }else{
                console.log("USER HAS TASK")
            }
        }catch(err){
            console.log("Err from func: " + JSON.stringify(err));
        }
    }

    const renderItem = ({item}) => (
        <FallingTiles>


            <View
                className={"flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>


                <Feather className={"pl-2"} name="clipboard" size={24} color="#3E86D8"/>

                {/*<Button onPress={() => console.log("Dodaj ")} type='clear' icon={*/}
                {/*    <Feather name="plus-circle" size={24} color="#32a856"/>*/}
                {/*}*/}
                {/*/>*/}

                <TouchableOpacity onPress={() => console.log("TouchableOpacity")}
                                  hitSlop={{top: 15, bottom: 15, left: 25, right: 25}}>

                    <View className="px-2 py-2 mx-4  rounded  " >

                        <View className={"flex-row justify-center align-items-center align-middle"} >
                            <Text className={"text-center font-bold"}>Product: </Text>
                            <Text className={"text-center"}>{item.productName}</Text>

                        </View>

                        <View className={"flex-row justify-center align-items-center align-middle"}>
                            <Text className={"text-center font-bold"}>Quantity: </Text>
                            <Text className={"text-center"}>{item.quantityAllocated}</Text>

                        </View>


                        <View className={"flex-row justify-center align-items-center align-middle"}>
                            <Text className={"text-center font-bold"}>Priority: </Text>

                            <Text className={`text-center ${ item.priority === 5 ? "text-red-500" : (item.priority >= 2 && item.priority <= 4) ? "text-yellow-600" : "text-green-500" }`}>{item.priority}</Text>

                        </View>

                    </View>

                </TouchableOpacity>

                <Button onPress={() => checkIfUserHasTask(item.taskId)} type='clear' icon={
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
        </SafeAreaView>
    )
}

export default TasksMobileDisplayer
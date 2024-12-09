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
import {Feather} from "@expo/vector-icons";
import {UserDataContext} from "../../app/home/_layout";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";
import CustomEditButtonFlatList from "../buttons/CustomEditButtonFlatList";
import crudService from "../../services/dataServices/crudService";

const TasksMobileDisplayer = () => {

    //PROPS====================================================================================================
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const userData = useContext(UserDataContext);

    //FUNCTIONS================================================================================================
    const fetchData = () => {

        crudService.GetAll("Task")
            .then(result => {
                setLoading(false);
                const filteredTasks = result.data.filter(item => item.taken === false);

                return Promise.all(
                    filteredTasks.map(task =>
                        crudService.Get(task.orderDetailsOrderDetailId, "OrderDetail")
                            .then(orderDetail => {

                                return crudService.Get(orderDetail.data.productsProductId, "Product")
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
                                CustomAlert("Error fetching data.");
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

                await taskService.TakeTask(taskId);

                router.push("./yourTask", {relativeToDirectory: true});

            } else {
                CustomAlert("You already have task taken.")
            }
        } catch (err) {
        }
    }

    const renderItem = ({item}) => (

        <FallingTiles>

            <View className={"flex-col justify-start bg-slate-200 pt-2 rounded-lg mt-5 mx-4 shadow"}>

                <View className={"flex-row bg-blue-200  items-center mx-2 rounded-lg w-fit"}>

                    <View className="flex-row bg-smartwms-blue rounded-lg justify-center items-center p-2">
                        <Feather color="#ffffff" className={""} name={"list"} size={45}/>
                    </View>

                    <View className={"flex-col mx-2"}>
                        <Text className={"text-smartwms-blue text-2xl font-bold"}>{item.productName}</Text>
                        <Text className={"text-xl color-gray-500"}>{item.taken ? "Task taken" : "Ready to be taken"}</Text>
                    </View>

                </View>

                <View className={"flex-row gap-4 my-2 p-2"}>
                    <View className={"flex-row"}>
                        <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"} />
                        <View className={"flex-col"}>
                            <Text className={"text-smartwms-blue text-xl font-bold"}>Quantity</Text>
                            <Text className={" color-gray-500"}>{item.quantityAllocated}</Text>
                        </View>
                    </View>

                    <View className={"flex-row"}>
                        <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"} />
                        <View className={"flex-col"}>
                            <Text className={"text-smartwms-blue text-xl font-bold"}>Priority</Text>
                            <Text className={" color-gray-500"}>{item.priority}</Text>
                        </View>
                    </View>

                </View>

                <View className="mt-2 flex-row  justify-center items-cente">

                    <CustomEditButtonFlatList onEdit={() => userData.role !== "Employee" ? CustomAlert("Admin nor Manager can't take task.") : checkIfUserHasTask(item.taskId) } icon={"plus-circle"} title={"Take" } containerStyles={"flex-1 bg-green-500 rounded-b-lg"} textStyles={"text-white"}></CustomEditButtonFlatList>

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
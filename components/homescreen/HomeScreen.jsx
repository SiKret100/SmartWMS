import React, {useEffect, useState, useContext} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from 'react-native'

import {ScrollView} from "react-native-gesture-handler";
import {UserDataContext} from "../../app/home/_layout";
import {Feather} from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import {router} from "expo-router";
import CustomButton from "../buttons/CustomButton";
import taskService from "../../services/dataServices/taskService";
import FallingTiles from "../FallingTiles";
import CustomEditButtonFlatList from "../buttons/CustomEditButtonFlatList";


const HomeScreen = () => {

    //PROPS====================================================================================================
    const userData = useContext(UserDataContext);
    const [hasUserTask, setHasUserTask] = useState(false);
    const [quantityCollected, setQuantityCollected] = useState(0);
    const [quantityAllocated, setQuantityAllocated] = useState(0);
    const [loading, setLoading] = useState(true);
    const progress = quantityAllocated > 0 ? quantityCollected / quantityAllocated : 0;

    const views = [
        {
            id: 0,
            name : "Alerts",
            route : "/home/alerts",
            icon: "bell"
        },
        {
            id : 1,
            name : "Products",
            route: "/home/products",
            icon: "package"
        },
        {
            id: 2,
            name : "Tasks",
            route: "/home/tasks",
            icon: "list"
        },
        {
            id: 3,
            name : "Waybils",
            route: "/home/waybills",
            icon: "file-text"
        }
    ]


    //FUNCTIONS================================================================================================
    const fetchData = async () => {
        try {
            const userTasksResponse = await taskService.UserTasks();

            if (userTasksResponse === "User has no tasks") {
                setHasUserTask(false);
            } else {
                setHasUserTask(true);
                setQuantityCollected((userTasksResponse.data)[0].quantityCollected);
                setQuantityAllocated((userTasksResponse.data)[0].quantityAllocated);
            }
        } catch (err) {
            console.log("Err from func: " + JSON.stringify(err));
        }
    }

    const renderItem = ({item}) => (

        <FallingTiles>


            <View className={"flex-col justify-start bg-slate-200 rounded-lg mt-5 shadow"}>


                <TouchableOpacity onPress={() => router.push(item.route)}>
                    <View className={"flex-row bg-blue-200  items-center rounded-lg w-fit m-2"}>

                        <View className="flex-row bg-smartwms-blue rounded-lg justify-center items-center p-2">
                            <Feather color="#ffffff" className={""} name={item.icon} size={35}/>
                        </View>

                        <View className={"flex-col mx-2"}>
                            <Text className={"text-smartwms-blue text-2xl font-bold"}>{item.name}</Text>

                        </View>


                    </View>
                </TouchableOpacity>



            </View>


        </FallingTiles>
    );

    //USE EFFECT HOOKS=========================================================================================
    useEffect(async () => {
        await fetchData()
            .then(_ => setLoading(false))
            .catch(err => console.log(err));
    }, []);


    return (
        <SafeAreaView className={"justify-start align-center"}>
            <View className={"mx-4"}>

                <View className={"flex-row mt-2 gap-5"}>

                    <View className={"flex-auto p-2 flex-col bg-slate-200 rounded-lg shadow"}>

                        <View className={"flex-col justify-between"}>

                            <View className={"flex-row bg-blue-200  items-center rounded-lg w-fit"}>
                                <View className="flex-row bg-smartwms-blue rounded-lg justify-center items-center p-2">
                                    <Feather color="#ffffff" name={"user"} size={30}/>
                                </View>

                                <View className={"flex-col mx-2"}>
                                    <Text className={"text-smartwms-blue text-xl font-bold"}>Profile</Text>
                                    <Text className={"text-xl color-gray-500"}>{userData.userName}</Text>
                                </View>
                            </View>

                            <View className={"flex-col gap-5 my-2"}>
                                <View className={"flex-row"}>
                                    <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"}/>
                                    <View className={"flex-col"}>
                                        <Text className={"text-smartwms-blue text-xl font-bold"}>Role</Text>
                                        <Text className={" color-gray-500"}>{userData.role}</Text>
                                    </View>
                                </View>

                                <View className={"flex-row"}>
                                    <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"}/>
                                    <View className={"flex-col"}>
                                        <Text className={"text-smartwms-blue text-xl font-bold"}>Email</Text>
                                        <Text className={" color-gray-500"}>{userData.email}</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </View>

                    {
                        userData.role === "Employee" &&
                        (
                            <View className="flex-auto flex-col bg-slate-200 p-2 rounded-lg shadow items-center justify-center">

                                <TouchableOpacity className={"flex-col items-center justify-center"} onPress={() => {
                                    hasUserTask ? router.push('/home/tasks/yourTask') : router.push('/home/tasks/')
                                }}>
                                    <Text className="text-center font-bold color-gray-500">
                                        {hasUserTask ? "Your task" : "You have no task"}
                                    </Text>

                                    <Text className="text-2xl text-center font-bold text-smartwms-blue">
                                        {quantityCollected}/{quantityAllocated}
                                    </Text>

                                    <Progress.Circle
                                        className={"px-2 shadow py-2"}
                                        size={90}
                                        progress={progress}
                                        thickness={19}
                                        color="#FFB50C"
                                        unfilledColor="#d9dbdf"
                                        borderWidth={5}
                                        borderColor={"#475f9c"}
                                    />
                                </TouchableOpacity>

                            </View>
                        )
                    }


                </View>


                <FlatList
                    data={views}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    className={"h-full px-2"}
                />



            </View>

        </SafeAreaView>

    )
}

export default HomeScreen;
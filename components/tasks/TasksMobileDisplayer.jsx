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

const TasksMobileDisplayer = () => {
    //PROPS====================================================================================================
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);


    //FUNCTIONS================================================================================================
    const fetchData = async () => {
        try{
            const result = await taskService.GetAll();
            const filteredResult = result.data.filter(item => item.taken === false);
            setData(filteredResult);
        }
        catch(err){
            console.log(err);
        }
    }

    const renderItem = ({item}) => (
        <FallingTiles>


            <View
                className={"flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>


                <Feather name="clipboard" size={24} color="#3E86D8" />

                <TouchableOpacity onPress={() => console.log("TouchableOpacity")}
                                  hitSlop={{top: 15, bottom: 15, left: 25, right: 25}}>
                    <View className={"px-2 py-2 mx-4"}>
                        <Text className={"text-center"}>{item.quantityAllocated}</Text>
                    </View>
                </TouchableOpacity>

                <Button onPress={() => console.log("Dodaj ")} type='clear' icon={
                    <Feather name="plus-circle" size={24} color="#32a856" />
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
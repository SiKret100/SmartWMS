import {Text, View, ActivityIndicator, FlatList } from "react-native";
import {useState, useEffect, useCallback } from "react";
import CustomSelectList from "../selects/CustomSelectList";
import userService from "../../services/dataServices/userService";
import FallingTiles from "../FallingTiles";
import { RefreshControl } from "react-native-gesture-handler";
import { useFocusEffect } from "expo-router";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";


const UserMobileManagers = () => {

    //PROPS====================================================================================================
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [managers, setManagers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selected, setSelected] = useState("")
    const [err, setError] = useState("");
    const [defaultOption, setDefaultOption] = useState({ key: "", value: "Select manager..." });
    const [refreshing, setRefreshing] = useState(false);


    //FUNCTIONS================================================================================================
    const fetchData = async () => {
        try {
            setLoading(false);
            const response = await userService.GetAll();
            setData(response.data.reverse());
            const managersOnly = response.data.filter(user => user.role === "Manager");
            setManagers(managersOnly.map(manager => { return { key: manager.id, value: manager.userName } }))
            setLoading(true);
        } catch (err) {
            CustomAlert("Error fetching data.");
            setError(err);
        }
    };

    const handleSelect = () => {
        setFilteredData(data.filter(employee => employee.managerId === selected));
    }

    const renderItem = ({ item }) => (
        <FallingTiles>

            <View className={"flex-row justify-center items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>
                <View className={"px-2 py-2 mx-4"}>
                    <View>
                        <Text className={"text-center"}>{item.email}</Text>
                        <Text className={"text-center"}>{item.userName}</Text>
                        <Text className={"text-center"}>{item.role}</Text>
                    </View>
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
    useEffect(() => {
        setManagers([]);
        fetchData();
    }, []);

    useEffect(() => {
        handleSelect();
    }, [selected])

    useFocusEffect(
        useCallback(() => {
            setData([]);
            setSelected("");
            fetchData();
        }, [])
    );


    return (
        <View>

            <View className={"mx-2 mt-2 mb-10"}>
                <CustomSelectList
                    setSelected={(value) => {
                        setSelected(value)
                    }}
                    typeMap={managers}
                    defaultOption={defaultOption}
                />
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View className={"justify-center align-center"}>
                            <ActivityIndicator size="small" color="#000" />
                        </View>
                    ) : (
                        <View className={"justify-center align-center"}>
                            <Text className={"text-center my-5"}>No users</Text>
                        </View>
                    )
                }
            />
        </View>
    )
}

export default UserMobileManagers


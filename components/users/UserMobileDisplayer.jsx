import {SafeAreaView, Text, View, ActivityIndicator, FlatList} from "react-native";
import {useState, useEffect, useCallback} from "react";
import {useFocusEffect} from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import userService from "services/dataServices/userService.js";
import userTypeMap from "data/Mappers/userType.js";
import {RefreshControl} from "react-native-gesture-handler";
import FallingTiles from "../FallingTiles";
import DeleteButton from "../buttons/DeleteButton";
import Feather from "react-native-vector-icons/Feather";
import CustomSelectList from "../selects/CustomSelectList";
import crudService from "../../services/dataServices/crudService";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";

const UserMobileDisplayer = () => {

    //PROPS====================================================================================================
    const [selected, setSelected] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [defaultOption, setDefaultOption] = useState({key: -1, value: 'All'});
    const [refreshing, setRefreshing] = useState(false);
    const [err, setError] = useState("");
    const [isDeletedItem, setIsDeletedItem] = useState(false);
    const [selectKey, setSelectKey] = useState(0);

    //FUNCTIONS================================================================================================
    const fetchData = () => {
        setLoading(false);
        userService.GetAll()
            .then(response => {
                setData(response.data.reverse());
                setLoading(true);
            })
            .catch(err => {
                CustomAlert("Error fetching data.");
                setError(err);
            });
    };

    const renderItem = ({item}) => (
        <FallingTiles>
            {item.role === "Admin" ? null : (
                <View
                    className={"flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>
                    <Feather name="user" size={24} color={"black"}/>
                    <View className={"px-2 py-2 mx-4"}>
                        <View>
                            <Text className={"text-center"}>{item.email}</Text>
                            <Text className={"text-center"}>{item.userName}</Text>
                            <Text className={"text-center"}>{item.role}</Text>
                        </View>
                    </View>
                    <DeleteButton onDelete={() => handleDelete(item.id)}/>
                </View>
            )}
        </FallingTiles>
    );


    const getRole = (selected) => {
        const roleObject = userTypeMap.find(item => item.key === selected);
        return roleObject ? roleObject.value : "Unknown role";
    }

    const handleDelete = async (id) => {

        try {
            await crudService.Delete(id, "User/delete")
        } catch (err) {
            console.log(err);
            CustomAlert("You cant delete this user.")
        }
        setIsDeletedItem(true);
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    }, []);


    //USE EFFECT HOOKS=========================================================================================
    useEffect(() => {
        fetchData();
        if (isDeletedItem){
            setIsDeletedItem(false);
            setSelectKey(prev => prev + 1);
        }


    }, [isDeletedItem]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
            setSelectKey(prev => prev + 1);

        }, [isModalVisible])
    );

    useEffect(() => {
        const parsedSelected = parseInt(selected);
        setSelected(parsedSelected);

        if (selected !== -1)
            setFilteredData(data.filter(record => record.role === getRole(selected)));

        else
            setFilteredData(data);

    }, [data, selected]);


    return (
        <SafeAreaView className={"flex-1 justify-start align-center"}>

            <View className={"mx-2 mt-2 mb-10"}>

                <CustomSelectList
                    selectKey={selectKey}
                    setSelected={val => setSelected(val)}
                    typeMap={[{key: -1, value: 'All'}, ...userTypeMap]}
                    defaultOption={defaultOption}
                />

            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
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
                            <Text className={"text-center my-5"}>No users</Text>
                        </View>
                    )
                }
            />

        </SafeAreaView>
    );
};


export default UserMobileDisplayer;

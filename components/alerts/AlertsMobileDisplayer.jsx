import {SafeAreaView, Text, View, Modal, Platform, ActivityIndicator, FlatList, Animated, Alert} from "react-native";
import React, {useRef, useState, useEffect, useCallback, createContext, useContext} from "react";
import alertService from "../../services/dataServices/alertService";
import Feather from "react-native-vector-icons/Feather";
import {Button} from "react-native-elements";
import DeleteButton from "../buttons/DeleteButton";
import EditButton from "../buttons/EditButton";
import {RefreshControl} from "react-native-gesture-handler";
import {useFocusEffect} from "expo-router";
import alertTypeMap from "../../data/Mappers/alertType";
import AlertMobileForm from "components/alerts/AlertMobileForm.jsx";
import {SelectList} from 'react-native-dropdown-select-list';
import moment from 'moment-timezone';
import FallingTiles from "../FallingTiles";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import CustomSelectList from "../selects/CustomSelectList";
import CustomButton from "../buttons/CustomButton";
import {UserDataContext} from "../../app/home/_layout";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";
import CustomEditButtonFlatList from "../buttons/CustomEditButtonFlatList";

const AlertMobileDisplayer = () => {

    //PROPS====================================================================================================
    const userData = useContext(UserDataContext);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [err, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDeletedItem, setIsDeletedItem] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [selected, setSelected] = useState(undefined);
    const [defaultOption, setDefaultOption] = useState();
    const [flatListHeight, setFlatListHeight] = useState(0);

    const scrollY = useRef(new Animated.Value(0)).current;

    const handleScroll = Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollY}}}],
        {useNativeDriver: true}
    );


    //FUNCTIONS================================================================================================
    const renderItem = ({item}) => (

        <FallingTiles>


            <View className={"flex-col justify-start bg-slate-200 pt-2 rounded-lg mt-5 mx-4 shadow"}>




                <View className={"flex-row bg-blue-200  items-center mx-2 rounded-lg w-fit"}>

                    <View className="flex-row bg-smartwms-blue rounded-lg justify-center items-center p-2">
                        <Feather color="#ffffff" className={""} name={"bell"} size={45}/>
                    </View>

                    <View className={"flex-col mx-2"}>
                        <Text className={"text-smartwms-blue text-2xl font-bold"}>{item.title}</Text>
                        <Text className={"text-xl color-gray-500"}>{moment(item.alertDate).format("DD MMMM YYYY")}</Text>
                    </View>

                </View>



                <View className={"flex-row gap-4 my-2 p-2"}>
                    <View className={"flex-row"}>
                        <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"} />
                        <View className={"flex-col"}>
                            <Text className={"text-smartwms-blue text-xl font-bold"}>Type</Text>
                            <Text className={" color-gray-500"}> {alertTypeMap.find(alert => alert.key === item.alertType).value} </Text>
                        </View>
                    </View>

                    <View className={"flex-row"}>
                        <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"} />

                        <View className="flex-col w-44">
                            <Text className="text-smartwms-blue text-xl font-bold">Description</Text>
                            <Text className="color-gray-500 flex-wrap">{item.description}</Text>
                        </View>
                    </View>


                </View>


                <View className="mt-2 flex-row  justify-center items-cente">

                    <CustomEditButtonFlatList onEdit={() =>  userData.role === "Employee" ? CustomAlert("You can't edit alert.") : handleModalEdit(item) } icon={"edit"} title={"Edit" } containerStyles={"flex-1 bg-smartwms-orange rounded-b-lg"} textStyles={"text-white"}></CustomEditButtonFlatList>

                </View>

            </View>


        </FallingTiles>

    );

    const fetchData = async () => {
        setLoading(false);
        await alertService.GetAll()
            .then(response => {
                setData(response.data);
                loadSelected();
                if (selected !== null) {
                    const parsedSelected = parseInt(selected);
                    setSelected(parsedSelected);

                    if (parsedSelected !== -1) {
                        const filteredData = response.data.filter(record => record.alertType === parsedSelected);
                        setFilteredData(filteredData);
                    } else {
                        setFilteredData();
                    }

                } else
                    setFilteredData(response.data);

                console.log("Fetched data");
                setLoading(true);
            })
            .catch(err => {
                setError(err);
                console.log(`Error ${err}`);
            })
    };

    const saveSelected = async () => {
        try {
            if (selected !== undefined && selected !== null) {
                await AsyncStorage.setItem('selectedFilter', selected.toString());
                console.log('Selected value after saving:', selected);

            } else {
                console.log('Selected is undefined or null, not saving to AsyncStorage');
            }
        } catch (error) {
            console.log('Error saving selected filter: ', error);
        }
    };


    const loadSelected = async () => {
        try {
            const savedSelected = await AsyncStorage.getItem('selectedFilter');

            if (savedSelected !== null && savedSelected !== undefined && savedSelected !== NaN && !isNaN(savedSelected)) {
                const parsedSelected = parseInt(savedSelected);

                setSelected(parsedSelected);
                console.log('Selected value after loading:', savedSelected);

                const foundOption = alertTypeMap.find(alert => alert.key === parsedSelected);

                setDefaultOption(foundOption)

            } else {
                setDefaultOption({key: -1, value: "All"});
                setSelected(-1);
            }
        } catch (error) {
            console.log('Error loading selected filter: ', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await alertService.Delete(id);
        } catch (err) {
            console.log(err);
        }
        setIsDeletedItem(true);
    };

    const handleModalEdit = async (object) => {
        setCurrentEditItem(object);
        setIsModalVisible(true);
    };

    const animatedTranslateY = scrollY.interpolate({
        inputRange: [0, flatListHeight],
        outputRange: [60, -flatListHeight + 20],
        extrapolate: 'clamp',
    });

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    }, []);


    //USE EFFECT HOOKS=========================================================================================
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [isModalVisible])
    );

    useEffect(() => {
        fetchData();
        if (isDeletedItem) setIsDeletedItem(false);
    }, [isDeletedItem]);

    useEffect(() => {
        if (data.length > 0) {
            if (selected !== -1) {
                setFilteredData(data.filter(record => record.alertType === selected));
            } else {
                setFilteredData(data);
            }

            if (selected !== undefined && selected !== null && !isNaN(selected)) {
                saveSelected();
            }
        }
    }, [data, selected]);


    return (

        <SafeAreaView className={"flex-1 justify-start align-center"}>
            <Animated.View
                style={{
                    transform: [
                        {
                            translateY: scrollY.interpolate({
                                inputRange: [0, 90],
                                outputRange: [0, -130],
                                extrapolate: 'clamp',
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
                    typeMap={[{key: -1, value: 'All'}, ...alertTypeMap]}
                    defaultOption={defaultOption}
                    setSelected={setSelected}
                />

            </Animated.View>

            <Animated.FlatList
                data={filteredData}
                keyExtractor={(item) => item.alertId.toString()}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                onScroll={handleScroll}
                onLayout={(e) => {
                    const {height} = e.nativeEvent.layout;
                    setFlatListHeight(height);
                }}
                style={{
                    transform: [{translateY: animatedTranslateY}],
                }}
                ListEmptyComponent={
                    !loading ? (
                        <ActivityIndicator size="small" color="#000"/>
                    ) : (
                        <Text>No alerts</Text>
                    )
                }
            />

            <Modal
                visible={isModalVisible}
                animationType={Platform.OS !== "ios" ? "" : "slide"}
                presentationStyle="pageSheet"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className="flex-auto mt-5">
                    <AlertMobileForm
                        object={currentEditItem}
                        header="Edit"
                        setIsModalVisible={setIsModalVisible}
                    />
                </View>

            </Modal>

        </SafeAreaView>
    );
};

export default AlertMobileDisplayer;
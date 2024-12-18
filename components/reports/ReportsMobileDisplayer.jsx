import React, {useCallback, useEffect, useState} from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    FlatList
} from "react-native";
import reportService from "../../services/dataServices/reportService";
import FallingTiles from "../FallingTiles";
import Feather from "react-native-vector-icons/Feather";
import DeleteButton from "../buttons/DeleteButton";
import {useFocusEffect} from "expo-router";
import CustomSelectList from "../selects/CustomSelectList";
import reportTypeMap from "../../data/Mappers/reportType";
import reportPeriodMap from "../../data/Mappers/reportPeriod";
import crudService from "../../services/dataServices/crudService";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";


const ReportsMobileDisplayer = () => {

    //PROPS====================================================================================================
    const [filteredData, setFilteredData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectKey, setSelectKey] = useState(0);
    const [selectedType, setSelectedType] = useState(undefined);
    const [selectedPeriod, setSelectedPeriod] = useState(undefined);
    const [isDeletedItem, setIsDeletedItem] = useState(false);
    const [data, setData] = useState([]);


    //FUNCTIONS================================================================================================
    const fetchData = async () => {
        try {

            const result = await crudService.GetAll("Report");
            const data = result.data;
            setFilteredData(data);
            setData(data)
        } catch (err) {
            CustomAlert("Error fetching data.");
            console.log(err)
        } finally {
            setLoading(false);
        }
    }

    const handleDownload = async (Id) => {
        try {
            await reportService.Download(Id);
        } catch (err) {
            CustomAlert("Error downloading report.");

            console.log(err)
        }
    }

    const handleDelete = async (id) => {

        try {
            await crudService.Delete(id, "Report");
            setIsDeletedItem(true)

        } catch (err) {
            CustomAlert("Error deleting report.");
            console.log(err);
        }
    }

    const renderItem = ({item}) => (
        <FallingTiles>
            <View
                className={"flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>
                <TouchableOpacity
                    onPress={() => handleDownload(item.reportId)}
                    className={"px-2"}
                >
                    <Feather name="download" size={24} color={"#3E86D8"}/>
                </TouchableOpacity>


                <View className={"px-2 py-2 mx-4"}>
                    <Text className={"text-center"}>{item.reportId}</Text>

                    <Text className={"text-center"}>
                        {new Date(item.reportDate).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>
                    <Text className={"text-center"}>
                        Report Type: {reportTypeMap.find((type) => type.key === item.reportType).value}
                    </Text>
                    <Text className={"text-center"}>
                        Report Period: {reportPeriodMap.find((period) => period.key === item.reportPeriod).value}
                    </Text>

                </View>


                <DeleteButton onDelete={() => handleDelete(item.reportId)}/>

            </View>
        </FallingTiles>
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
        setSelectKey(prev => prev + 1)
        setSelectedType({key: -1, value: "All"});
        setRefreshing(false);
    }, []);


    //USE EFFECT HOOKS=========================================================================================
    useFocusEffect((
        useCallback(
            () => {
                setSelectKey(prev => prev + 1)
                setSelectedType({key: -1, value: "All"});
                fetchData();
            }, [])
    ));

    useEffect(() => {
        fetchData();
        setSelectKey(prev => prev + 1)
        setSelectedType({key: -1, value: "All"});
        if (isDeletedItem) setIsDeletedItem(false);
    }, [isDeletedItem]);

    useEffect(() => {
        if (selectedType !== undefined && selectedType !== -1) {
            if (selectedType === 0) {
                setFilteredData(data.filter((record) => record.reportType === selectedType));
            } else if (selectedPeriod !== undefined && selectedPeriod !== -1) {
                setFilteredData(
                    data.filter(
                        (record) =>
                            record.reportType === selectedType &&
                            record.reportPeriod === selectedPeriod
                    )
                );
            } else {
                setFilteredData(data.filter((record) => record.reportType === selectedType));
            }
        } else {
            setFilteredData(data);
        }

        setLoading(false);
    }, [selectedType, selectedPeriod]);

    useEffect(() => {
        fetchData();
        if (isDeletedItem) setIsDeletedItem(false);
    }, [isDeletedItem]);


    return (
        <SafeAreaView className={"flex-1 justify-start align-center"}>

            <View className={" flex-col gap-4 m-2"}>
                <CustomSelectList
                    selectKey={selectKey}
                    typeMap={[{key: -1, value: 'All'}, ...reportTypeMap]}
                    defaultOption={{key: -1, value: 'All'}}
                    setSelected={setSelectedType}
                />

                {
                    (selectedType !== undefined && selectedType !== -1 && selectedType !== 0) &&
                    <CustomSelectList
                        selectKey={selectKey}
                        typeMap={[{key: -1, value: 'All'}, ...reportPeriodMap]}
                        defaultOption={{key: -1, value: 'All'}}
                        setSelected={setSelectedPeriod}
                    />
                }

            </View>


            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.reportId.toString()}
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
                        filteredData.length === 0 && (
                            <View className={"justify-center align-center"}>
                                <Text className={"text-center my-5"}>No reports</Text>
                            </View>
                        )
                    )
                }
            />

        </SafeAreaView>
    )
}

export default ReportsMobileDisplayer
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Animated,
    RefreshControl,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    FlatList
} from "react-native";
import waybillService from "../../services/dataServices/waybillService";
import CustomSelectList from "../selects/CustomSelectList";
import reportTypeMap from "../../data/Mappers/reportType";
import supplierTypeMap from "../../data/Mappers/supplierType";
import CustomButton from "../buttons/CustomButton";
import supplierType from "../../data/Mappers/supplierType";
import FallingTiles from "../FallingTiles";
import Feather from "react-native-vector-icons/Feather";
import reportPeriodMap from "../../data/Mappers/reportPeriod";
import DeleteButton from "../buttons/DeleteButton";
import countryService from "../../services/dataServices/countryService";
import orderHeaderService from "../../services/dataServices/orderHeaderService";
import barcodeGenerator from "../../services/reports/barcodeGenerator";
import ReportGenerator from "../../services/reports/reportGenerator";
import allProductState from "../../data/reportTemplates/allProductState";
import allOrderState from "../../data/reportTemplates/allOrderState";
import allUsersTasksState from "../../data/reportTemplates/allUsersTasksState";
import {WebView} from "react-native-webview";
import waybills from "../../app/home/waybills";
import waybillFile from "../../data/waybillTemplate/waybillFile";
import CustomEditButtonFlatList from "../buttons/CustomEditButtonFlatList";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";

const WaybillsMobileDisplayer = () => {
    //PROPS====================================================================================================
    const [data, setData] = useState([])
    const [selectKey, setSelectKey] = useState(0);
    const [selected, setSelected] = useState(undefined);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [htmlTemplate, setHtmlTemplate] = useState("");
    const [rawData, setRawData] = useState([]);


    //FUNCTIONS================================================================================================
    const fetchData = async () => {
        try {
            const result = await waybillService.GetAll();
            const enrichedResult = await Promise.all(
                result.data.map(async waybill => {
                    const country = await countryService.Get(waybill.countriesCountryId);
                    const oh = await orderHeaderService.Get(waybill.orderHeadersOrderHeaderId);
                    console.log(country.data.countryName);
                    return {...waybill, countryName: country.data.countryName, address: oh.data.destinationAddress};
                })
            )
            setFilteredData(enrichedResult);
            setData(enrichedResult);

        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    }

    const handleCreateWaybill = async (data) => {
        try {
            setIsLoading(true)
            const barcode = await barcodeGenerator.GenerateBarcode(data.barcode);
            const waybill = {...data, barcodeImage: barcode}
            console.log("Waybill: " + JSON.stringify(waybill, null, 2));

            setHtmlTemplate(waybillFile(waybill));
            setRawData(waybill);

        } catch (err) {
            console.log(JSON.stringify(err, null, 2))
        }


    }

    const renderItem = ({item}) => (
        // <FallingTiles>
        //     <View
        //         className={"flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>
        //
        //         <Feather color="#3E86D8" className={"m-2"} name={"file-text"} size={24}></Feather>
        //
        //         <View className={"px-2 py-2 mx-4"}>
        //             <Text className={"text-center"}>Waybill ID: {item.waybillId}</Text>
        //
        //             <Text className={"text-center"}>
        //                 {new Date(item.shippingDate).toLocaleDateString('en-GB', {
        //                     year: 'numeric',
        //                     month: 'long',
        //                     day: 'numeric'
        //                 })}
        //             </Text>
        //             <Text className={"text-center"}>
        //                 Address: {item.address}
        //             </Text>
        //             <Text className={"text-center"}>
        //                 Postal code: {item.postalCode}
        //             </Text>
        //             <Text className={"text-center"}>
        //                 Supplier name: {item.supplierName}
        //             </Text>
        //             <Text className={"text-center"}>
        //                 Country: {item.countryName}
        //             </Text>
        //             <Text className={"text-center"}>
        //                 Barcode: {item.barcode}
        //             </Text>
        //
        //         </View>
        //
        //         <TouchableOpacity
        //             onPress={() => handleCreateWaybill(item)}
        //             className={"px-2"}
        //         >
        //             <Feather name="download" size={24} color={"#3E86D8"}/>
        //         </TouchableOpacity>
        //
        //     </View>
        // </FallingTiles>

        <FallingTiles>


            <View className={"flex-col justify-start bg-slate-200 pt-2 rounded-lg mt-5 mx-4 shadow"}>


                <View className={"flex-row bg-blue-200  items-center mx-2 rounded-lg w-fit"}>

                    <View className="flex-row bg-smartwms-blue rounded-lg justify-center items-center p-2">
                        <Feather color="#ffffff" className={""} name={"file-text"} size={50}/>
                    </View>
                    <View className={"flex-col mx-2"}>
                        <Text className={"text-smartwms-blue text-2xl font-bold"}>Waybill No. {item.waybillId}</Text>
                        <Text className={" color-gray-500"}>{item.barcode}</Text>
                        <Text
                            className={" color-gray-500"}>{new Date(item.shippingDate).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                        </Text>
                    </View>


                </View>


                <View className={"flex-col"}>

                    <View className={"flex-row gap-4 p-2"}>

                            <View className={" flex-1 flex-row"}>
                                <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"}/>
                                <View className={"flex-col"}>
                                    <Text className={"text-smartwms-blue text-xl font-bold"}>Address</Text>
                                    <Text className={" color-gray-500"}>{item.address}</Text>
                                </View>
                            </View>

                            <View className={"flex-1 flex-row"}>
                                <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"}/>
                                <View className={"flex-col"}>
                                    <Text className={"text-smartwms-blue text-xl font-bold"}>Postal</Text>
                                    <Text className={" color-gray-500"}>{item.postalCode}</Text>
                                </View>
                            </View>


                    </View>

                    <View className={"flex-row gap-4 p-2"}>
                        <View className={"flex-1 flex-row"}>
                            <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"}/>
                            <View className={"flex-col"}>
                                <Text className={"text-smartwms-blue text-xl font-bold"}>Country</Text>
                                <Text className={" color-gray-500"}>{item.countryName}</Text>
                            </View>
                        </View>

                        <View className={"flex-1 flex-row"}>
                            <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"}/>
                            <View className={"flex-col"}>
                                <Text className={"text-smartwms-blue text-xl font-bold"}>Supplier</Text>
                                <Text className={" color-gray-500"}>{item.supplierName}</Text>
                            </View>
                        </View>
                    </View>




                </View>


                <View className="mt-2 flex-row  justify-center items-cente">

                    <CustomEditButtonFlatList icon={"download"} title={"Download"}
                                              containerStyles={"flex-1 bg-green-500 rounded-b-lg"}
                                              textStyles={"text-white"} onEdit={() => handleCreateWaybill(item)}></CustomEditButtonFlatList>

                </View>

            </View>


        </FallingTiles>
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
        setSelectKey(prev => prev + 1)
        setSelected({key: -1, value: "All"});
        setRefreshing(false);
    }, []);

    const handleSaveWaybill = async () => {
        await ReportGenerator.printToFile(waybillFile, rawData);
        setIsLoading(false);
    }


    //USE EFFECT HOOKS=========================================================================================
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selected !== undefined && selected !== -1) {
            const foundSupplier = supplierType.find(item => item.key === selected).value;
            setFilteredData(data.filter(item => item.supplierName === foundSupplier));
        } else {
            setFilteredData(data);
        }

        setIsLoading(false);
    }, [selected]);

    return (
        isLoading === false ? (
            <SafeAreaView className={"flex-1 justify-start align-center"}>
                <View className={"m-2"}>
                    <CustomSelectList
                        selectKey={selectKey}
                        typeMap={[{key: -1, value: 'All'}, ...supplierTypeMap]}
                        setSelected={setSelected}

                    />
                </View>

                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.waybillId.toString()}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                    }
                    ListEmptyComponent={
                        isLoading ? (
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
        ) : (
            <View className="flex-1 mt-4">
                <WebView
                    source={{html: htmlTemplate}}
                    style={{flex: 1}}
                />
                <CustomButton
                    title={"Print Waybill"}
                    textStyles={"text-white"}
                    containerStyles={"mb-2 py-6 mx-2"}
                    handlePress={async () => await handleSaveWaybill()}
                    iconName={"printer"}
                />
                <CustomButton
                    title={"Cancel"}
                    textStyles={"text-white"}
                    containerStyles={"mb-2 py-6 mx-2 bg-red-500"}
                    handlePress={() => setIsLoading(false)}
                    iconName={"x-circle"}
                />
            </View>
        )


    )
}

export default WaybillsMobileDisplayer
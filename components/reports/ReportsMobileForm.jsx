import React, {useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {WebView} from 'react-native-webview';
import CustomButton from "../buttons/CustomButton";
import ReportGenerator from "../../services/reports/reportGenerator";
import CustomSelectList from "../selects/CustomSelectList";
import allProductState from "../../data/reportTemplates/allProductState";
import reportTypeMap from "../../data/Mappers/reportType";
import reportPeriodMap from "../../data/Mappers/reportPeriod";
import productService from "../../services/dataServices/productService";
import barcodeGenerator from "../../services/reports/barcodeGenerator";
import subcategoryService from "../../services/dataServices/subcategoryService";
import {Feather} from "@expo/vector-icons";
import {Divider} from "react-native-elements";
import orderHeaderService from "../../services/dataServices/orderHeaderService";
import allOrderState from "../../data/reportTemplates/allOrderState";
import reportService from "../../services/dataServices/reportService";
import allUsersTasksState from "../../data/reportTemplates/allUsersTasksState";

const ReportsMobileForm = () => {

    //PROPS====================================================================================================
    const [selectKey, setSelectKey] = useState(0);
    const [form, setForm] = useState({
        reportType: -1,
        reportPeriod: -1
    });
    const [htmlTemplate, setHtmlTemplate] = useState('');

    const [periodError, setPeriodError] = useState(true);
    const [typeError, setTypeError] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [rawData, setRawData] = useState([]);

    //FUNCTIONS=============================================================================================
    const handleReportType = () => {
        form.reportType === -1 ? setTypeError(true) : setTypeError(false);
    }

    const handleReportPeriod = () => {
        console.log(`Chosen period: ${form.reportPeriod}`)
        form.reportPeriod === -1 ? setPeriodError(true) : setPeriodError(false);
    }

    const handleCreateReport = async () => {
        setIsLoading(true);

        switch (form.reportType) {
            case 0:
                setForm(prev => ({...prev, reportPeriod: 0}));
                const result = await productService.GetAll();
                const data = await Promise.all(result.data.map(async product => {
                    const generatedLink = await barcodeGenerator.GenerateBarcode(product.barcode);
                    const subcategoryResponse = await subcategoryService.Get(product.subcategoriesSubcategoryId);
                    const subcategoryName = subcategoryResponse.data.subcategoryName;
                    return {...product, barcode: generatedLink, subcategoriesSubcategoryId: subcategoryName};
                }));

                setHtmlTemplate(allProductState(data));
                setRawData(data);
                break;

            case 2:
                const orderHeaderResponse = await orderHeaderService.GetWithDetails();
                const preparedOrderHeader = await Promise.all(
                    orderHeaderResponse.data.map(async (oh) => {
                        const preparedOrderDetails = await Promise.all(
                            oh.orderDetails.map(async (od) => {
                                const productInfo = await productService.Get(od.productsProductId);
                                return {...od, price: productInfo.data.price * od.quantity};
                            })
                        );

                        const parsedDate = new Date(oh.deliveryDate).toString();
                        return {
                            ...oh,
                            orderDetails: preparedOrderDetails,
                            deliveryDate: parsedDate
                        };
                    })
                );

                let endDate = new Date();
                let beginningDate = new Date(endDate);

                switch (form.reportPeriod) {
                    case 0:
                        beginningDate.setDate(beginningDate.getDate() - 1);
                        break;
                    case 1:
                        beginningDate.setDate(beginningDate.getDate() - 7);
                        break;
                    case 2:
                        beginningDate.setMonth(beginningDate.getMonth() - 1);
                        break;
                    case 3:
                        beginningDate.setMonth(beginningDate.getMonth() - 3);
                        break;
                    case 4:
                        beginningDate.setFullYear(beginningDate.getFullYear() - 1);
                        break;
                }

                const filteredPreparedOrderHeader = preparedOrderHeader.filter(order => new Date(order.deliveryDate) >= beginningDate && new Date(order.deliveryDate) <= endDate);
                setHtmlTemplate(allOrderState(filteredPreparedOrderHeader));
                setRawData(filteredPreparedOrderHeader);
                break;

            case 4:
                const usersTasks = await reportService.UsersFinishedTasks();
                console.log("Raw users tasks: ", JSON.stringify(usersTasks.data, null, 2));
                endDate = new Date();
                beginningDate = new Date(endDate);


                switch (form.reportPeriod) {
                    case 0:
                        beginningDate.setDate(beginningDate.getDate() - 1);
                        break;
                    case 1:
                        beginningDate.setDate(beginningDate.getDate() - 7);
                        break;
                    case 2:
                        beginningDate.setMonth(beginningDate.getMonth() - 1);
                        break;
                    case 3:
                        beginningDate.setMonth(beginningDate.getMonth() - 3);
                        break;
                    case 4:
                        beginningDate.setFullYear(beginningDate.getFullYear() - 1);
                        break;
                }

                console.log("Beginning date: ", beginningDate);
                console.log("End date: ", endDate);
                let filteredUsersFinishedTasks = usersTasks.data.map(user => {
                    const filteredTasks = user.tasks.filter(task =>
                        new Date(task.finishDate) >= beginningDate && new Date(task.finishDate) <= endDate
                    );
                    return {
                        ...user,
                        tasks: filteredTasks,
                        completedTasksCount: filteredTasks.length
                    };
                });

                filteredUsersFinishedTasks = {
                    startDate: beginningDate,
                    endDate: endDate,
                    filteredTasks: filteredUsersFinishedTasks
                };

                // console.log("Filtered users tasks: ", JSON.stringify(filteredUsersFinishedTasks,null,2));

                setHtmlTemplate(allUsersTasksState(filteredUsersFinishedTasks));
                setRawData(filteredUsersFinishedTasks);
                break;
        }
    }

    const handleSaveReport = async () => {


        switch (form.reportType) {
            case 0:
                console.log("Form: " + JSON.stringify(form))
                await ReportGenerator.printToFile(allProductState, rawData, form);
                break;
            case 2:
                await ReportGenerator.printToFile(allOrderState, rawData, form);
                break;
            case 4:
                console.log("Save button")
                await ReportGenerator.printToFile(allUsersTasksState, rawData, form);
                break;
        }
        setIsLoading(false);
    }

    return (


        isLoading === false ? (
            <SafeAreaView className="justify-start align-center mx-2 px-4 py-2">


                <View className="flex-row items-center gap-2 bg-slate-200 rounded-lg shadow p-2 pt-2 ">
                    <Feather className="flex-3 shadow " name="pie-chart" size={72} color="#3E86D8"/>
                    <View className="flex-1 justify-center">
                        <Text className="text-4xl text-center">Generate Report</Text>
                    </View>
                </View>


                <Divider width={2} className={"my-4 color-gray-400"}/>

                <View className={"mb-6"}>
                    <Text className='text-base font-pmedium'> Report type </Text>
                    <CustomSelectList
                        selectKey={selectKey}
                        setSelected={val => setForm({...form, reportType: val})}
                        typeMap={reportTypeMap}
                        defaultOption={{key: -1, value: "Select report type..."}}
                        onSelect={() => handleReportType()}
                    />
                </View>

                {form.reportType !== 0 && (
                    <View className="mb-12">
                        <Text className='text-base font-pmedium'> Report period </Text>
                        <CustomSelectList
                            selectKey={selectKey}
                            setSelected={val => setForm({...form, reportPeriod: val})}
                            typeMap={reportPeriodMap}
                            defaultOption={{key: -1, value: "Select report period..."}}
                            onSelect={() => handleReportPeriod()}
                        />
                    </View>
                )}

                <CustomButton
                    title={"Product report"}
                    textStyles={"text-white"}
                    containerStyles={"mb-2 py-6"}
                    handlePress={() => handleCreateReport()}
                    isLoading={!!isLoading ? true : form.reportType !== 0 ? (!!typeError || !!periodError) : (!!typeError)}
                    showLoading={!!isLoading}

                />

            </SafeAreaView>
        ) : (

            <View className="flex-1 mt-4">
                <WebView
                    source={{html: htmlTemplate}}
                    style={{flex: 1}}
                />
                <CustomButton
                    title={"Save Report"}
                    textStyles={"text-white"}
                    containerStyles={"mb-2 py-6 mx-2"}
                    handlePress={async () => await handleSaveReport()}
                />
                <CustomButton
                    title={"Cancel"}
                    textStyles={"text-white"}
                    containerStyles={"mb-2 py-6 mx-2 bg-rose-500"}
                    handlePress={() => setIsLoading(false)}
                />
            </View>

        )


    );
};

export default ReportsMobileForm;

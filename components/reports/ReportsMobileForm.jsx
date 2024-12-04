import React, {useState} from 'react';
import {SafeAreaView, Text, TouchableHighlight, View} from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import CustomButton from "../buttons/CustomButton";
import ReportGenerator from "../../services/reports/reportGenerator";
import CustomSelectList from "../selects/CustomSelectList";
import allProductState from "../../data/reportTemplates/allProductState";
import reportTypeMap from "../../data/Mappers/reportType";
import reportPeriodMap from "../../data/Mappers/reportPeriod";
import productService from "../../services/dataServices/productService";
import barcodeGenerator from "../../services/reports/barcodeGenerator";
import subcategoryService from "../../services/dataServices/subcategoryService";

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
    const [isLoadig, setIsLoadig] = useState(false);

    //FUNCTIONS=============================================================================================
    const handleReportType = () => {
        form.reportType === -1 ? setTypeError(true) : setTypeError(false);
    }

    const handleReportPeriod = () => {
        form.reportPeriod === -1 ? setPeriodError(true) : setPeriodError(false);
    }



    const handleCreateReport = async () => {
        let result;

        setIsLoadig(true)

        switch(form.reportType) {
            case 0:
                const result = await productService.GetAll();
                //console.log(result.data);
                const data = await Promise.all(result.data.map(async product => {
                    const generatedLink = await barcodeGenerator.GenerateBarcode(product.barcode);
                    const subcategoryResponse = await subcategoryService.Get(product.subcategoriesSubcategoryId);
                    console.log("PODKATEGORIA: " + subcategoryResponse.data);
                    const subcategoryName = subcategoryResponse.data.subcategoryName;
                    return ({...product, barcode: generatedLink, subcategoriesSubcategoryId: subcategoryName});
                }));

                console.log("Nasza data" + JSON.stringify(data));
                await ReportGenerator.printToFile(allProductState, data);
                setIsLoadig(false);
                break;
            case 2:

                //ReportGenerator.printToFile(allProductState)
                break;
            case 4:
                //ReportGenerator.printToFile(allProductState)
                break;
        }
    }


    //USE EFFECT HOOKS=========================================================================================

    return (
        <SafeAreaView className={"justify-start align-center mx-2 px-4 py-2"}>

            <View className={"space-y-6 mt-6 mb-2"}>
                <Text
                    className='text-base font-pmedium'> Report type
                </Text>

                <CustomSelectList
                    selectKey={selectKey}
                    setSelected={val => setForm({...form, reportType: val})}
                    typeMap={reportTypeMap}
                    defaultOption={{key: -1, value: "Select report type..."}}
                    onSelect={() => handleReportType()}
                />
            </View>

            {
                form.reportType !== 0 ? (
                    <View className={"mt-6 mb-12"}>
                        <Text
                            className='text-base font-pmedium'> Report period
                        </Text>

                        <CustomSelectList
                            selectKey={selectKey}
                            setSelected={val => setForm({...form, reportPeriod: val})}
                            typeMap={reportPeriodMap}
                            defaultOption={{key: -1, value: "Select report period..."}}
                            onSelect={() => handleReportPeriod()}
                        />
                    </View>
                ) : null
            }

            <CustomButton title={"Product report"}
                          textStyles={"text-white"}
                          containerStyles={"mb-2 py-6"}
                          handlePress={() => handleCreateReport() }
                          isLoading={!!isLoadig ? true : form.reportType !== 0 ? (!!typeError || !!periodError) : (!!typeError)}
                          showLoading={!!isLoadig}

            />
            
            <CustomButton title={"Push me"} handlePress={() =>barcodeGenerator.GenerateBarcode("01234565")}></CustomButton>

        </SafeAreaView>
    );
};

export default ReportsMobileForm;

import {Text, View} from "react-native";
import React from "react";
import TextFormField from "../form_fields/TextFormField";
import {useState, useEffect} from "react";
import {SafeAreaView} from "react-native";
import {KeyboardAvoidingView} from "react-native";
import {Platform} from "react-native";
import CustomButton from "../buttons/CustomButton";
import alertTypeMap from "../../data/Mappers/alertType";
import CustomSelectList from "../selects/CustomSelectList";
import CancelButton from "../buttons/CancelButton";
import AlertDto from "../../data/DTOs/alertDto";
import crudService from "../../services/dataServices/crudService";
import {router} from "expo-router";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";

const AlertMobileForm = ({object = {}, header, setIsModalVisible}) => {

    //PROPS====================================================================================================
    const [errors, setErrors] = useState({});
    const [selectKey, setSelectKey] = useState(0);//to jest po to zeby customselectlist sie restowal po edycji albo dodaniu
    const [titleError, setTitleError] = object?.alertId ? useState(false) : useState(true);
    const [descrtiptionError, setDescriptionError] = object?.alertId ? useState(false) : useState(true);
    const [alertTypeError, setAlertTypeError] = object?.alertId ? useState(false) : useState(true);

    const [form, setForm] = useState({
        title: object?.title || "",
        description: object?.description || "",
        //usuanac z drugiego objecta ? jak przestanie dzialac
        alertType: object?.alertType !== undefined && object?.alertType !== null ? object.alertType : -1
    });

    const defaultOption = form.alertType !== -1 ? alertTypeMap.find(item => item.key === form.alertType) : null;

    //FUNCTIONS================================================================================================
    const handleTitle = (e) => {
        const titleVar = e.nativeEvent.text;
        titleVar.length > 0 ? setTitleError(false) : setTitleError(true);
    }

    const handleDescription = (e) => {
        const descVar = e.nativeEvent.text;
        descVar.length > 0 ? setDescriptionError(false) : setDescriptionError(true);
    }

    const handleAlertType = () => {
        form.alertType === -1 ? setAlertTypeError(true) : setAlertTypeError(false);
    }

    const handleEdit = async (id, form) => {
        try {
            const alertDto = new AlertDto(form);

            const result = await crudService.Update(id, alertDto, "Alert");
            console.log(result.errors)
            if (result.errors) {
                setErrors(result.errors);
                console.log(`Błędy przechwycone: ${JSON.stringify(result.errors)}`);
            } else {
                setErrors({});
                setForm({
                    title: "",
                    description: "",
                    alertType: -1
                });
                setIsModalVisible(false);
                setSelectKey((prevKey) => prevKey + 1);
            }
        } catch (err) {
            CustomAlert("Error editing alert.");

            console.log(err)
            setErrors(err);
        }
    }

    const handleAdd = async (form) => {
        try {
            const alertDto = new AlertDto(form);
            const result = await crudService.Post(alertDto, "Alert");

            if (result.errors) {
                setErrors(result.errors);
                console.log(`Błędy przechwycone: ${JSON.stringify(result.errors)}`);
            } else {
                setErrors({});
                setForm({
                    title: "",
                    description: "",
                    alertType: -1
                });
                setSelectKey((prevKey) => prevKey + 1);
                router.push('/home/alerts');
            }
        } catch (err) {
            CustomAlert("Error adding alert.");
            //console.log(err)
            setErrors(err);
        }
    };


    //USE EFFECT HOOKS=========================================================================================
    useEffect(() => {
        console.log(`Otrzymano obiekt: ${JSON.stringify(object)}`);
    }, [])


    return (
        <SafeAreaView className="h-full">
            <KeyboardAvoidingView
                behavior="padding"
                className={`h-full px-4 ${Platform.OS === "web" ? "w-96" : "w-full"}`}
            >
                {header === "Edit" && (
                    <View className="flex flex-row items-center justify-between my-5">
                        <CancelButton onPress={() => setIsModalVisible(false)} />
                        <Text className="absolute left-1/2 transform -translate-x-1/2 my-5 text-3xl font-bold">{header}</Text>
                    </View>
                )}


                <TextFormField
                    title="Title"
                    value={form.title}
                    handleChangeText={(e) => setForm({...form, title: e})}
                    otherStyles=""
                    keyboardType="email-address"
                    onChange={e => handleTitle(e)}
                    isError={titleError}
                    iconsVisible={true}
                />

                <TextFormField
                    title="Description"
                    value={form.description}
                    handleChangeText={(e) => setForm({...form, description: e})}
                    otherStyles="mt-7"
                    onChange={e => handleDescription(e)}
                    isError={descrtiptionError}
                    iconsVisible={true}
                />

                <View className="space-y-2 mt-6 mb-2">
                    <Text
                        className='text-base font-pmedium'> Alert Type
                    </Text>
                    <CustomSelectList
                        selectKey={selectKey}
                        setSelected={(val) => setForm((prevForm) => ({...prevForm, alertType: val}))}
                        typeMap={alertTypeMap}
                        form={form}
                        defaultOption={defaultOption}
                        onSelect={() => handleAlertType()}

                    />
                </View>

                <CustomButton
                    title="Save"
                    handlePress={() => {
                        if (object?.alertId)
                            handleEdit(object.alertId, form);
                        else handleAdd(form);
                    }}
                    containerStyles="w-full mt-7"
                    textStyles={"text-white"}
                    isLoading={titleError || descrtiptionError || alertTypeError}
                    showLoading={false}
                />

                {Object.keys(errors).length > 0 && (
                    <View
                        className={
                            "bg-red-400  mt-7 w-full h-16 rounded-2xl items-center justify-center"
                        }
                    >
                        {Object.keys(errors).map((key, index) => (
                            <Text key={index} className="text-white">
                                {errors[key]}
                            </Text>
                        ))}
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AlertMobileForm;

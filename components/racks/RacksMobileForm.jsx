import {KeyboardAvoidingView, SafeAreaView, Text, View} from "react-native";
import React, {useState} from "react";
import NumberFormField from "../form_fields/NumberFormField";
import CustomButton from "../buttons/CustomButton";
import {useEffect} from "react";
import CancelButton from "../buttons/CancelButton";
import rackErrorMessages from "../../data/ErrorMessages/rackErrorMessages";
import crudService from "../../services/dataServices/crudService";
import RackDto from "../../data/DTOs/rackDto";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";

const RacksMobileForm = ({object = {}, header, setIsModalVisible, rackId, laneId}) => {

    //PROPS====================================================================================================
    const [form, setForm] = useState({
        title: object?.title || "",
        lanesLaneId: laneId,
    })
    const [titleError, setTitleError] = useState({});
    const[errors, setErrors] = useState({});
    const [selectKey, setSelectKey] = useState(0);
    const [lanesRacks, setLanesRacks] = useState([]);
    const [titleErrorMessage, setTitleErrorMessage] = useState("");


    //FUNCS====================================================================================================
    const getLanesRacks = async () => {
        try{
            var result = await crudService.Get(laneId, "Rack/lanesRacks");
            setLanesRacks(result.data.map(object => object.rackNumber))
        }
        catch(err){
            CustomAlert("Error fetching data.");
            console.log(err);
        }
    }

    const handleTitle = (e) => {
        const rackNumber = e.nativeEvent.text;
        const regexp = new RegExp("^[1-9]{1}\\d*$");
        if (regexp.test(rackNumber)) {
            const parsedRackNumber = parseInt(rackNumber);

            if (isNaN(parsedRackNumber)) {
                setTitleError(true);
                setTitleErrorMessage(rackErrorMessages.rackNumber)
            } else {
                if ( parsedRackNumber > 0 && parsedRackNumber <= 20 ) {
                    if(!lanesRacks.includes(parsedRackNumber))
                        setTitleError(false);

                    else {
                        setTitleError(true);
                        setTitleErrorMessage(rackErrorMessages.rackNumberExists);
                    }

                }else{
                    setTitleError(true);
                    setTitleErrorMessage(rackErrorMessages.rackNumber);
                }
            }
        } else {
            setTitleError(true);
            setTitleErrorMessage(rackErrorMessages.rackNumber);
        }
    }

    const handleAdd = async(form) => {

        try{
            const rackDto = new RackDto(form);
            const result = await crudService.Post(rackDto, "Rack");

            if (result.errors)
                setErrors(result.errors);
            else{
                setErrors({});
                setForm({
                    title: "",
                    lanesLaneId: null
                })
                setIsModalVisible(false);
                setSelectKey((prevKey) => prevKey + 1);
            }
        }
        catch(err) {
            CustomAlert("Error adding rack.");
            setErrors(err);
        }
    }

    //USE EFFECT HOOKS=========================================================================================
    useEffect(() => {
        getLanesRacks();
    }, [])

    return (
        <SafeAreaView className={"h-full mx-2"}>

            <KeyboardAvoidingView
                behavior="padding"
                className={"h-full"}
            >

                <View className={"flex flex-row items-center justify-between my-5"}>
                    <CancelButton onPress={() => setIsModalVisible(false)} />
                    <Text className="absolute left-1/2 transform -translate-x-1/2 my-5 text-3xl font-bold">{header}</Text>
                </View>

                <NumberFormField
                    title="Rack number"
                    value={form?.title ? form.title.toString() : ''}
                    handleChangeText={(e) => setForm({...form, title: e})}
                    onChange={e => handleTitle(e)}
                    isError={!!titleError}
                    iconsVisible={true}
                    otherStyles={"w-full mt-7"}
                />

                {(titleError && form.title.length > 0) ? (<Text className={'text-red-600'}>{titleErrorMessage}</Text>) : null}

                <CustomButton
                    title="Save"
                    handlePress={() => {handleAdd(form)}}
                    containerStyles="w-full mt-7"
                    textStyles={"text-white"}
                    isLoading={!!titleError}
                    showLoading={false}
                />

            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default RacksMobileForm
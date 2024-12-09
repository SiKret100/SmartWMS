import {KeyboardAvoidingView, Text, View} from "react-native";
import TextFormField from "../form_fields/TextFormField";
import React, {useState, useCallback} from "react";
import CustomButton from "../buttons/CustomButton";
import {router, useFocusEffect} from "expo-router";
import laneErrorMessages from "../../data/ErrorMessages/laneErrorMessages";
import crudService from "../../services/dataServices/crudService";
import LaneDto from "../../data/DTOs/laneDto";

const LanesMobileForm = () => {

    //PROPS====================================================================================================
    const [form, setForm] = useState({
           laneCode: "",
    });
    const [laneCodeError, setLaneCodeError] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectKey, setSelectKey] = useState(0);//to jest po to zeby customselectlist sie resetowal po edycji albo dodaniu
    const [lanes, setLanes] = useState([])
    const [laneCodeErrorMessage, setLaneCodeErrorMessage] = useState("");


    //FUNCTIONS================================================================================================
    const handleLaneCode = (e) => {
        const regexp = new RegExp("^[A-Za-z]{1}\\d{1,2}$");
        const laneCode = e.nativeEvent.text;

        if (laneCode.length > 0 && laneCode.length <= 3 && regexp.test(laneCode)) {
            const normalizedLaneCode = laneCode.replace(/^([A-Za-z]{1})0?(\d{1,2})$/, "$1$2");

            const duplicateExists = lanes.some(
                existingLane => existingLane.replace(/^([A-Za-z]{1})0?(\d{1,2})$/, "$1$2") === normalizedLaneCode
            );

            if (duplicateExists) {
                setLaneCodeError(true);
                setLaneCodeErrorMessage(laneErrorMessages.laneExists)
            } else {
                setLaneCodeError(false);
                setLanes([...lanes, laneCode]);
            }
        } else {
            setLaneCodeError(true);
            setLaneCodeErrorMessage(laneErrorMessages.wrongPattern)
        }
    };

    const handleAdd = async (form) => {
        try {

            form.laneCode = form.laneCode.toUpperCase();

            const laneDto = new LaneDto(form);
            const result = await crudService.Add(laneDto, "Lane");

            if(result.errors){
                setErrors(result.errors);
            }else{
                setErrors({})
                setForm({
                    laneCode: ""
                })
                setSelectKey((prevKey) => prevKey + 1);
                router.push("/home/shelves")
            }
        }catch(err){
            setErrors(err);
        }
    }

    const getAllLanes = async () => {
        try{
            const result = await crudService.GetAll("Lane");
            setLanes(result.data.map(object => object.laneCode));
        }
        catch(err){
            console.log(err);
        }
    }


    //USE EFFECT HOOKS=========================================================================================
    useFocusEffect(
        useCallback(() => {
            getAllLanes()
        }, [selectKey])
    );


    return(
            <KeyboardAvoidingView
                behavior={"padding"}
                className={"f-full px-4"}
            >

                <Text className={"text-3xl font-bold my-5"}>Add</Text>
                <TextFormField
                    title={"Lane code"}
                    value={form.laneCode}
                    handleChangeText={(e) => setForm({...form, laneCode: e})}
                    onChange={e => handleLaneCode(e)}
                    isError={laneCodeError}
                    iconsVisible={true}
                />
                {(laneCodeError && form.laneCode.length > 0) ? <Text className={'text-red-600'}>{laneCodeErrorMessage}</Text> : null}


                <CustomButton
                    title="Save"
                    handlePress={() => handleAdd(form)}
                    containerStyles={"w-full mt-7"}
                    textStyles={"text-white"}
                    isLoading={laneCodeError}
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
    );
}

export default LanesMobileForm;
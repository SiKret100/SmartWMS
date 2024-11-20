import {KeyboardAvoidingView, SafeAreaView, Text, View} from "react-native";
import React, {useState} from "react";
import TextFormField from "../form_fields/TextFormField";
import CategoriesMobileForm from "../categories/CategoriesMobileForm";
import CustomSelectList from "../selects/CustomSelectList";
import shelfTypeMap from "../../data/Mappers/shelfType";
import alertTypeMap from "../../data/Mappers/alertType";
import NumberFormField from "../form_fields/NumberFormField";
import CustomButton from "../buttons/CustomButton";
import shelfService from "../../services/dataServices/shelfService";
import shelfErrorMessages from "../../data/ErrorMessages/shelfErrorMessages";
import {useEffect} from "react";
import rackService from "../../services/dataServices/rackService";
import CancelButton from "../buttons/CancelButton";
import rackErrorMessages from "../../data/ErrorMessages/rackErrorMessages";

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
            var result = await rackService.GetAllLanesRacks(laneId);
            setLanesRacks(result.data.map(object => object.rackNumber))

            // // w resulcie mamy obiekty {"level":0}, potrzebna jest sama wartosc
            // var laneRacks = result.data.map(object => object.level);
            //
            // console.log(`Rack levels: ${JSON.stringify(rackLevels)}`);
            //
            // //uzywajac shelfTypeMap zwracamy tylko te levele ktorych jeszcze nie ma dodanych dla regalu sprawdzajac, czy dany key jest w tablicy rackLevels
            // setSelectList(shelfTypeMap.filter(shelf => !rackLevels.includes(shelf.key)));
            // //console.log(`Ustawiona selectList: ${JSON.stringify(selectList)}`);
        }
        catch(err){
            console.log(err);
        }
    }

    const handleTitle = (e) => {
        const rackNumber = e.nativeEvent.text;
        const regexp = new RegExp("^[1-9]{1}\\d*$");
        if (regexp.test(rackNumber)) {
            const parsedRackNumber = parseInt(rackNumber);
            console.log(parsedRackNumber);

            if (isNaN(parsedRackNumber)) {
                setTitleError(true);
                console.log('Error: not a number');
                setTitleErrorMessage(rackErrorMessages.rackNumber)
            } else {
                if ( parsedRackNumber > 0 && parsedRackNumber <= 20 ) {
                    if(!lanesRacks.includes(parsedRackNumber))
                    {
                        setTitleError(false);
                        console.log('No error');
                    }
                    else {
                        setTitleError(true);
                        console.log('error');
                        setTitleErrorMessage(rackErrorMessages.rackNumberExists);
                    }

                }else{
                    setTitleError(true);
                    console.log('Error');
                    setTitleErrorMessage(rackErrorMessages.rackNumber);
                }
            }
        } else {
            setTitleError(true);
            setTitleErrorMessage(rackErrorMessages.rackNumber);
            console.log('No error');
        }
    }

    const handleAdd = async(form) => {

        console.log(`Data from form: ${JSON.stringify(form)}`)

        try{
            const result = await rackService.Add(form);
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

                {/*<CustomButton title={"Pobierz regaly"} handlePress={() => console.log(lanesRacks)}/>*/}


            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default RacksMobileForm
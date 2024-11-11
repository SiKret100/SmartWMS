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

const ShelvesMobileForm = ({object = {}, header, setIsModalVisible, rackId}) => {

    //PROPS====================================================================================================
    const [form, setForm] = useState({
        title: object?.title !== undefined && object?.title !== null ? object.title : -1,
        maxQuant: object?.maxQuant || "",
        currentQuant: 0,
        racksRackId: rackId
    });

    const [titleError, setTitleError] = object?.title ? useState(false) : useState(true);
    // const [titleError, setTitleError] = useState(false);
    const [maxQuantError, setMaxQuantError] = object?.maxQuant ? useState(false) : useState(true);
    // const [maxQuantError, setMaxQuantError] = useState(false);
    const [selectKey, setSelectKey] = useState(0);
    const[errors, setErrors] = useState({});
    const[selectList, setSelectList] = useState([]);
    const defaultOption = form?.title !== undefined && form?.title !== -1 ? shelfTypeMap.find(item => item.key === form.title) : null;

    //FUNCTIONS================================================================================================
    const handleEdit = async (id, form) => {
        setForm(prevForm=> setForm({...prevForm, maxQuant: parseInt(prevForm.maxQuant)}));
        //console.log(`default option : ${JSON.stringify(defaultOption)}`);

        try {
            const result = await shelfService.Update(id, form);
            console.log(result.errors)
            if (result.errors) {
                setErrors(result.errors);
                console.log(`Błędy przechwycone: ${JSON.stringify(result.errors)}`);
            } else {

                setErrors({});
                setForm({
                    title: -1,
                    maxQuant: '',
                    productId: null,
                });
                setIsModalVisible(false);
                setSelectKey((prevKey) => prevKey + 1);

            }
        } catch (err) {
            console.log(err)
            setErrors(err);
        }
    }

    const handleAdd = async(form) => {

        console.log(`Fomr from form: ${JSON.stringify(form)}`)

        try{
            const result = await shelfService.Add(form);
            if (result.errors)
                setErrors(result.errors);
            else{
                setErrors({});
                setForm({
                    title: -1,
                    maxQuant: '',
                    productId: null,
                    racksRackId: null
                })
                setIsModalVisible(false);
                setSelectKey((prevKey) => prevKey + 1);
            }
        }
        catch(err) {
            setErrors(err);
        }
    }

    const handleTitle = () => {
        form.title  === -1 ? setTitleError(true) : setTitleError(false);
    }

    const handleMaxQuantity = (e) => {
        const maxQuantity = e.nativeEvent.text;

        if (maxQuantity.length >= 1 && !maxQuantity.startsWith("0")) {
            const parsedMaxQuantity = parseInt(maxQuantity);
            console.log(parsedMaxQuantity);

            if (isNaN(parsedMaxQuantity)) {
                setMaxQuantError(true);
                console.log('Error: not a number');
            } else {
                if ( parsedMaxQuantity > 0 && parsedMaxQuantity <= 2147483647 ) {
                    setMaxQuantError(false);
                    console.log('No error');
                }else{
                    setMaxQuantError(true);
                    console.log('Error');
                }
            }
        } else {
            setMaxQuantError(true);
            console.log('No error');
        }
    };

    const getRacksLevels = async () => {
        try{
            var result = await shelfService.GetRacksLevels(rackId);

            // w resulcie mamy obiekty {"level":0}, potrzebna jest sama wartosc
            var rackLevels = result.data.map(object => object.level);

            console.log(`Rack levels: ${JSON.stringify(rackLevels)}`);

            //uzywajac shelfTypeMap zwracamy tylko te levele ktorych jeszcze nie ma dodanych dla regalu sprawdzajac, czy dany key jest w tablicy rackLevels
            setSelectList(shelfTypeMap.filter(shelf => !rackLevels.includes(shelf.key)));
            //console.log(`Ustawiona selectList: ${JSON.stringify(selectList)}`);
        }
        catch(err){
            console.log(err);
        }
    }

    //USE EFFECT HOOKS=========================================================================================
    useEffect( () => {
        getRacksLevels();
    }, [])

    return(
     <SafeAreaView className={"h-full mx-2"}>
         <KeyboardAvoidingView
             behavior="padding"
             clasName={`h-full px-4`}>

             <View className="flex flex-row items-center justify-between my-5">
                 <CancelButton onPress={() => setIsModalVisible(false)} />
                 <Text className="absolute left-1/2 transform -translate-x-1/2 my-5 text-3xl font-bold">{header}</Text>
             </View>

             <View className={'mt-8'}>
                 <Text>Select shelf</Text>
                 <CustomSelectList
                     selectKey={selectKey}
                     setSelected={(val) => setForm((prevForm) => ({...prevForm, title: val}))}
                     typeMap={selectList}
                     form={form}
                     defaultOption={defaultOption}
                     onSelect={() => handleTitle()}
                 />
             </View>

             <NumberFormField
                 title="Maximum quantity"
                 value={form?.maxQuant ? form.maxQuant.toString() : ''}
                 handleChangeText={(e) => setForm({...form, maxQuant: e})}
                 onChange={e => handleMaxQuantity(e)}
                 isError={maxQuantError}
                 iconsVisible={true}
                 otherStyles={"mt-7"}
             />
             {(maxQuantError && form.maxQuant.length > 0) ? <Text className={'text-red-600'}>{shelfErrorMessages.maxQuant}</Text> : null}

             <CustomButton
                 title="Save"
                 handlePress={() => {
                     if (object?.shelfId)
                         handleEdit(object.shelfId, form);
                     else handleAdd(form);
                 }}
                 containerStyles="w-full mt-7"
                 textStyles={"text-white"}
                 isLoading={titleError || maxQuantError}
                 showLoading={false}
             />

         </KeyboardAvoidingView>
     </SafeAreaView>
    )
}

export default ShelvesMobileForm;
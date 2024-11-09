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


const ShelvesMobileForm = ({object = {}, header, setIsModalVisible, rackId = null}) => {
    const [form, setForm] = useState({
        title: object?.title !== undefined && object?.title !== null ? object.title : -1,
        maxQuant: object?.maxQuant || '0',
        prodcutId: object?.productsProductId || null
    });

    const [titleError, setTitleError] = object?.title ? useState(false) : useState(true);
    const [maxQuantError, setMaxQuantError] = object?.maxQuant ? useState(false) : useState(true);
    const [selectKey, setSelectKey] = useState(0);
    const[errors, setErrors] = useState({});

    const defaultOption = form?.title !== undefined && form?.title !== -1 ? shelfTypeMap.find(item => item.key === form.title) : null;

    const handleTitle = () => {
        form.title  === -1 ? setTitleError(true) : setTitleError(false);
        console.log(`Wybor: ${form.title}`);
    }

    const handleMaxQuant = (e) => {
        const maxQuant = parseInt(e.nativeEvent.text);
        //console.log(maxQuant)
        Number.isNaN(maxQuant) ? setMaxQuantError(true)
         :
            (maxQuant < 0 || maxQuant >  2147483647) ?
                setMaxQuantError(true) : setMaxQuantError(false)
       // console.log(`Wartosc maxQuantError: ${maxQuantError}`)
    }

    const handleEdit = async (id, form) => {
        setForm(prevForm=> setForm({...prevForm, maxQuant: parseInt(prevForm.maxQuant)}));
        console.log(`default option : ${JSON.stringify(defaultOption)}`);
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
                    maxQuant: '0',
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


    return(
     <SafeAreaView className={"h-full mx-2"}>
         <KeyboardAvoidingView
             behavior="padding"
             clasName={`h-full px-4`}>

             <Text className={'my-5 text-3xl font-bold'}>{header}</Text>

             <View className={'mt-8'}>
                 <Text>Select shelf</Text>
                 <CustomSelectList
                     selectKey={selectKey}
                     setSelected={(val) => setForm((prevForm) => ({...prevForm, title: val}))}
                     typeMap={shelfTypeMap}
                     form={form}
                     defaultOption={defaultOption}
                     onSelect={() => handleTitle()}
                 />
             </View>
             {titleError ? <Text className={'text-red-600'}>{shelfErrorMessages.title}</Text> : null}

             <NumberFormField
                 title="Maximum quantity"
                 value={form?.maxQuant ? form?.maxQuant.toString() : null}
                 handleChangeText={(e) => setForm({...form, maxQuant: e})}
                 onChange={e => handleMaxQuant(e)}
                 isError={maxQuantError}
                 iconsVisible={true}
                 otherStyles={"mt-7"}
             />
             {maxQuantError ? <Text className={'text-red-600'}>{shelfErrorMessages.maxQuant}</Text> : null}

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
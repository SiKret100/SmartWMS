import {KeyboardAvoidingView, SafeAreaView, Text, View} from "react-native";
import React, {useState} from "react";
import FormField from "../FormField";
import CategoriesMobileForm from "../categories/CategoriesMobileForm";
import CustomSelectList from "../selects/CustomSelectList";
import shelfTypeMap from "../../data/Mappers/shelfType";
import alertTypeMap from "../../data/Mappers/alertType";


const ShelvesMobileForm = ({object = {}, header, setIsModalVisible, rackId = null}) => {
    const [form, setForm] = useState({
        title: object?.title || -1,
        maxQuant: object?.maxQuant || "",
        prodcutId: object?.productsProductId || null
    });

    const [titleError, setTitleError] = object?.title ? useState(false) : useState(true);
    const [maxQuantError, setMaxQuantError] = object?.maxQuant ? useState(false) : useState(true);
    const [selectKey, setSelectKey] = useState(0);

    const defaultOption = form.title !== -1 ? shelfTypeMap.find(item => item.key === form.title) : null;

    const handleTitle = (e) => {
        const title = e.nativeEvent.text
        title  === -1 ? setTitleError(true) : setTitleError(true);
    }

    const handleMaxQuant = (e) => {
        // const maxQuant = parseInt(await e.nativeEvent.text);
        // isNaN(maxQuant) ? setMaxQuantError(true) :
        //     (maxQuant < 0 || maxQuant >  2147483647) ?
        //         setMaxQuantError(true) : setMaxQuantError(false);
    }


    return(
     <SafeAreaView className={"h-full mx-2"}>
         <KeyboardAvoidingView
             behavior="padding"
             clasName={`h-full px-4`}>

             <Text className={'my-5 text-3xl font-bold'}>{header}</Text>

             <View className={'mt-8'}>
                 <CustomSelectList
                     selectKey={selectKey}
                     setSelected={(val) => setForm((prevForm) => ({...prevForm, title: val}))}
                     typeMap={shelfTypeMap}
                     form={form}
                     defaultOption={defaultOption}
                     onSelect={() => handleTitle()}
                 />
             </View>

             <FormField
                 title="Maximum quantity"
                 value={form.maxQuant}
                 handleChangeText={(e) => setForm({...form, maxQuant: parseInt(e)})}
                 onChange={e => handleMaxQuant(e)}
                 isError={maxQuantError}
                 iconsVisible={true}
             />

         </KeyboardAvoidingView>
     </SafeAreaView>
    )
}

export default ShelvesMobileForm;
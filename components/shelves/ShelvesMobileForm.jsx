import {KeyboardAvoidingView, SafeAreaView, Text, View} from "react-native";
import React, {useState} from "react";
import CustomSelectList from "../selects/CustomSelectList";
import shelfTypeMap from "../../data/Mappers/shelfType";
import CustomButton from "../buttons/CustomButton";
import shelfService from "../../services/dataServices/shelfService";
import {useEffect} from "react";
import CancelButton from "../buttons/CancelButton";
import crudService from "../../services/dataServices/crudService";
import ShelfDto from "../../data/DTOs/shelfDto";

const ShelvesMobileForm = ({object = {}, header, setIsModalVisible, rackId}) => {

    //PROPS====================================================================================================
    const [form, setForm] = useState({
        title: object?.title !== undefined && object?.title !== null ? object.title : -1,
        maxQuant: object?.maxQuant || "0",
        currentQuant: object?.currentQuant || "0",  
        racksRackId: rackId
    });

    const [titleError, setTitleError] = object?.title ? useState(false) : useState(true);
    const [selectKey, setSelectKey] = useState(0);
    const[errors, setErrors] = useState({});
    const[selectList, setSelectList] = useState([]);
    const defaultOption = form?.title !== undefined && form?.title !== -1 ? shelfTypeMap.find(item => item.key === form.title) : null;

    //FUNCTIONS================================================================================================
    const handleEdit = async (id, form) => {
        setForm(prevForm=> setForm({...prevForm, maxQuant: parseInt(prevForm.maxQuant)}));

        try {
            const shelfDto = new ShelfDto(form)
            await crudService.Update(id , shelfDto, "Shelf");

            const result = await shelfService.Update(id, form);

            if (result.errors) {
                setErrors(result.errors);
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


        try{
            const shelfDto = new ShelfDto(form);
            const result = await  crudService.Post(shelfDto, "Shelf");
            if (result.errors){
                setErrors(result.errors);
                console.log(`Błędy przechwycone: ${JSON.stringify(result.errors)}`);
            }


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


    const getRacksLevels = async () => {
        try{

            var result = await crudService.Get(rackId, "Shelf/racksLevels");

            var rackLevels = result.data.map(object => object.level);

            console.log(`Rack levels: ${JSON.stringify(rackLevels)}`);

            setSelectList(shelfTypeMap.filter(shelf => !rackLevels.includes(shelf.key)));
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

             <CustomButton
                 title="Save"
                 handlePress={() => {
                     if (object?.shelfId)
                         handleEdit(object.shelfId, form);
                     else handleAdd(form);
                 }}
                 containerStyles="w-full mt-7"
                 textStyles={"text-white"}
                 isLoading={titleError}
                 showLoading={false}
             />

         </KeyboardAvoidingView>
     </SafeAreaView>
    )
}

export default ShelvesMobileForm;
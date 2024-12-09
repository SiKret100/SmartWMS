import CustomSelectList from "../selects/CustomSelectList";
import { SafeAreaView, Text, View, Platform} from "react-native";
import React, {useState, useEffect} from "react";
import { KeyboardAvoidingView } from "react-native";
import CustomButton from "../buttons/CustomButton";
import TextFormField from "../form_fields/TextFormField";
import userTypeMap from "data/Mappers/userType.js"
import userService from "services/dataServices/userService.js";
import { ScrollView } from "react-native-gesture-handler";
import userErrorMessage from "../../data/ErrorMessages/userErrorMessages.jsx"
import ErrorMessages from "components/errors/ErrorMessages.jsx";

const UserMobileForm = ({ object = {}, header }) => {

    //PROPS====================================================================================================
    const [form, setForm] = useState({
        email: "",
        userName: "",
        password: "",
        role: "",
        managerId: undefined
    });

    const [errors, setErrors] = useState({});
    const [selectKey, setSelectKey] = useState(0);
    const [managers, setManagers] = useState([])
    const [emailError, setEmailError] = useState(true);
    const [passwordError, setPasswordError] = useState(true);
    const [usernameError, setUsernameError] = useState(true);
    const [roleError, setRoleError] = useState(true);
    const [managerError, setManagerError] = useState(true);

    //FUNCTIONS================================================================================================
     const handleAdd = async (form) => {
        try {
            setErrors({})
            if ((form.role === 1 && (form.managerId === undefined || form.managerId === -1)))
                setErrors({ "Description": ["Employee must have manager assigned"] });

            const result = await userService.Add(form);

            if (result.errors) {
                setErrors((prevErrors) => ({ ...prevErrors, ...result.errors }));
            } else {

                if (!errors.Description) {
                    setErrors({});
                    setForm({
                        email: "",
                        userName: "",
                        password: "",
                        role: "",
                        managerId: undefined
                    });
                    setSelectKey((prevKey) => prevKey + 1);
                }
            }
        }
        catch (err) {
            setErrors(err);
        }
    }

    const handleEmail = (e) => {
        const emailVar = e.nativeEvent.text;
        if (emailVar.includes("@") && emailVar.includes(".")) {
            setEmailError(false);
        } else {
            setEmailError(true);
        }
    }

    const handleUsername = (e) => {
        const usernameVar = e.nativeEvent.text;
        if (usernameVar.length >= 5) {
            setUsernameError(false);
        } else {
            setUsernameError(true);
        }
    }

    const handlePassword = (e) => {
        const passVar = e.nativeEvent.text;
        const passRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;
        
        if (passVar.match(passRegexp))
            setPasswordError(false)
        else
            setPasswordError(true);
    }

    const handleRole = () => {
        if (form.role == -1) {
            setRoleError(true);
        } else {

            if(form.role == 1 && form.managerId == -1){
                setManagerError(true);

            } else { 
                setManagerError(false);
                setRoleError(false);
            }
        }
    }

    const handleManager = () => {
        if (form.managerId == -1) {
            setManagerError(true);
        } else {
            setManagerError(false);
        }
    }

    const fetchManagers = async () => {
        try {
            const response = await userService.GetAll("Manager");
            setManagers(response.data.map((manager) => { return { key: manager.id, value: manager.userName } }));
        }
        catch (err) {
            setErrors(err);
        }
    }


    //USE EFFECT HOOKS=========================================================================================
    useEffect(() => {
        fetchManagers();
    }, [])

    return (
        <ScrollView>
            <SafeAreaView className="h-full">
                <KeyboardAvoidingView
                    behavior="padding"
                    className={`h-full px-4 ${Platform.OS === "web" ? "w-96" : "w-full"}`}
                >
                    <Text className="my-5 text-3xl font-bold">{header}</Text>

                    <TextFormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles=""
                        keyboardType="email-address"
                        onChange={e => handleEmail(e)}
                        isError={emailError}
                        iconsVisible={true}

                    />

                    {form.email.length < 1 ? null : emailError ?
                        <Text className="text-red-500">{userErrorMessage.email}</Text>
                        :
                        null
                    }

                    <TextFormField
                        title="Username"
                        value={form.userName}
                        handleChangeText={(e) => setForm({ ...form, userName: e })}
                        otherStyles="mt-7"
                        onChange={e => handleUsername(e)}
                        isError={usernameError}
                        iconsVisible={true}
                    />

                    {form.userName.length < 1 ? null : usernameError ?

                        <Text className="text-red-500">{userErrorMessage.userName}</Text>
                        :
                        null
                    }

                    <TextFormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                        onChange={e => handlePassword(e)}
                        isError={passwordError}
                        iconsVisible={true}
                    />

                    {form.password.length < 1 ? null : passwordError ?


                        <Text className="text-red-500">{userErrorMessage.password}</Text>
                        :
                        null
                    }

                    <View className="mt-6">
                        <Text
                            className='text-base font-pmedium'> Role
                        </Text>
                        <CustomSelectList
                            setSelected={(e) => setForm((prevForm) => ({ ...prevForm, role: e }))}
                            typeMap={userTypeMap}
                            defaultOption={{key: -1, value: "Select role..."}}
                            onSelect={() => handleRole()}
                            title="Role"
                        />

                    </View>

                    <View className="mt-6">
                        {form.role === 1 && (
                            <View>
                                <Text
                                    className='text-base font-pmedium'> Manager
                                </Text>
                                <CustomSelectList
                                    setSelected={(e) => setForm((prevForm) => ({ ...prevForm, managerId: e }))}
                                    typeMap={managers}
                                    defaultOption={{key: -1, value: "Select manager..."}}
                                    onSelect={() => handleManager()}
                                    title={"Manager"}
                                />
                            </View>

                        )}
                    </View>

                    <CustomButton
                        title="Save"
                        handlePress={() => handleAdd(form)}
                        containerStyles="w-full mt-7"
                        textStyles={"text-white"}
                        showLoading = {false}
                        isLoading={emailError || passwordError || usernameError || roleError || managerError}

                    />

                    {Object.keys(errors).length > 0 && (
                        <ErrorMessages errors={errors}/>
                    )}
                    
                </KeyboardAvoidingView>

            </SafeAreaView>

        </ScrollView>

    );
}

export default UserMobileForm;
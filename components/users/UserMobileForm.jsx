import CustomSelectList from "../selects/CustomSelectList";
import { SafeAreaView, Text, View, Modal, Platform, ActivityIndicator, FlatList } from "react-native";
import { useRef, useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import CustomButton from "../buttons/CustomButton";
import FormField from "../FormField";
import userTypeMap from "data/Mappers/userType.js"
import userService from "services/dataServices/userService.js";
import { ScrollView } from "react-native-gesture-handler";
import FallingTiles from "../FallingTiles";
import userErrorMessage from "../../data/ErrorMessages/userErrorMessages.js"
import ErrorMessages from "components/errors/ErrorMessages.jsx";

const UserMobileForm = ({ object = {}, header }) => {
    const [form, setForm] = useState({
        email: object?.email || "",
        userName: object?.userName || "",
        password: object?.password || "",
        role: object?.role || "",
        managerId: object?.managerId || undefined
    });

    const [errors, setErrors] = useState({});
    const [selectKey, setSelectKey] = useState(0);
    const [managers, setManagers] = useState([])
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [roleError, setRoleError] = useState(true);
    const [managerError, setManagerError] = useState(false);


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
        const passRegexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$";
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
            const response = await userService.GetAll(roleName = "Manager");
            setManagers(response.data.map((manager) => { return { key: manager.id, value: manager.userName } }));
            console.log(`Managers: ${JSON.stringify(managers)}`);
        }
        catch (err) {
            console.log(err);
            setErrors(err);
        }
    }

    useEffect(() => {
        fetchManagers();
    }, [])

    

    const handleAdd = async (form) => {
        try {
            setErrors({})
            if ((form.role === 1 && (form.managerId === undefined || form.managerId === -1)))
                setErrors({ "Description": ["Employee must have manager assigned"] });

            const result = await userService.Add(form);

            if (result.errors) {
                const newErrros = result.errors
                console.log(`Errors: ${JSON.stringify(errors)}`)
                setErrors((prevErrors) => ({ ...prevErrors, ...result.errors }));
                console.log(`Błędy przechwycone: ${JSON.stringify(result.errors)}`);
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

    return (
        <ScrollView>
            <SafeAreaView className="h-full">
                <KeyboardAvoidingView
                    behavior="padding"
                    className={`h-full px-4 ${Platform.OS === "web" ? "w-96" : "w-full"}`}
                >
                    <Text className="my-5 text-3xl font-bold">{header}</Text>

                    <FormField
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

                    <FormField
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

                    <FormField
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



                    <View className="mt-7">
                        <CustomSelectList
                            setSelected={(e) => setForm((prevForm) => ({ ...prevForm, role: e }))}
                            typeMap={userTypeMap}
                            defaultOption={{ key: -1, value: "Select role..." }}
                            onSelect={() => handleRole()}
                            title="Role"
                        />

                    </View>

                    <View className="mt-7">
                        {form.role === 1 && (
                            <View>
                                <CustomSelectList
                                    setSelected={(e) => setForm((prevForm) => ({ ...prevForm, managerId: e }))}
                                    typeMap={managers}
                                    defaultOption={{ key: -1, value: "Select role" }}
                                    onSelect={() => handleManager()}
                                    title={"Manager"}
                                />
                            </View>

                        )}
                    </View>


                    <CustomButton
                        title="Save"
                        handlePress={() => {
                            if (object?.email)
                                handleEdit(object.id, form);
                            else handleAdd(form);
                        }}
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
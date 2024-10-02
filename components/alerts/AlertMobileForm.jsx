import { Text, View } from "react-native";
import React from "react";
import FormField from "../FormField";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import CustomButton from "../buttons/CustomButton";
import alertService from "../../services/dataServices/alertService";
import { SelectList } from "react-native-dropdown-select-list";
import alertTypeMap from "../../data/Mappers/alertType";
import CustomSelectList from "../CustomSelectList";

const AlertMobileForm = ({object = {}, header}) => {
  const [errors, setErrors] = useState({});
  const [selectKey, setSelectKey] = useState(0);



  const [form, setForm] = useState({
    title: object?.title || "",
    description: object?.description || "",
    alertType: object?.alertType !== undefined && object.alertType !== null ? object.alertType : -1
  });

  const handleEdit = async (id, form) => {
    try {
      const result = await alertService.Update(id, form);
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
        setSelectKey((prevKey) => prevKey + 1);
      }
    } catch (err) {
      //console.log(err)
      setErrors(err);
    }
  }
  
  const handleAdd = async (form) => {
    try {
      const result = await alertService.Add(form);

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
      }
    } catch (err) {
      //console.log(err)
      setErrors(err);
    }
  };

  useEffect(() => {
    console.log(`Otrzymano obiekt: ${JSON.stringify(object)}`);
  }, [])

  return (
    <SafeAreaView className="h-full">
      <KeyboardAvoidingView
        behavior="padding"
        className={`h-full px-4 ${Platform.OS === "web" ? "w-96" : "w-full"}`}
      >
        <Text className = "my-5 text-3xl font-bold">{header}</Text>

        <FormField
          title="Title"
          value={form.title}
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles=""
          keyboardType="email-address"
        />

        <FormField
          title="Description"
          value={form.description}
          handleChangeText={(e) => setForm({ ...form, description: e })}
          otherStyles="mt-7"
        />

        <View className = "mt-8">
          <CustomSelectList
            selectKey={selectKey}
            setForm={setForm}
            alertTypeMap={alertTypeMap}
            form={form}
          />
        </View>

        <CustomButton
          title="Save"
          handlePress={() => { if(object?.alertId) handleEdit(object.alertId, form); else handleAdd(form); }}
          containerStyles="w-full mt-7"
          textStyles={"text-white"}
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

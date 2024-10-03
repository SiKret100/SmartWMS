import { StyleSheet, Text, View } from "react-native";
import { React, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "../buttons/CustomButton";
import userService from "services/dataServices/userServices.js";
import UserDto from "data/DTOs/userDto.js";

const UserMobileDisplayer = () => {
  const [errors, setErrors] = useState([]);

  const myUser = {
    email: "daw@daw.pl",
    userName: "SDFasdf",
    password: "test2#dsafasdfS"
    };

  const [err, setError] = useState("");

  const userToDelete = "a2f1c19c-5a64-4a03-87fd-4b7f91acb81c";

  const handleAdd = async (userData) => {
    try {
      const result = await userService.Add(userData);
      console.log(result);
  

      if (result.errors) {
        setErrors(result.errors);
        console.log(`Validation errors: ${JSON.stringify(result.errors)}`);
      } 
      else if (Array.isArray(result) && result[0].description) {
        setErrors({"info": result[0].description });
        console.log(`Error: ${result[0].description}`);
      } 
      else {
        setErrors({});
        console.log("User added successfully");
      }

    } catch (err) {
      setError(err);
      console.log(err);
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-start align-middle">
      <ScrollView>
        <CustomButton
          title="GetAll"
          handlePress={() => userService.GetAll()}
        />

        <CustomButton
          title="Add"
          handlePress={() => handleAdd(myUser)}
        />

        <CustomButton
          title="Exterminate"
          handlePress={() => userService.Delete(userToDelete)}
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
      </ScrollView>
    </SafeAreaView>
  );
};


export default UserMobileDisplayer;

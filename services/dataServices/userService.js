import axios from "axios";
import { Platform } from "react-native";
import UserDto from "../../data/DTOs/userDto.js";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

axios.defaults.withCredentials = true;

export default class userService {
  static ip = process.env.EXPO_PUBLIC_IP;

  static GetAll = async (roleName=null) => {
    const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let response;

      const mainUrl = `${this.ip}/api/User/getUsersByRole`;

      if (roleName === null) {
          response = await axios.get(mainUrl, config);
      }else{
        const urlWithRole = `${mainUrl}?roleName=${roleName}`;
        response = await axios.get(urlWithRole, config);
      }

      return response;
    } catch (err) {
        //console.log(err);
        throw err;
    }
  };

  static Add = async (userData) => {
    const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const userDto = new UserDto(userData);
      let response;
      if (userDto.managerId === null)
        response = await axios.post(`${this.ip}/api/User/register/manager`, userDto, config);
      else
        response = await axios.post(`${this.ip}/api/User/register/employee`, userDto, config);

      
      router.push('/home/users/');
      //console.log("From service: " + JSON.stringify(response));
      return response;

    } catch (err) {
        throw err;
    }

    
  };

}

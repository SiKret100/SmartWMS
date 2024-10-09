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
        if (Platform.OS === "web") {
          response = await axios.get(mainUrl);
        } else {
          response = await axios.get(mainUrl, config);
        }
      }else{
        const urlWithRole = `${mainUrl}?roleName=${roleName}`;
        if (Platform.OS === "web") {
            response = await axios.get(urlWithRole);
          } else {
            response = await axios.get(urlWithRole, config);
          }

      }

      //console.log(response);
      return response;
    } catch (err) {
        console.log(err);
        //console.log(err.response.data);   
    
        return err;
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
      if (Platform.OS === "web") {
        if (userDto.managerId === null)
          response = await axios.post(`${this.ip}/api/User/register/manager`, userDto);
        else
          response = await axios.post(`${this.ip}/api/User/register/employee`,userDto);
      } else {
        if (userDto.managerId === null)
          response = await axios.post(`${this.ip}/api/User/register/manager`, userDto, config);
        else
          response = await axios.post(`${this.ip}/api/User/register/employee`, userDto, config);
      }
      
      router.push('/home/users/');
      
      return response;

    } catch (err) {
        //console.log(err.response.data);
        return err.response.data;
    }

    
  };

  static Get = async (id) => {
    const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
        let response;
        if (Platform.OS === "web") {
            response = await axios.get(`${this.ip}/api/User/${id}`);
        } else {
        response = await axios.get(`${this.ip}/api/User/${id}`, config);
        }
    }
    catch (err){
        return err.response.data;
    }
  }

  static Delete = async (id) => {
    
    const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try{
        let response;
        if (Platform.OS === "web") {
            response = await axios.delete(`${this.ip}/api/User/delete/${id}`);
        } else {
            response = await axios.delete(`${this.ip}/api/User/delete/${id}`, config);
        }
        
        console.log(response);
        return response;
    }catch(err){
      return err.response.data;
    }


    

  }
}

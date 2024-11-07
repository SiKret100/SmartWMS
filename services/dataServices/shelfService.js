/* eslint-disable no-undef */
import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import ShelfDto from "../../data/DTOs/shelfDto";

export default class shelfService {
    static ip = process.env.EXPO_PUBLIC_IP;

    static Delete = async (id) => {

        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try{
            let response

            if (Platform.OS === "web") {
                response = await axios.delete(`${this.ip}/api/Shelf/${id}`);
            } else {
                response = await axios.delete(`${this.ip}/api/Shelf/${id}`, config);
            }

            console.log(response);
            return response;
        }catch(err){
            console.log("Error from service" + err);
            return err.response.data;

        }
    }

    static Update = async (id, shelfData) => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        try{
            const shelfDto = new ShelfDto(shelfData)

            let response;

            if (Platform.OS === "web") {
                response = await axios.put(`${this.ip}/api/Shelf/${id}`, shelfDto);
            } else {
                response = await axios.put(
                    `${this.ip}/api/Shelf/${id}`, shelfDto, config);
            }

            console.log(response);
            return response;
        }catch(err){
            console.log("Error from service" + err);
            return err.response.data;
        }
    }

}
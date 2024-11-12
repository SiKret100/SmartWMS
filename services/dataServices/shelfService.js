/* eslint-disable no-undef */
import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import ShelfDto from "../../data/DTOs/shelfDto";

export default class shelfService {
    static ip = process.env.EXPO_PUBLIC_IP;

    static Add = async (shelfData) => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {

            const shelfDto = new ShelfDto(shelfData);
            console.log(`Utworzone dto: ${JSON.stringify(shelfDto)}`)
            let response;
            if (Platform.OS === "web") {
                response = await axios.post(`${this.ip}/api/Shelf`, shelfDto);
            } else {
                response = await axios.post(`${this.ip}/api/Shelf`, shelfDto, config);
            }
            console.log(JSON.stringify(response));
            return response;

        } catch (err) {
            console.log(`Wystapil blad: ${JSON.stringify(err)}`);
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

            return response;
        }catch(err){
            console.log("Error from service" + err);
            return err.response.data;
        }
    }

    static GetRacksLevels = async (rackId) => {
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
                response = await axios.get(`${this.ip}/api/Shelf/racksLevels/${rackId}`);
            } else {
                response = await axios.get(
                    `${this.ip}/api/Shelf/racksLevels/${rackId}`, config);
            }

            return response;
        }
        catch(err){
            console.log(`Errors from racklevels: ${JSON.stringify(err)} `);
        }
    }

    static GetAll = async () => {
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
                response = await axios.get(`${this.ip}/api/Shelf`);
            } else {
                response = await axios.get(
                    `${this.ip}/api/Shelf`, config);
            }

            return response;
        }
        catch(err){
            console.log(`Error from shelfservice: ${JSON.stringify(err)} `);
        }
    }

}
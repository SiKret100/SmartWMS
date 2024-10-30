import axios from "axios";
import {Modal, Platform, View} from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import CategoryDto from "../../data/DTOs/categoryDto";
import categoryDto from "../../data/DTOs/categoryDto";

export default class categoryService {
    
    static ip = process.env.EXPO_PUBLIC_IP;

    static GetCategoriesWithSubcategories = async () => {
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
                response = await axios.get(`${this.ip}/api/Category/withSubcategories`);
            } else {
                response = await axios.get(`${this.ip}/api/Category/withSubcategories`, config);
            }

            return response;
        }catch(err){
            return err.response.data;
        }
    }

    static Add = async (userData) => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const categoryDto = new CategoryDto(userData);
            let response;
            if (Platform.OS === "web") {
               response = await axios.post(`${this.ip}/api/Category`, categoryDto);
            } else {
                response = await axios.post(`${this.ip}/api/Category`, categoryDto, config);
            }
            router.push('/home/categories/');

            return response;
        }
        catch(err){
            return err.response.data;
        }
    }

    static Update = async(id, userData) => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const categoryDto = new CategoryDto(userData);

            let response;
            if (Platform.OS === "web") {
                response = await axios.put(`${this.ip}/api/Category/${id}`, categoryDto);
            } else {
                response = await axios.put(
                    `${this.ip}/api/Category/${id}`,
                    categoryDto,
                    config
                );
            }

            console.log(response);
            return response;
        } catch (err) {
            return err.response.data;
        }
    }
}
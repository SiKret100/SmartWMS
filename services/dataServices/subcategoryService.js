import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import SubcategoryDto from "data/DTOs/subcategoryDto.js"
import {router} from "expo-router";

export default class subcategoryService {
    static ip = process.env.EXPO_PUBLIC_IP;

    static Add = async(subcategoryData) => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const subcategoryDto = new SubcategoryDto(subcategoryData);
            let response;
            if (Platform.OS === "web") {
                response = await axios.post(`${this.ip}/api/Subcategory`, subcategoryDto);
            } else {
                response = await axios.post(`${this.ip}/api/Subcategory`, subcategoryDto, config);
            }
            router.push('/home/categories/');

            return response;
        }
        catch(err){
            return err.response.data;
        }
    }

    static Update = async(id, subcategoryData) => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try{


            const subcategoryDto = new SubcategoryDto(subcategoryData)
            //console.log(JSON.stringify(subcategoryDto));
            //console.log(`Przekazane id: ${id}`);
            let response

            if (Platform.OS === "web") {
                response = await axios.put(`${this.ip}/api/Subcategory/${id}`, subcategoryDto);
            } else {
                response = await axios.put(
                    `${this.ip}/api/Subcategory/${id}`,
                    subcategoryDto,
                    config
                );
            }

           // console.log(response);
            return response;

        } catch (err) {
            console.log(err);
            return err.response.data;
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
            let response

            if (Platform.OS === "web") {
                response = await axios.get(`${this.ip}/api/Subcategory`);
            } else {
                response = await axios.get(
                    `${this.ip}/api/Subcategory`,
                    config
                );
            }

            //console.log(response);
            return response;
        }
        catch (err) {
            console.log(err);
            return err.response.data;
        }
    }

}
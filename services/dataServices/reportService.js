import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";
import CategoryDto from "../../data/DTOs/categoryDto";
import axios from "axios";
import {router} from "expo-router";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';
import ReportDto from "../../data/DTOs/reportDto";


export default class reportService {
    static ip = process.env.EXPO_PUBLIC_IP;

    static UsersFinishedTasks = async () => {
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
                response = await axios.get(`${this.ip}/api/Task/usersFinishedTasks`);
            } else {
                response = await axios.get(`${this.ip}/api/Task/usersFinishedTasks`, config);
            }

            // console.log("Response from service: " + JSON.stringify(response.data));
            return response;
        } catch (err) {
            console.log("Error from service" + JSON.stringify(err));
            return err.response.data;
        }
    };

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
                response = await axios.delete(`${this.ip}/api/Report/${id}`);
            } else {
                response = await axios.delete(`${this.ip}/api/Report/${id}`, config);
            }

            console.log("Delete response: "+ response.data);
            return response;
        }catch(err){
            console.log("Error from service: " + JSON.stringify(err));
            return err.response.data;

        }
    }


    static Download = async (id) => {
        const token = Platform.OS !== "web" ? await SecureStore.getItemAsync("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            responseType: 'arraybuffer',
        };

        try {
            const response = await axios.get(`${this.ip}/api/Report/downloadFile/${id}`, config);

            const base64Data = Buffer.from(response.data, 'binary').toString('base64');

            const fileUri = `${FileSystem.documentDirectory}report_${id}.pdf`;

            await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            });

            await Sharing.shareAsync(fileUri);



            return fileUri
        } catch (err) {
            return err
        }
    };


    static Get = async () => {
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
                response = await axios.get(`${this.ip}/api/Report`);
            } else {
                response = await axios.get(`${this.ip}/api/Report`, config);
            }

            // console.log("Response from service: " + JSON.stringify(response.data));
            return response;
        } catch (err) {
            console.log("Error from service" + JSON.stringify(err));
            return err.response.data;
        }
    };

    static Add = async (data) => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const reportDto = new ReportDto(data);
            let response;
            if (Platform.OS === "web") {
                response = await axios.post(`${this.ip}/api/Report/`, reportDto);
            } else {
                response = await axios.post(`${this.ip}/api/Report`, reportDto, config);
            }

            // console.log("Response from service: " + JSON.stringify(response.data));
            return response;
        }
        catch(err){
            console.log("Error from service: " + err);
            return err.response.data;
        }
    }

    static UploadFile = async (id, data) => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            },
        };



        try {
            let response;
            if (Platform.OS === "web") {
                response = await axios.put(`${this.ip}/api/Report/uploadFile/${id}`, data);
            } else {
                response = await axios.put(`${this.ip}/api/Report/uploadFile/${id}`, data, config);
            }

            return response;
        }
        catch(err){
            return err.response.data;
        }
    }

}
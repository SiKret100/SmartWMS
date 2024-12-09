import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';


export default class reportService {
    static ip = process.env.EXPO_PUBLIC_IP;

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
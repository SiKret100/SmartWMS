import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import LaneDto from "../../data/DTOs/laneDto";
import {router} from "expo-router";

export default class laneService {

    static ip = process.env.EXPO_PUBLIC_IP;

    static GetAllWithRacksShelves = async () => {
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
                response = await axios.get(`${this.ip}/api/Lane/getAllWithRacksShelves`);
            } else {
                response = await axios.get(`${this.ip}/api/Lane/getAllWithRacksShelves`, config);
            }

            //console.log("From service:" + JSON.stringify(response.data));
            return response;
        } catch (err) {
            return err.response.data;
        }
    };

    static Add = async (laneData) => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {

            const laneDto = new LaneDto(laneData);
            console.log(`Utworzone dto: ${JSON.stringify(laneDto)}`)
            let response;
            if (Platform.OS === "web") {
                response = await axios.post(`${this.ip}/api/Lane`, laneDto);
            } else {
                response = await axios.post(`${this.ip}/api/Lane`, laneDto, config);
            }
            console.log(JSON.stringify(response));
            router.push('/home/shelves/');
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
                response = await axios.delete(`${this.ip}/api/Lane/${id}`);
            } else {
                response = await axios.delete(`${this.ip}/api/Lane/${id}`, config);
            }

            console.log(response);
            return response;
        }catch(err){
            console.log("Error from service" + err);
            return err.response.data;

        }
    }

    static GetAllLanes = async () => {
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
                response = await axios.get(`${this.ip}/api/Lane`);
            } else {
                response = await axios.get(`${this.ip}/api/Lane`, config);
            }

            //console.log(response);
            return response;
        }catch(err){
            console.log("Error from service" + err);
            return err.response.data;

        }
    }


}
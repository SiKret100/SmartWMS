import axios from "axios";
import { Platform } from "react-native";
import RackDto from "../../data/DTOs/rackDto";
import * as SecureStore from "expo-secure-store";

export default class rackService {
    static ip = process.env.EXPO_PUBLIC_IP;

    static Add = async (rackData) => {

        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {

            const rackDto = new RackDto(rackData);
            console.log(`Utworzone dto: ${JSON.stringify(rackDto)}`)
            let response;
            if (Platform.OS === "web") {
                response = await axios.post(`${this.ip}/api/Rack`, rackDto);
            } else {
                response = await axios.post(`${this.ip}/api/Rack`, rackDto, config);
            }
            console.log(JSON.stringify(response));
            return response;

        } catch (err) {
            console.log(`Wystapil blad: ${JSON.stringify(err)}`);
            return err.response.data;
        }

    }

    static GetAllLanesRacks = async (laneId) => {
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
                response = await axios.get(`${this.ip}/api/Rack/lanesRacks/${laneId}`)
            } else {
                response = await axios.get(`${this.ip}/api/Rack/lanesRacks/${laneId}`, config)            }
            console.log(JSON.stringify(response));
            return response;
        }
        catch(err){
            console.log(`Wystapil blad: ${JSON.stringify(err)}`);
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
                response = await axios.delete(`${this.ip}/api/Rack/${id}`);
            } else {
                response = await axios.delete(`${this.ip}/api/Rack/${id}`, config);
            }

            console.log(response);
            return response;
        }catch(err){
            console.log("Error from service" + err);
            return err.response.data;

        }
    }

}
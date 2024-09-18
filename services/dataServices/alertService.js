import axios from "axios";
import { Platform } from "react-native";
import AlertDto from "../../data/DTOs/alertDto";
import * as SecureStore from 'expo-secure-store';

axios.defaults.withCredentials = true

const getCookieByName = (name) => {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";")
    for(let c of cookies){
        let cookie = c.trim();
        if(cookie.indexOf(nameEQ) === 0){
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

export default class alertService{
    static ip = process.env.EXPO_PUBLIC_IP;
    static token = Platform.OS !== "web" ? SecureStore.getItem('token') : "";
    static config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`
        }
    };

    static Add = async (alertData) => {
        try{
            const alertDto = new AlertDto(alertData);

            let response;
            if(Platform.OS === "web"){
                response = await axios.post(`${this.ip}/api/Alert`, alertDto);
            }
            else{
                response = await axios.post(`${this.ip}/api/Alert`, alertDto, this.config);
            }

            console.log(response);
            return response;
        }
        catch(err){
            console.log(err);
        }
    }
   
    static GetAll = async () => {
        try{
            let response;
            if(Platform.OS === "web"){
                response = await axios.get(`${this.ip}/api/Alert`);
            }
            else{
                response = await axios.get(`${this.ip}/api/Alert`, this.config);
            }

            console.log(response);
            return response;
        }
        catch(err){
            console.log(err);
        }
    }

    static Get = async (id) => {
        try{
            let response;
            if(Platform.OS === "web"){
                response = await axios.get(`${this.ip}/api/Alert/${id}`);
            }
            else{
                response = await axios.get(`${this.ip}/api/Alert/${id}`, this.config);
            }

            console.log(response);
            return response;
        }
        catch(err){
            console.log(err);
        }
    }

    static Update = async (id, alertData) => {
        try{
            const alertDto = new AlertDto(alertData);

            let response;
            if(Platform.OS === "web"){
                response = await axios.put(`${this.ip}/api/Alert/${id}`, alertDto);
            }
            else{
                response = await axios.put(`${this.ip}/api/Alert/${id}`, alertDto, this.config);
            }

            console.log(response);
            return response;
        }
        catch(err){
            console.log(err);
        }
    }

    static Delete = async (id) => {
        try{
            let response;
            if(Platform.OS === "web"){
                response = await axios.delete(`${this.ip}/api/Alert/${id}`);
            }
            else{
                response = await axios.delete(`${this.ip}/api/Alert/${id}`, this.config);
            }

            console.log(response);
            throw response;
        }
        catch(err){
            console.log(err);
        }
    }

    static Seen = async (id) => {
        try{
            let response;
            if(Platform.OS === "web"){
                response = await axios.put(`${this.ip}/api/Alert/seen/${id}`);
            }
            else{
                response = await axios.put(`${this.ip}/api/Alert/${id}`, this.config);
            }

            console.log(response);
            throw response;
        }
        catch(err){
            console.log(err);
        }
    }
}
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";


const ip = process.env.EXPO_PUBLIC_IP;


const hubUrl = `${ip}/notificationHub`

const createConnection = async () => {
    const token = Platform.OS !== "web" ? await SecureStore.getItem("token") : "";

    const connection = new HubConnectionBuilder()
        .withUrl(`${hubUrl}?access_token=${token}`)
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build()

    return connection;
}

let connection;

const startConnection = async () => {
    if(!connection) {
        connection = await createConnection();
    }

    try{
        await connection.start();
        console.log("Connection started");
    }catch (err) {
        console.error("SignalR Connection Error:", err)
        setTimeout(() => startConnection(), 5000);
    }
};

connection?.onclose(async () => {
    await startConnection();
})

export const initializeSignalR = async () => {
    await startConnection();
};

export const getConnection = () => { return connection };





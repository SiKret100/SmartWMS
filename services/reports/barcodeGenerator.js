import AlertDto from "../../data/DTOs/alertDto";
import {Platform} from "react-native";
import axios from "axios";
import {router} from "expo-router";

export default class barcodeGenerator {

    static GenerateBarcode = async(barcode) => {
        let barcodeType;

        switch(barcode.length) {
            case 8:
                barcodeType = "ean8";
                break;
            case 13:
                barcodeType = "ean13";
                break;
            default:
                throw new Error("Invalid barcode length.");
        }

        try {
            const response = await axios.get(`https:/barcode.orcascan.com/?type=${barcodeType}&data=${barcode}&format=png`);

            console.log("Response from barcode service " +  response.request.responseURL);

            return response.request.responseURL;

        } catch (err) {
            throw err;
        }
    }
}
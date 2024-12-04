import React from 'react';
import {SafeAreaView, Text, TouchableHighlight, View} from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import CustomButton from "../buttons/CustomButton";

const ReportsMobileForm = () => {
    const printToFile = async () => {
        const html = `
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                </head>
                <body style="text-align: center;">
                    <h1>Hello Expo!</h1>
                    <img
                        src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
                        style="width: 90vw;" />
                </body>
            </html>
        `;
        try {
            const { uri } = await Print.printToFileAsync({ html });
            console.log('File has been saved to:', uri);
            await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (error) {
            console.error('Error creating PDF:', error);
        }
    };

    return (
        <SafeAreaView className={"justify-start align-center"}>
            <CustomButton title={"Product report"} textStyles={"text-white"} containerStyles={"px-2 mb-2 mx-2"}
                          handlePress={() => printToFile()}/>
        </SafeAreaView>
    );
};

export default ReportsMobileForm;

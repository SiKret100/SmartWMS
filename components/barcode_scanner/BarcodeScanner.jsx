import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import {Button, StyleSheet, Text, View, Modal} from 'react-native';
import CancelButton from "../buttons/CancelButton";

const BarcodeScanner = ({form=null, setForm=null, setIsModalVisible}) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState('back');
    const [scanned, setScanned] = useState(false);


    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleBarCodeScanned = (data) => {
        if (!scanned) {
            setScanned(true);
            setForm({...form, barcode: data});
            setIsModalVisible(false);
            console.log(data);
        }
    };


    return (

            <View style={styles.container}>
                <View style={styles.cancelButtonContainer}>
                    <CancelButton onPress={() => setIsModalVisible(false)} />
                </View>

                <View style={styles.cameraContainer}>
                    <CameraView
                        style={styles.camera}
                        facing={"back"}
                        barcodeScannerSettings={{
                            barcodeTypes: ["ean8", "ean13"],
                        }}
                        onBarcodeScanned={({data}) => {
                            handleBarCodeScanned(data)
                        }}>
                        <View style={styles.buttonContainer}>

                        </View>
                    </CameraView>
                </View>

            </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'space-between',
    },
    cancelButtonContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    cameraContainer: {
        justifyContent:"center",
        alignSelf: 'center',
        borderRadius: 30,
        overflow: 'hidden',
        height: 200,
        width: 300,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
export default BarcodeScanner;
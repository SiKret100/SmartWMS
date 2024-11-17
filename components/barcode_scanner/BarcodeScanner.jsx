import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import {Button, StyleSheet, Text, View, Modal} from 'react-native';

const BarcodeScanner = ({form, setForm, isModalVisible}) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState('back');
    const [scanned, setScanned] = useState(false);
    const [barcodeData, setBarcodeData] = useState('');


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
        setForm({...form, barcode: data});
        isModalVisible(false);
        console.log(data);
    };

    return (

            <View style={styles.container}>
                <View style={styles.cameraContainer}>
                    <CameraView
                        style={styles.camera}
                        facing={"back"}
                        barcodeScannerSettings={{
                            barcodeTypes: ["ean8", "ean13"],
                        }}
                        onBarcodeScanned={({data}) => {
                            {scanned ? undefined : handleBarCodeScanned(data)}
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
        alignItems: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    cameraContainer: {
        justifyContent:"center",
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
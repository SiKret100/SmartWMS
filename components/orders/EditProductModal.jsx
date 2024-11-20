import {Text, View} from "react-native";
import CancelButton from "../buttons/CancelButton";
import React, {useState} from "react";
import NumberFormField from "../form_fields/NumberFormField";
import CustomButton from "../buttons/CustomButton";
import orderErrorMessages from "../../data/ErrorMessages/orderErrorMessages";

const EditProductModal = ({setIsModalVisible, setAssignedProducts, assignedProducts, object, allProducts}) => {

    const [quantityError, setQuantityError] = useState(false);
    const [quantityErrorMessage, setQuantityErrorMessage] = useState(false);

    const [form, setForm] = useState({
        productId: object.productId,
        quantity: object.quantity
    });

    const handleQuantity = (e) => {
        const quantity = e.nativeEvent.text;
        const regexp = new RegExp("^[1-9]{1}\\d*$");
        if (regexp.test(quantity)) {
            const parsedQuantity = parseInt(quantity);
            const foundProduct = allProducts.find(product => product.productId === form.productId);
            if (parsedQuantity <= foundProduct.quantity) {
                setQuantityError(false);
                setQuantityErrorMessage("");
            } else {
                setQuantityError(true);
                setQuantityErrorMessage(orderErrorMessages.excessiveProductQuantity);
            }
        } else {
            setQuantityError(true);
            setQuantityErrorMessage(orderErrorMessages.wrongProductQuantityFormat);
        }

    };


    const handleEditProduct = () => {
        const filteredAssignedProduct = assignedProducts.filter(product => product.productId !== form.productId);
        filteredAssignedProduct.push(form);
        setAssignedProducts(filteredAssignedProduct);
        console.log("Filtered assign product: " + JSON.stringify(filteredAssignedProduct));
        setIsModalVisible(false)
        setForm({
            productId: -1,
            quantity: "",
        })

    }

    return(
        <View className={"px-2"}>
            <View className="flex flex-col items-start justify-between my-5 mx-5">
                <CancelButton onPress={() => setIsModalVisible(false)}/>
                <Text className="my-5 text-3xl font-bold">Edit assigment</Text>
            </View>


            <NumberFormField
                title={"Quantity"}
                value={form.quantity.toString()}
                handleChangeText={(e) => setForm({...form, quantity: e})}
                onChange={e => handleQuantity(e)}
                isError={!!quantityError}
                iconsVisible={true}
                otherStyles={"mt-7"}
            />

            {form.quantity.length === 0 ? null : quantityError ?

                <Text className="text-red-500">{quantityErrorMessage}</Text>
                :
                null
            }


            <CustomButton handlePress={() => handleEditProduct()} containerStyles={"mt-7"}
                          isLoading={!!quantityError}
                          showLoading={false}
                          textStyles={"text-white"}
                          title={"Add product"}></CustomButton>

        </View>
    )
}

export default EditProductModal
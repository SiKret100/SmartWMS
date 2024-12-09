import React, {useState} from "react";
import {Text, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import CancelButton from "../buttons/CancelButton";
import CustomSelectList from "../selects/CustomSelectList";
import CustomButton from "../buttons/CustomButton";
import NumberFormField from "../form_fields/NumberFormField";
import orderErrorMessages from "../../data/ErrorMessages/orderErrorMessages";

const AddProductModal = ({setIsModalVisible, setAssignedProducts, productTypeMap, allProducts}) => {

    //PROPS====================================================================================================
    const [form, setForm] = useState({
        productId: -1,
        quantity: ""
    });
    const defaultOption = {key: -1, value: "Select product..."};
    const [selectKey, setSelectKey] = useState(0);

    const [productIdError, setProductIdError] = useState(true);
    const [quantityError, setQuantityError] = useState(true);

    const [quantityErrorMessage, setQuantityErrorMessage] = useState(true);
    const [isEditable, setIsEditable] = useState(false);


    //FUNCTIONS=============================================================================================
    const handleProductId = () => {

        if (form.productId === -1) {
            setProductIdError(true);
            setIsEditable(false);
        } else {
            setProductIdError(false);
            setIsEditable(true);
        }
    };

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

    const handleAddProduct = () => {
        setAssignedProducts(prev => [...prev, form]);
        setIsModalVisible(false)
        setForm({
            productId: -1,
            quantity: "",
        })
    }

    //USE EFFECT HOOKS=========================================================================================

    return (
        <View>

            <ScrollView className={"px-2"}>
                <View className="flex flex-col items-start justify-between my-5 mx-5">
                    <CancelButton onPress={() => setIsModalVisible(false)}/>
                    <Text className="my-5 text-3xl font-bold">Assign product to order</Text>
                </View>

                <View className={"mt-12"}>
                    <CustomSelectList
                        selectKey={selectKey}
                        setSelected={val => setForm({...form, productId: val})}
                        typeMap={productTypeMap}
                        defaultOption={defaultOption}
                        onSelect={() => handleProductId()}
                    />
                </View>


                <NumberFormField
                    title={"Quantity"}
                    value={form.quantity.toString()}
                    handleChangeText={(e) => setForm({...form, quantity: e})}
                    onChange={e => handleQuantity(e)}
                    isError={!!quantityError}
                    iconsVisible={true}
                    otherStyles={"mt-7"}
                    editable={isEditable}
                />

                {form.quantity.length === 0 ? null : quantityError ?

                    <Text className="text-red-500">{quantityErrorMessage}</Text>
                    :
                    null
                }


                <CustomButton handlePress={() => handleAddProduct()} containerStyles={"mt-7"}
                              isLoading={!!quantityError || !!productIdError}
                              showLoading={false}
                              textStyles={"text-white"}
                title={"Add product"}></CustomButton>

            </ScrollView>

        </View>
    )

}

export default AddProductModal
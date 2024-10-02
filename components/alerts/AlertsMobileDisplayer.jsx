import { SafeAreaView, Text, View, Modal } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import alertService from "../../services/dataServices/alertService";
import Feather from "react-native-vector-icons/Feather";
import { Button } from "react-native-elements";
import DeleteButton from "../buttons/DeleteButton";
import EditButton from "../buttons/EditButton";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from "expo-router";
import alertTypeMap from "../../data/Mappers/alertType";
import AlertMobileForm from "components/alerts/AlertMobileForm.jsx";
import { SelectList } from 'react-native-dropdown-select-list'

const AlertMobileDisplayer = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [err, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeletedItem, setIsDeletedItem] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [selected, setSelected] = useState(-1);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(false);
      //await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await alertService.GetAll();
      console.log(`Response: ${JSON.stringify(response)}`);
      setData(response.data.reverse());
      setFilteredData(response.data.reverse());
      console.log(data);
      setLoading(true);
    } catch (err) {
      setError(err);
      console.log(`Wystąpił błąd: ${err}`);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();    
    }, [isModalVisible])
  );

  useEffect(() => {
    fetchData();
    if (isDeletedItem) 
      setIsDeletedItem(false);
  }, [isDeletedItem]);

  useEffect(() => {
    if(selected !== -1)
      setFilteredData(data.filter(record => record.alertType === selected));
    else
      setFilteredData(data);
  }, [selected])

  const handleDelete = async (id) => {
    try {
      console.log(`id: ${id}`);
      const res = await alertService.Delete(id);
    } catch (err) {
      console.log(err);
    }
    setIsDeletedItem(true);
  };

  const handleModalEdit = async (object) => {
    setCurrentEditItem(object)
    setIsModalVisible(true);
  };


  return (
    <SafeAreaView className={"flex-1 justify-start align-center"}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!loading ? (
          <View className={"justify-center align-center"}>
            <ActivityIndicator size="small" color="#000" />
          </View>
        ) : data.length === 0 ? (
          <View className={"justify-center align-center"}>
            <Text className={"text-center my-5"}>Brak alertów</Text>
          </View>
        ) : (
          <View>
            <View className={"mx-4 mt-4"}>
              <SelectList 
                boxStyles={{
                  borderColor: 'black',
                  borderWidth: 2,
                  height: 56,
                  borderRadius: 13,
                  alignItems: 'center'
                }}
                inputStyles={{ fontSize: 16 }}
                dropdownTextStyles={{ fontSize: 16 }}
                data={[{key: -1, value: 'All'} ,...alertTypeMap]}
                setSelected={(val) => setSelected(val)}
                save="key"
                defaultOption={{key: -1, value: 'All'}}
              />
            </View>
            {filteredData.map((object) => (
              <>
                <View
                  className={
                    "flex-row justify-between items-center flex-0.5 border-solid rounded-3xl border-2 px-2 py-2 mx-4 mt-4 bg-slate-200"
                  }
                >
                  <EditButton onEdit={() => handleModalEdit(object)} />
                  <View className={"px-2 py-2 mx-4"}>
                    <View>
                      <Text className={"text-center"}>{object.title}</Text>
                      <Text className={"text-center"}>{object.description}</Text>
                      <Text className={"text-center"}>{object.alertDate}</Text>
                      <Text className={"text-center"}>
                        {object.seen === 0 ? "Widziano" : "Nie widziano"}
                      </Text>
                      <Text className={"text-center"}>
                        {alertTypeMap.find(alert => alert.key === object.alertType)?.value || "Unknown"}
                      </Text>
                    </View>
                  </View>
                  <DeleteButton onDelete={() => handleDelete(object.alertId)} />
                </View>
  
                <Modal
                  visible={isModalVisible}
                  animationType="slide"
                  presentationStyle="pageSheet"
                  onRequestClose={() => setIsModalVisible(false)}
                >
                  <View className="flex-auto mt-5">
                    <AlertMobileForm
                      object={currentEditItem}
                      header="Edit"
                      setIsModalVisible={setIsModalVisible}
                    />
                  </View>
                </Modal>
                </>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}  

export default AlertMobileDisplayer;

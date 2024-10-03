import { SafeAreaView, Text, View, Modal, Platform } from "react-native";
import { useRef, useState, useEffect, useCallback } from "react";
import { ActivityIndicator, Animated } from "react-native";
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
import moment from 'moment-timezone';
import FallingTiles from "../FallingTiles";
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
    if (selected !== -1)
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
            <View className={"mx-2 mt-2 mb-10"}>
              <SelectList
                boxStyles={{
                  borderColor: 'black',
                  borderWidth: 0,
                  height: 56,
                  borderRadius: 13,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5, // Dla Androida
                  backgroundColor: '#E2E8F0',
                }}
                inputStyles={{ fontSize: 16 }}
                dropdownTextStyles={{ fontSize: 16 }}
                dropdownStyles={{
                  backgroundColor: '#E2E8F0',
                  borderWidth: 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                  backgroundColor: '#E2E8F0',
                }}

                data={[{ key: -1, value: 'All' }, ...alertTypeMap]}
                setSelected={(val) => setSelected(val)}
                save="key"
                defaultOption={{ key: -1, value: 'All' }}
              />
            </View>

            <FallingTiles>

              {filteredData.reverse().map((object) => (
                <>
                  <View
                    className={
                      "flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"
                    }
                  >
                    <EditButton onEdit={() => handleModalEdit(object)} />
                    <View className={"px-2 py-2 mx-4"}>
                      <View>
                        <Text className={"text-center"}>{object.title}</Text>
                        <Text className={"text-center"}>{object.description}</Text>
                        <Text className={"text-center"}>{moment(object.alertDate).format("DD MMMM YYYY")}</Text>
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

                    animationType={Platform.OS !== "ios" ? "" : "slide"}
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
            </FallingTiles>




          </View>



        )}
      </ScrollView>
    </SafeAreaView>
  );
}




export default AlertMobileDisplayer;

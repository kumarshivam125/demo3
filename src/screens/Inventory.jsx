import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { images } from './Main';
import axios from "axios";
import Toast from 'react-native-toast-message';

const Inventory = () => {
  const { catalog } = useSelector(state => state.cart);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [val, setVal] = useState();
  const [inventoryData, setInventoryData] = useState('');
  console.log("Val-", val)
  async function fetchInventoryData() {
    setLoading(true)
    console.log("The-");
    try {
      const { data } = await axios.get("http://10.190.129.33:4000/getInventoryData");
      console.log("Inv-", data)
      setInventoryData(data.inventory)
    }
    catch (err) {
      console.log("Error-", err)
    }
    setLoading(false)
  }
  async function updateInventory(id) {
    Toast.show({ type: 'success', text1: 'Inventory Updated.', })
    console.log("In updateInv-", val)
    try {
      const { data } = await axios.post('http://10.190.129.33:4000/updateInventoryData', { count: val, id:Number(id) });
      console.log("Update Inventory-", data)
      if (data.succes) {
        await fetchInventoryData();
      }
    }
    catch (err) {
      console.log("Error-", err)
    }
  }
  useEffect(() => {
    fetchInventoryData();
  }, [catalog])
  useEffect(() => {
    if (inventoryData) {
      const finalData = catalog.map(x => ({ ...x, image: images[x.id - 1], count: inventoryData?.find(y => y.id == x.id).count }));
      console.log("FinalData-", finalData)
      setData(finalData)
    }
  }, [inventoryData])
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40, fontWeight: '600', color: '#5D75FF', marginTop: 10 }}>Inventory</Text>
      {
        loading ? <ActivityIndicator size="large" color="#6366f1" /> :
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#2563EB',
                  padding: 15,
                  // width: 300,
                  marginVertical: 5,
                  // marginRight: 5,
                  columnGap: 10,
                  borderRadius: 20,
                  flexDirection: 'row',
                  // backgroundColor: '#F2FCFB'
                  backgroundColor: '#FFFFFF'
                }}>
                <Image
                  // source={{ uri: item.image }}
                  // source={require('../assets/user.webp')}
                  source={item.image}
                  style={{ width: 120, height: 150, borderRadius: 10 }}
                />
                <View style={{ width: 150, backgroundColor: '', gap: 10 }}>
                  <Text>{item.title}</Text>
                  <Text style={{ fontWeight: '900', justifyContent: 'center', fontSize: 17 }}>Stock-<Text style={{ color: '#31d493' }}>{item.count}</Text></Text>
                  <TakeInput setVal={setVal} />
                  {/* <TouchableOpacity>
                    
                  </TouchableOpacity> */}

                  <TouchableOpacity style={{ backgroundColor: '#2563EB', width: 90, paddingVertical: 5, borderRadius: 10, }}
                    onPress={() => updateInventory(item.id)} >
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#F1F5F9', textAlign: 'center' }}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
            }
          />
      }
    </View >
  )
}

export default Inventory

const TakeInput = ({ setVal }) => {
  const [text, setText] = useState();
  useEffect(() => {
    setVal(text)
  }, [text])
  return (
    <TextInput
      value={text}
      onChangeText={setText}
      placeholder='Enter qty'
      style={{ borderWidth: 1, borderColor: '#2563EB', borderRadius: 10, paddingVertical: 5 }}
    />
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
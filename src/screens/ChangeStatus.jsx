import { Button, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { setOrders } from '../redux/orderSlice';
import { images } from './Main';
import { DataTable } from 'react-native-paper';
import Toast from 'react-native-toast-message';
const ChangeStatus = () => {
  const { orders } = useSelector(state => state.order);
  const { catalog } = useSelector(state => state.cart);
  const {userData}=useSelector(state=>state.user);
  const dispatch = useDispatch();
  async function fetchOrder() {
    try {
      const { data } = await axios.get("http://10.190.129.33:4000/getOrderDetails");
      dispatch(setOrders(data.orders));
    }
    catch (err) {
      console.log("Error in change status--", err)
    }
  }
  useEffect(() => {
    fetchOrder();
  }, [])
  console.log("In change status--", orders);
  async function handler(orderId, itemId,userId) {
    // Toast.show({ type: 'success', text1: 'Status Changed Successfully', });
    console.log("OrderId-", orderId, "Itenmid-", itemId)
    try {
      const { data } = await axios.post('http://10.190.129.33:4000/changeStatus', { docId: orderId, id: itemId ,userId});
      console.log("Data-", data)
      fetchOrder();
      Toast.show({ type: 'success', text1: 'Status Changed Successfully', });
    }
    catch (err) {
      console.log("Error-", err)
    }
    // console.log("---", orders.find(x => x.orderId == orderId)?.order);
    // let obj = { ...orders.find(x => x.orderId == orderId) };
    // let dummy=obj.order.map(x=>x.id==id?{...x,status:'Delivered'}:{...x});
    // let res=orders.map(x=>x.orderId==orderId?{...x,orders:dummy}:{...x})
    // console.log()


    // orders.find(x=>x.orderId==orderId)?.order
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
      <Text style={{ fontSize: 35, fontWeight: "500", color: '#5D75FF', textAlign: 'center', maxWidth: 300 }}>Change Product Status</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => {
          const id = item.orderId;
          const userId=item?.userId;
          return <View style={{ backgroundColor: '#FFFFFF', marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#2563EB', borderRadius: 20, gap: 10 }} >
            <Text style={{ fontWeight: '900', fontSize: 18, }}>Order Date-<Text style={{ color: '#d96af7' }}>{item?.date}</Text></Text>
            <Text style={{ fontWeight: '900', fontSize: 18, }}>UserId-{item?.userId}</Text>
            <Text style={{ fontWeight: '900', fontSize: 18, }}>OrderId-<Text style={{ color: '#99aafd' }}>{item?.orderId}</Text></Text>
            <FlatList
              data={item.order}
              renderItem={({ item }) => (
                <View style={{
                  flexDirection: 'row', borderWidth: 1, borderColor: '#2563EB', paddingVertical: 10,
                  justifyContent: 'space-between', columnGap: 60,
                  paddingHorizontal: 30, borderRadius: 20, marginBottom: 5
                }}>
                  <Image
                    style={{ width: 70, height: 70 }}
                    source={images[item.id - 1]}
                  />
                  <View style={{ gap: 5 }}>
                    <Text style={{ fontWeight: '900', }}>Product ID-<Text style={{ color: '#d96af7' }}>{item?.id}</Text></Text>
                    <Text style={{ fontWeight: '900', }}>Product Qty-<Text style={{ color: '#d96af7' }}>{item?.qty}</Text></Text>
                    <Text style={{ backgroundColor: item?.status == 'Delivered' ? 'green' : '#499afa', color: 'white', fontWeight: '600', paddingHorizontal: 10, textAlign: 'center', borderRadius: 10 }}>{item.status}</Text>
                    <Pressable style={{ backgroundColor: '#6dcbf7', padding: 10, borderRadius: 10 }}
                      onPress={() => handler(id, item.id,userId)} >
                      <Text style={{ fontWeight: 'bold', fontSize: 15, }}>Change Status</Text>
                    </Pressable>
                  </View>

                </View>
              )}
            />
          </View>
        }}
      />


    </View >
  )
}

export default ChangeStatus

const styles = StyleSheet.create({

})
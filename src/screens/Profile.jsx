import { ActivityIndicator, Button, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { useFocusEffect } from '@react-navigation/native';
import { setAuthenticated } from '../redux/userSlice';

const Profile = ({ setIsAuthenticated, navigation,setIsAdmin }) => {
  const { userData } = useSelector(state => state.user);
  // console.log("IN profile page--", setIsAuthenticated);
  const dispatch = useDispatch();
  const logout = async () => {
    Toast.show({ type: 'success', text1: 'Logged Out Successfully', })
    let keys = await AsyncStorage.getAllKeys();
    console.log("LOG OUT page-- ALL KEYS Before-", keys);
    // await AsyncStorage.clear();
    // await AsyncStorage.removeItem('userToken');
    // keys = await AsyncStorage.getAllKeys();
    // console.log("LOG OUT page-- ALL KEYS after-",keys);
    console.log("LOG OUT page-- KEY/VALUE pair -", AsyncStorage.multiGet(keys));
    await AsyncStorage.removeItem("userToken");
    setIsAuthenticated(false);
  };
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  //This UseEffect WILL NOT WORK.  
  //So i used useFocusEffect--------------

  // useEffect(() => {
  //   console.log("Loading all the orders--");
  //   async function fetchOrders() {
  //     const userData = JSON.parse(await AsyncStorage.getItem("userData"));
  //     try {
  //       const { data } = await axios.get("http://10.190.129.33:4000/getAllorders/" + userData.docId);
  //       // console.log("Orders--",data)
  //       setOrders(data.orders);
  //       console.log("FInal Orders--", data.orders)
  //     }
  //     catch (err) {
  //       console.log("Error in fetching Orders--", err)
  //     }
  //   }
  //   fetchOrders();
  // }, [])
  useFocusEffect(
    useCallback(() => {
      // console.log("Loading all the orders--");
      async function fetchOrders() {
        const userData = JSON.parse(await AsyncStorage.getItem("userData"));
        setLoading(true);
        try {
          const { data } = await axios.get("http://10.190.129.33:4000/getAllorders/" + userData.docId);
          console.log("Orders--",data)
          setOrders(data.orders);
          console.log("FInal Orders--", data.orders)
        }
        catch (err) {
          console.log("Error in fetching Orders--", err)
        }
        setLoading(false);
      }
      fetchOrders();
    }, [])
  );
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40, fontWeight: 'bold', textAlign: 'center' }}>Hi!  <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'green' }}>{userData?.name}</Text>
      </Text>

      <Image
        style={{ width: 100, height: 100, marginLeft: '35%' }}
        source={require('../assets/user.webp')}
      />
      <Text style={{ fontSize: 25, fontWeight: '500', textAlign: 'center' }}>Email-{userData?.email}</Text>
      <Pressable style={{backgroundColor: '#2563EB', padding: 10, alignItems: 'center', borderRadius: 20, width: '45%', marginLeft: '30%'
      }} onPress={logout}>
        <Text style={{ fontWeight: 'bold', color: '#F1F5F9', textAlign: 'center' }}>Log Out</Text>
      </Pressable>
      <Text style={{ fontSize: 30, fontWeight: "700", color: '#5D75FF', marginLeft: 10 }}>Your Orders ({orders.length})</Text>
      {
        loading ? <ActivityIndicator size="large" color="#6366f1" /> :
          <>
            <FlatList
              data={orders}
              renderItem={({ item, index }) => (
                <View style={{
                  margin: 5, flexDirection: 'row', borderRadius: 15,
                  paddingVertical: 10, paddingHorizontal: 10, justifyContent: 'space-evenly', alignItems: 'center', borderWidth: 1,
                  borderColor: '#2563EB', backgroundColor: '#FFFFFF'
                }}>
                  <Text style={{ fontSize: 18, fontWeight: '500' }}>{index + 1}</Text>
                  <View>
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>{item?.date}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>Total Items- {item?.order.length}</Text>
                  </View>

                  <Pressable style={{ backgroundColor: '#6dcbf7', padding: 10, borderRadius: 10 }}
                    onPress={() => navigation.navigate("OrderDetail", item)}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, }}>Order Details</Text>
                  </Pressable>
                </View>
              )}
            />
           
          </>
      }
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // justifyContent: 'center',
    // alignItems: 'center',
    gap: 10
  }
})
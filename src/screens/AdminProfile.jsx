import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
// import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import PrintOrder from './PrintOrder';
import Coupons from './Coupons';

const AdminProfile = ({ setIsAdmin, setIsAuthenticated }) => {
  const { userData } = useSelector(state => state.user);
  // console.log("In admin Profile-", setIsAdmin, setIsAuthenticated)
  const logout = async () => {
    Toast.show({ type: 'success', text1: 'Logged Out Successfully', })
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
    setIsAuthenticated(false);
    setIsAdmin(false);
  };
  console.log("In Admin Profile-", userData);
  return (
    <View style={{ gap: 10, marginTop: 20 }}>
      <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }}>Hi!  <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'green' }}>{userData?.name}</Text>
      </Text>
      <View style={{ flexDirection: 'row' ,justifyContent:'space-evenly',alignItems:'center',borderWidth:1,marginHorizontal:20,borderRadius:10,paddingVertical:7}}>
        <Image
          style={{ width: 50, height: 50,  }}
          source={require('../assets/admin.jpg')}
        />
        <View style={{ rowGap:10 }}>
          <Text style={{ fontSize: 20, fontWeight: '500', textAlign: 'center' }}>Email-{userData?.email}</Text>
          <Pressable style={{ backgroundColor: '#2563EB', padding: 10, alignItems: 'center', borderRadius: 20, width: '45%', marginLeft: '30%' }} onPress={logout}>
            <Text style={{ fontWeight: 'bold', color: '#F1F5F9', textAlign: 'center' }}>Log Out</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView>
        <Coupons />
      </ScrollView>
    </View>
  )
}

export default AdminProfile

const styles = StyleSheet.create({})
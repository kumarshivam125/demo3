import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Card from './Card'
import axios from "axios";
import { useSelector } from 'react-redux';

const UserNotification = () => {
  const { userData } = useSelector(state => state.user);
  // console.log("USER-", userData)
  const [notification, setNotification] = useState([])
  async function fetchNotifications() {
    try {
      const { data } = await axios.get('http://10.190.129.33:4000/getUserNotifications')
      console.log("Response-", data.notifications)
      let x = [];
      for (let doc of data.notifications) {
        for (let obj of doc.reciverId) {
          if (userData?.docId == obj.id)
            x.push({ createdAt: doc.createdAt, reason: doc.reason, isRead: obj.isRead });
        }
      }
      // console.log("BEFORE sorting-",x);
      // DESCENDING order sort
      x = x.sort((a, b) => b.createdAt - a.createdAt);
      // console.log("AFTER sorting-",x);
      setNotification(x)
    }
    catch (err) {
      console.log("Error--", err)
    }
  }
  useEffect(() => {
    fetchNotifications();
  }, [userData])
  return (
    <View style={{ paddingHorizontal: 20 ,paddingBottom:130}}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>UserNotification </Text>
      {
        notification.length == 0 ?<Text style={{ fontSize: 25, fontWeight: "500", color: '#5D75FF', textAlign: 'center' }}>No Notifications!!</Text>:
          <View style={{ gap: 10 }}>
            <FlatList
              data={notification}
              renderItem={({ item }) => (
                <Card item={item} fetchNotifications={fetchNotifications} />
              )}
            />
          </View>
      }
    </View>
  )
}

export default UserNotification

const styles = StyleSheet.create({})
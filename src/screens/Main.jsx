import { ActivityIndicator, Button, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SingleItem from './SingleItem';
import { setCart, setCatalog } from '../redux/cartSlice';
import axios from "axios";
import { setUser } from '../redux/userSlice';
import { setRatingAndReview } from '../redux/ratingSlice';
export const images = [
  require('../assets/img1.jpg'),
  require('../assets/img2.jpg'),
  require('../assets/img3.jpg'),
  require('../assets/img4.jpg'),
  require('../assets/img5.jpg'),
  require('../assets/img6.jpg'),
  require('../assets/img7.jpg'),
  require('../assets/img8.jpg'),
  require('../assets/img9.jpg'),
  require('../assets/img10.jpg'),
  require('../assets/img11.jpg'),
  require('../assets/img12.jpg'),
  require('../assets/img13.jpg'),
  require('../assets/img14.jpg'),
  require('../assets/img15.jpg'),
  require('../assets/img16.jpg'),
  require('../assets/img17.jpg'),
  require('../assets/img18.jpg'),
  require('../assets/img19.jpg'),
  require('../assets/img20.jpg'),
];

const Main = ({ navigation }) => {
  const { catalog } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  //FOR NODE 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const resp=await fetch('http://localhost:4000/hello');  //This line will NOT WORK
        // YOU Need to mention IP ADDRESS OF COMPUTER at place of LOCALHOST...
        const resp = await fetch('http://10.190.129.33:4000/getData');
        const resp1 = await resp.json();
        console.log("Data Recieved", resp1);
        let newCatalog = [];
        for (let i = 0; i < resp1.length; i++) {
          const copy = { ...resp1[i] };
          newCatalog.push(copy);
        }
        const x = await AsyncStorage.getItem("userData");
        let x1 = JSON.parse(x);
        x1.cart = x1.cart.map(obj => JSON.parse(obj));
        console.log("USER DATA In MAIN.jsx--", x1);
        const ids = x1.cart.map(x => x.id);
        const qtys = x1.cart.map(x => x.qty);
        const colors = x1.cart.map(x => x.color);
        let newCart = [];
        for (let i = 0; i < ids.length; i++) {
          const one = resp1.find(x => x.id == ids[i]);
          one.qty = qtys[i];
          one.color = colors[i];
          newCart.push(one);
          newCatalog = newCatalog.map(x => x.id == ids[i] ? { ...x, qty: qtys[i], color: colors[i] } : x);
        }
        newCatalog = newCatalog.map((x, ind) => ({ ...x, image: images[ind] }));
        //In below line we cant use "images[ind]" -->This will not work..
        newCart = newCart.map((x, ind) => ({ ...x, image: images[x.id - 1] }));

        console.log("NEW CART -", newCart);
        console.log("NEW Catalog-", newCatalog);
        dispatch(setUser(x1));
        dispatch(setCatalog(newCatalog));
        dispatch(setCart(newCart));
      }
      catch (err) {
        console.log("ERROR in frontend", err)
      }
    }
    async function fetchRatingAndReview() {
      console.log("Start of SUbmit Review---")
      try {
        const { data } = await axios.get('http://10.190.129.33:4000/getAllRatings')
        console.log("Post Rating--", data)
        dispatch(setRatingAndReview(data.ratings))
      }
      catch (err) {
        console.log("Error-", err)
      }
    }
    fetchData();
    fetchRatingAndReview();
  }, [])
  const { cart } = useSelector(state => state.cart);
  async function updateCart() {
    console.log("Main.jsx cart update-", cart)
    const finalCart = cart.map(x => ({ id: x.id, qty: x.qty, color: x.color }));
    console.log("Main.jsx cart update FInalCart-", finalCart)
    try {
      const token = JSON.parse(await AsyncStorage.getItem("userToken"));
      const { data } = await axios.post('http://10.190.129.33:4000/updateCart', { data: finalCart },
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      console.log("CART UPDATE Response--", data);
    }
    catch (err) {
      console.log("Error in Update cart", err)
    }
  }
  useEffect(() => {
    console.log("-------------------IN Main.jsx file---------------------")
    updateCart();
  }, [cart])
  
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 50, fontWeight: "700", color: '#5D75FF' }}>Home</Text>
      <FlatList
        data={catalog}
        renderItem={({ item }) => (
          <SingleItem item={item} goToDetailPage={() => navigation.navigate('ProductDetail', item)} />
        )}
      />
    </View>
  )
}

export default Main

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F5F9', // Light pink background
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
})




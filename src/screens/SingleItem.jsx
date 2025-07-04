import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decrement, increment, removeFromCart } from '../redux/cartSlice';
import Toast from 'react-native-toast-message';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SingleItem = ({ item, goToDetailPage, flg = true }) => {
    const dispatch = useDispatch();
    return (
        <View style={{
            borderWidth: 1,
            borderColor: '#2563EB',
            marginBottom: 20,
            padding: 15,
            width: 300,
            marginRight: 5,
            borderRadius: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // backgroundColor: '#F2FCFB'
            backgroundColor: '#FFFFFF'
        }}>
            <Image
                // source={{ uri: item.image }}
                // source={require('../assets/user.webp')}
                source={item.image}
                style={{ width: 120, height: 150, borderRadius: 10 }}
            />
            <View style={{ backgroundColor: '', maxWidth: 150, flex: 1, gap: 10, alignItems: 'center' }}>
                <Text style={{ fontWeight: '600' }}>{item.title.substr(0, 40)}</Text>
                <Text style={{ fontWeight: '900', fontSize: 20, color: '#F59E0B' }}>₹{item.price}</Text>
                {/* <Pressable style={{ backgroundColor: '#75F780', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, }} */}
                {
                    flg &&
                    <Pressable style={{ backgroundColor: '#059669', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}
                        onPress={() => goToDetailPage(item)}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#F1F5F9' }}>View Details</Text>
                    </Pressable>
                }
                {
                    item.qty == 0 &&
                    <Pressable style={{ backgroundColor: '#2563EB', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, }}
                        onPress={() => {
                            if (item.count == 0) {
                                Toast.show({ type: 'error', text1: 'This Item is Out of Stock' })
                                return;
                            }
                            dispatch(addToCart(item))
                            Toast.show({ type: 'success', text1: 'Added to Cart', })
                        }} >
                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#F1F5F9' }}>Add</Text>
                    </Pressable>
                }
                {
                    item.qty >= 1 &&
                    <View style={{ flexDirection: 'row', backgroundColor: '#b1f6b7', borderRadius: 10, gap: 10, alignItems: 'center' }}>
                        <Pressable>
                            {
                                (item.qty == 1) &&
                                <Icon1 name="delete" size={25} onPress={() => {
                                    dispatch(removeFromCart(item.id))
                                }} />
                            }
                            {
                                item.qty > 1 &&
                                <Icon name="minus" size={25} onPress={() => {
                                    dispatch(decrement(item.id))
                                }} />
                            }
                        </Pressable>
                        <Text>{item.qty}</Text>
                        <Pressable>
                            <Icon name="plus" size={25} onPress={() => {
                                if (item.count == 0) {
                                    Toast.show({ type: 'error', text1: 'This Item is Out of Stock' })
                                    return;
                                }
                                if (item.count == item.qty) {
                                    Toast.show({ type: 'error', text1: 'We only have this much in stock' })
                                    return;
                                }
                                dispatch(increment(item.id))
                            }} />
                        </Pressable>
                    </View>
                }
            </View>
        </View>
    )
}

export default SingleItem

const styles = StyleSheet.create({})
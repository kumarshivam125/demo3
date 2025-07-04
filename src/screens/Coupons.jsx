import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon1 from 'react-native-vector-icons/AntDesign'

import { SafeAreaView } from 'react-native-safe-area-context';

const Coupons = () => {
    const [formData, setData] = useState({
        coupon: '',
        amount: ''
    })
    const [loading, setLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    function handler(field, val) {
        setData(prev => ({ ...prev, [field]: val }))
    }
    async function createCouponHandler() {
        if (!formData.coupon && !formData.amount) {
            Alert.alert('Error.','Both Fields are Required.');
            return;
        }
        try {
            console.log("APi call started--")
            const { data } = await axios.post('http://10.190.129.33:4000/createCoupon', formData);
            console.log("Create Coupon Response--", data);
            if (data.success) {
                Toast.show({ type: 'success', text1: 'Coupon Created Successfully', });
                setData({
                    coupon: '',
                    amount: ''
                });
                fetchCoupons();
            }
            else {
                Toast.show({ type: 'error', text1: data.message, });
            }
        }
        catch (err) {
            console.log("Error in Coupon Creation-", err)
        }
        // console.log("Form Data-", formData)
    }
    async function fetchCoupons() {
        try {
            setLoading(true);
            console.log("Before Fetchinh COuponss--")
            const { data } = await axios.get('http://10.190.129.33:4000/getCoupons');
            // const data1 = response1.data;
            console.log("ALl coupons-", data.coupons)
            setCoupons(data.coupons);
        }
        catch (err) {
            console.log("Error--", err)
        }
        setLoading(false);
    }
    async function deleteCoupon(id) {
        try {
            // setLoading(true);
            console.log("Before Fetchinh COuponss--")
            const { data } = await axios.delete('http://10.190.129.33:4000/deleteCoupon/' + id);
            console.log("Delete Coupon Response-", data)
            if (data.success) {
                Toast.show({ type: 'success', text1: 'Coupon Deleted Successfully', });
            }
            fetchCoupons();
        }
        catch (err) {
            console.log("Error--", err)
        }
        // setLoading(false);
    }
    useEffect(() => {
        fetchCoupons();
    }, [])
    console.log("Dat-", formData);
    return (
        // <View style={styles.container}>
        <View style={{ paddingHorizontal: 20, gap: 10, marginBottom: 100, }}>
            <Text style={styles.title}>Create Coupons</Text>
            <TextInput
                onChangeText={(val) => handler('coupon', val)}
                value={formData.coupon}
                placeholder='Enter Coupon Name'
                style={styles.input}
            />
            <TextInput
                onChangeText={(val) => handler('amount', val)}
                value={formData.amount}
                placeholder='Enter Coupon Amount'
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={createCouponHandler}>
                <Text style={styles.buttonText}>Create Coupon</Text>
            </TouchableOpacity>
            {
                loading ? <ActivityIndicator size='large' /> :
                    <>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: '#1f2937', }}>All Coupons</Text>
                        <View style={{ paddingVertical: 1, marginBottom: 90, }}>
                            {
                                coupons?.map((item, ind) => (
                                    <View key={ind} style={{ flexDirection: 'row', justifyContent: 'space-evenly', gap: 10, borderWidth: 1, borderColor: '#2563EB', backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, marginTop: 10 }}>
                                        <Icon name="local-offer" size={24} color='#FFD700' />
                                        <Text>{item.coupon}</Text>
                                        <Text>₹{item.amount}</Text>
                                        <Icon1 name="delete" size={24} color='red' onPress={() => deleteCoupon(item.docId)} />
                                    </View>
                                ))
                            }
                        </View>
                    </>
            }

        </View>
    )
}

export default Coupons

const styles = StyleSheet.create({
    title: {
        // marginTop: 1,
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        // color: '#1f2937',
        color: '#5D75FF',
    },
    container: {
        flex: 1,
        // justifyContent:'center',
        alignItems: 'center'
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderColor: '#e5e7eb',
        backgroundColor: 'white'
    },
    button: {
        backgroundColor: '#6366f1',
        paddingVertical: 10,
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
})
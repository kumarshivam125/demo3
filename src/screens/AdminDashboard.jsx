import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { setCatalog } from '../redux/cartSlice';
import { images } from './Main';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../redux/userSlice';

const AdminDashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { catalog } = useSelector(state => state.cart);
    const [total, setTotal] = useState();
    const [discountedTotal,setDiscountedTotal]=useState(0);
    const dispatch = useDispatch();
    async function fetchCatalog() {
        try {
            const { data } = await axios.get("http://10.190.129.33:4000/getData");
            // console.log("Catalog Data--", data);
            dispatch(setCatalog(data));
            const user=await AsyncStorage.getItem("userData");
            // console.log("User Data--", user);
            dispatch(setUser(JSON.parse(user)));
        }
        catch (err) {
            console.log("Err-", err)
        }
    }
    async function fetchOrder() {
        try {
            let sum1 = 0; //Total
            let sum2=0; //Discounted Total
            const { data } = await axios.get("http://10.190.129.33:4000/getOrderDetails");
            console.log("SHivam-",data)
            const data1 = data.orders.map(x => x.order);
            console.log("Doubt--",data.orders);

            const arr = [];
            for (let i = 0; i < data1.length; i++) {
                for (let j = 0; j < data1[i].length; j++) {
                    const obj = data1[i][j];
                    sum2+=obj.discountedPrice;
                    arr.push({ id: obj.id, qty: obj.qty,discountedPrice:obj.discountedPrice });
                };
            }
            const mp1 = new Map();
            for (const { id, qty ,discountedPrice} of arr) {
                if (mp1.has(id)) {
                    const {qty:qty1,price:price1}=mp1.get(id);
                    mp1.set(id, {qty:qty+qty1,price:price1+discountedPrice});
                }
                else mp1.set(id, {qty,price:discountedPrice});
            }
            const arr2=Array.from(mp1.entries());
            console.log("ARR2-",arr2);
            // const arr1 = Array.from(mp.entries());
            // console.log("Arr1-", arr1)
            const demo = [];
            //{id,sales}
            for (let [id, {qty,price}] of arr2) {
                // console.log("P-",price)
                const obj = catalog.find(x => x.id == id);
                sum1 += obj?.price * qty;
                demo.push({ title: obj?.title, id: id, sales: qty, img: images[id - 1], price: obj?.price ,price1:price});
            }
            console.log("Final Data-", demo)
            setData(demo);
            setTotal(sum1);
            setDiscountedTotal(sum2)
        }
        catch (err) {
            console.log("Error in Fetching Order-", err)
        }
    }
    useEffect(() => {
        setLoading(true);
        fetchCatalog();
    }, [])
    useEffect(() => {
        // setLoading(true);
        fetchOrder();
        setLoading(false);
    }, [catalog])
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 50, fontWeight: "500", color: '#5D75FF', textAlign: 'center' }}>Dashboard</Text>
            {
                loading ? <ActivityIndicator size="large" color="#6366f1" /> :
                    <View style={{
                        borderWidth: 1, borderColor: 'black', backgroundColor: '#44d2fc', marginHorizontal: 5, paddingHorizontal: 10,
                        borderRadius: 10, paddingVertical: 10, width: '80%',
                    }}>
                        <Text style={{ fontSize: 20, fontWeight: '900', }}>Total Sales- ₹{total?.toFixed(2)}</Text>
                        <Text style={{ fontSize: 20, fontWeight: '900', }}>After Discount- ₹{discountedTotal?.toFixed(2)}</Text>
                    </View>
            }
            {
                loading ? <ActivityIndicator size="large" color="#6366f1" /> :
                    <View style={styles.container}>
                        <FlatList
                            data={data}
                            renderItem={({ item }) => (
                                <View style={{
                                    borderWidth: 1, borderColor: '#2563EB',
                                    marginBottom: 10,
                                    padding: 16,
                                    width: 300,
                                    borderRadius: 20,
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    <Image
                                        source={item.img}
                                        style={{ width: 100, height: 120, borderRadius: 10 }}
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ fontWeight: '900', fontSize: 18, }}>Product ID-<Text style={{ color: '#d96af7' }}>{item?.id}</Text></Text>
                                        <Text style={{ fontWeight: '900', fontSize: 18, }}>Sales-{item?.sales}</Text>
                                        <Text style={{ fontWeight: '900', fontSize: 18, }}>Rate-<Text style={{ color: '#F59E0B' }}>₹{item?.price}</Text></Text>
                                        <Text style={{ fontWeight: '900', justifyContent: 'center', fontSize: 17 }}>Before Offer-<Text style={{ color: '#31d493' }}>₹{item?.price * item?.sales}</Text></Text>
                                        <Text style={{ fontWeight: '900', justifyContent: 'center', fontSize: 17 }}>After Offer-<Text style={{ color: '#31d493' }}>₹{item?.price1.toFixed(2)}</Text></Text>
                                        {/* <Text style={{ maxWidth: 150, }}>{item.title.substr(0, 40)}....</Text> */}
                                    </View>
                                </View>
                            )}
                        />
                    </View>
            }
        </View>
    )
}

export default AdminDashboard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        padding: 10,
    }
})
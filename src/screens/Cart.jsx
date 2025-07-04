import { ActivityIndicator, Alert, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, setCart, setCatalog } from '../redux/cartSlice';
import Toast from 'react-native-toast-message';
import SingleItem from './SingleItem';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DemoStar from './DemoStar';

const Cart = ({ navigation }) => {
    const { cart, catalog } = useSelector(state => state.cart);
    const [total, setTotal] = useState(0);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [text, setText] = useState();
    const [discount, setDiscount] = useState(0);
    const [visible, setVisible] = useState(false)

    async function updateCart() {
        const finalCart = cart.map(x => ({ id: x.id, qty: x.qty, color: x.color }));
        try {
            const token = JSON.parse(await AsyncStorage.getItem("userToken"));
            console.log("TOKEN in CART-", token);

            const { data } = await axios.post('http://10.190.129.33:4000/updateCart', { data: finalCart },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            console.log("CART UPDATE Response--", data);
            // if (data.success) {
            // }
            // else
            //     Alert.alert("Error-", data.message)
        }
        catch (err) {
            console.log("Error in Update cart", err)
        }
    }
    function applyDiscount() {
        console.log("IN fun-", text, coupons, coupons.some(x => x.coupon == text))
        if (coupons.some(x => x.coupon == text)) {
            const obj = coupons.find(x => x.coupon == text);
            if (Number(obj.amount) > total) {
                Toast.show({ type: 'error', text1: 'Cart Amount is less ', });
                setText('');
                setDiscount(0);
                return;
            }
            console.log("OBJ-", obj, total)
            Toast.show({ type: 'success', text1: 'Coupon Applied!', });
            setDiscount(obj.amount);
            setVisible(true)
        }
        else {
            Toast.show({ type: 'error', text1: 'Coupon Invalid', });
            setVisible(false);
        }
        setText('')
    }
    useEffect(() => {
        setText('');
        setVisible(false);
        setDiscount(0);
    }, [cart])
    console.log("Total-", total)
    console.log("Discount-", discount)
    // console.log("CCART--", cart)
    async function checkoutProduct() {
        console.log("Inital Catlaog-", catalog);
        const finalCatalog = catalog.map(x => ({
            ...x, color: 0, qty: 0,
            count: cart.find(y => y.id == x.id) ? cart.find(y => y.id == x.id).count - cart.find(y => y.id == x.id).qty : x.count
        }));
        console.log("Fibna--", finalCatalog);
        for (let i = 0; i < cart.length; i++) {
            try {
                const { data } = await axios.post('http://10.190.129.33:4000/updateInventoryData', { count: cart[i].count-cart[i].qty, id:cart[i].id });
                console.log("Update Inventory-", data)
            }
            catch (err) {
                console.log("Error While updating the Inventory IN Cart-", err)
            }
        }
        const finalCart = cart.map(x => ({ ...x, discountedPrice: (x.price * x.qty) - ((x.price * x.qty) / total) * discount }))
        //Update in DB also
        try {
            setLoading(true);
            const token = JSON.parse(await AsyncStorage.getItem("userToken"));
            const userData = JSON.parse(await AsyncStorage.getItem("userData"));
            // console.log("USERDATA in cart--",userData);
            const { data } = await axios.post('http://10.190.129.33:4000/checkout', { cart: finalCart, docId: userData.docId, originalTotal: total, discountedTotal: total - discount },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            console.log("Checkout API Response--", data);
            //  let userData1 = JSON.parse(await AsyncStorage.getItem("userData"));
            console.log("USERDATA in cart--", userData);
            userData.cart = [];
            console.log("After USERDATA in cart--", userData);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            if (data.success) {
                Alert.alert("Order Placed Successfully-");
            }
            // else
            //     Alert.alert("Error-", data.message)
        }
        catch (err) {
            console.log("Error in Checkout API", err)
        }
        dispatch(setCatalog(finalCatalog));
        dispatch(setCart([]));
        setLoading(false);
    }
    useEffect(() => {
        // console.log("Catalog Updated at CART after checkout-", catalog);
    }, [catalog])
    useEffect(() => {
        const sum = cart.reduce((tot, curr) => tot + curr.price * curr.qty, 0);
        setTotal(sum);
        updateCart();
    }, [cart])
    async function fetchCoupons() {
        console.log("Start of fetch coupons")
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
    useEffect(() => {
        fetchCoupons();
    }, [])
    const goToDetailPage = (data) => {
        navigation.navigate('ProductDetail', data);
    };
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 40, fontWeight: "700", color: '#5D75FF' }}>Cart</Text>
            {
                loading ? <ActivityIndicator size="large" color="#6366f1" /> :
                    <>
                        {
                            total > 0 &&
                            <View style={{ backgroundColor: '#06B6D4', padding: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                <Text style={{ fontWeight: '900', fontSize: 20 }}>Total-</Text>
                                <Text style={{ fontWeight: '900', fontSize: 25 }}>{total.toFixed(2)} </Text>
                            </View>
                        }
                        {
                            cart.length == 0 &&
                            <View>
                                <Text style={{ fontWeight: '500', fontSize: 20 }}>Cart is Empty!!!</Text>
                                <Pressable style={{ backgroundColor: '#F997C6', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginTop: 15 }}
                                    onPress={() => navigation.navigate('Home')}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Buy Now</Text>
                                </Pressable>
                            </View>
                        }
                        {
                            total > 0 &&
                            <Pressable style={{ backgroundColor: '#F997C6', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginBottom: 1 }}
                                onPress={checkoutProduct}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Checkout</Text>
                            </Pressable>
                        }
                        {
                            total > 0 &&
                            <View style={{ flexDirection: 'row', gap: 10, marginVertical: 10 }}>
                                <TextInput
                                    onChangeText={setText}
                                    value={text}
                                    placeholder='Enter Coupon'
                                    style={styles.input}
                                />
                                <Pressable style={{ backgroundColor: '#2563EB', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#F1F5F9' }} onPress={applyDiscount}>Apply</Text>
                                </Pressable>
                            </View>
                        }
                        {
                            visible &&
                            <View style={{ marginBottom: 20, borderWidth: 1, borderRadius: 15 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 300, padding: 5, paddingHorizontal: 10 }}>
                                    <Text style={{ fontWeight: '600', fontSize: 17 }}>Original Price-</Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>₹{total.toFixed(2)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '', width: 300, padding: 5, paddingHorizontal: 10 }}>
                                    <Text style={{ fontWeight: '600', fontSize: 17 }}>Discount -</Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#8a6af8' }}>-₹{discount}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '', width: 300, padding: 5, paddingHorizontal: 10 }}>
                                    <Text style={{ fontWeight: '600', fontSize: 17 }}>Final Price -</Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>₹{(total - discount).toFixed(2)}</Text>
                                </View>
                            </View>
                        }
                        <FlatList
                            data={cart}
                            renderItem={({ item }) => (
                                <SingleItem item={item} goToDetailPage={goToDetailPage} />
                            )}
                        />

                    </>
            }
            {/* <DemoStar /> */}
        </View>
    )
}

export default Cart

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5e7eb', // Light pink background
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
        width: 150,
        borderColor: '#e5e7eb',
        backgroundColor: 'white'
    },
})
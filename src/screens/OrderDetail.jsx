import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import MyStar from './MyStar';
import ReviewContainer from './ReviewContainer';
import axios from "axios";
import { setRatingAndReview } from '../redux/ratingSlice';
import PrintOrder from './PrintOrder';

const OrderDetail = ({ route }) => {
    console.log("Order Details--", route.params);
    const { ratingAndReview } = useSelector(state => state.rating);
    const [order, setOrder] = useState([]);
    const { userData } = useSelector(state => state.user);
    const { catalog } = useSelector(state => state.cart);
    const [priceData, setpriceData] = useState();
    const [visible, setVisible] = useState(false);
    const [review, setReview] = useState('')
    const [rating, setRating] = useState();
    const [printData, setPrintData] = useState()
    const dispatch = useDispatch();
    // console.log("IN Order Details-", ratingAndReview)
    useEffect(() => {
        // data1=route.params;
        // const data1 = route.params;
        setpriceData(route.params);
        const finalData = route.params.order;
        const arr = [];
        // let total = 0;
        for (let i = 0; i < finalData.length; i++) {
            const obj = catalog.find(x => x.id == finalData[i].id);
            const isRated = ratingAndReview.some(x => x.productId == obj.id && x.userId == userData.docId);
            let obj1;
            if (isRated)
                obj1 = ratingAndReview.find(x => x.productId == obj.id && x.userId == userData.docId);

            let newObj = {
                ...obj, qty: finalData[i].qty, color: finalData[i].color, status: finalData[i].status,
                discountedPrice: finalData[i].discountedPrice,
                isRated: isRated, rating: isRated ? obj1.rating : 0, review: isRated ? obj1.review : null,
            };
            // console.log("Before OBJ-",data1)
            // newObj = {
            //     ...newObj,
            //     // discount: ((newObj.price * newObj.qty) / data1?.originalTotal) * (data1?.originalTotal - data1?.discountedTotal)
            // }

            arr.push(newObj);
            // total += newObj.price * newObj.qty;  //------------
            // total += newObj.originalTotal;  //------------
        }
        setOrder(arr);
        // setTotalAmount(total);
        // console.log("Total--", total)
        // console.log("User Data--")
        // demo()
    }, [ratingAndReview])
    // const orderData = {
    //     orderId: 'ORD123456',
    //     customerName: 'John Doe',
    //     customerEmail: 'john@example.com',
    //     customerAddress: '123 Main St, City, State 12345',
    //     orderDate: '2024-01-15',
    //     items: [
    //         {
    //             name: 'Product 1',
    //             quantity: 2,
    //             price: 29.99,
    //             total: 59.98
    //         },
    //         {
    //             name: 'Product 2',
    //             quantity: 1,
    //             price: 49.99,
    //             total: 49.99
    //         }
    //     ],
    //     subtotal: 109.97,
    //     discount: 10.99,
    //     shipping: 5.99,
    //     total: 126.95
    // };
    
    useEffect(() => {
        if(priceData&&order){
            setPrintData({
                orderId: priceData?.orderId,
                customerName: userData?.name,
                customerEmail: userData?.email,
                customerAddress: '123 Main St, City, State 12345',
                orderDate: priceData?.date,
                items: order.map(x => ({ name: x.title, quantity: x.qty, price: x.price, total: x.price * x.qty })),
                subtotal: priceData?.originalTotal,
                discount: priceData?.originalTotal-priceData?.discountedTotal,
                shipping: 0,
                total:priceData?.discountedTotal
                
            })
        }
    }, [priceData, order])
    useEffect(()=>{
        console.log("Print Data-",printData)
    },[printData])
    console.log("Data1-", priceData)
    console.log("Order -", order)
    const orderData1 = {}
    // console.log("Review--", review)
    async function demo() {
        const user = await AsyncStorage.getItem("userData");
        console.log('User---', user)
    }
    async function submitReviewHandler(productId) {
        // const user = JSON.parse(await AsyncStorage.getItem("userData"));
        // console.log('User---', user);
        console.log("Final Data-", rating, review, "Prod Id-", productId, "UserId", userData.docId)
        // console.log("Start of SUbmit Review---")
        try {
            const { data } = await axios.post('http://10.190.129.33:4000/giveRating', { rating, review, productId, userId: userData.docId })
            console.log("Post Rating--", data)
            if (data.success) {
                try {
                    const { data } = await axios.get('http://10.190.129.33:4000/getAllRatings')
                    console.log("Post Rating--", data)
                    dispatch(setRatingAndReview(data.ratings))
                    setRating(0);
                    setReview(null);
                }
                catch (err) {
                    console.log("Error-", err)
                }
            }
        }
        catch (err) {
            console.log("Error-", err)
        }
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
            <View style={{ borderWidth: 1, borderColor: 'black', backgroundColor: '#44d2fc', marginHorizontal: 5, paddingHorizontal: 10, borderRadius: 10, paddingVertical: 10, marginBottom: 10 }}>
                {/* <Text style={{ fontSize: 20, fontWeight: '900', }}>Order Total- ₹{totalAmount}</Text> */}
                <Text style={{ fontSize: 20, fontWeight: '900', }}>Original Total- ₹{priceData?.originalTotal.toFixed(2)}</Text>
                <Text style={{ fontSize: 20, fontWeight: '900', }}>Discounted Total- ₹{priceData?.discountedTotal.toFixed(2)}</Text>
            </View>
            <PrintOrder orderData={printData} />
            <FlatList
                data={order}
                renderItem={({ item }) => (
                    <View>
                        <View style={{
                            borderWidth: 1,
                            borderColor: '#2563EB',
                            marginBottom: 20,
                            padding: 15,
                            width: 300,
                            marginRight: 5,
                            borderRadius: 20,
                            // flexDirection: 'row',
                            // justifyContent: 'space-between',
                            // backgroundColor: '#F2FCFB'
                            backgroundColor: '#FFFFFF',
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Image
                                    // source={{ uri: item.image }}
                                    // source={require('../assets/user.webp')}
                                    source={item.image}
                                    style={{ width: 120, height: 150, borderRadius: 10 }}
                                />
                                <View style={{ backgroundColor: '', maxWidth: 150, flex: 1, gap: 10, alignItems: 'center' }}>
                                    <Text style={{ fontWeight: '600' }}>{item.title.substr(0, 40)}....</Text>
                                    <Text style={{ fontWeight: '800', fontSize: 15 }}>Qty-{item.qty}</Text>
                                    <Text style={{ fontWeight: '900', fontSize: 20, }}>Rate-<Text style={{ color: '#F59E0B' }}>₹{item.price}</Text></Text>
                                    {/* <Text style={{ fontWeight: '900', fontSize: 20, }}>Price-<Text style={{ color: '#F59E0B' }}>₹{item.originalTotal}</Text></Text> */}
                                    <Text style={{ fontWeight: '900', justifyContent: 'center', fontSize: 20 }}>Total-<Text style={{ color: '#F59E0B' }}>₹{item.price * item.qty}</Text></Text>
                                    <Text style={{ fontWeight: '900', fontSize: 20, }}>Discounted Rate-<Text style={{ color: '#F59E0B' }}>₹{item.discountedPrice.toFixed(2)}</Text></Text>
                                    <Text style={{ backgroundColor: item?.status == 'Delivered' ? 'green' : '#8095fc', padding: 10, borderRadius: 10, fontWeight: 'bold', fontSize: 15, color: 'white' }}>{item.status}</Text>
                                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                        <Text style={{ fontWeight: '600', justifyContent: 'center', fontSize: 20 }}>Color-</Text>
                                        <Text style={{ fontWeight: '600', justifyContent: 'center' }}>
                                            {
                                                item.color == 0 ?
                                                    <View style={{ width: 20, height: 20, backgroundColor: '#4CAF50', borderRadius: 10 }}></View> :
                                                    item.color == 1 ?
                                                        <View style={{ width: 20, height: 20, backgroundColor: '#2196F3', borderRadius: 10 }}></View> :
                                                        <View style={{ width: 20, height: 20, backgroundColor: '#FF9800', borderRadius: 10 }}></View>
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>


                            </View>
                            <ReviewContainer rating={rating} setRating={setRating}
                                review={review} setReview={setReview}
                                item={item} submitReviewHandler={submitReviewHandler} />
                        </View>
                    </View>
                )}
            />
        </View>
    )
}
export default OrderDetail



const styles = StyleSheet.create({

})
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useSelector } from 'react-redux';
import { images } from './Main';
import SingleItem from './SingleItem';
const Card = ({ item, fetchNotifications ,navigation}) => {
    console.log("Item-", item)
    const [visible, setVisible] = useState(false);
    const [data1, setData1] = useState();
    const { userData } = useSelector(state => state.user);
    const { catalog } = useSelector(state => state.cart);
    const [loading, setLoading] = useState(false);
    const [temp,setTemp]=useState()
    async function fetchData() {
        if (item?.reason?.includes('New Coupon')) {
            //Fetch coupon details
            setLoading(true);
            try {
                const { data } = await axios.get('http://10.190.129.33:4000/getSingleCoupon/' + item?.reason?.split('-')[1]);
                // console.log("CARD_", data)
                const x = data.obj;
                const finalData = { ...x, isRead: item?.isRead, title: "Hi " + userData.name + " Use below Coupon" };
                // console.log("Fina-", finalData)
                setData1(finalData);
            }
            catch (err) {
                console.log("Error-", err)
            }
            setLoading(false);
        }
        else {
            console.log("Data-", item);
            const itemId = item?.reason?.split('-')[2];
            const orderId = item?.reason?.split('-')[1];
            const finalData = {
                itemId: itemId, orderId: orderId, isRead: item?.isRead,
                title: "Hi " + userData.name + " Your Order is Delivered",
                image: images[itemId - 1]
            };
            // console.log("Fina-", finalData)
            setTemp(catalog.find(x=>x.id==itemId));
            setData1(finalData);
        }
    }
    useEffect(() => {
        fetchData();
    }, [])
    // console.log("CARD Data-", data1)
    async function handleClick() {
        //This function is for updating the MESSAGE SEEN status of user. 
        console.log("Handle click-", data1)
        if (data1.isRead == false) {
            setLoading(true);
            try {
                const { data } = await axios.post('http://10.190.129.33:4000/updateReadStatus', { userId: userData.docId, createdAt: item?.createdAt });
                console.log("Change Staus DATA-", data)
                if (data.success) {
                    await fetchNotifications();
                    setData1({ ...data1, isRead: true })
                }
            }
            catch (err) {
                console.log("Error-", err)
            }
            setLoading(false);
        }
        setVisible(!visible);
    }
    // useEffect(())
    console.log("Data1-", data1)
    return (
        <>
            {
                loading ? <ActivityIndicator size="large" color="#6366f1" /> :
                    <View style={{ borderWidth: 1, borderColor: '#2563EB', backgroundColor: '#ffffff', padding: 15, borderRadius: 20, marginTop: 10 }}>
                        <View>
                            <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                                onPress={handleClick}>
                                <Text
                                    style={{ padding: 10, fontWeight: '700' }}>
                                    {item?.reason?.split('-')[0]}
                                </Text>
                                {
                                    item?.isRead == false &&
                                    <View style={{ width: 15, height: 15, backgroundColor: 'red', borderRadius: 30 }}></View>
                                }
                            </Pressable>
                            {
                                visible && item?.reason?.includes('New Coupon') &&
                                <View style={{ padding: 10 }}>
                                    <Text style={{ fontSize: 15 }}>{data1?.title}</Text>
                                    <View style={{ flexDirection: 'row', columnGap: 10 }}>
                                        <Text style={{ fontWeight: '600', fontSize: 20 }}>{data1?.amount}</Text>
                                        <Text style={{ fontWeight: '600', fontSize: 20 }}>{data1?.coupon}</Text>
                                    </View>
                                </View>
                            }
                            {
                                visible && item?.reason?.includes('Order Delivered') &&
                                <>
                                    <Text>{data1?.title}</Text>
                                    <Text style={{ fontWeight: '600', fontSize: 17 }}>OrderId- {data1?.orderId}</Text>
                                    <Text style={{ fontWeight: '600', fontSize: 20 }}>ItemId- {data1?.itemId}</Text>
                                    <SingleItem item={temp} flg={false}/>
                                    {/* <Image
                                        // source={{ uri: item.image }}
                                        // source={require('../assets/user.webp')}
                                        source={item?.image}
                                        style={{ width: 50, height: 50, borderRadius: 10 ,backgroundColor:'yellow'}}
                                    /> */}
                                </>
                            }
                        </View>
                    </View>
            }
        </>
    )
}

export default Card

const styles = StyleSheet.create({})
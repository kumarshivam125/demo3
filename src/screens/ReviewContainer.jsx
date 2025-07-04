import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-paper'
import MyStar from './MyStar'

const ReviewContainer = ({ rating, setRating, editable, review, setReview, submitReviewHandler, item }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        // console.log("Complete Item-", item)
        // if(item.isRated){
        //     setRating(item.rating);
        // }
        // console.log("Default-", defaultReview)
        // setReview(defaultReview);
    }, [])
    return (
        <View>
            <Text style={{ backgroundColor: '#bb90ed', textAlign: 'center', padding: 10, paddingHorizontal: 15, borderRadius: 10, fontWeight: 'bold', fontSize: 15, color: '' }}
                onPress={() => setVisible(!visible)}>{item?.isRated ? 'See' : 'Rate'}</Text>
            {
                visible &&
                <View style={{ marginTop: 10 }}>
                    <TextInput
                        style={{ marginVertical: 10, height: 40, paddingHorizontal: 15, borderRadius: 10 }}
                        placeholder="Write Your Review"
                        value={item.isRated ? item.review : review}
                        readOnly={item.isRated ? true : false}
                        onChangeText={setReview}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                    />
                    {
                        !item.isRated &&
                        <MyStar rating={rating} setRating={setRating} />
                    }
                    {
                        item.isRated &&
                        <View style={{ flexDirection: 'row' ,}}>
                            {/* <Text>Demo</Text> */}
                            {
                                [1, 2, 3, 4, 5].map((star) => (
                                    <Text
                                        key={star}
                                        style={{ fontSize: 40, color: item.rating >= star ? '#FFD700' : '#bbbcbc' }}
                                    >
                                        ★
                                    </Text>
                                ))
                            }
                        </View>
                    }
                    {
                        !item.isRated &&
                        <Text style={{ backgroundColor: '#fbbd57', padding: 10, textAlign: 'center', borderRadius: 10, fontWeight: 'bold', fontSize: 15, color: '' }}
                            onPress={() => submitReviewHandler(item?.id)}>Submit Review</Text>
                    }
                </View>
            }
        </View>
    )
}

export default ReviewContainer

const styles = StyleSheet.create({})
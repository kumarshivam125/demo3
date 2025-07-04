import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Rating } from 'react-native-ratings';
const DemoStar = ({ val }) => {
    const [rating, setRating] = useState(0);
    console.log("Demo star--", rating)
    return (
        <View>
            <Text>DemoStar</Text>
            <Rating
                type='star'
                ratingCount={5}
                imageSize={30}
                // showRating
                // fractions={1}
                startingValue={val}
            // onFinishRating={(rating) => setRating(rating)}
            />
        </View>
    )
}

export default DemoStar

const styles = StyleSheet.create({})
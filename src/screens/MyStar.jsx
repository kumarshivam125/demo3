import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

const MyStar = ({ rating, setRating }) => {
    return (
        <View style={{ backgroundColor: '' }}>
            <Text>Rating- {rating}</Text>
            <View style={{ flexDirection: 'row' }}>
                <Pressable onPress={() => setRating(1)}>
                    <Text style={{ fontSize: 40, color: rating >= 1 ? '#FFD700' : '#bbbcbc' }}>★</Text>
                </Pressable>
                <Pressable onPress={() => setRating(2)}>
                    <Text style={{ fontSize: 40, color: rating >= 2 ? '#FFD700' : '#bbbcbc' }}>★</Text>
                </Pressable>
                <Pressable onPress={() => setRating(3)}>
                    <Text style={{ fontSize: 40, color: rating >= 3 ? '#FFD700' : '#bbbcbc' }}>★</Text>
                </Pressable>
                <Pressable onPress={() => setRating(4)}>
                    <Text style={{ fontSize: 40, color: rating >= 4 ? '#FFD700' : '#bbbcbc' }}>★</Text>
                </Pressable>
                <Pressable onPress={() => setRating(5)}>
                    <Text style={{ fontSize: 40, color: rating >= 5 ? '#FFD700' : '#bbbcbc' }}>★</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default MyStar

const styles = StyleSheet.create({})
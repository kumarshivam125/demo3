import { FlatList, Image, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
const img = {
    "men's clothing": require('../assets/male1.png'),
    "women's clothing": require('../assets/female1.png'),
    "jewelery": require('../assets/jewelery1.png'),
    "electronics": require('../assets/electronics.png'),
}
const Category = ({ navigation }) => {
    const { catalog } = useSelector(state => state.cart);
    // console.log("Catalog data in Categoty", catalog);
    const [categories, setCategories] = useState([]);
    let mp = {};
    useEffect(() => {
        console.log("Start")
        for (let i = 0; i < catalog.length; i++) {
            if (!mp[catalog[i].category])
                mp[catalog[i].category] = [];
            mp[catalog[i].category].push(catalog[i]);
        }
        console.log("MAP in CATegory page-", Object.keys(mp))
        setCategories(Object.keys(mp));
    }, [])
    return (
        <View>
            <Text style={{ fontSize: 50, fontWeight: "700", color: '#5D75FF', textAlign: 'center' }}>Categories</Text>
            <View style={{ marginBottom: 130, justifyContent: 'center', alignItems: 'center' }}>
                <FlatList
                    data={categories}
                    renderItem={({ item }) => (
                        <Pressable style={styles.categoryContainer} onPress={() => navigation.navigate("CategoryDetail", item)}>
                            <ImageBackground
                                source={img[item]}
                                style={styles.backgroundImage}
                                // resizeMode="stretch"
                                imageStyle={{ resizeMode: 'cover' }}
                            />
                        </Pressable>
                    )}
                />
            </View>
        </View>
    )
}

export default Category

const styles = StyleSheet.create({
    categoryContainer: {
        marginBottom: 10,
        borderRadius: 15,
        overflow: 'hidden',
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
    },
    backgroundImage: {
        width: 300,
        height: 200,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
});
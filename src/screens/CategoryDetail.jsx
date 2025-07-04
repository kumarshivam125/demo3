import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import SingleItem from './SingleItem';
import DemoStar from './DemoStar';

const CategoryDetail = ({ route, navigation }) => {
    console.log("Category Detail Page", route.params);
    const { catalog, cart } = useSelector(state => state.cart);
    const [categoryProduct, setCategoryProduct] = useState([]);
    useEffect(() => {
        setCategoryProduct(catalog.filter(x => x.category == route.params));
    }, [cart])
    console.log(categoryProduct);
    const goToDetailPage = (data) => {
        navigation.navigate('ProductDetail', data);
    };
    return (
        <View style={{ marginTop: 20 }}>
            <FlatList
                data={categoryProduct}
                renderItem={({ item }) => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <SingleItem flg={false} item={item} goToDetailPage={goToDetailPage} />
                    </View>
                    // <View style={{ backgroundColor: 'yellow', margin: 10, padding: 20, justifyContent: 'center', borderRadius: 20 }}>

                    // </View>
                )}
            // numColumns={2}
            />
        </View>
    )
}

export default CategoryDetail

const styles = StyleSheet.create({})
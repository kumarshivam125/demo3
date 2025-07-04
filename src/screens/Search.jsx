import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import SingleItem from './SingleItem';
import DemoStar from './DemoStar';

const Search = ({ navigation }) => {
  const { catalog } = useSelector(state => state.cart);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  useEffect(() => {
    // console.log("IN SEARCH-",catalog)
    if (catalog) {
      setFiltered(catalog)
    }
  }, [])
  //VVVIMP IN below array CATALOG Should also be passed as a DEPENDENCY.........
  useEffect(() => {
    setFiltered(catalog.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())))
  }, [search, catalog])

  // const goToDetailPage = (data) => {
  //   navigation.navigate('ProductDetail', data);
  // };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 50, fontWeight: "700", color: '#5D75FF' }}>Search</Text>
      <TextInput
        placeholder='Search'
        value={search}
        onChangeText={setSearch}
        style={{ borderWidth: 1, borderColor: 'black', width: '90%', margin: 10, padding: 10, borderRadius: 10 }}
      />
      <FlatList
        data={filtered}
        renderItem={({ item }) => (
        //  <SingleItem item={item} goToDetailPage={goToDetailPage}/>
         <SingleItem item={item} goToDetailPage={()=>navigation.navigate('ProductDetail', item)}/>
        )}
      />
    </SafeAreaView>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Light pink background
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
})
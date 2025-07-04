import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, changeColor, decrement, increment, removeFromCart } from '../redux/cartSlice';
import DemoStar from './DemoStar';
import MyStar from './MyStar';
// import StarRating from 'react-native-star-rating-widget';

const Detail = ({ route }) => {
  const { cart, catalog } = useSelector(state => state.cart);
  // console.log("DETAIl page-", cart);

  const obj1 = route.params;
  // console.log("Route->", route.params);
  // console.log("OBj1->", obj1);
  const [obj, setObj] = useState(obj1);
  const dispatch = useDispatch();
  const { ratingAndReview } = useSelector(state => state.rating);
  const [ratings, setRating] = useState();
  useEffect(() => {
    if (catalog.some(x => x.title == obj1.title)) {
      // console.log("FIND Fun--", catalog.find(x => x.title == obj1.title))
      setObj(catalog.find(x => x.title == obj1.title));
    }
    else
      setObj(null);
  }, [cart])
  useEffect(() => {
    console.log("Before setting-", ratingAndReview)
    setRating(ratingAndReview.filter(x => x.productId == obj.id));
  }, [])
  const [selectedColor, setSelectedColor] = useState(obj1.color);
  useEffect(() => {
    console.log('In detail For cahnge color')
    dispatch(changeColor({ id: obj1.id, color: selectedColor }))
  }, [selectedColor])
  useEffect(() => {
    console.log("---", ratings)
  }, [ratings])
  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          // source={{ uri: image }}
          source={obj?.image}
          style={{ width: 300, height: 300, borderRadius: 20, borderWidth: 1 }}
        />
        <Text style={{ fontWeight: '900', fontSize: 25, color: '#0F172A' }}>{obj?.title}</Text>
        {/* <Text style={{ fontWeight: '500', fontSize: 20, color: '#0c2d2d' }}>{obj?.description}</Text> */}
        <Text style={{ fontWeight: '500', fontSize: 20, color: '#78716C' }}>{obj?.description}</Text>
        <Text style={{ fontWeight: '900', fontSize: 25, color: '#F59E0B', marginTop: 10 }}>₹{obj?.price}</Text>
        {
          obj?.count > 0 ?
            <Text style={{ fontWeight: '900', fontSize: 20 }}>Stock-<Text style={{ color: '#31d493' }}>{obj?.count}</Text></Text> :
            <Text style={{ fontWeight: '900', fontSize: 20, color: '#f63939' }}>This Item is Currently Out of Stock !!!</Text>

        }
        <Text style={{ fontWeight: 'bold', fontSize: 30, marginTop: 20 }}>Select Color</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity onPress={() => setSelectedColor(0)}>
            <View style={{ width: 35, height: 35, borderRadius: 20, borderWidth: selectedColor == 0 ? 2 : 0, borderColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 25, height: 25, backgroundColor: '#4CAF50', borderRadius: 20 }}></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedColor(1)}>
            <View style={{ width: 35, height: 35, borderRadius: 20, borderWidth: selectedColor == 1 ? 2 : 0, borderColor: '#2196F3', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 25, height: 25, backgroundColor: '#2196F3', borderRadius: 20 }}></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedColor(2)}>
            <View style={{ width: 35, height: 35, borderRadius: 20, borderWidth: selectedColor == 2 ? 2 : 0, borderColor: '#FF9800', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 25, height: 25, backgroundColor: '#FF9800', borderRadius: 20 }}></View>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={{ fontWeight: '400', fontSize: 20 }}>Product Color- <Text style={{ fontWeight: 'bold' }}>{selectedColor == 0 ? "Green" : selectedColor == 1 ? "Blue" : "Orange"}</Text></Text>
        <TouchableOpacity style={{ backgroundColor: '#e7f923', paddingVertical: 20, marginVertical: 15, borderRadius: 20 }}>
          {
            obj?.qty == 0 &&
            <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 20 }}
              onPress={() => {
                if (obj.count == 0) {
                  Toast.show({ type: 'error', text1: 'This Item is Out of Stock' })
                  return;
                }
                dispatch(addToCart(obj))
              }}>Add To Cart</Text>
          }
          {
            obj.qty >= 1 &&
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 1, }}>
              <Text>
                {
                  (obj.qty == 1) &&
                  <Icon1 name="delete" size={25} onPress={() => {
                    dispatch(removeFromCart(obj.id))
                  }} />
                }
                {
                  obj.qty > 1 &&
                  <Icon name="minus" size={25} onPress={() => {
                    dispatch(decrement(obj.id))
                  }} />
                }
              </Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{obj.qty}</Text>
              <Text>
                <Icon name="plus" size={25} onPress={() => {
                  if (obj.count == 0) {
                    Toast.show({ type: 'error', text1: 'This Item is Out of Stock' })
                    return;
                  }
                  if (obj.count == obj.qty) {
                    Toast.show({ type: 'error', text1: 'We only have this much in stock' })
                    return;
                  }
                  dispatch(increment(obj.id))
                }} />
              </Text>
            </View>

          }
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
          {
            ratings?.length == 0 &&
            <Text style={{ fontWeight: 'bold', fontSize: 25, }}>No Ratings and Reviews!!</Text>
          }
          {
            ratings?.length > 0 &&
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 25, }}>Ratings and Reviews</Text>
              {
                ratings.map((item, ind) => (
                  <View style={{ borderWidth: 1, borderColor: '#2563EB', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 5, marginTop: 10 }} key={ind}>
                    {/* <Text>{item.rating}</Text> */}
                    <View style={{ flexDirection: 'row' }}>
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
                    <Text style={{ fontWeight: '500', fontSize: 15 }}>Review- {item.review}</Text>
                  </View>
                ))
              }

            </View>
          }
        </View>


      </ScrollView>

    </View>
  )
}

export default Detail

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#F1F5F9',

    // flex: 1,
    // backgroundColor: 'white', // Light pink background
    // padding: 20,
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'yellow',
  }
})

// const Detail=()=>{
//   return(
//     <Text>Detail Page</Text>
//   )
// }
// export default  Detail;
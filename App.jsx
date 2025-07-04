import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/Fontisto';
import Icon5 from 'react-native-vector-icons/Entypo';


import Main from './src/screens/Main';
import Search from './src/screens/Search';
import Detail from './src/screens/Detail';

import Profile from './src/screens/Profile';
import { StyleSheet } from 'nativewind';
import { NavigationContainer } from '@react-navigation/native';
import Cart from './src/screens/Cart';
import { ToastProvider } from 'react-native-toast-notifications';
import Toast from "react-native-toast-message";
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Category from './src/screens/Category';
import CategoryDetail from './src/screens/CategoryDetail';
import OrderDetail from './src/screens/OrderDetail';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthenticated } from './src/redux/userSlice';
import AdminDashboard from './src/screens/AdminDashboard';
import AddProduct from './src/screens/AddProduct';
import ChangeStatus from './src/screens/ChangeStatus';
import AdminProfile from './src/screens/AdminProfile';
import AddAdmin from './src/screens/AddAdmin';
import Coupons from './src/screens/Coupons';
import Inventory from './src/screens/Inventory';
import AdminNotification from './src/screens/AdminNotification';
import UserNotification from './src/screens/UserNotification';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={Main}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={Detail}
        options={{
          headerShown: true,
          title: 'Product Details',
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

// Search Stack Navigator
function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchScreen"
        component={Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={Detail}
        options={{
          headerShown: true,
          title: 'Product Details',
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

// Cart Stack Navigator
function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CartScreen"
        component={Cart}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={Detail}
        options={{
          headerShown: true,
          title: 'Product Details',
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

// Cart Stack Navigator
function CategoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CategoryScreen"
        component={Category}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryDetail"
        component={CategoryDetail}
        options={{
          headerShown: true,
          title: 'Category Details',
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

function OrderDetailStack({ screenProps }) {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="OrderDetailScreen"
        component={Profile}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen name="OrderDetailScreen" options={{ headerShown: false }}>
        {(props) => <Profile {...props} setIsAuthenticated={screenProps.setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{
          headerShown: true,
          title: 'Order Details',
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}
// Main Tab Navigator
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();
  // const {isAuthenticated}=useSelector(state=>state.user);

  function AppNavigator() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarInactiveTintColor: '#666',
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarActiveTintColor: '#2563EB',
            tabBarIcon: ({ color }) => (
              <Icon name="home" size={24} color={color} />
            )
          }}
        />

        <Tab.Screen
          name="Category"
          component={CategoryStack}
          options={{
            tabBarActiveTintColor: '#2563EB',
            tabBarIcon: ({ color }) => (
              <Icon3 name="category" size={25} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={{
            tabBarActiveTintColor: '#2563EB',
            tabBarIcon: ({ color }) => (
              <Icon name="search1" size={25} color={color} />

            )
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartStack}
          options={{
            tabBarActiveTintColor: '#2563EB',
            tabBarIcon: ({ color }) => (
              <Icon name="shoppingcart" size={25} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Notification"
          component={UserNotification}
          options={{
            tabBarActiveTintColor: '#2563EB',
            tabBarIcon: ({ color }) => (
              <Icon3 name="notifications" size={25} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Profile"
          children={(props) => <OrderDetailStack {...props} screenProps={{ setIsAuthenticated, setIsAdmin }} />}
          options={{
            tabBarActiveTintColor: '#2563EB',
            tabBarIcon: ({ color }) => (
              <Icon name="user" size={25} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    );
  }
  function AdminNavigator() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarInactiveTintColor: '#666',
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{
            tabBarActiveTintColor: '#2563EB',
            tabBarIcon: ({ color }) => (
              <Icon name="dashboard" size={24} color={color} />
            )
          }}
        />

        <Tab.Screen
          name="Inventory"
          component={Inventory}
          options={{
            tabBarActiveTintColor: '#2563EB',
            tabBarIcon: ({ color }) => (
              // <Icon4 name="shopping-basket-add" size={25} color={color} />
              // <Icon3 name="discount" size={25} color={color} />
              <Icon3 name="inventory" size={25} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="AddAdmin"
          component={AddAdmin}
          options={{
            tabBarActiveTintColor: '#2563EB',
            tabBarIcon: ({ color }) => (
              <Icon5 name="add-user" size={25} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="ChangeStatus"
          component={ChangeStatus}
          options={{
            tabBarActiveTintColor: '#2563EB',
            tabBarIcon: ({ color }) => (
              <Icon3 name="change-circle" size={25} color={color} />

            )
          }}
        />
        <Tab.Screen
          name="Notification"
          component={AdminNotification}
          options={{
            tabBarActiveTintColor: '#2563EB',
            tabBarIcon: ({ color }) => (
              <Icon3 name="notifications" size={25} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="AdminProfile"
          // children={(props) => <AdminProfile {...props} screenProps={{ setIsAuthenticated }} />}
          children={(props) => <AdminProfile {...props} setIsAdmin={setIsAdmin} setIsAuthenticated={setIsAuthenticated} />}
          options={{
            tabBarActiveTintColor: '#2563EB',
            tabBarIcon: ({ color }) => (
              <Icon3 name="admin-panel-settings" size={25} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    );
  }

  function AuthNavigator() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* If we will write in below way then we cant pass the props SO USING CHILDREN */}
        {/* <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} /> */}
        <Stack.Screen name="Login" children={(props) => <Login {...props} setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />} />
        <Stack.Screen name="Signup" children={(props) => <Signup {...props} setIsAuthenticated={setIsAuthenticated} />} />
      </Stack.Navigator>
    );
  }
  // Check authentication status on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData')
        console.log("App.jsx--", userData);
        const data = JSON.parse(userData);
        if (data?.role == 'Admin' && token) {
          setIsAuthenticated(false);
          setIsAdmin(true)
        }
        else if (data?.role == 'user' && token) {
          setIsAuthenticated(true);
          setIsAdmin(false);
        }
        else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
        console.log("USER TOKEN IN app.jsx", token)
        // if (token) setIsAuthenticated(true);
      }
      catch (error) {
        console.error('Error checking auth status:', error);
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);
  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {
        isAuthenticated ? <AppNavigator /> : isAdmin ? <AdminNavigator /> : <AuthNavigator />
      }
      <Toast />
    </NavigationContainer>
  );

  // return (
  //   <NavigationContainer>
  //     <AppNavigator />
  //     <Toast />
  //   </NavigationContainer>
  // );
}
export default App;
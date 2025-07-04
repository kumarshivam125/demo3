import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cart: [],
    catalog: [],
    inventory: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCatalog: (state, action) => {
            state.catalog = action.payload
        },
        changeColor: (state, action) => {
            const { id, color } = action.payload;
            //Only changing the color when the item is present in cart .IF not then DB will not be updated.
            if (state.cart.some(x => x.id == id)) {
                console.log("Indside SLice - ", action.payload)
                state.cart = state.cart.map(x => x.id == id ? { ...x, color: color } : x);
                state.catalog = state.catalog.map(x => x.id == id ? { ...x, color: color } : x);
            }
        },
        setInventory:(state,action)=>{
            state.inventory=action.payload;
        },
        setCart: (state, action) => {
            state.cart = action.payload
        },
        addToCart: (state, action) => {
            state.cart.push(action.payload);
            state.cart = state.cart.map(x => x.id == action.payload.id ? { ...x, qty: 1 } : x);
            state.catalog = state.catalog.map(x => x.id == action.payload.id ? { ...x, qty: x.qty + 1, color: 0 } : x);
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(item => item.id !== action.payload)
            state.catalog = state.catalog.map(x => x.id == action.payload ? { ...x, qty: 0, color: 0 } : x);
        },
        increment: (state, action) => {
            state.cart = state.cart.map(x => x.id == action.payload ? { ...x, qty: x.qty + 1 } : x);
            state.catalog = state.catalog.map(x => x.id == action.payload ? { ...x, qty: x.qty + 1 } : x);
        },
        decrement: (state, action) => {
            state.cart = state.cart.map(x => x.id == action.payload ? { ...x, qty: x.qty - 1 } : x);
            state.catalog = state.catalog.map(x => x.id == action.payload ? { ...x, qty: x.qty - 1 } : x);
        }
    }
})
export const { setCatalog, addToCart, removeFromCart, increment, decrement, setCart, changeColor,setInventory } = cartSlice.actions
export default cartSlice.reducer;
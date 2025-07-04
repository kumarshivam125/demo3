import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import userSlice from "./userSlice";
import orderSlice from "./orderSlice";
import ratingSlice from "./ratingSlice";

const rootReducer = combineReducers({
    cart: cartSlice,
    user:userSlice,
    order:orderSlice,
    rating:ratingSlice
})

export const store = configureStore({ 
    reducer: rootReducer 
});
export default rootReducer;

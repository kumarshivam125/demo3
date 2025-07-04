import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    token:null,
    userData:null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser:(state,action)=>{
            state.userData=action.payload;
        },
        setToken:(state,action)=>{
            state.token=action.payload;
        },
    }
})
export const {setToken,setUser} = userSlice.actions
export default userSlice.reducer;
import { createSlice } from "@reduxjs/toolkit"

const initialState={
    ratingAndReview:[]
}
const ratingSlice=createSlice({
    name:'rating',
    initialState,
    reducers:{
        setRatingAndReview:(state,action)=>{
            state.ratingAndReview=action.payload;
        }
    }
})
export const {setRatingAndReview}=ratingSlice.actions;
export default ratingSlice.reducer;
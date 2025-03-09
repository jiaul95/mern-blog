import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  createPostSuccess:null, 
}

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    publishPostStart: (state) => {
     state.error = null;
     state.loading = true;
    },
    publishPostSuccess: (state,action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    publishPostFailure: (state,action) => {
      state.loading = false;
      state.error = action.payload;
    },     
    dismissImageAlert:(state) => {
      state.error = null;
      state.updateUserSuccess = null;
    },
    successAlert: (state,action) => {
      state.createPostSuccess = action.payload;
      state.loading = false;
      state.error = null;
    },
    imageUploadFailure: (state,action) => {
      state.loading = false;
      state.error = action.payload;
    },
   
    
  },
})

export const {  
              publishPostStart, 
              publishPostSuccess, 
              publishPostFailure,
              dismissImageAlert,
              successAlert,
              imageUploadFailure
              } = postSlice.actions

export default postSlice.reducer
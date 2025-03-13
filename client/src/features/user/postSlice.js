import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  createPostSuccess:null, 
  allPosts:[]
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
      state.createPostSuccess = null;
      state.loading = false;      
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

    postFetchSuccess: (state,action) => {
      state.allPosts = action.payload;
      state.loading = false;
      state.error = null;
    },
    postFetchFailure: (state,action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deletePostStart:(state) => {
      state.error = null;
      state.loading = true;
      state.currentUser = null;
    },

    deletePostSuccess:(state) => {
      state.error = null;
      state.loading = false;
      state.currentUser = null;
    },

    deletePostFailure:(state,action) => {
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
              imageUploadFailure,
              postFetchSuccess,
              postFetchFailure,
              deletePostStart,
              deletePostSuccess,
              deletePostFailure
              } = postSlice.actions

export default postSlice.reducer
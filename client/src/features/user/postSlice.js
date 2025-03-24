import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  successMessage:null, 
  allPosts:[],
  individualPost: null,
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
      state.successMessage = null;
      state.loading = false;      
    },
    successAlert: (state,action) => {
      state.successMessage = action.payload;
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

    updatePostStart: (state) => {
      state.error = null;
      state.loading = true;
    },
    updatePostSuccess: (state,action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updatePostFailure: (state,action) => {
      state.loading = false;
      state.error = action.payload;
    },     
        
    individualPostFetchStart: (state) => {
      state.error = null;
      state.loading = true;
    },
    individualPostFetchSuccess: (state,action) => {
      state.individualPost = action.payload;
      state.loading = false;
      state.error = null;
    },
    individualPostFetchFailure: (state,action) => {
      state.error = action.payload;
      state.loading = false;
    },

    createCommentStart: (state) => {
      state.error = null;
      state.loading = true;
    },
    createCommentSuccess: (state,action) => {
      state.individualPost = action.payload;
      state.loading = false;
      state.error = null;
    },
    createCommentFailure: (state,action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // commentsFetchSuccess: (state,action) => {
    //   state.allPosts = action.payload;
    //   state.loading = false;
    //   state.error = null;
    // },
    // commentsFetchFailure: (state,action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // },


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
              deletePostFailure,
              updatePostStart,
              updatePostSuccess,
              updatePostFailure,
              individualPostFetchStart,
              individualPostFetchSuccess,
              individualPostFetchFailure,
              createCommentStart,
              createCommentSuccess,
              createCommentFailure
              } = postSlice.actions

export default postSlice.reducer
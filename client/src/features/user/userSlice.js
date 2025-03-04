import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
    profilePicture: null,
    progressBar: 0,
    updateUserSuccess:null,
 
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
     state.error = null;
     state.loading = true;
    },
    signInSuccess: (state,action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state,action) => {
      state.loading = false;
      state.error = action.payload;
    },
    uploadProgressStart:(state,action) => {
      state.progressBar = action.payload;
    },
    imageUploadStart: (state) => {
      state.error = null;
      state.loading = true;
    },
    imageUploadSuccess: (state,action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      state.progressBar = 0;

    },
    imageUploadFailure: (state,action) => {
      state.loading = false;
      state.error = action.payload;
    },
    uploadProgressReset:(state) => {
      state.progressBar = 0;
    },
    updateStart: (state) => {
      state.error = null;
      state.loading = true;
     },
     updateSuccess: (state,action) => {
       state.currentUser = action.payload;
       state.loading = false;
       state.error = null;
       state.updateUserSuccess = true;
     },
     updateFailure: (state,action) => {
       state.loading = false;
       state.error = action.payload;
     },
     updateUserSuccess: (state,action) => {
       state.updateUserSuccess = action.payload;
       state.loading = false;
       state.error = null;
     },
     
    dismissImageAlert:(state) => {
      state.error = null;
      state.updateUserSuccess = null;
    },

    deleteUserStart:(state) => {
      state.error = null;
      state.loading = true;
      state.currentUser = null;
    },

    deleteUserSuccess:(state) => {
      state.error = null;
      state.loading = false;
      state.currentUser = null;
    },

    deleteUserFailure:(state,action) => {
      state.loading = false;
      state.error = action.payload;
    }
  
   

    
  },
})

// Action creators are generated for each case reducer function
export const { signInStart, 
                signInSuccess, 
                signInFailure,
                imageUploadStart,
                imageUploadSuccess,
                imageUploadFailure,
                dismissImageAlert,
                uploadProgressStart,
                uploadProgressReset,
                updateStart,
                updateSuccess,
                updateFailure,
                updateUserSuccess,
                deleteUserStart,
                deleteUserSuccess,
                deleteUserFailure
              } = userSlice.actions

export default userSlice.reducer
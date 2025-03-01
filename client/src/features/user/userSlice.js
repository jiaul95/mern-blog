import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
    profilePicture: null,
    progressBar: 0
 
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
    dismissImageAlert:(state) => {
      state.error = null;
    },
    uploadProgressReset:(state) => {
      state.progressBar = 0;
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
                uploadProgressReset
              } = userSlice.actions

export default userSlice.reducer
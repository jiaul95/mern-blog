import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
    profilePicture: null,
 
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
    imageUploadStart: (state) => {
      state.error = null;
      state.loading = true;
    },
    imageUploadSuccess: (state,action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    imageUploadFailure: (state,action) => {
      state.loading = false;
      state.error = action.payload;
    }
    
  },
})

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, signInFailure,imageUploadStart,imageUploadSuccess,imageUploadFailure } = userSlice.actions

export default userSlice.reducer
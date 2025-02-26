import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    theme: "light",
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            console.log("testing theme",state.theme);
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            console.log("final theme",state.theme);
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
    },
});

export const { toggleTheme,setTheme  } = themeSlice.actions;

export default themeSlice.reducer;
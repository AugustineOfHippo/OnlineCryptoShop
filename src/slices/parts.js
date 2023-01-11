import { createSlice } from "@reduxjs/toolkit";

export const partsSlice = createSlice({
    name: 'parts',
    initialState: {
        parts: [],
    },
    reducers: {
        setParts: (state,action) => {
            state.parts = action.payload;
        },
        addParts: (state,action) => {
            state.parts = [...state.parts,action.payload];
        }
    },
})

// Action creators are generated for each case reducer function
export const { setParts, addParts } = partsSlice.actions

export default partsSlice.reducer
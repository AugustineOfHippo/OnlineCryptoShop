import { configureStore } from "@reduxjs/toolkit";
import  partsSlice  from "./slices/parts.js";

export default configureStore({
    reducer: {
        parts:partsSlice
    },
})
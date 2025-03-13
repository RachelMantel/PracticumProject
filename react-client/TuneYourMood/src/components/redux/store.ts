import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";


const Store = configureStore({
    reducer: {
        auth: AuthSlice.reducer,
    }
});

export type StoreType = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store


// // redux/store.ts
// import { configureStore } from '@reduxjs/toolkit';
// import AuthSlice from "./AuthSlice";

// // כאן אתה מגדיר את ה-RootState, שזה בעצם כל מצב ה-Redux שלך
// const Store = configureStore({
//   reducer: {
//     auth: AuthSlice.reducer,
//   }
// });

// // כאן אתה מייצא את ה-RootState על מנת שנוכל להשתמש בו בקומפוננטות
// export type RootState = ReturnType<typeof Store.getState>;

// // גם תוכל לייצא את ה-dispatch, אם אתה רוצה להשתמש בו עם הטיפוסים המתאימים
// export type AppDispatch = typeof Store.dispatch;
// export default Store
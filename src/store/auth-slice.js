import { createSlice } from '@reduxjs/toolkit'
import { userLogin } from 'src/api/auth';

const initialState = {
    data: null,
    error: null
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        cleanUp(state, action) {
            state.error = null
        }
    },
    extraReducers: builder => {
          builder.addCase(userLogin.pending, (state) => {
              state.data = null;
              state.error = null;
          });
          builder.addCase(
            userLogin.fulfilled, (state, {payload}) => {
                state.data = payload.result;
                state.error = null;
          });
          builder.addCase(
            userLogin.rejected,(state, {payload}) => {
                state.data = null;
                state.error = payload;
          });
    }
})

export const authActions = authSlice.actions
export default authSlice
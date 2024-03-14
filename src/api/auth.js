import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../utils/axios'

export const userLogin = createAsyncThunk('auth/userLogin', 
    async (credential,thunkAPI) => {
        return axios
            .post("/user/login", credential)
            .then(response => response.data)
            .catch(({response}) => thunkAPI.rejectWithValue(response.data.message))
    }
)

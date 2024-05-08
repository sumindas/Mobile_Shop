import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : 'auth',
    initialState : {
        is_login : false,
        user_email : '',
        token : '',
    },
    reducers : {
        setUser : (state,action)=>{
            state.is_login = true
            state.user_email = action.payload.email
            state.token = action.payload.access_token
        },
        setLogout:(state)=>{
            state.user_email = ''
            state.token = ''
            state.is_login = false
        }
    }
})

export const {setUser,setLogout} = authSlice.actions
export default authSlice.reducer
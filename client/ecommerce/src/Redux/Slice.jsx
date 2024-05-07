import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : 'auth',
    initialState : {
        is_login : false,
        user_id : '',
        user_email : '',
    },
    reducers : {
        setUser : (state,action)=>{
            state.is_login = true
            state.user_id = action.payload.id
            state.user_email = action.payload.user_email
        },
        setLogout:(state)=>{
            state.user_email = ''
            state.user_id = ''
            state.is_login = false
        }
    }
})

export const {setUser,setLogout} = authSlice.actions
export default authSlice.reducers
/* eslint-disable no-unused-vars */
import React from 'react'
import Products from './Products'
import Navbar from '../NavBar/navBar'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function HomeUser() {

  const user = useSelector((state)=>state.auth)
  console.log("User:",user)
  return (
    <>
        <Navbar />
        <ToastContainer />
        <Products />
    </>
  )
}

export default HomeUser
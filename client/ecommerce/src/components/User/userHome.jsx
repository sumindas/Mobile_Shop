/* eslint-disable no-unused-vars */
import React from 'react'
import Products from './Products'
import Navbar from '../NavBar/navBar'
import { useSelector } from 'react-redux'

function HomeUser() {

  const user = useSelector((state)=>state.auth)
  console.log("User:",user)
  return (
    <>
        <Navbar />
        <Products />
    </>
  )
}

export default HomeUser
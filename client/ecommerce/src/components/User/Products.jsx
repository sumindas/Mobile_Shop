/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import axios from 'axios'

function Products() {
    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const response = await axios.get('http://127.0.0.1:8000/products')
                console.log("Res:",response.data)
            } catch(error){
                console.log("Error",error)
            }
        }
        fetchData()
    },[])
  return (
    <div>Products</div>
  )
}

export default Products
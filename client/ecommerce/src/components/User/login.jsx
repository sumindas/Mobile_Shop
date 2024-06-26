import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../Api/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../../Redux/Slice';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../NavBar/navBar';
import Footer from '../Footer/footer';

const LoginForm = () => {
    
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [errors,setErrors] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if (!email || !password){
          toast.error("Please Fill Required Data")
          return
        }
        try{
            const response = await axios.post(`${BASE_URL}/login/`,{
                email,
                password,
            })
            if (response.status === 200) {
                dispatch(setUser(response.data))
                console.log("Response:",response.data)
                navigate('/')
              }
              else{
                toast.error("An Error Occured...!! Please Try Again..")
              }
        }catch(error){
            setErrors(error.response.data.non_field_errors)
            console.log("Error:",errors)
            toast.error(errors[0])
        }
    }


  return (
    <>
      <Navbar />
      <ToastContainer />
      <section className="border-x-green-100">
      <div className="flex flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" name="email" id="email"value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com"  />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" name="password" id="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
              </div>
              <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Login</button>
              <Link to = '/signup'>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don't have an account? <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Sign up here</a>
                </p>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
};

export default LoginForm;

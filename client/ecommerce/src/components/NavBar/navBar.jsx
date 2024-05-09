import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { FaHome, FaShoppingCart, FaUser, FaRegHeart, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../../Redux/Slice';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const username = useSelector((state) => state.auth.token) || ''
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogout = () => {
    dispatch(setLogout());
    toast.success("Logged Out Successfully")
    navigate('/')
  };

  const navItems = [
    { id: 1, icon: <Link to = '/'><FaHome /></Link> }, 
    { id: 2, icon: <Link to = '/cart'><FaShoppingCart /></Link> }, 
    { id: 4, icon: <FaBars /> }, 
  ];

  return (
      
      <div className='bg-gray-50 dark:bg-gray-900 flex justify-between items-center h-24  mx-auto text-white'>
        <h1 className='ml-20 text-2xl font-bold text-[#00df9a]'>MobShop</h1>

        <ul className='hidden md:flex items-center ml-[-100px]'>
          {navItems.map(item => (
            <li
              key={item.id}
              className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'
            >
              {item.icon} 
            </li>
          ))}
        </ul>

        <div onClick={handleNav} className='block md:hidden'>
          {nav? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>

        <ul
          className={
            nav
             ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
              : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
          }
        >
          <h1 className='w-full text-3x1 font-bold text-[#00df9a] m-4'>Shop</h1>

          {navItems.map(item => (
            <li
              key={item.id}
              className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'
            >
              {item.icon} 
            </li>
          ))}
        </ul>

        {username? (
          <button onClick={handleLogout} className='p-2 rounded-lg bg-red-500 text-white ml-[-10px] '>
            <FaSignOutAlt />
          </button>
          
        ) : (
          <ul className="list-none">
            <li className="p-4 hover:bg-[#00df9a] rounded-xl m-2 duration-300">
              <Link to="/login" className="cursor-pointer">
                <FaUser />
              </Link>
            </li>
          </ul>
        )}
      </div>
  );
};

export default Navbar;

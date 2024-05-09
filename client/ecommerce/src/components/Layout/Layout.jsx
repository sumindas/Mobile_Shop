import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeUser from '../User/userHome';
import HomePage from '../Dashboard/home';
import SignUpForm from '../User/signUp';
import LoginForm from '../User/login';
import ProductDetails from '../User/ProductDetail';
import CartPage from '../User/cart';
import background_img from '../../Images/bg2.avif'; 
export default function Layout() {
  return (
    <Router>
      {/* <div style={{ backgroundImage: `url(${background_img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}> */}
        <Routes>
          <Route path='/' element={<HomeUser />} />
          <Route path='/dashboard' element={<HomePage />} />
          <Route path='/signup' element={<SignUpForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<CartPage />} />
        </Routes>
      {/* </div> */}
    </Router>
  );
}

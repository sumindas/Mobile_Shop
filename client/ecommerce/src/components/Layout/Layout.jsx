import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeUser from '../User/userHome';
import HomePage from '../Dashboard/home';
import SignUpForm from '../User/signUp';
import LoginForm from '../User/login';
import ProductDetails from '../User/ProductDetail';
import CartPage from '../User/cart';
import OrdersList from '../Dashboard/orders';
import OrderDetailView from '../Dashboard/orderDetailView';

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
          <Route path = '/orders' element = {<OrdersList/>}/>
          <Route path = '/order_detail/:order_id' element = {<OrderDetailView/>}/>
        </Routes>
      {/* </div> */}
    </Router>
  );
}

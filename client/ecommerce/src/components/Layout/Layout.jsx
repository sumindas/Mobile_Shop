import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeUser from '../User/userHome'
import HomePage from '../Dashboard/home'
import SignUpForm from '../User/signUp'
import LoginForm from '../User/login'
import ProductDetails from '../User/ProductDetail'



export default function Layout() {
  return (
    <div>
        <Router>
            <Routes>
                <Route path='/' element = {<HomeUser/>}/>
                <Route path='/dashboard' element = {<HomePage/>}/>
                <Route path='/signup' element = {<SignUpForm/>}/>
                <Route path='/login' element = {<LoginForm/>}/>
                <Route path = '/product/:id' element = {<ProductDetails/>}/>
            </Routes>
        </Router>
    </div>
  )
}

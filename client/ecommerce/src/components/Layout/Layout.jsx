import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeUser from '../User/userHome'
import HomePage from '../Dashboard/home'

export default function Layout() {
  return (
    <div>
        <Router>
            <Routes>
                <Route path='/' element = {<HomeUser/>}/>
                <Route path='/dashboard' element = {<HomePage/>}/>
            </Routes>
        </Router>
    </div>
  )
}

import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'


import './App.css'
import Login from './components/pages/Login'
import Signup from './components/pages/Signup'
import { AuthProvider } from './components/Auth/AuthProvider'
import Home from './components/pages/Home'
import { useEffect } from 'react'
import FloatingWhatsapp from './components/ModalComponent/FlotingWhatsapp'
// import Shop from './components/pages/Shop'

function App() {


    function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]); // runs on every route/path change

    return null;
  }

  return (
    <>
    {/* <FloatingWhatsApp
        avatar={`${import.meta.env.BASE_URL}createacc.jpg`}
        phoneNumber={import.meta.env.VITE_WHATSAPPNO}
        accountName={import.meta.env.VITE_WHATSAPPNAME} /> */}

        <FloatingWhatsapp />


      <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          {/* <Route path='/shop' element={<Shop />} /> */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App

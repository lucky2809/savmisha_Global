import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Login from './components/pages/Login'
import Signup from './components/pages/Signup'
import { AuthProvider } from './components/Auth/AuthProvider'
import Home from './components/pages/Home'
import { useEffect } from 'react'
import FloatingWhatsapp from './components/ModalComponent/FlotingWhatsapp'
import PublicRoute from './components/Auth/PublicRoute'
import ImageUpload from './components/Admin/ImageUpload'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import DashboardRoot from './components/Admin/DashboardRoot'
import AllUser from './components/Admin/AllUser'
import About from './components/pages/About'
import Contact from './components/pages/Contact'
import BulkImageUpload from './components/Admin/BulkImageUpload'
import UpdateProductImages from './components/Admin/UpdateProductImages'
import AllProducts from './components/pages/AllProducts'
import Test from './components/pages/test'
import ForgotPasswordFlow from './components/ForgetPassword/ForgetPasswordFlow'

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

        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<AllProducts />} />
            {/* <Route path='/shop' element={<Shop />} /> */}
            <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/about' element={<About />} />
            <Route path='/forgetpassword' element={<ForgotPasswordFlow />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/test' element={<Test />} />
            {/* <Route path="updateproductimages/:id" element={<ProtectedRoute><UpdateProductImages /></ProtectedRoute>} />       Image Update */}
            {/* <Route path='/imageupload' element={
            // <ProtectedRoute>
              <ImageUpload />
              //  </ProtectedRoute>
            } /> */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRoot /></ProtectedRoute>}>
              <Route path="upload" element={<ImageUpload />} />   {/* Image Upload */}
              <Route path="users" element={<AllUser />} />       {/* All Users */}
              <Route path="bulkImagepload" element={<BulkImageUpload />} />       {/* Bulk Image Upload */}
              <Route path="updateproductimages/:id" element={<ProtectedRoute><UpdateProductImages /></ProtectedRoute>} />       {/* Image Update */}
            </Route>
            
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App

import React, { useRef,createContext, useContext, useState , useEffect} from 'react';
import LandingPageSt from '../styleweb/LandingPageSt.module.css'
import {Link,Navigate,useNavigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';



import schoollogo from '../assets/schoollogo.png';
import learnengLogo from '../assets/LearnENG3.png';
import TeacherPic from '../assets/Teacher_Illustration.png'
const LandingPage=()=>{

          const navigator = useNavigate();

    return(
        <>

            <div className={LandingPageSt.landingcontainer}>
      {/* Header */}
      <div className={LandingPageSt.landingheader}>
        <img src={schoollogo} alt="School Logo" className={LandingPageSt.landinglogo} />
        <div className={LandingPageSt.landinglinks}>
          <a href="/FAQs">FAQs</a>
          <a href="/ContactUs">Contact Support</a>
        </div>
      </div>

      {/* Main content */}
      <div className={LandingPageSt.landingmain}>
        <div className={LandingPageSt.landingleft}>
          <h2>Welcome to</h2>
          <img src={learnengLogo} alt="LearnENG" className={LandingPageSt.learnengtitle} />
          <h2>Admin and Teachers Portal</h2>

          <div className={LandingPageSt.landingbuttons}>
            <button onClick={()=> {
               const isSuperAdmin = localStorage.getItem("superadmin");
                if (isSuperAdmin) {
                  navigator('/SuperAdminPage')
                  return
                }
              navigator('/Login')
              }} className={LandingPageSt.landingbtn}>Login</button>
            <button onClick={()=> navigator('/Signup')} className={LandingPageSt.landingbtn}>Sign Up</button>
          </div>
        </div>

        <div className={LandingPageSt.landingright}>
          <img src={TeacherPic} alt="Teacher Illustration" className={LandingPageSt.teacherimg} />
        </div>
      </div>
    </div>

        </>
    )
}

export default LandingPage;
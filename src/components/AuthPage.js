import React, { useRef,createContext, useContext, useState , useEffect} from 'react';
// import '../styleweb/AuthPageSt.css';
import {Link,Navigate,useNavigate} from 'react-router-dom';
import { MyContext } from './DataContext';
import axios from 'axios';
import {firestore} from "../firebase";
import { addDoc,collection,getDocs, updateDoc, deleteDoc } from '@firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import emailjs from '@emailjs/browser';
import BG from '../assets/Code_Verification_Page_BG.png';
import AuthPageSt from '../styleweb/AuthPageSt.module.css'
import {
  Container,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Card,
  Badge,
  Dropdown,
  DropdownButton,
  InputGroup,
  FormControl,
  Image,
  Table,
  ListGroup
} from 'react-bootstrap';
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { toast } from "react-toastify";

const AuthPage=()=>{

     const navigator = useNavigate(); //navigator 

    //useState

    const {AuthCode,setAuthCode}=useContext(MyContext);
    const {isFullAuth,setisFullAuth}=useContext(MyContext);
 

    //hold ProfileAuth data every each one
 // useState signup datahold

    const {unameHold,setunameHold}=useContext(MyContext);
    const {firstnameHold,setfirstnameHold}=useContext(MyContext);
    const {lastnameHold,setlastnameHold}=useContext(MyContext);
    const {teacherIDHold,setteacherIDHold}=useContext(MyContext);
    const {emailHold,setemailHold}=useContext(MyContext);
    const {passHold,setpassHold}=useContext(MyContext);
    const {repassHold,setrepassHold}=useContext(MyContext);
     const {gradeHold,setgradeHold}=useContext(MyContext);
       const {profimageHold,setprofimageHold}=useContext(MyContext)


       const [isLoading,setisLoading]=useState(false)
    //functions

 
 

     //Register now
    const RegisterNow=async(e)=>{
  const min = Math.ceil(0);   // Ensure min is an integer (rounds up)
   const max = Math.floor(999999);

   try{
        if(AuthCode === e){
          setisLoading(true)
          await addDoc(collection(firestore,"teachers"),{
            username:unameHold,
            firstname:firstnameHold,
            lastname:lastnameHold,
            teacherID:Math.floor(Math.random() * (max - min + 1)) + min,
            gradelevel:gradeHold,
            email:emailHold.toLowerCase(),
            isarchived:false,
            profilepath:profimageHold
          
           })

           let email = emailHold.toLowerCase()
           let password = passHold

           await createUserWithEmailAndPassword(auth,email,password)
           
              setunameHold("")
              setfirstnameHold("")
              setlastnameHold("")
              setteacherIDHold(0)
              setemailHold("")
              setpassHold("")
              setrepassHold("")
              setgradeHold(0)
              setprofimageHold(null)

               toast.success(`Account Created`, {
                        position:'top-center',   
                       autoClose: 3000,      
                      hideProgressBar: false,
                  closeButton:false,
                    pauseOnHover: false,
                draggable: false,
                    });
           setisLoading(false)
              navigator("/Login")    
    }
           
           
}

catch(e){
  window.alert(e)
}
    }

     //resend code
    const resendcodeFunc=(e)=>{
        
        e.preventDefault()
       

        const userCode = Math.random().toString(36).substring(2, 8).toUpperCase(); //random code generator

       //get information
      const InfoMail = {

     user_name:unameHold,
     user_email:emailHold.toLowerCase(),
     user_code:userCode
     }

        //send to email
    emailjs.send(process.env.REACT_APP_SERVICE_ID,process.env.REACT_APP_TEMPLATE_ID,InfoMail,process.env.REACT_APP_PUBLIC_KEY).then("Email Sent")
   setAuthCode(userCode)

    toast.success(`Verification Code renewed. Check your email`, {
             position:'top-center',   
            autoClose: 3000,      
           hideProgressBar: false,
       closeButton:false,
         pauseOnHover: false,
     draggable: false,
         });

    }



    return(
        <>

           <div className={AuthPageSt.verificationwrapper} style={{ backgroundImage: `url(${BG})` }}>
      <div className={AuthPageSt.verificationbox}>
        <h1 className={AuthPageSt.verificationtitle}>Verification</h1>
        <div className={AuthPageSt.verificationcontent}>
          <p className={AuthPageSt.textbody}>A verification code has been sent to:</p>
          <p className={AuthPageSt.emaildisplay}>{emailHold}</p>
          <p className={AuthPageSt.textbold}>Check your email to see the verification code:</p>

          <input type="text" placeholder="Enter Code" onChange={(text)=> RegisterNow(text.target.value)} className={AuthPageSt.codeinput} />

          <p className={AuthPageSt.resendtext}>
            Need new code? <span className="resendlink"><button onClick={resendcodeFunc}>Click here</button></span>
          </p>
        </div>
      </div>

       {/* modal loading */}
              <Modal show={isLoading} backdrop="static" centered>
              <Modal.Body className="text-center">
                 <div className={AuthPageSt.customloader}></div>
                <p className="mt-3 mb-0 fw-bold">Loading</p>
              </Modal.Body>
            </Modal>
    </div>



       

        </>
    )
}

export default AuthPage;
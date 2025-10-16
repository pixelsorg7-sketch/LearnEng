import React, { useRef,createContext, useContext, useState , useEffect} from 'react';
import SignupSt from '../styleweb/SignupSt.module.css'
import {Link,Navigate,useNavigate} from 'react-router-dom'
import { MyContext } from './DataContext';
import { GoogleLogin,GoogleOAuthProvider,useGoogleOneTapLogin  } from '@react-oauth/google';
import {gapi}from 'gapi-script';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import { HiSortAscending } from 'react-icons/hi';
import {firestore} from "../firebase";
import { addDoc,collection,getDocs, updateDoc, deleteDoc } from '@firebase/firestore';
import CryptoJS from 'crypto-js';
import { getStorage,ref, uploadBytes, getDownloadURL, updateMetadata,deleteObject  } from "firebase/storage";
import { storage } from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 } from "uuid";
import { FaRegEyeSlash,FaRegEye  } from "react-icons/fa";
import { toast } from "react-toastify";
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
  Alert
} from 'react-bootstrap';



const Signup=()=>{


   emailjs.init(process.env.REACT_APP_PUBLIC_KEY)
     const navigator = useNavigate(); //navigator 

     //useState hold Authetication 
    const {AuthCode,setAuthCode}=useContext(MyContext);

    //terms and conditions modal

    const [termsConModal,settermsConModal]=useState(false)
    
//terms and condition accept hold

const [TermsConAccept,setTermsConAccept]=useState(false);
    

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

    const [viewProfImageName,setviewProfImageName]=useState(null)
    //function

    //show/hide pass
    const [showPassword, setShowPassword] = useState(false);
     const [showPassword2, setShowPassword2] = useState(false);

        const [isLoading,setisLoading]=useState(false)



  const RegisterFunc=(e)=>{ //register user
        e.preventDefault();

        if(gradeHold === 0){
            toast.error("Pls select grade level", {
        position:'top-center',   
        autoClose: 3000,      
        hideProgressBar: false,
        closeButton:false,
        pauseOnHover: false,
        draggable: false,
        });
           return
        }

        //validations
        if(passHold !== repassHold){
          // window.alert("Password not matched")
           toast.error("Password not matched", {
        position:'top-center',   
        autoClose: 3000,      
        hideProgressBar: false,
        closeButton:false,
        pauseOnHover: false,
        draggable: false,
        });
          return
        };
        if(unameHold.length > 12){
            //  window.alert("Only accepting < 12 characters")
             toast.error("Only accepting < 12 characters", {
          position:'top-center',   
          autoClose: 3000,      
         hideProgressBar: false,
         closeButton:false,
       pauseOnHover: false,
       draggable: false,
       });
             return
        }
        
         if(unameHold.length < 5){
            //  window.alert("Only accepting > 5  characters")
             toast.error("Only accepting > 5  characters", {
          position:'top-center',   
          autoClose: 3000,      
         hideProgressBar: false,
         closeButton:false,
       pauseOnHover: false,
       draggable: false,
       });
             return
        }

        if(TermsConAccept === false){
            // window.alert("Pls Accept Terms and Condition")
             toast.error("Pls Accept Terms and Condition", {
          position:'top-center',   
          autoClose: 3000,      
         hideProgressBar: false,
         closeButton:false,
       pauseOnHover: false,
       draggable: false,
       });
            return
        }

        if(profimageHold === null){
            // window.alert("Profile picture empty")
             toast.error("Profile picture empty", {
          position:'top-center',   
          autoClose: 3000,      
         hideProgressBar: false,
         closeButton:false,
       pauseOnHover: false,
       draggable: false,
       });
            return;
        }

        
    const userCode = Math.random().toString(36).substring(2, 8).toUpperCase(); //random code generator

    //get information
   const InfoMail = {

    user_name:unameHold,
    user_email:emailHold.toLowerCase(),
    user_code:userCode
   }

     setAuthCode(userCode)

   //send to email
  emailjs.send(process.env.REACT_APP_SERVICE_ID,process.env.REACT_APP_TEMPLATE_ID,InfoMail,process.env.REACT_APP_PUBLIC_KEY).then("Email Sent")

    // setisFullAuth(true)
   setAuthCode(userCode)
   setTermsConAccept(false)
  navigator("/AuthPage") //navigate page

    }

    //image process upload

   const handleImageChange=async(file)=>{

    setisLoading(true)
     let randImageCode = v4()
      const imageRef = ref(storage, `teacherprofile/${"TeacherProfile" + " " + randImageCode + " " + file.name}`);
      uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {

        setprofimageHold(`teacherprofile/${"TeacherProfile" + " " + randImageCode + " " + file.name}`)
        setviewProfImageName(url)
           });
       });

       setisLoading(false)

    }
   

    return(
        <>


         <div className={SignupSt.signupwrapper}>
         <button 
  type="button" 
  className={SignupSt.backbtn} 
  onClick={() => navigator("/")}
>
  ← Back
</button>
      <div className={SignupSt.signupbox}>
      
        <h2 className={SignupSt.signuptitle}>Sign Up</h2>

        <form onSubmit={RegisterFunc}>

        <div className={SignupSt.namefields}>
          <input type="text" onChange={(text)=>setfirstnameHold(text.target.value)} placeholder="First Name" className={SignupSt.signupinput} required/>
          <input type="text" onChange={(text)=>setlastnameHold(text.target.value)} placeholder="Last Name" className={SignupSt.signupinput} required/>
        </div>
          {/* <input type="text" onChange={(text)=>setteacherIDHold(Number(text.target.value))} placeholder="Teacher ID"className={SignupSt.signupinput} /> */}
          <select onChange={(text)=>setgradeHold(Number(text.target.value))} className={SignupSt.signupinput}> {/* Added custom-select for specific styling */}
            <option  value="">--Select Grade--</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>

          </select>
        <input type="text" onChange={(text)=>setunameHold(text.target.value)} placeholder="Username" className={SignupSt.signupinput}  required />
        <input type="email" onChange={(text)=>setemailHold(text.target.value)} placeholder="Email" className={SignupSt.signupinput}  required/>
        <div className={SignupSt.passwordfields}>
        <input type={showPassword ? "text" : "password"}  onChange={(text)=>setpassHold(text.target.value)} placeholder="Password" className={SignupSt.signupinput} minLength={6}   required />

         <button
                type="button"
                className={SignupSt.passhidebtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaRegEyeSlash size={20}/> : <FaRegEye size={20}/>}
              </button>
        </div>

        <div className={SignupSt.passwordfields}>
        <input type={showPassword2 ? "text" : "password"} onChange={(text)=>setrepassHold(text.target.value)} placeholder="Re-Type Password" className={SignupSt.signupinput} minLength={6}  required />

         <button
                type="button"
                className={SignupSt.passhidebtn}
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? <FaRegEyeSlash size={20}/> : <FaRegEye size={20}/>}
              </button>

        </div>
        <h5>Upload Image:</h5>
                <Form.Control
                  type="file"
                   accept="image/*"
                   onChange={(e)=>{
                    if(e.target.files[0]){
                      const file = e.target.files[0];
                        const maxSize = 15 * 1024 * 1024; // 2 MB in bytes
                        if (file.size > maxSize) {
                          // alert("File is too large! Maximum allowed size is 15 MB.");
                            toast.error("File is too large! Maximum allowed size is 15 MB.", {
                        position:'top-center',   
                     autoClose: 3000,      
                    hideProgressBar: false,
                      closeButton:false,
                  pauseOnHover: false,
                  draggable: false,
                   });
                          return;
                        }
                      handleImageChange(e.target.files[0])
                    }
                   }}
                />
        <div className={SignupSt.checkboxcontainer}>
          <input type="checkbox" id="terms" onChange={(e)=>setTermsConAccept(e.target.checked)} />
          <label htmlFor="terms">I agree with <a href = "#" onClick={()=>settermsConModal(true)}>Terms & Conditions</a>.</label>
        </div>

        <button type='sumbit' className={SignupSt.signupsubmit}>Create Account</button>
           </form>

       
      </div>

      {/* terms and condtion */}

        <Modal show={termsConModal} onHide={()=>settermsConModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
          <p>
            Welcome to our application. Please read these Terms & Conditions carefully.
          </p>
          <ol>
            <li>
              <strong>Acceptance:</strong> By using this app, you agree to these
              terms and conditions.
            </li>
            <li>
              <strong>Responsibilities:</strong> You must not misuse the
              service or attempt to disrupt our systems.
            </li>
            <li>
              <strong>Privacy:</strong> We respect your privacy. Check our
              Privacy Policy for details.
            </li>
            <li>
              <strong>Termination:</strong> We may suspend access if you violate
              the terms.
            </li>
            <li>
              <strong>Changes:</strong> Terms may be updated at any time, and
              continued use means you accept them.
            </li>
          </ol>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={()=>settermsConModal(false)}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>

      {/* modal loading */}
            <Modal show={isLoading} backdrop="static" centered>
              <Modal.Body className="text-center">
            <div className={SignupSt.customloader}></div>
          <p className="mt-3 mb-0 fw-bold">Loading</p>
          </Modal.Body>
        </Modal>
    </div>


        </>
    )
}

export default Signup;
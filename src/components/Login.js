import React, { useRef,createContext, useContext, useState , useEffect} from 'react';
import LoginSt from '../styleweb/LoginSt.module.css'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import { MyContext } from './DataContext';
import {firestore} from "../firebase";
import { jwtDecode } from "jwt-decode";
import { FaRegEyeSlash,FaRegEye  } from "react-icons/fa";
import { XCircleFill } from "react-bootstrap-icons";
import { GoogleLogin } from '@react-oauth/google';
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit,ref, getDoc,doc} from '@firebase/firestore';
// import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import {
  Button,
  Modal,
} from 'react-bootstrap';

import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";

import LearnEngLogo from '../assets/LearnEngLG.png';


const Login=()=>{

    const clientid = ""; //client id for admin gmail 

    const navigator = useNavigate(); //navigator for all the components

    //useState

    const [usernameHold,setusernameHold]=useState("");
    const [passHold,setpassHold]=useState("");

    const {ProfileActive,setProfileActive}=useContext(MyContext);

      //forgot pass useState
      const [forgotPassToggle,setforgotPassToggle]=useState(false)
      const [forEmailHold,setforEmailHold]=useState("")
       //loading toggle holder

       const [loadingLogin,setloadingLogin]=useState(false)

       //show/hide pass
         const [showPassword, setShowPassword] = useState(false);

         //show error note

         const [showError,setshowError]=useState(false)
         const [noteError,setnoteError]=useState("")

    //functions


   // "email":"email dev --dir src/emails"
    
    //login functions
    const LoginFunc = async (e)=>{
        e.preventDefault()
        setloadingLogin(true)

        try{
        const teacherdblist = collection(firestore, "teachers")
        const whereTeacher = query(teacherdblist,
            where("username",'==',usernameHold),
            // where("password",'==',passHold),
            limit(1)
         )
        const getTeacher = await getDocs(whereTeacher)
        const TeacherData = getTeacher.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
        }))

        if(TeacherData[0].isarchived === true){
           setshowError(true)
           setnoteError("Your Account is on hold")
          return
        }


        let email = String(TeacherData[0].email)
        let password = passHold

        await signInWithEmailAndPassword(auth,email,password)

        
        const convertToArray = {
             id:TeacherData[0].id,
            username:TeacherData[0].username,
            firstname:TeacherData[0].firstname,
            lastname:TeacherData[0].lastname,
            teacherID:TeacherData[0].teacherID,
            gradelevel:TeacherData[0].gradelevel,
            email:TeacherData[0].email,
            // password:TeacherData[0].password,
            profilepath:TeacherData[0].profilepath
            // isModifyGood:TeacherData[0].isModifyGood,
        }

        

        //delete previous record
          const loginrecordblist = collection(firestore,"login-records")
          const whereLoginrecord = query(loginrecordblist,
          where("email",'==',String(convertToArray.email)),
          limit(1)
          )
        
            const getLoginrecord = await getDocs(whereLoginrecord)
          const loginrecordData = getLoginrecord.docs.map((doc)=>({
             id:doc.id,
            ...doc.data(),
            }))

            
          if(loginrecordData.length > 0){
           await deleteDoc(doc(firestore,"login-records",String(loginrecordData[0].id)))
            console.log("OKAYYY")
           }

        //set new login record
        const datetimenow = dayjs()
        addDoc(collection(firestore,"login-records"),{
          datelogin:String(datetimenow.format('MM/DD/YYYY')),
          timelogin:String(datetimenow.format('hh:mm:a')),
          timelogout:"",
          username:convertToArray.username,
          email:convertToArray.email
        })



     localStorage.setItem("profile_active", JSON.stringify(convertToArray));

     
       setProfileActive(convertToArray)
       navigator('/Homepage') //if both username and pass correct

       }
       catch(e){
         //if the account is super admin
          if(usernameHold === "PixelsAdmin" && passHold === "1234"){
          localStorage.clear()
          localStorage.setItem("superadmin", "true");
          navigator("/SuperAdminPage")
          return;
        }
        setshowError(true)
        setnoteError("Incorrect Username or Password")
        
  
       }
       finally {
    setloadingLogin(false);
  }

    

     }

     //google login

     const googleLogFunc=async(e)=>{
          setloadingLogin(true)
         const teacherdblist = collection(firestore, "teachers")
        const whereTeacher = query(teacherdblist,
        where("email",'==',e.email),
        limit(1));

        const getTeacher = await getDocs(whereTeacher)
        const TeacherData = getTeacher.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
        }))

        if(TeacherData.length === 0){

            // window.alert("Account doesnt exist from our database")
            setshowError(true)
            setnoteError('Account doesnt exist from our database')
            setloadingLogin(false)
            return;
        }

        const convertToArray = {
            id:TeacherData[0].id,
            username:TeacherData[0].username,
            firstname:TeacherData[0].firstname,
            lastname:TeacherData[0].lastname,
            teacherID:TeacherData[0].teacherID,
            gradelevel:TeacherData[0].gradelevel,
            email:TeacherData[0].email,
            // password:TeacherData[0].password,
            profilepath:TeacherData[0].profilepath
            // isModifyGood:TeacherData[0].isModifyGood,
        }

        
        //delete previous record
          const loginrecordblist = collection(firestore,"login-records")
          const whereLoginrecord = query(loginrecordblist,
          where("email",'==',String(convertToArray.email)),
          limit(1)
          )
        
            const getLoginrecord = await getDocs(whereLoginrecord)
          const loginrecordData = getLoginrecord.docs.map((doc)=>({
             id:doc.id,
            ...doc.data(),
            }))

            
          if(loginrecordData.length > 0){
           await deleteDoc(doc(firestore,"login-records",String(loginrecordData[0].id)))
            console.log("OKAYYY")
           }

         //set login record
        const datetimenow = dayjs()
        addDoc(collection(firestore,"login-records"),{
          datelogin:String(datetimenow.format('MM/DD/YYYY')),
          timelogin:String(datetimenow.format('hh:mm:a')),
          timelogout:"",
          username:convertToArray.username,
          email:convertToArray.email
        })

         

        //   setisFullAuth(TeacherData[0].isModifyGood)
        // setcurrentAuth(TeacherData[0].isModifyGood)
      localStorage.setItem("profile_active", JSON.stringify(convertToArray));
       setProfileActive(convertToArray)
         setloadingLogin(false)
       navigator('/Homepage')

     }



     const sendAuthTokenFunc=async()=>{

        try {
           await sendPasswordResetEmail(auth, forEmailHold);
           window.alert("Password reset email sent!");
          } catch (error) {
           window.alert(error.message);
           }

            setforgotPassToggle(false)
        // const min = Math.ceil(0);  
        // const max = Math.floor(999999);
        // setAuthToken(Math.floor(Math.random() * (max - min + 1)) + min)
     }

   

    return(
      <>

        <div className={LoginSt.loginwrapper}>
      <div className={LoginSt.loginbox}>
        <h2 className={LoginSt.logintitle}>Log In</h2>

        <input type="text" onChange={(text)=>setusernameHold(text.target.value)} placeholder="Username" className={LoginSt.logininput}/>
            <div className={LoginSt.passwordWrapper}>
        <input type={showPassword ? "text" : "password"} onChange={(text)=>setpassHold(text.target.value)} placeholder="Password" className={LoginSt.logininput} />
         <button
        type="button"
        className={LoginSt.passhidebtn}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaRegEyeSlash size={20}/> : <FaRegEye size={20}/>}
      </button>
        </div>
        <button onClick={LoginFunc} className={LoginSt.loginsubmit}>LOGIN</button>

        <div className={LoginSt.loginlinks}>
       <a href = "/Signup">Sign Up as Teacher</a>
          <a href="#" onClick={()=>setforgotPassToggle(true)}>Forgot Password?</a>
        </div>

        <div className={LoginSt.divider}>
          <hr /><span>or</span><hr />
        </div>
                <GoogleLogin
                size='large'
                disabled={loadingLogin === true}
               clientId={process.env.REACT_APP_GOOGLE_API_ID}
               onSuccess={authSuccess => {
            const decoded = jwtDecode(authSuccess?.credential);
           // setProfileAuth(decoded)
            googleLogFunc(decoded)
           
            
           
           }}
           onError={() => {
          console.log('Login Failed');
            }}
               onFailure={()=>console.log("fail")}
              //  isSignedIn={true}
              //  cookiePolicy={'single_host_origin'}
               
            />

             <div className={LoginSt.backlandingcon}>
           <a href = "/">Back to Landing Page</a>
           </div>
      </div>
          <div className={LoginSt.noteloginbox}>
                    <div className={LoginSt.welcomecontent}>
                         <img src={LearnEngLogo} fetchpriority="high"  alt="LearnENG Logo" className={LoginSt.logo} />
                        <p>Continue your teaching journey with powerful educational games</p>
                        <div className={LoginSt.featurelist}>
                            <div className={LoginSt.featureitem}>
                                <div className={LoginSt.featureicon}>🎮</div>
                                <span>Interactive Learning Games</span>
                            </div>
                            <div className={LoginSt.featureitem}>
                                <div className={LoginSt.featureicon}>📊</div>
                                <span>Student Progress Tracking</span>
                            </div>
                            <div className={LoginSt.featureitem}>
                                <div className={LoginSt.featureicon}>🎯</div>
                                <span>Personalized Learning Paths</span>
                            </div>
                            <div className={LoginSt.featureitem}>
                                <div className={LoginSt.featureicon}>👥</div>
                                <span>Collaborative Play rooms</span>
                            </div>
                            </div>
                            </div>
                            </div>
      

      {/* modal loading */}
        <Modal show={loadingLogin} backdrop="static" centered>
        <Modal.Body className="text-center">
           <div className={LoginSt.customloader}></div>
          <p className="mt-3 mb-0 fw-bold">Logging In</p>
        </Modal.Body>
      </Modal>

      {/* modal for forgot password */}

      <Modal centered  show = {forgotPassToggle} onHide={()=>{setforgotPassToggle(false)
      }}>
        <Modal.Body className={LoginSt.forgotpasscon}>
        <h3>Forgot Password</h3>
        <hr/>

     <div className={LoginSt.modalCon}>
        <h3>Email:</h3>
         <div className={LoginSt.emailtokentfcon}>
        <input type='text' onChange={(e)=>setforEmailHold(e.target.value)}/>
        <button onClick={sendAuthTokenFunc}>Send Email</button>
       </div>
      
         </div>

        
       
        </Modal.Body>
      </Modal>

       {/* Animated Fail Modal */}
      <Modal
        show={showError}
        onHide={()=>setshowError(false)}
        centered
        // backdrop="static"
        animation={true}
      >
        <Modal.Body className={`text-center p-4 ${LoginSt.errorPanel}`}>
          <div className="fail-icon">
            <XCircleFill size={70} color="red" />
          </div>
          <h4 className="fw-bold text-danger mt-3">Login Error</h4>
          <p className="text-muted">
           {noteError} 
          </p>
          <Button variant="outline-danger" onClick={()=>setshowError(false)}>
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </div>


      </>

    

    );
}

export default Login;
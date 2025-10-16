import { BrowserRouter,Route, Routes,useNavigate } from "react-router-dom";
import React, { useRef,createContext, useContext, useState , useEffect, cloneElement} from 'react';
import { MyContext } from './DataContext';
import ProfilePageSt from '../styleweb/ProfilePageSt.module.css';
import { IoIosArrowDown,IoMdArrowDropright,IoMdContact } from "react-icons/io";
import { FaLongArrowAltDown,FaGithub } from "react-icons/fa";
import { TiVendorMicrosoft } from "react-icons/ti";
import { BiLogoGmail } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { RiEnglishInput } from "react-icons/ri";
import {firestore} from "../firebase";
import { MdDelete } from "react-icons/md";
import { v4 } from "uuid";
import { Container, Button, Form, Row, Col, Modal} from 'react-bootstrap';
import { limit,addDoc,collection,getDocs, updateDoc, deleteDoc, query, where,doc } from '@firebase/firestore';
import LearnEngLogo from '../assets/LearnEngLG.png';
import UserIcon from '../assets/Admin_Icon.png';
import AvatarPlaceholder from '../assets/chiikawa len_imresizer.jpg';
import EmailIcon from '../assets/Mail_Icon.png';
import LinkedInIcon from '../assets/LinkedIn_Icon.png';
import DeleteIcon from '../assets/Delete_Icon.png';
import { getStorage,ref, uploadBytes, getDownloadURL, updateMetadata,deleteObject  } from "firebase/storage";
import { storage } from '../firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import dayjs from 'dayjs';
import { toast } from "react-toastify";

const ProfilePage=()=>{

    const [showEditProf,setshowEditProf]=useState(false); //toggle


    //useState Edit

    const [editusernameHold,seteditusernameHold]=useState("")
    const [editfirstnameHold,seteditfirstnameHold]=useState("")
    const [editlastnameHold,seteditlastnameHold]=useState("")
    const [editteacherIdHold,seteditteacherIDHold]=useState(0)
    const [editemailHold,seteditemailHold]=useState("")
    const [editcurrpassHold,seteditcurrpassHold]=useState("")
    const [editpasswordHold,seteditpasswordHold]=useState("")
    const [editrepassHold,seteditrepassHold]=useState("")


    const {ProfileActive,setProfileActive}=useContext(MyContext);
     const {currentAuth,setcurrentAuth}=useContext(MyContext);

     //profile img management
    const [profileUrlName,setprofileUrlName]=useState(null)
    const [profileUrlLatest,setprofileUrlLatest]=useState(null)
    const [profileLatestName,setprofileLatestName]=useState("")
     
    //useEffect profile pic

    useEffect(()=>{

      const imageRender=async()=>{

         if (!ProfileActive?.profilepath) return;

      console.log(ProfileActive.profilepath)
      const imageRef = ref(storage,ProfileActive.profilepath);
      const url = await getDownloadURL(imageRef);
      setprofileUrlName(url)
       }

       imageRender()
    },[profileUrlName,ProfileActive])

    const navigator = useNavigate();

    //functions................

   //reset edit textfield

   const resetEditFunc=()=>{
     seteditusernameHold(ProfileActive.username)
   seteditfirstnameHold(ProfileActive.firstname)
   seteditlastnameHold(ProfileActive.lastname)
   seteditteacherIDHold(ProfileActive.teacherID)
   seteditemailHold(ProfileActive.email)
   }

   const editPendFunc=async()=>{  //edit toggle open profile

   const imageRef = ref(storage,ProfileActive.profilepath);
  const url = await getDownloadURL(imageRef);
   setprofileUrlLatest(url)
       
   seteditusernameHold(ProfileActive.username)
   seteditfirstnameHold(ProfileActive.firstname)
   seteditlastnameHold(ProfileActive.lastname)
   seteditteacherIDHold(ProfileActive.teacherID)
   seteditemailHold(ProfileActive.email)
   setprofileLatestName(ProfileActive.profilepath)


    setshowEditProf(true)

   }

   

    const editFunc=async(e)=>{ 

        e.preventDefault();
        if(  //if textfield not empty
        editusernameHold !== "" &&
        editfirstnameHold !== "" &&
        editlastnameHold !== "" &&
        editteacherIdHold !== 0 &&
        editemailHold !== "" 
        // editcurrpassHold !== "" 
        ) 
        {

      //check account completion for change of authorization

                // let isStillFullAuth = false;
                // if(currentAuth === false){
                // if(editteacherIdHold > 0 && editpasswordHold.length > 0){
                //    isStillFullAuth = true;
                // }
                //  }
                   

            let docid = ProfileActive.id
            const teacherDocRef = doc(firestore, "teachers", docid);

            //updated now firebase
            await updateDoc(teacherDocRef, {
                username: editusernameHold,
                firstname: editfirstnameHold,
                lastname: editlastnameHold,
                teacherID: editteacherIdHold, // Be careful: teacherID is usually the document ID. If this is a field *within* the document that also stores the ID, it's fine.
                email: editemailHold,
                // password: editpasswordHold,
                profilepath:profileLatestName
                // isModifyGood:currentAuth === true ? true : isStillFullAuth
            });

            

            //update state storage

            const updatedProf = {
                id:docid,
                username:editusernameHold,
                firstname:editfirstnameHold,
                lastname:editlastnameHold,
                teacherID:editteacherIdHold,
                email:editemailHold,
                gradelevel:ProfileActive.gradelevel,
                profilepath:profileLatestName
            }

            //update localStorage session

             localStorage.clear();
            localStorage.setItem("profile_active", JSON.stringify(updatedProf));

              //remove previous image
        
            setprofileUrlName(null)

            localStorage.setItem("profile_active", JSON.stringify(updatedProf));
            setProfileActive(updatedProf)
            // window.alert("Profile Edited")
            setshowEditProf(false)
             toast.success(`Profile Edited`, {
                  position:'top-center',   
                  autoClose: 3000,      
               hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
                draggable: false,
                 });
            // setcurrentAuth(isStillFullAuth)
       
        
        }
        else{   //else textfield not empty

        //  window.alert("Fill up all the empty textfield/s")
         toast.error(`Fill up all the empty textfield/s`, {
                  position:'top-center',   
                  autoClose: 3000,      
               hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
                draggable: false,
                 });
            
        }


        
      
    }

    //reset password

    const resetPassword=async()=>{
      try {
     await sendPasswordResetEmail(auth, ProfileActive.email);
    //  window.alert("Password reset email sent!");
     toast.success(`Password reset email sent!`, {
                  position:'top-center',   
                  autoClose: 3000,      
               hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
                draggable: false,
                 });
    } catch (error) {
     window.alert(error.message);
     }
    }

    //logout func

     const [timeloginDocid,settimeloginDocid]=useState("")

       useEffect(()=>{
     
         const putlogout=async()=>{
     
          
           if(timeloginDocid !== ""){
           
           const datetimenow = dayjs()
     
             const loginrecordref = doc(firestore,"login-records",timeloginDocid)
             await updateDoc(loginrecordref,{
               timelogout:String(datetimenow.format('hh:mm:a'))
             })
     
             await signOut(auth);
     
              setProfileActive({}) 
             navigator("/")
           console.log("Alrighttt")
           settimeloginDocid("")
           }
          } 
          
          putlogout()
           },[timeloginDocid])
     

    //delete account through archiving

    const deleteFunc=async()=>{
       const confirmDelete = window.confirm("Are you sure you want to delete account?")
       //Delete now
        if(confirmDelete){

           const teacherDocRef = doc(firestore, "teachers", ProfileActive.id);
              await updateDoc(teacherDocRef,{
                isarchived:true
              })
            // //put it to archive

            // addDoc(collection(firestore,"archive-teachers"),{
            //     email:ProfileActive.email,
            //     firstname:ProfileActive.firstname,
            //     lastname:ProfileActive.lastname,
            //     password:ProfileActive.password,
            //     teacherID:ProfileActive.teacherID,
            //     username:ProfileActive.username
            // })

            // //delete profile 
              const loginrecordblist = collection(firestore,"login-records")
                    const whereLoginrecord = query(loginrecordblist,
                      where("email",'==',ProfileActive.email),
                      limit(1)
                    )
            
                    const getLoginrecord = await getDocs(whereLoginrecord)
                    const loginrecordData = getLoginrecord.docs.map((doc)=>({
                      id:doc.id,
                      ...doc.data(),
                    }))
                    settimeloginDocid(String(loginrecordData[0].id))
            // deleteDoc(doc(firestore,"teachers",ProfileActive.id))
           localStorage.clear();
            navigator("/")
            setProfileActive({})
        }
    }

    //exit edit

    const exitEdit=()=>{
      setshowEditProf(false)
      setprofileLatestName("")
      setprofileUrlLatest(null)
    }

    //handle image change
    const handleImageChange = (file) => {

      let randImageCode = v4()

        const imageRef = ref(storage, `teacherprofile/${"TeacherProfile" + " " + randImageCode + " " + file.name}`);
        uploadBytes(imageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
           setprofileUrlLatest(url)
           setprofileLatestName(`teacherprofile/${"TeacherProfile" + " " + randImageCode + " " + file.name}`)
          });
        });
    }

    return(
        <>

        <div className={ProfilePageSt.editwrapper}>
       <div className={ProfilePageSt.header}>
                          <img src={LearnEngLogo} alt="LearnENG Logo" className={ProfilePageSt.logo} />
                  
                          <div className={ProfilePageSt.userDropdown} >
                            <button
                              className={ProfilePageSt.userToggle}
                            
                            >
                              <span className={ProfilePageSt.welcomeText}>Welcome, {ProfileActive.username}!</span>
                              <img src={profileUrlName} alt="User Icon" className={ProfilePageSt.userIcon} />
                            </button>
                  
                          
                          </div>
                        </div>

      <div className={ProfilePageSt.profilecard}>
        <button onClick={()=>navigator("/HomePage")} className={ProfilePageSt.closebtn}>✖</button>
        <img src={profileUrlName} alt="Avatar" className={ProfilePageSt.profileavatar} />
        <h3 className={ProfilePageSt.teachername}>{ProfileActive.firstname} {ProfileActive.lastname}</h3>
        <p className={ProfilePageSt.teacherrole}>Grade {ProfileActive.gradelevel} Teacher</p>

        <div className={ProfilePageSt.contacticons}>
          {/* <a href="mailto:teacher@example.com" target="_blank" rel="noopener noreferrer">
            <img src={EmailIcon} alt="Email Icon" className={ProfilePageSt.contacticonimg} />
          </a> */}
          {/* <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <img src={LinkedInIcon} alt="LinkedIn Icon" className={ProfilePageSt.contacticonimg} />
          </a> */}
        </div>

        <button onClick={editPendFunc} className={ProfilePageSt.editbtn}>Edit Profile</button>

        <div className={ProfilePageSt.deletesection}>
          <p>Delete Account?</p>
          <button onClick={deleteFunc} className={ProfilePageSt.deletebtn}>
            <img src={DeleteIcon} alt="Delete Icon" className={ProfilePageSt.deleteiconimg} />
          </button>
        </div>
      </div>

 
  
        {/* edit profile */}

        {showEditProf ? <div className={ProfilePageSt.profeditpanel}>

        <div className={ProfilePageSt.profedittext}>
        <h3>Profile pic</h3>
         <img src={profileUrlLatest} alt="Avatar" className={ProfilePageSt.profileavatar} />
        <Form.Control
          type="file"
           accept="image/*"
           onChange={(e)=>{
            if(e.target.files[0]){
              const file = e.target.files[0];   
              const maxSize = 15 * 1024 * 1024; // 2 MB in bytes
              if (file.size > maxSize) {
              // alert("File is too large! Maximum allowed size is 15 MB.");
               toast.error(`File is too large! Maximum allowed size is 15 MB.`, {
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
         <h3>Username</h3>
         <input type="text" onChange={(text)=>seteditusernameHold(text.target.value)} value={editusernameHold}/>
         
         <h3>Firstname</h3>
         <input type="text" onChange={(text)=>seteditfirstnameHold(text.target.value)} value={editfirstnameHold}/>
         
         <h3>Lastname</h3>
         <input type="text" onChange={(text)=>seteditlastnameHold(text.target.value)} value={editlastnameHold}/>
         
         {/* <h3>Teacher ID</h3>
         <input type="text" onChange={(text)=>seteditteacherIDHold(Number(text.target.value))} value={editteacherIdHold}/> */}

         <h3>Email</h3>
         <input type="text" onChange={(text)=>seteditemailHold(text.target.value)} disabled={true} value={editemailHold}/>

        
         </div>

         <button onClick={resetPassword}>Reset Password</button>
         <button onClick={editFunc}>Confirm</button>
         <button onClick={resetEditFunc}>Clear</button>
         <button onClick={exitEdit}>Exit</button>
        </div> : ""}
              </div>
        {/* </div> */}

        </>
    )


}

export default ProfilePage;
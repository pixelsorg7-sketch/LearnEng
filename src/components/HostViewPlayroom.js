import React, { useRef,createContext, useContext, useState , useEffect} from 'react';
import {Link,Navigate,useNavigate} from 'react-router-dom'
import { MyContext } from './DataContext';
import { GoogleLogin,GoogleOAuthProvider,useGoogleOneTapLogin  } from '@react-oauth/google';
import {gapi}from 'gapi-script';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import { HiSortAscending } from 'react-icons/hi';
import { IoIosArrowDown,IoMdArrowDropright,IoMdContact } from "react-icons/io";
import { TfiMenu } from "react-icons/tfi";
import { MdMeetingRoom,MdContactPhone, MdSynagogue  } from "react-icons/md";
import { FaEllipsisV ,FaBook, FaCrown,FaChevronDown, FaSearch, FaArrowRight } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { Container, Button, Form, Row, Col, Modal} from 'react-bootstrap';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase';
import HostViewPlayroomSt from '../styleweb/HostViewPlayroomSt.module.css'
import { v4 } from "uuid";

import Background from '../assets/Category__Game_1_BG.png';
import LearnEngLogo from '../assets/LearnEngLG.png';
import UserIcon from '../assets/Admin_Icon.png';
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit, getDoc,doc} from '@firebase/firestore';
import { firestore } from '../firebase';
import { toast } from "react-toastify";

const HostViewPlayroom=()=>{

     const navigator = useNavigate();  //navigator
      const {ProfileActive,setProfileActive}=useContext(MyContext);

       const [dropdownOpen, setDropdownOpen] = useState(false);

     const {roomAccessCode,setroomAccessCode}=useContext(MyContext)
     const {roomNameAccess,setroomNameAccess}=useContext(MyContext)

      const [students,setstudents]=useState([])
        const [roomcodeDocuId,setroomcodeDocuId]=useState("");

        //modal view
        const [isLoading,setisLoading]=useState(false)
        const [isConfirmed,setisConfirmed]=useState(false)

//show edit time handler
     const [TimeEdit,setTimeEdit]=useState(false);

          //set time and date holdder
    const [time, setTime] = useState({ hour: "", minute: "", period: "AM" });
    const [date, setDate] = useState("");

     //rennder students in the room
     useEffect(()=>{

        const renderStud=async()=>{

        const joinroomlistdblist = collection(firestore,"joinroom-list")
        const wherejoinroomlist = query(joinroomlistdblist,
             where('roomcode','==',roomAccessCode)
        )
        const getjoinroomlist = await getDocs(wherejoinroomlist)
        const joinroomlistdata = getjoinroomlist.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
         }))
            
         const joinroomdblist = collection(firestore,"joinroom")
        const wherejoinroom = query(joinroomdblist,
          where('roomcode','==',roomAccessCode)
         )
            
         const getjoinroom = await getDocs(wherejoinroom)
         const joinroomdata = getjoinroom.docs.map((doc)=>({
           id:doc.id,
           ...doc.data(),
         }))

         const datehold = joinroomdata[0].timeopen.toDate()

         // Get the year, month, and day from the Date object
    const year = datehold.getFullYear();
     const month = (datehold.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
     const day = datehold.getDate().toString().padStart(2, '0');

       // Create the YYYY-MM-DD string
    const formattedDateString = `${year}-${month}-${day}`;

         // Get the hour in 24-hour format
      let hours24 = datehold.getHours();

      // Convert to 12-hour format and handle AM/PM
      const hours12 = hours24 % 12 || 12; // This handles the special case of midnight (0) and noon (12)
       const ampm = hours24 < 12 ? 'AM' : 'PM';

       //set time now
     
          setTime({...time,
            hour: hours12,
            minute:datehold.getMinutes(),
            period:ampm,
           })

          //set date now
           setDate(formattedDateString)

    

        setroomcodeDocuId(joinroomdata[0].id)
         setstudents(joinroomlistdata)
         console.log("loop")

        }

        renderStud()

     },[])

     //functions

     const saveChangesFunc=async()=>{

      setisLoading(true)
         //combine date and time
    const dateTimeValue = date + " " + time.hour + ":" + time.minute + " " + time.period
    const dateupdated = new Date(dateTimeValue)
    
    const joinroomRef = doc(firestore,"joinroom",roomcodeDocuId)
    await updateDoc(joinroomRef,{
    timeopen:dateupdated
    })

    // window.alert("Date and Time changed")
    toast.success("Save Changed", {
                  position:'top-center',   
                autoClose: 3000,      
              hideProgressBar: false,
              closeButton:false,
            pauseOnHover: false,
            draggable: false,
             })

      setisLoading(false)
     }
      //delete room
    const deleteRoomFunc=async()=>{

     const confirmDelete = window.confirm("Are you sure you want to delete room?")

     if(confirmDelete){

      setisLoading(true)
        //get joinroom
           const joinroomlistdblist = collection(firestore,"joinroom-list")
        const wherejoinroomlist = query(joinroomlistdblist,
             where('roomcode','==',roomAccessCode),
             where('teacherid','==',ProfileActive.teacherID)
        )
        const getjoinroomlist = await getDocs(wherejoinroomlist)
        const joinroomlistdata = getjoinroomlist.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
         }))

         //get joinroomactivegame

         const joinroomactivegamedblist = collection(firestore,"joinroom-activegame")
         const wherejoinroomactivegame = query(joinroomactivegamedblist,
            where("roomcode","==",roomAccessCode),
            where('teacherid','==',ProfileActive.teacherID)
         )

         const getjoinroomactivegame = await getDocs(wherejoinroomactivegame)
         const joinroomactivegamedata = getjoinroomactivegame.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
         }))

         //get joinroom-progress

         const joinroomprogressdblist = collection(firestore,"joinroom-progress")
         const wherejoinroomprogress = query(joinroomprogressdblist,
            where("joinroom",'==',roomAccessCode),
            where('teacherid','==',ProfileActive.teacherID)
         )

           const getjoinroomprogress = await getDocs(wherejoinroomprogress)
         const joinroomprogressdata = getjoinroomprogress.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
         }))

       
         //delete joinroom-progress

         joinroomprogressdata?.map((element,index)=>{
         deleteDoc(doc(firestore,"joinroom-progress",element.id)) 
         })


          //delete joinroom list

        joinroomlistdata?.map((element,index)=>{
        deleteDoc(doc(firestore,"joinroom-list",element.id))
          })

          //delete joinroom
         deleteDoc(doc(firestore,"joinroom",roomcodeDocuId))  

        //delete joinroom active game
        deleteDoc(doc(firestore,"joinroom-activegame",joinroomactivegamedata[0].id))

    
      //  window.alert("Room deleted")   
      toast.success("Room deleted", {
                  position:'top-center',   
                autoClose: 3000,      
              hideProgressBar: false,
              closeButton:false,
            pauseOnHover: false,
            draggable: false,
             })
      setroomAccessCode(0)
      setroomNameAccess("")
      navigator("/HostPlayroom")

    }

    setisLoading(false)
 

    }

    //when user reloads

    useEffect(() => {
    const handleBeforeUnload = (event) => {
       sessionStorage.setItem('isReloading',true)
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);


  useEffect(()=>{
    if(sessionStorage.getItem('isReloading')){
      sessionStorage.clear();
      navigator("/HostPlayroom")
    }
  },[])



    return (
        <div className={HostViewPlayroomSt.ViewHostroomContainer}>

         <div className={HostViewPlayroomSt.header}>
                                <img src={LearnEngLogo} alt="LearnENG Logo" className={HostViewPlayroomSt.logo} />
                        
                                <div className={HostViewPlayroomSt.userDropdown} >
                                  <button
                                    className={HostViewPlayroomSt.userToggle}
                                    onClick={() => setDropdownOpen((v) => !v)}
                                  >
                                    <span className={HostViewPlayroomSt.welcomeText}>Welcome, {ProfileActive.username}!</span>
                                    <img src={UserIcon} alt="User Icon" className={HostViewPlayroomSt.userIcon} />
                                  </button>
                        
                                  {dropdownOpen && (
                                    <div className={HostViewPlayroomSt.dropdownCustom}>
                                      <button
                                        className={HostViewPlayroomSt.dropdownItem}
                                        onClick={()=>{ navigator('/Profilepage')}}
                                      >
                                        ✏️ Edit Profile
                                      </button>

                                    <hr/>
                            <a>Back to homepage for more options...</a>
                                    </div>
                                  )}
                                </div>
                              </div>
            {/* <div className={HostViewPlayroomSt.topBar}>
                <div className={HostViewPlayroomSt.learnengLogo} />
                <div className={HostViewPlayroomSt.welcomeSection}>
                    <span className={HostViewPlayroomSt.welcomeText}>Welcome, [Teacher’s Name]</span>
                    <span className={HostViewPlayroomSt.profileIcon}>👤</span>
                </div>
            </div> */}

            <div className={HostViewPlayroomSt.buttonRow}>
                <button onClick={()=>{setroomAccessCode(0)
                setroomNameAccess("")
                navigator("/HostPlayroom")}} className={HostViewPlayroomSt.backButton}>Back</button>
            </div>

            <div className={HostViewPlayroomSt.playroomBox}>
                 <h4 className={HostViewPlayroomSt.playroomTitle}>Playroom Name: {roomNameAccess}</h4>
                <h2 className={HostViewPlayroomSt.playroomTitle}>Playroom Code: {roomAccessCode}</h2>
                <div className={HostViewPlayroomSt.controlsRow}>
                     <div className={HostViewPlayroomSt.dateControlGroup}>
                        <input type="date" className={HostViewPlayroomSt.dateInput}  
                       value={date}
                       onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className={HostViewPlayroomSt.terminateBtnWrapper}>
                        <button onClick={()=>deleteRoomFunc()} className={HostViewPlayroomSt.terminateBtn}>Terminate Playroom</button>
                    </div>

                    <div className={HostViewPlayroomSt.timeControlGroup}>
                        <div className={HostViewPlayroomSt.timeInputs}>
                        <input type="number" placeholder="HH" 
                        value={time.hour > 12 ? 1 : time.hour && time.hour < 1 ? 1 : time.hour}
                        onChange={(e)=>setTime({...time,hour:e.target.value})}
                        />
                        <input type="number" placeholder="MM"  
                        value={time.minute > 59 ? 0: time.minute && time.minute < 0 ? 0 : time.minute }
                       onChange={(e)=>setTime({...time,minute:e.target.value})}
                        />
                        <select
                        value={time.period}
                          onChange={(e)=>setTime({...time,period:e.target.value})}
                        >
                            <option>AM</option>
                            <option>PM</option>
                        </select>
                         <button onClick={()=>saveChangesFunc()} className={HostViewPlayroomSt.edittBtn}> Save Changes </button>
                        </div>
                    </div>
                </div>

                <h3 className={HostViewPlayroomSt.joinedTitle}>Joined Students:</h3>
                <div className={HostViewPlayroomSt.studentGrid}>
                  {students.map((student,index)=>(
                        <div className={HostViewPlayroomSt.studentButton}>{student.studentname} </div>
                  ))}
                </div>

                
                      {/* modal loading */}
                        <Modal show={isLoading} backdrop="static" centered>
                        <Modal.Body className="text-center">
                           <div className={HostViewPlayroomSt.customloader}></div>
                          <p className="mt-3 mb-0 fw-bold">Loading</p>
                        </Modal.Body>
                      </Modal>

                      {/* modal confirmed */}

                      <Modal show={isConfirmed} onHide={()=>setisConfirmed(false)} centered>
        <Modal.Header
        closeButton
        style={{ backgroundColor: '#e8f5e9', borderBottom: 'none' }}
        >
        <Modal.Title className="w-100 text-center" style={{ color: '#2e7d32', fontWeight: '600' }}>
        ✅ Changes Saved
        </Modal.Title>
        </Modal.Header>


        <Modal.Body className="text-center" style={{ backgroundColor: '#f1f8f4' }}>
        <p className="mb-0" style={{ color: '#33691e', fontSize: '1.1rem' }}>
        Your changes have been successfully updated.
        </p>
        </Modal.Body>


        <Modal.Footer style={{ backgroundColor: '#e8f5e9', borderTop: 'none' }}>
        <Button
        variant="success"
        className="w-100"
        onClick={()=>setisConfirmed(false)}
        style={{ backgroundColor: '#66bb6a', borderColor: '#66bb6a', fontWeight: '600' }}
        >
        Continue
        </Button>
        </Modal.Footer>
        </Modal>
            </div>
        </div>
    );
};


export default HostViewPlayroom;

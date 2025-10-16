import React, { useRef,createContext, useContext, useState , useEffect} from 'react';
import {Link,Navigate,useNavigate} from 'react-router-dom'
import { MyContext } from './DataContext';
import { GoogleLogin,GoogleOAuthProvider,useGoogleOneTapLogin  } from '@react-oauth/google';
import {gapi}from 'gapi-script';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import RoomViewSt from '../styleweb/RoomViewSt.module.css'
import { HiSortAscending } from 'react-icons/hi';
import { IoIosArrowDown,IoMdArrowDropright,IoMdContact } from "react-icons/io";
import { TfiMenu } from "react-icons/tfi";
import { MdMeetingRoom,MdContactPhone, MdSynagogue  } from "react-icons/md";
import { FaBook, FaCrown,FaChevronDown } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion } from "react-icons/fa6";

import 'bootstrap/dist/css/bootstrap.min.css';
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
import { firestore } from '../firebase';
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit,ref, getDoc,doc} from '@firebase/firestore';
import { Label } from 'recharts';


const RoomView=()=>{

    
      const [showNav, setshowNav]=useState(false);
        
     const navigator = useNavigate();
    
   //sort date lead animation
    
  //  const [dateLeadanim,setdateLeadanim]=useState(false);



//useState------------------------------
  const [students,setstudents]=useState([])

    const {ProfileActive,setProfileActive}=useContext(MyContext)
  //room access code
  const {roomAccessCode,setroomAccessCode}=useContext(MyContext);
  const [roomcodeDocuId,setroomcodeDocuId]=useState("");
  //show edit time handler
  const [showeditTime,setshoweditTime]=useState(false);

  //set time and date holdder
  const [time, setTime] = useState({ hour: "", minute: "", period: "AM" });
  const [date, setDate] = useState("");

  //functions....................

//rennder students in the room

useEffect(()=>{

  const renderStud=async()=>{

    //             roomcode:searchroom[0].roomcode,
    //             studentid:studProfile.studentID,
    //             studentname:studProfile.username,
    //             studenttitle:"English guy"  
    
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

    setroomcodeDocuId(joinroomdata[0].id) //set joinroom docuid
    setstudents(joinroomlistdata) //set students inside the room

  }
  
  renderStud()

},[])

//end session func
  const handleEndSession = () => {
   
    const confirmEnd = window.confirm('Are you sure, you want to end session?')
    if(confirmEnd === true){
      deleteDoc(doc(firestore,"joinroom",roomcodeDocuId)) //delete room 

      students.map((element,index)=>{  //delete students still insidde the room
      deleteDoc(doc(firestore,"joinroom-list",element.id)) 
      })
      navigator("/LobbyRoom")
    }
  };

  //edit date and time func...

  const editTimeDateFunc=async()=>{

    //combine date and time
    const dateTimeValue = date + " " + time.hour + ":" + time.minute + " " + time.period
    const dateupdated = new Date(dateTimeValue)

    //update date and time now
    
    const joinroomRef = doc(firestore,"joinroom",roomcodeDocuId)
    await updateDoc(joinroomRef,{
      timeopen:dateupdated
    })

    window.alert("Date and Time changed")
    setshoweditTime(false)
 
  }
  
    return(<>

    <div className={RoomViewSt.roomviewContainer}>
         <nav className={RoomViewSt.roomviewHeader}>
        
               <ul className = {showNav ? RoomViewSt.sidebarShow : RoomViewSt.sidebarHide}>
                <li onClick={()=>setshowNav(false)}><a><ImCross /></a></li>
                <li><a>Welcome, Userdfgdgdgdgddg</a></li>
                <li><a>Classroom</a></li>
                <li><a>sdfsfsfsf</a></li>
                <li><a>sdfsfsfsf</a></li>
                <li><a>sdfsfsfsf</a></li>
        
               </ul>
        
               <ul>
                <li onClick={()=>console.log("df")}><a className={RoomViewSt.Logoname}>LearnEng</a></li>
                <li onClick={()=>navigator("/HelpNote")} className={RoomViewSt.hideonMobile}><a>Help</a></li>
                <li onClick={()=>navigator("/AboutPage")} className={RoomViewSt.hideonMobile}><a> About us</a></li>
                <li onClick={()=>{}} className={RoomViewSt.hideonMobile}></li>
                <li className={RoomViewSt.hideonMobile} onClick={()=>{ navigator('/Profilepage')}}><a>Welcome, {ProfileActive.username}</a></li>
                <li className={RoomViewSt.navbtn} onClick={()=>setshowNav(true)}><a><TfiMenu/></a></li>
                 {/* <li onClick={()=>{setProfileActive({}) 
                    navigator("/")}} className={RoomViewSt.hideonMobile}><a>LOGOUT</a></li> */}
               </ul>
        
               </nav>
               
               {/* start form */}

               <Container className="mt-4" style={{ maxWidth: '1200px' }}>
        <Card className="p-4" style={{ backgroundColor: '#2b5ea4', color: 'white' }}>
          <h3 className="mb-3">Room Code: {roomAccessCode} </h3>
          {/* <Button variant="secondary" className="m-2">Lock Room</Button> */}
          <Button variant="danger" className="m-2" onClick={() => handleEndSession()}>End Session</Button>

          <div className="mt-3">
            <p>Time to open room for everyone:</p>
            {/* <span>{room.time?.hour}:{room.time?.minute} {room.time?.period} on {room.date}</span> */}
          </div>

          
          <div className="mt-3">
                      <Button
                    variant="info"
                    className="m-2"> View Lobby</Button>
            <Button onClick={()=>{setshoweditTime(true)}} variant="warning" className="m-2">Edit Date and Time</Button>
          </div>

          <div className="mt-4" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            color: 'black'
          }}>
            <h5 className="mb-3">Student/s Online</h5>
            <Row>
              {students.map((student, index) => (
                <Col key={index} xs={12} md={6} lg={6} className="mb-3">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                  

                  }}>
                    <img src="https://i.imgur.com/svFqnyk.png" alt="student" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px' }} />
                    <span style={{ fontSize: '1.1rem' }}>{student.studentname}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Card>

        <Modal show = {showeditTime} onHide={() => setshoweditTime(false)} centered>

        <Modal.Body style={{ color: 'white' }}>

<Row className="justify-content-center">
   <Col xs={4} md={2}>
    <h6 style = {{color:'black'}}>Hours</h6>
    <Form.Control
    type='number'
     placeholder="HH"
     value={time.hour > 12 ? 1 : time.hour}
     onChange={(e)=>setTime({...time,hour:e.target.value})}
    />
  </Col>
  <Col xs={4} md={2}>
   <h6 style = {{color:'black'}}>Minutes</h6>
    <Form.Control 
    placeholder="MM"
     type='number'
     value={time.minute > 59 ? 0: time.minute}
      onChange={(e)=>setTime({...time,minute:e.target.value})}
    />
  </Col>
   <Col xs={4} md={3}>
    <h6 style = {{color:'black'}}>Period</h6>
    <Form.Select 
    placeholder="Last Name"
    onChange={(e)=>setTime({...time,period:e.target.value})}
    >
      <option>AM</option>
      <option>PM</option>
    </Form.Select>
  </Col>
  <h6 style = {{color:'black'}}>Date</h6>
   <Form.Control
       type="date"
       value={date}
       onChange={(e) => setDate(e.target.value)}
      // disabled={openAnytime}
   />

   <Col xs={1} md={4}  className="d-flex gap-2">
<Button className="me-2" onClick={()=>editTimeDateFunc()}>Change time</Button>

 </Col>

</Row>
       
                                 
        </Modal.Body>

        </Modal>
      </Container>
               
               </div>
    </>)

}

export default RoomView;

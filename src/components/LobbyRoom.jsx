import React, { useRef,createContext, useContext, useState , useEffect} from 'react';
import {Link,Navigate,useNavigate} from 'react-router-dom'
import { MyContext } from './DataContext';
import { GoogleLogin,GoogleOAuthProvider,useGoogleOneTapLogin  } from '@react-oauth/google';
import {gapi}from 'gapi-script';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import LobbyRoomSt from '../styleweb/LobbyRoomSt.module.css'
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
  Image
} from 'react-bootstrap';
import { firestore } from '../firebase';
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit,ref, getDoc,doc} from '@firebase/firestore';


const LobbyRoom=()=>{

  const [LobbyRendered,setLobbyRendered]=useState(false)  //loading

         const [showNav, setshowNav]=useState(false);
         const navigator = useNavigate()

         //useState---------
           const [rooms, setRooms] = useState([]); //list of available rooms

                   
        const {ProfileActive,setProfileActive}=useContext(MyContext);
        const {roomAccessCode,setroomAccessCode}=useContext(MyContext);

           //functions
           const addRoom = (newRoom) => {
        //   setRooms([...rooms, newRoom]);
            };

           const deleteRoom = (code) => {
        //  setRooms(rooms.filter(room => room.code !== code));
           };

        const joinRoomFunc=(roomcode)=>{

            setroomAccessCode(roomcode)
            navigator('/RoomView')
            
        }


        useEffect(()=>{

          setLobbyRendered(true)

            const listofRoomF=async()=>{

         

            const joinroomdblist = collection(firestore,"joinroom")
            const wherejoinroom = query(joinroomdblist,
                where('teacherid',"==",ProfileActive.teacherID)
            )
            const getJoinroom = await getDocs(wherejoinroom)
            const JoinroomData = getJoinroom.docs.map((doc)=>({
                id:doc.id,
                ...doc.data(),
            }));

            setRooms(JoinroomData)
              setLobbyRendered(false)
           }
           listofRoomF()
        //    console.log(rooms)

       },[])
    return(
        <>

        
          {/* home header  */}
        <div className={LobbyRoomSt.LobContainer}>
               <nav className={LobbyRoomSt.LobHeader}>
        
               <ul className = {showNav ? LobbyRoomSt.sidebarShow : LobbyRoomSt.sidebarHide}>
                <li onClick={()=>setshowNav(false)}><a><ImCross /></a></li>
                <li><a>Welcome, Userdfgdgdgdgddg</a></li>
                <li><a>Classroom</a></li>
                <li><a>sdfsfsfsf</a></li>
                <li><a>sdfsfsfsf</a></li>
                <li><a>sdfsfsfsf</a></li>
                
        
               </ul>
        
               <ul>
                <li onClick={()=>console.log("df")}><a className={LobbyRoomSt.Logoname}>LearnEng</a></li>
                <li onClick={()=>navigator("/HelpNote")} className={LobbyRoomSt.hideonMobile}><a>Help</a></li>
                <li onClick={()=>navigator("/AboutPage")} className={LobbyRoomSt.hideonMobile}><a> About us</a></li>
                {/* <li onClick={()=>{}} className={LobbyRoomSt.hideonMobile}></li> */}
                <li className={LobbyRoomSt.hideonMobile} onClick={()=>{ navigator('/Profilepage')}}><a>Welcome, {ProfileActive.username}</a></li>
                <li className={LobbyRoomSt.navbtn} onClick={()=>setshowNav(true)}><a><TfiMenu/></a></li>
                {/* <li onClick={()=>{setProfileActive({}) 
                    navigator("/")}} className={LobbyRoomSt.hideonMobile}><a>LOGOUT</a></li> */}
               </ul>
        
               </nav>

               {/* start form */}

                 <Container className="mt-4">
              <h3 className="text-white">Active Room</h3>
              <div style={{ backgroundColor: '#2b5ea4', padding: '20px', borderRadius: '12px' }}>
                <Row>
                  {rooms.length === 0 ? (
                    <p className="text-white">No active rooms yet. Click below to create one!</p>
                  ) : (
                    rooms.map((room, index) => (
                      <Col key={index} xs={12} md={4} className="mb-3">
                        <Card className="text-center" style={{ cursor: 'pointer' }} onClick={() => joinRoomFunc(room.roomcode)}>
                          <Card.Body>
                            <img src="https://img.freepik.com/premium-vector/old-wooden-door-with-metal-rivets-standing-stone-step_98402-199950.jpg?ga=GA1.1.1339217056.1740616814&semt=ais_items_boosted&w=740" alt="Clock" style={{ width: '80px', marginBottom: '10px' }} />
                            <Card.Title>{room.roomcode}</Card.Title>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  )}
                </Row>
             <Row className="mt-3">
  <Col xs="auto">
    <Button variant="info" onClick={() => navigator('/HostActivityPage')}>
      ➕ Create new room
    </Button>
  </Col>
  {/* <Col xs="auto">
    <Button variant="info">View Room/s</Button>
  </Col> */}
</Row>
             
              </div>
                {/* loading modal */}
                        <Modal show = {LobbyRendered} onHide={() => setLobbyRendered(false)} centered>
                        <Modal.Body style={{ color: 'white' }}>
                         <div className="d-flex mb-3">
                            <span style={{width:50,height:50,color:'black',color:'blue'}} class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span  style={{fontSize:30,color:'black'}} class="sr-only">Loading...</span>
                          </div>
                        </Modal.Body>
                        </Modal>
            </Container>

               </div>

        </>
    )
}

export default LobbyRoom;
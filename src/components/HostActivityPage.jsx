import React, { useRef,createContext, useContext, useState , useEffect} from 'react';

import {Link,Navigate,useNavigate} from 'react-router-dom'
import { MyContext } from './DataContext';
import { GoogleLogin,GoogleOAuthProvider,useGoogleOneTapLogin  } from '@react-oauth/google';
import {gapi}from 'gapi-script';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import { HiSortAscending } from 'react-icons/hi';
import 'bootstrap/dist/css/bootstrap.min.css';
import HostActivityPageSt from '../styleweb/HostActivityPageSt.module.css'
import { Button, Form, Card, Container, Row, Col,Alert } from 'react-bootstrap';
import { TfiMenu } from "react-icons/tfi";
import { MdMeetingRoom,MdContactPhone  } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import {firestore} from "../firebase";
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit,ref, getDoc,doc} from '@firebase/firestore';

const HostActivityPage=()=>{

  //useState get set
    const [selectedForm, setSelectedForm] = useState(null);
  const [code, setCode] = useState("");
  const [time, setTime] = useState({ hour: "", minute: "", period: "AM" });
  const [date, setDate] = useState("");
  const [openAnytime, setOpenAnytime] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

   const {ProfileActive,setProfileActive}=useContext(MyContext); //saved profile

  //get question useState
  // const {roomList,setroomList}=useContext(MyContext)
  const [questionSet,setquestionSet]=useState([]);

  //set questionsetref before creating room
  const[questionSetref,setquestionSetref]=useState(0);


  //functions...............

  //render questionset

  useEffect(()=>{

    const renderQuesSet=async()=>{

      const questionsetdblist = collection(firestore,"question-collection")
      const wherequesSet = query(questionsetdblist,
        where("teacherid","==",ProfileActive.teacherID)
      )
      const getquesSet = await getDocs(wherequesSet)
      const quesSetData = getquesSet.docs.map((doc)=>({
        id:doc.id,
        ... doc.data(),
      }))

      setquestionSet(quesSetData)
      console.log("dsfsfsd")
    }

    renderQuesSet()
  

  },[])


  const handleFormClick = (index,questionsetref) => {
    setSelectedForm(index);
    setquestionSetref(questionsetref)
  };

  const generateCode = () => {
    // const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
     const min = Math.ceil(0);   // Ensure min is an integer (rounds up)
   const max = Math.floor(999999);  // Ensure max is an integer (rounds down)
    setCode(Math.floor(Math.random() * (max - min + 1)) + min);
  };

  //create room--------------------
  const validateAndCreate = () => {
    if (selectedForm === null) {
      showAlert("danger", "Please select a form.");
      return;
    }
    else if (!openAnytime && (!time.hour || !time.minute || !date)) {
      showAlert("danger", "Please fill in time and date or choose Open Anytime.");
      return;
    }
   else if (!code) {
      showAlert("danger", "Please generate a code.");
      return;
    }
    //create room now*****
    const dateValue = date + " " + time.hour +":"+ time.minute +" " + time.period //combine ddate and time
    const datern = new Date(dateValue) //convert to date
   
    addDoc(collection(firestore,"joinroom"),{
      questionsetref:questionSetref,
      roomcode:code,
      teacherid:ProfileActive.teacherID,
      timeopen:datern

    })
    showAlert("success", "Form created successfully!");
    navigator("/LobbyRoom")
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
  };


     const [showNav, setshowNav]=useState(false);
  
      const navigator = useNavigate();
        
      //darkmode activator
  
      const [darkMode,setdarkmode]=useState(false);
  
    return(
        <>
         <div
  style={{
     backgroundimage: "url('https://i.imgflip.com/727smp.jpg')",
    backgroundSize: "cover",       // Scale to cover entire area
    backgroundPosition: "center",  // Center the image
    backgroundRepeat: "no-repeat", // Prevent repeating
    height: "100vh"                // Optional: full height
  }}
>

  {/* home header  */}

       <nav className={HostActivityPageSt.hostHeader}>

       <ul className = {showNav ? HostActivityPageSt.sidebarShow : HostActivityPageSt.sidebarHide}>
        <li onClick={()=>setshowNav(false)}><a><ImCross /></a></li>
        <li><a>Welcome, {ProfileActive.username}</a></li>
        <li onClick={()=>navigator("/HelpNote")}><a>Help</a></li>
        <li onClick={()=>navigator("/AboutPage")}><a>About us</a></li>
        {/* <li><a>sdfsfsfsf</a></li> */}
        

       </ul>

       <ul>
        <li onClick={()=>console.log("df")}><a className={HostActivityPageSt.Logoname}>LearnENG</a></li>
        <li onClick={()=>navigator("/HelpNote")} className={HostActivityPageSt.hideonMobile}><a>Help</a></li>
        <li onClick={()=>navigator("/AboutPage")} className={HostActivityPageSt.hideonMobile}><a> About us</a></li>
        {/* <li onClick={()=>{}} className={HostActivityPageSt.hideonMobile}></li> */}
        <li className={HostActivityPageSt.hideonMobile} onClick={()=>{ navigator('/Profilepage')}}><a>Welcome, {ProfileActive.username}</a></li>
        <li className={HostActivityPageSt.navbtn} onClick={()=>setshowNav(true)}><a><TfiMenu/></a></li>

       </ul>

       </nav>

     {/* start room form */}
      <Container className={[" bg-primary py-4 border-2"]}>
        {alert.show && (
          <Alert variant={alert.type}>{alert.message}</Alert>
        )}

        <Card className="p-4">
          <h4 className="mb-3">Select Form</h4>
          <Row>
     
          {questionSet.map((element,index)=>(
              <Col xs={6} key={index}>
                <Card
                  className={`text-center p-2 mb-3 ${selectedForm === index ? "border-primary" : ""}`}
                  onClick={() => {handleFormClick(index,element.questionsetref)}}
                  style={{ width: '10rem' , cursor: "pointer" }}
                >
                  <div style={{ background: "#ccc", height: 100 }}></div>
                  <Card.Body >
                    <Card.Title>{element.setname}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>

          ))
          }
          
              
          </Row>

          <Form>
            <Row className="align-items-end mb-3">
              <Col xs={6} md={4}>
                <Form.Label>Code</Form.Label>
                <Form.Control type="text" value={code} readOnly />
              </Col>
              <Col xs={6} md={4}>
                <Button variant="info" className="mt-2" onClick={generateCode}>Generate Code</Button>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={4} md={2}>
                <Form.Label>Set open time</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="HH"
                      value={time.hour > 12 ? 1 : time.hour}
                  onChange={(e) => setTime({ ...time, hour: e.target.value })}
                />
              </Col>
              <Col xs={4} md={2}>
                <Form.Label>&nbsp;</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="MM"
                value={time.minute > 59 ? 0: time.minute}
                  onChange={(e) => setTime({ ...time, minute: e.target.value })}
                />
              </Col>
              <Col xs={4} md={2}>
                <Form.Label>&nbsp;</Form.Label>
                <Form.Select
                  value={time.period}
                  onChange={(e) => setTime({ ...time, period: e.target.value })}
                >
                  <option>AM</option>
                  <option>PM</option>
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Label>Set open date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={openAnytime}
                />
              </Col>
              <Col xs={12} md={6} className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  label="Open anytime"
                  checked={openAnytime}
                  onChange={() => setOpenAnytime(!openAnytime)}
                />
              </Col>
            </Row>

            <Button onClick={validateAndCreate} variant="primary">Create</Button>
         
          </Form>
        </Card>
      </Container>
    </div>

        </>
    )
}

export default HostActivityPage;
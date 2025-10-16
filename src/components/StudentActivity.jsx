import React, { useRef,createContext, useContext, useState , useEffect} from 'react';
import {Link,Navigate,useNavigate} from 'react-router-dom'
import { MyContext } from './DataContext';
import { GoogleLogin,GoogleOAuthProvider,useGoogleOneTapLogin  } from '@react-oauth/google';
import {gapi}from 'gapi-script';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import QuestionCreationSt from '../styleweb/QuestionCreationSt.module.css'
import { HiSortAscending } from 'react-icons/hi';
import { IoIosArrowDown,IoMdArrowDropright,IoMdContact } from "react-icons/io";
import { TfiMenu } from "react-icons/tfi";
import { MdMeetingRoom,MdContactPhone, MdSynagogue  } from "react-icons/md";
import { FaBook, FaCrown,FaChevronDown } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import StudentActivitySt from '../styleweb/StudentActivitySt.module.css'

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
} from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { firestore } from '../firebase';
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit,ref, getDoc,doc} from '@firebase/firestore';

const StudentActivity=()=>{

         const [showNav, setshowNav]=useState(false);
      
          const navigator = useNavigate();
            
          //darkmode activator
      
          const [darkMode,setdarkmode]=useState(false);

    const data = [
  { name: "Grammar", value: 38 },
  { name: "Vocabulary", value: 42 },
  { name: "Situational English", value: 20 }
];

// Optional: custom colors for each slice
const COLORS = ["#007bff", "#28a745", "#ffc107"];

    return(
        <>

        <div className={StudentActivitySt.studactContainer}>

         <nav className={StudentActivitySt.studactHeader}>
                
                       <ul className = {showNav ? StudentActivitySt.sidebarShow : StudentActivitySt.sidebarHide}>
                        <li onClick={()=>setshowNav(false)}><a><ImCross /></a></li>
                        <li><a>Welcome, Userdfgdgdgdgddg</a></li>
                        <li><a>Classroom</a></li>
                        <li><a>sdfsfsfsf</a></li>
                        <li><a>sdfsfsfsf</a></li>
                        <li><a>sdfsfsfsf</a></li>
                        
                
                       </ul>
                
                       <ul>
                        <li onClick={()=>console.log("df")}><a className={StudentActivitySt.Logoname}>Create Room</a></li>
                        <li onClick={()=>navigator("/HelpNote")} className={StudentActivitySt.hideonMobile}><a>Help</a></li>
                        <li onClick={()=>navigator("/AboutPage")} className={StudentActivitySt.hideonMobile}><a> About us</a></li>
                        <li onClick={()=>{}} className={StudentActivitySt.hideonMobile}></li>
                        <li className={StudentActivitySt.hideonMobile} onClick={()=>{ navigator('/Profilepage')}}><a>Welcome, Userdfgdgdgdgddg</a></li>
                        <li className={StudentActivitySt.navbtn} onClick={()=>setshowNav(true)}><a><TfiMenu/></a></li>
                
                       </ul>
                
                       </nav>

                         <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow p-4 rounded-4">
            <h4 className="text-center mb-4">
              Students' English Proficiency Performance
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Container>
        

      
       </div>
        </>
    )

}

export default StudentActivity;
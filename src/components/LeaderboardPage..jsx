import React, { useRef,createContext, useContext, useState , useEffect} from 'react';
import LeaderBoardPageSt from '../styleweb/LeaderboardPageSt.module.css'
import {Link,Navigate,useNavigate} from 'react-router-dom'
import { MyContext } from './DataContext';
import { GoogleLogin,GoogleOAuthProvider,useGoogleOneTapLogin  } from '@react-oauth/google';
import {gapi}from 'gapi-script';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import { HiSortAscending } from 'react-icons/hi';
import { IoIosArrowDown,IoMdArrowDropright,IoMdContact } from "react-icons/io";
import { TfiMenu } from "react-icons/tfi";
import { MdMeetingRoom,MdContactPhone  } from "react-icons/md";
import { FaBook, FaCrown,FaChevronDown } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { FiCheck } from 'react-icons/fi';
import { MdLeaderboard } from "react-icons/md";
import { FaMedal, FaAward } from "react-icons/fa";
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
  Table
} from 'react-bootstrap';


const LeaderboardPage=()=>{

    
        const [showNav, setshowNav]=useState(false);
    
        const navigator = useNavigate();

        //sort date lead animation

        const [dateLeadanim,setdateLeadanim]=useState(false);

        //dropdown state

        const [dropDown1,setdropDown1]=useState(false);
        const [dropDown2,setdropDown2]=useState(false);

        const {ProfileActive,setProfileActive}=useContext(MyContext)

        const leaderboardData = [
  { name: "Kylie Santos", honoraryTitle: "Grammar Guru", score: 98 },
  { name: "Russell Tan", honoraryTitle: "Vocab Virtuoso", score: 92 },
  { name: "Mira Diaz", honoraryTitle: "Situation Star", score: 87 },
  { name: "John Cruz", honoraryTitle: "English Explorer", score: 15 },
  { name: "Bianca Lee", honoraryTitle: "Proficiency Pro", score: 80 }
];

const getIcon = (rank) => {
  if (rank === 0)
    return <FaCrown size={24} style={{ color: "#FFD700", verticalAlign: "middle" }} title="Top 1"/>;
  if (rank === 1)
    return <FaMedal size={22} style={{ color: "#C0C0C0", verticalAlign: "middle" }} title="Top 2"/>;
  if (rank === 2)
    return <FaAward size={22} style={{ color: "#CD7F32", verticalAlign: "middle" }} title="Top 3"/>;
  return null;
};


const scoreBadge = (score) => {
  let variant = "secondary";
  if (score >= 95) variant = "success";
  else if (score >= 90) variant = "info";
  else if (score >= 85) variant = "primary";
  else if (score >= 80) variant = "warning";
  return (
    <Badge pill bg={variant} style={{ fontSize: "1.05em", minWidth: 40 }}>
      {score}
    </Badge>
  );
};
  const sortedData = leaderboardData.sort((a, b) => b.score - a.score);

    return(
        <>

        <div className={LeaderBoardPageSt.leadContainer}>

        <nav className={LeaderBoardPageSt.leadHeader}>
        
               <ul className = {showNav ? LeaderBoardPageSt.sidebarShow : LeaderBoardPageSt.sidebarHide}>
                <li onClick={()=>setshowNav(false)}><a><ImCross /></a></li>
                <li><a>Welcome, Userdfgdgdgdgddg</a></li>
                <li><a>Classroom</a></li>
                <li><a>sdfsfsfsf</a></li>
                <li><a>sdfsfsfsf</a></li>
                <li><a>sdfsfsfsf</a></li>
                
        
               </ul>
        
               <ul>
                <li onClick={()=>console.log("df")}><a className={LeaderBoardPageSt.Logoname}>Create Room</a></li>
                <li onClick={()=>navigator("/HelpNote")} className={LeaderBoardPageSt.hideonMobile}><a>Help</a></li>
                <li onClick={()=>navigator("/AboutPage")} className={LeaderBoardPageSt.hideonMobile}><a> About us</a></li>
                {/* <li onClick={()=>{}} className={LeaderBoardPageSt.hideonMobile}></li> */}
                <li className={LeaderBoardPageSt.hideonMobile} onClick={()=>{ navigator('/Profilepage')}}><a>Welcome, {ProfileActive.username}</a></li>
                <li className={LeaderBoardPageSt.navbtn} onClick={()=>setshowNav(true)}><a><TfiMenu/></a></li>
                {/* <li onClick={()=>{setProfileActive({}) 
                 navigator("/")}} className={LeaderBoardPageSt.hideonMobile}><a>LOGOUT</a></li> */}
               </ul>
        
               </nav>
        

              <Container className="my-5">
      <Card className="shadow-lg p-4 rounded-4 border-0" style={{ background: "linear-gradient(135deg, #f8fafc 80%, #b2d8f7 100%)" }}>
        <div
          style={{
            background: "linear-gradient(90deg, #007bff 60%, #66e0ff 100%)",
            color: "#fff",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
            padding: "1rem 0",
            margin: "-1.9rem -1.9rem 2rem -1.9rem",
            textAlign: "center",
            boxShadow: "0 4px 24px rgba(0,123,255,0.1)",
            letterSpacing: "0.04em"
          }}
        >
          <h2 style={{ margin: 0, fontWeight: 700 }}>
            🏆 English Proficiency Leaderboard 🏆
          </h2>
        </div>
        <Table
          hover
          responsive
          className="align-middle text-center mb-0"
          style={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 2px 18px rgba(0,0,0,0.04)"
          }}
        >
          <thead style={{ background: "#f1f3f7" }}>
            <tr>
              <th style={{ fontWeight: 600 }}>Rank</th>
              <th style={{ fontWeight: 600 }}>Student Name</th>
              <th style={{ fontWeight: 600 }}>Honorary Title</th>
              <th style={{ fontWeight: 600 }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((student, index) => (
              <tr key={student.name}>
                <td>
                  <span style={{ fontWeight: 700, fontSize: "1.2em" }}>
                    {getIcon(index) || index + 1}
                  </span>
                </td>
                <td style={{ fontWeight: index === 0 ? 700 : 500 }}>
                  {student.name}
                </td>
                <td>
                  <span>
                    {student.honoraryTitle}{" "}
                    {index === 0 && <FaCrown style={{ color: "#FFD700", marginLeft: 4 }} />}
                    {index === 1 && <FaMedal style={{ color: "#C0C0C0", marginLeft: 4 }} />}
                    {index === 2 && <FaAward style={{ color: "#CD7F32", marginLeft: 4 }} />}
                  </span>
                </td>
                <td>{scoreBadge(student.score)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="text-end mt-3" style={{ fontStyle: "italic", fontSize: "0.9em", color: "#6c757d" }}>
          Congratulations to our top performers!
        </div>
      </Card>
    </Container>
            
        </div>

        </>
    )
}

export default LeaderboardPage;

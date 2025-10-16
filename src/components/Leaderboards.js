import {Link,Navigate,useNavigate} from 'react-router-dom'
import React, { useRef,createContext, useContext, useState , useEffect, useSyncExternalStore} from 'react';
import { MyContext } from './DataContext';
import { GoogleLogin,GoogleOAuthProvider,useGoogleOneTapLogin  } from '@react-oauth/google';
import {gapi}from 'gapi-script';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import { HiSortAscending } from 'react-icons/hi';
import { IoIosArrowDown,IoMdArrowDropright,IoMdContact } from "react-icons/io";
import { TfiMenu } from "react-icons/tfi";
import { MdMeetingRoom,MdContactPhone, MdSynagogue  } from "react-icons/md";
import { FaStar ,FaBook, FaCrown,FaChevronDown, FaSearch, FaArrowRight,FaFacebook,FaSchool} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion,FaSquareXTwitter } from "react-icons/fa6";


import LeaderboardsSt from '../styleweb/LeaderboardsSt.module.css'

import Background from '../assets/Category__Game_1_BG.png';
import LearnEngLogo from '../assets/LearnEngLG.png';
import UserIcon from '../assets/Admin_Icon.png';
import { addDoc,collection,getDocs, updateDoc, deleteDoc,Timestamp,onSnapshot, where, query, limit, getDoc,doc} from '@firebase/firestore';
import { firestore } from '../firebase';

import { storage } from '../firebase';
import { getStorage,ref, uploadBytes, getDownloadURL, updateMetadata,deleteObject  } from "firebase/storage";

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
  Accordion,
  ListGroup
} from 'react-bootstrap';

const Leaderboards = ()=>{

       const navigator = useNavigate();  //navigator
        
   const [dropdownOpen, setDropdownOpen] = useState(false);

     const formRef = useRef(null);
         //terms and conditions modal
     
         const [termsConModal,settermsConModal]=useState(false)
   
         const [aboutUsModal,setaboutUsModal]=useState(false)
   
         const [contactUsModal,setcontactUsModal]=useState(false)
   
   
          const handleSubmit = () => {
       alert('Submitted successfully!');
       setTimeout(() => {
         if (formRef.current) {
           formRef.current.reset();
         }
       }, 100);
     };
         


  //useState
  const {ProfileActive,setProfileActive}=useContext(MyContext);
  const [studentScores,setstudentScores]=useState([]);
    //profile img management
    const [profileUrlName,setprofileUrlName]=useState(null)

    const sortedData = [...studentScores].sort((a, b) => b.performanceaverage - a.performanceaverage);

    //compute gwa

  const computeAverageFromPerformance = (performanceArray) => {
  if (!performanceArray || performanceArray.length === 0) return 0;
  const total = performanceArray.reduce((sum, score) => sum + score, 0);
  return Math.round(total / performanceArray.length);
 
};

  //filter student year
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
// Generate array of years for dropdown (last 10 years)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  //useEffect.......

   useEffect(()=>{
    
          const imageRender=async()=>{
  
            if (!ProfileActive?.profilepath) return;
  
          console.log(ProfileActive.profilepath)
          const imageRef = ref(storage,ProfileActive.profilepath);
          const url = await getDownloadURL(imageRef);
          setprofileUrlName(url)
          console.log(url)
           }
    
           imageRender()
        },[ProfileActive])

  //render all leaderboard data (source: analytics)

  useEffect(()=>{

    const LeaderBoardRen = async()=>{

      if (!ProfileActive?.gradelevel) return; 

      const startDate = Timestamp.fromDate(new Date(selectedYear, 0, 1, 0, 0, 0));
        const endDate = Timestamp.fromDate(new Date(selectedYear, 11, 31, 23, 59, 59));

        const analyticsdblist = collection(firestore,"analytics")
        const whereAnalytics = query(analyticsdblist,
          where("gradelevel",'==',ProfileActive.gradelevel)
        );
      
        // const getAnalytics = await getDocs(whereAnalytics)
           const unsubscribe = onSnapshot(whereAnalytics, (snapshot) => {
        const AnalyticsData = snapshot.docs.map((doc)=>({
          id:doc.id,
          ...doc.data()
        })).filter((item) => {
       if (!item.datecreated) return false;
      const docDate = item.datecreated.toDate();
      return docDate >= startDate.toDate() && docDate <= endDate.toDate();
       });

      
    const newStudentScores = AnalyticsData.map((element) => ({
      studentname: element.studentname,
      performanceaverage: computeAverageFromPerformance(element.performance),
    }));

    setstudentScores(newStudentScores);
});

  return () => unsubscribe();
  
    }

    LeaderBoardRen()

  },[ProfileActive?.gradelevel,selectedYear])

    return(
        <>

         <div
      className={LeaderboardsSt.leaderboardwrapper}
      style={{ backgroundImage: `url(${Background})` }}
    >
      {/* <div className={LeaderboardsSt.headerbar}>
        <img src={LearnEngLogo} alt="Logo" className={LeaderboardsSt.logo} />
        <div className={LeaderboardsSt.headerright}>
          <span className={LeaderboardsSt.welcometext}>Welcome, {ProfileActive.username}!!</span>
          <img src={UserIcon} alt="User" className={LeaderboardsSt.usericon} />
        </div>
      </div> */}
       <div className={LeaderboardsSt.header}>
                    <img src={LearnEngLogo} alt="LearnENG Logo" className={LeaderboardsSt.logo} />
            
                    <div className={LeaderboardsSt.userDropdown} >
                      <button
                        className={LeaderboardsSt.userToggle}
                        onClick={() => setDropdownOpen((v) => !v)}
                      >
                        <span className={LeaderboardsSt.welcomeText}>Welcome, {ProfileActive.username}!</span>
                        <img src={profileUrlName} alt="User Icon" className={LeaderboardsSt.userIcon} />
                      </button>
            
                      {dropdownOpen && (
                        <div className={LeaderboardsSt.dropdownCustom}>
                          <button
                            className={LeaderboardsSt.dropdownItem}
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
      

      <div className={LeaderboardsSt.backbuttoncontainer}>
        <button className={LeaderboardsSt.backbutton} onClick={() => navigator('/Homepage')}>Back</button>
      </div>

<div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems:'center',
  marginBottom: '20px',
  columnGap:'20px'
}}>

<h3>Sort by  Year:</h3>
         <select
    id="year-select"
    value={selectedYear}
    onChange={(e) => setSelectedYear(Number(e.target.value))}
    style={{
      width:'500px',
      padding: '8px 12px',
      fontSize: '14px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: 'white',
      cursor: 'pointer',

    }}
  >
    {years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
</div>

      <div className={LeaderboardsSt.leaderboardcontent}>
        <h2 className={LeaderboardsSt.leaderboardtitle}>Leaderboards for Grade {ProfileActive.gradelevel} Students</h2>

        {studentScores.length > 0 ? 
        <div className={LeaderboardsSt.scrollableleaderboard}>
          <table className={LeaderboardsSt.customleaderboardtable}>
            <tbody>
              {sortedData.map((student, index) => (
                <tr key={index} >

                  <td className={LeaderboardsSt.rankcol}>
                    {index < 3 ? (
                      <div className={LeaderboardsSt.iconcontainer}>
                        <FaStar className={LeaderboardsSt.staricon} />
                        <span className={LeaderboardsSt.crownrank}>{index + 1}</span>
                      </div>
                    ) : (
                      <div className={LeaderboardsSt.iconcontainer}>
                        <FaStar className={LeaderboardsSt.staricon} />
                        <span className={LeaderboardsSt.starnumber}>{index + 1}</span>
                      </div>
                    )}
                  </td>
                  <td className={LeaderboardsSt.namecol}>{student.studentname}</td>
                  <td className={LeaderboardsSt.scorecol}>{student.performanceaverage}%</td>
              
                </tr>
              ))}
            </tbody>
          </table>
        </div>
         : 'No Record'}
      </div>
    </div>

   <footer className={LeaderboardsSt.footer}>
           <div className={LeaderboardsSt.footerContent}>
   
           
             {/* Main Footer Content */}
             <div className={LeaderboardsSt.footerMain}>
             
               {/* Brand Section */}
               <div className={LeaderboardsSt.footerBrand}>
                
   
                 <div className={LeaderboardsSt.infoFooter}>
                  <img src={LearnEngLogo} alt="LearnENG Logo" className={LeaderboardsSt.logofooter} />
                 <p className={LeaderboardsSt.brandTagline}>Master English with confidence</p>
                  {/* Social Links */}
                         <div className={LeaderboardsSt.socialLinks}>
                         <a>Follow us: </a>
                          <a href="https://www.facebook.com/share/1Ty9MwVs2s/" target="_blank" rel="noopener noreferrer" className={LeaderboardsSt.socialLink}>
                         <FaFacebook />
                          </a>
                           
                         </div>
   
                         
                  </div> 
   
          
                          
               </div>
               
   
       <div className={LeaderboardsSt.footerinfoCon}>
      
                  <div className={LeaderboardsSt.footerquicklinkCon}>
               {/* Quick Links */}
               <div className={LeaderboardsSt.footerSection}>
                 <h4 className={LeaderboardsSt.sectionTitle}>Quick Links</h4>
                 <div className={LeaderboardsSt.linkGroup}>
                   <button onClick={()=>setaboutUsModal(true)} className={LeaderboardsSt.footerLink}>About Us</button>
                 </div>
               </div>
               
               {/* Support */}
               <div className={LeaderboardsSt.footerSection}>
                 <h4 className={LeaderboardsSt.sectionTitle}>Support</h4>
                 <div className={LeaderboardsSt.linkGroup}>
                   <button onClick={()=>setcontactUsModal(true)} className={LeaderboardsSt.footerLink}>Contact Us</button>
                 </div>
               </div>
               
               {/* Legal */}
               <div className={LeaderboardsSt.footerSection}>
                 <h4 className={LeaderboardsSt.sectionTitle}>Legal</h4>
                 <div className={LeaderboardsSt.linkGroup}>
                   <button 
                     className={LeaderboardsSt.footerLink}
                     onClick={() => settermsConModal(true)}
                   >
                     Terms & Conditions
                   </button>
                 </div>
               </div>
   
      
   
            </div>   
             
   
             <div className={LeaderboardsSt.footerSection}>
      <h4 className={LeaderboardsSt.sectionTitle}>Get in Touch</h4>
      <div className={LeaderboardsSt.linkGroup}>
        <p>&#8226; Pasay, Philippines</p>
     <p>&#8226;1987goldentreasure@gmail.com</p>
     <p>&#8226; 288512003</p>
      </div>
    </div>
   
              </div> 
   
             </div>
   
   
   
              
        {/* Divider */}
             <div className={LeaderboardsSt.footerDivider}></div>     
   
             {/* Bottom Section */}
             <div className={LeaderboardsSt.footerBottom}>
               <div className={LeaderboardsSt.footerCopyright}>
                 <p>© {new Date().getFullYear()} LearnENG. All rights reserved.</p>
                 <p className={LeaderboardsSt.madeWith}>Made with ❤️ for English learners worldwide</p>
               </div>
               
             </div>
           </div>
         </footer>

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
    
            {/* about us */}
    
            <Modal show={aboutUsModal} onHide={()=>setaboutUsModal(false)} size="lg" centered scrollable>
    <Modal.Header closeButton>
    <Modal.Title>About LearnEng — Your English, Faster</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    {/* Mission */}
    <section className="mb-4">
    <p className="lead text-muted">LearnEng is an English-learning app built for real-world learners. Bite-sized lessons, AI-backed practice, and friendly progress tracking — all in one place.</p>
    <div className="card border-0 shadow-sm">
    <div className="card-body">
    <h2 className="h5">Our mission</h2>
    <p className="mb-0 text-muted">We help motivated learners gain confidence in English through short, practical lessons and smart feedback. Whether you need conversational fluency, better writing for work, or exam prep — LearnEng adapts to your goals.</p>
    </div>
    </div>
    </section>
    
    
    {/* Features */}
    <section className="mb-4">
    <h3 className="h6 mb-2">What you'll get</h3>
    <ul className="list-unstyled mb-0">
    <li className="mb-2">✅ <strong>Interactive Lessons:</strong> Play room sessions covering spelling, grammar and reading</li>
    <li className="mb-2">✅ <strong>Interactive practice:</strong> Assessments, speaking prompts, and instant feedback.</li>
    <li>✅ <strong>Personalized path:</strong> A plan tailored to your goals, with progress tracking.</li>
    </ul>
    </section>
    
    
    {/* How it works */}
    <section className="mb-4">
    <h3 className="h6 mb-2">How it works</h3>
    <ol className="mb-0">
    <li className="mb-1"><strong>Take a quick assessment</strong> — we estimate your level in minutes.</li>
    <li className="mb-1"><strong>Follow a weekly plan</strong> — daily short lessons that fit your schedule.</li>
    <li><strong>Practice with feedback</strong> — improve speaking and writing with tips that matter.</li>
    </ol>
    </section>
    
    
    
    </Modal.Body>
    <Modal.Footer>
    <Button variant="secondary" onClick={()=>setaboutUsModal(false)}>Close</Button>
    </Modal.Footer>
    </Modal>
    
    {/* contact us */}
    
    <Modal show={contactUsModal} onHide={()=>setcontactUsModal(false)} centered>
    <Modal.Header closeButton>
    <Modal.Title>Contact Us</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form 
     action="https://docs.google.com/forms/d/e/1FAIpQLSe49UXJTJwhWfxeWirlvjeyF1FxafWmXxtB7gMTwpNlHF52Og/formResponse"
     method="POST"
      target="hidden_iframe"
    onSubmit={handleSubmit}>
    
                <select name="entry.196762833" required defaultValue="">
                  <option value="" disabled>Select User Type</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                </select>
    
    <Form.Group className="mb-3" controlId="contactName">
    <Form.Label>Name</Form.Label>
    <Form.Control
    type="text"
    placeholder="Enter your name"
    name="entry.694285260"
    // value={formData.name}
    // onChange={handleChange}
    // required
    />
    </Form.Group>
    
    
    <Form.Group className="mb-3" controlId="contactEmail">
    <Form.Label>Email</Form.Label>
    <Form.Control
    type="email"
    placeholder="Enter your email"
    name="entry.1792390226"
    // value={formData.email}
    // onChange={handleChange}
    required
    />
    </Form.Group>
    
    
    
    
    <Form.Group className="mb-3" controlId="contactMessage">
    <Form.Label>Message</Form.Label>
    <Form.Control
    as="textarea"
    rows={4}
    placeholder="Write your message here..."
    name="entry.660316505"
    // value={formData.message}
    // onChange={handleChange}
    required
    />
    </Form.Group>
    
    
    
    <Button variant="primary" type="submit" className="w-100">
    Send Message
    </Button>
    </Form>
    
     <iframe
                name="hidden_iframe"
                style={{ display: 'none' }}
                title="hidden_iframe"
              ></iframe>
    </Modal.Body>
    </Modal>
    

        </>
    )
}

export default Leaderboards;
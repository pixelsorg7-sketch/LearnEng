import React, { useRef,createContext, useContext, useState , useEffect} from 'react';
import {Link,Navigate,useNavigate} from 'react-router-dom'
import { MyContext } from './DataContext';
import { GoogleLogin,GoogleOAuthProvider,useGoogleOneTapLogin  } from '@react-oauth/google';
import {gapi}from 'gapi-script';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import SuperAdminPageSt from '../styleweb/SuperAdminPageSt.module.css'
import { HiSortAscending } from 'react-icons/hi';
import { IoIosArrowDown,IoMdArrowDropright,IoMdContact } from "react-icons/io";
import { TfiMenu } from "react-icons/tfi";
import { MdMeetingRoom,MdContactPhone, MdSynagogue  } from "react-icons/md";
import { FaBook, FaCrown,FaChevronDown,FaSearch, FaArrowRight,FaFacebook,FaSchool } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion,FaSquareXTwitter } from "react-icons/fa6";
import dayjs from 'dayjs';
import projectlogo from '../assets/projectlogo.png';
import schoollogo from '../assets/schoollogo.png';
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
  Accordion
} from 'react-bootstrap';

import LearnEngLogo from '../assets/LearnEngLG.png';
import BgImage from '../assets/Classroom_Dashboard_BG_Admin.png';
import AdminIcon from '../assets/Admin_Icon.png';
import TeacherIcon from '../assets/Teacher_Log_In_Records_Icon.png';
import StudentIcon from '../assets/Student_Register_ID_Icon.png';
import ManageTeacherIcon from '../assets/Manage_Teacher_Accounts_Icon.png';
import ManageStudentIcon from '../assets/Manage_Student_Accounts.png';


const SuperAdminPage=()=>{


     const [showNav, setshowNav]=useState(false);
  
      const navigator = useNavigate();
        //terms and conditions modal
        
            const [termsConModal,settermsConModal]=useState(false)

             const [aboutUsModal,setaboutUsModal]=useState(false)
            
              const [contactUsModal,setcontactUsModal]=useState(false)

      const formRef = useRef(null);

      const handleSubmit = () => {
    alert('Submitted successfully!');
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.reset();
      }
    }, 100);
  };

    
    return(

        <>

          <div className={SuperAdminPageSt.dashboardwrapper}
        //    style={{
        //   backgroundImage: `url(${BgImage})`,
        //   backgroundSize: 'cover',
        //   backgroundRepeat: 'no-repeat',
        //   backgroundPosition: 'center',
        // }}
          >
      {/* Header section */}
      <header className={SuperAdminPageSt.dashboardheader}>
      
        <div className={SuperAdminPageSt.logowrapper}>
          <img src={LearnEngLogo} alt="LearnENG Logo" className={SuperAdminPageSt.logo} />
        </div>

     
        <Dropdown className={SuperAdminPageSt.admindropdown}>
          <Dropdown.Toggle variant="success" id={SuperAdminPageSt.dropdownbasic}>
            <span className={SuperAdminPageSt.admintoggle}>
              <span className={SuperAdminPageSt.admintext}>Welcome, Admin!</span>
              <span className={SuperAdminPageSt.adminphotoplaceholder}>
                <img src={AdminIcon} className={SuperAdminPageSt.adminphotoimg} alt="Admin Icon" />
              </span>
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={()=> {
              localStorage.clear()
              navigator("/Login")}} href="#logout">Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </header>

      {/* Main Background Section */}
      <div
        className={SuperAdminPageSt.dashboardbackground}
      >
        <Container className={SuperAdminPageSt.dashboardcontainer}>
          <Row className="justify-content-center">
            {/* CARD 1: Teacher Log In Records */}
            <Col xs={6} md={3}>
              <div className={SuperAdminPageSt.dashboardcard}>
                <div className={SuperAdminPageSt.iconwrapper}>
                  <img src={TeacherIcon} className={SuperAdminPageSt.iconimg} alt="Teacher Log In Records" />
                </div>
                <div className={SuperAdminPageSt.dashboardbox} onClick={()=>navigator("/SupadLoginRecord")}>
                  <p className={SuperAdminPageSt.boxtitle}>Teacher Log In Records</p>
                  <p className={SuperAdminPageSt.boxdescription}>View and track teacher login and logout activity in real time.</p>
                </div>
              </div>
            </Col>

            {/* CARD 2: Student Register ID */}
            <Col xs={6} md={3}>
              <div className={SuperAdminPageSt.dashboardcard}>
                <div className={SuperAdminPageSt.iconwrapper}>
                  <img src={StudentIcon} className={SuperAdminPageSt.iconimg} alt="Student Register ID" />
                </div>
                <div className={SuperAdminPageSt.dashboardbox} onClick={()=>navigator("/SupadIdRegister")}>
                  <p className={SuperAdminPageSt.boxtitle}>Student Register Email</p>
                  <p className={SuperAdminPageSt.boxdescription}>Register new students by assigning official school IDs.</p>
                </div>
              </div>
            </Col>

            {/* CARD 3: Manage Teacher Accounts */}
            <Col xs={6} md={3}>
              <div className={SuperAdminPageSt.dashboardcard}>
                <div className={SuperAdminPageSt.iconwrapper}>
                  <img src={ManageTeacherIcon} className={SuperAdminPageSt.iconimg} alt="Manage Teacher Accounts" />
                </div>
                <div className={SuperAdminPageSt.dashboardbox} onClick={()=>navigator("/SupadAdminManage")}>
                  <p className={SuperAdminPageSt.boxtitle}>Manage Teacher Accounts</p>
                  <p className={SuperAdminPageSt.boxdescription}>Add, edit, or remove teacher profiles and access levels.</p>
                </div>
              </div>
            </Col>

            {/* CARD 4: Manage Student Accounts */}
            <Col xs={6} md={3}>
              <div className={SuperAdminPageSt.dashboardcard}>
                <div className={SuperAdminPageSt.iconwrapper}>
                  <img src={ManageStudentIcon} className={SuperAdminPageSt.iconimg} alt="Manage Student Accounts" />
                </div>
                <div className={SuperAdminPageSt.dashboardbox} onClick={()=>navigator("/SupadStudentManage")}>
                  <p className={SuperAdminPageSt.boxtitle}>Manage Student Accounts</p>
                  <p className={SuperAdminPageSt.boxdescription}>
                  Maintain student profiles, credentials, and classroom assignments.</p>
                </div>
              </div>
            </Col>


          </Row>
        </Container>
      </div>
    </div>

  <footer className={SuperAdminPageSt.footer}>
          <div className={SuperAdminPageSt.footerContent}>
  
          
            {/* Main Footer Content */}
            <div className={SuperAdminPageSt.footerMain}>
            
              {/* Brand Section */}
              <div className={SuperAdminPageSt.footerBrand}>
               
  
                <div className={SuperAdminPageSt.infoFooter}>
                 <img src={LearnEngLogo} alt="LearnENG Logo" className={SuperAdminPageSt.logofooter} />
                <p className={SuperAdminPageSt.brandTagline}>Master English with confidence</p>
                 {/* Social Links */}
                        <div className={SuperAdminPageSt.socialLinks}>
                        <a>Follow us: </a>
                         <a href="https://www.facebook.com/share/1Ty9MwVs2s/" target="_blank" rel="noopener noreferrer" className={SuperAdminPageSt.socialLink}>
                      <FaFacebook />
                        </a>
                          
                        </div>
  
                        
                 </div> 
  
         
                         
              </div>
              
  
      <div className={SuperAdminPageSt.footerinfoCon}>
     
                 <div className={SuperAdminPageSt.footerquicklinkCon}>
              {/* Quick Links */}
              <div className={SuperAdminPageSt.footerSection}>
                <h4 className={SuperAdminPageSt.sectionTitle}>Quick Links</h4>
                <div className={SuperAdminPageSt.linkGroup}>
                  <button onClick={()=>setaboutUsModal(true)} className={SuperAdminPageSt.footerLink}>About Us</button>
                </div>
              </div>
              
              {/* Support */}
              <div className={SuperAdminPageSt.footerSection}>
                <h4 className={SuperAdminPageSt.sectionTitle}>Support</h4>
                <div className={SuperAdminPageSt.linkGroup}>
                  <button onClick={()=>setcontactUsModal(true)} className={SuperAdminPageSt.footerLink}>Contact Us</button>
                </div>
              </div>
              
              {/* Legal */}
              <div className={SuperAdminPageSt.footerSection}>
                <h4 className={SuperAdminPageSt.sectionTitle}>Legal</h4>
                <div className={SuperAdminPageSt.linkGroup}>
                  <button 
                    className={SuperAdminPageSt.footerLink}
                    onClick={() => settermsConModal(true)}
                  >
                    Terms & Conditions
                  </button>
                </div>
              </div>
  
     
  
           </div>   
            
  
            <div className={SuperAdminPageSt.footerSection}>
     <h4 className={SuperAdminPageSt.sectionTitle}>Get in Touch</h4>
     <div className={SuperAdminPageSt.linkGroup}>
       <p>&#8226; Pasay, Philippines</p>
     <p>&#8226;1987goldentreasure@gmail.com</p>
     <p>&#8226; 288512003</p>
     </div>
   </div>
  
             </div> 
  
            </div>
  
  
  
             
       {/* Divider */}
            <div className={SuperAdminPageSt.footerDivider}></div>     
  
            {/* Bottom Section */}
            <div className={SuperAdminPageSt.footerBottom}>
              <div className={SuperAdminPageSt.footerCopyright}>
                <p>© {new Date().getFullYear()} LearnENG. All rights reserved.</p>
                <p className={SuperAdminPageSt.madeWith}>Made with ❤️ for English learners worldwide</p>
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

export default SuperAdminPage;
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
import { FaBook, FaCrown,FaChevronDown, FaSearch, FaArrowRight,FaAppleAlt,FaFacebook,FaSchool } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion,FaFileWord,FaSquareXTwitter  } from "react-icons/fa6";
import GameCreateSelectSt from '../styleweb/GameCreateSelectSt.module.css'
import { BiSolidBookReader } from "react-icons/bi";
import Background from '../assets/Category__Game_1_BG.png';
import LearnEngLogo from '../assets/LearnEngLG.png';
import UserIcon from '../assets/Admin_Icon.png';
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
import { storage } from '../firebase';
import { getStorage,ref, uploadBytes, getDownloadURL, updateMetadata,deleteObject  } from "firebase/storage";

const GameCreateSelect = ()=>{
    const navigator = useNavigate();
 
    const {ProfileActive,setProfileActive}=useContext(MyContext);

    const [dropdownOpen, setDropdownOpen] = useState(false);
  
       //profile img management
    const [profileUrlName,setprofileUrlName]=useState(null)

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

  <div
      className={GameCreateSelectSt.gameselectionwrapper}
      style={{ backgroundImage: `url(${Background})` }}
    >
            <div className={GameCreateSelectSt.header}>
              <img src={LearnEngLogo} alt="LearnENG Logo" className={GameCreateSelectSt.logo} />
      
              <div className={GameCreateSelectSt.userDropdown} >
                <button
                  className={GameCreateSelectSt.userToggle}
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  <span className={GameCreateSelectSt.welcomeText}>Welcome, {ProfileActive.username}!</span>
                  <img src={profileUrlName} alt="User Icon" className={GameCreateSelectSt.userIcon} />
                </button>
      
                {dropdownOpen && (
                  <div className={GameCreateSelectSt.dropdownCustom}>
                    <button
                      className={GameCreateSelectSt.dropdownItem}
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

      {/* end header */}

      <div className={GameCreateSelectSt.backbuttoncontainer}>
      <button className={GameCreateSelectSt.backbutton} onClick={() => navigator('/Homepage')}>Back</button>
    </div>

      <div className={GameCreateSelectSt.gamecardscontainer}>
        <div className={GameCreateSelectSt.gamecard} onClick={()=> navigator("/SpellCreateSelect")} >
          <div class={GameCreateSelectSt.gameiconcontainer}>
           <div class={GameCreateSelectSt.gameicon}><FaAppleAlt size={40}/></div>
           </div>
          <h3 className={GameCreateSelectSt.gametitle}>Fruit Basket</h3>
          <p className={GameCreateSelectSt.gamedesc}>Input vocabulary words that your students need to master.</p>
             <button className={GameCreateSelectSt.gameaction}>Create Assessment</button>
        </div>

        <div className={GameCreateSelectSt.gamecard} onClick={() => navigator('/GrammarCreateView')}>
         <div class={GameCreateSelectSt.gameiconcontainer}>
           <div class={GameCreateSelectSt.gameicon}><FaFileWord size={40} /> </div>
           </div>
          <h3 className={GameCreateSelectSt.gametitle}>Word Match</h3>
          <p className={GameCreateSelectSt.gamedesc}>Create sentences with missing parts and provide word choices </p>
             <button className={GameCreateSelectSt.gameaction}>Create Assessment</button>
        </div>

        <div className={GameCreateSelectSt.gamecard} onClick={() => navigator('/ReadingCreateView')}>
         <div class={GameCreateSelectSt.gameiconcontainer}>
           <div class={GameCreateSelectSt.gameicon}><BiSolidBookReader size={40} /></div>
           </div>
          <h3 className={GameCreateSelectSt.gametitle}>Readventure</h3>
          <p className={GameCreateSelectSt.gamedesc}>Create storyboards and provide supplementary question</p>
             <button className={GameCreateSelectSt.gameaction}>Create Assessment</button>
        </div>
      </div>

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

    </div>

    <footer className={GameCreateSelectSt.footer}>
            <div className={GameCreateSelectSt.footerContent}>
    
            
              {/* Main Footer Content */}
              <div className={GameCreateSelectSt.footerMain}>
              
                {/* Brand Section */}
                <div className={GameCreateSelectSt.footerBrand}>
                 
    
                  <div className={GameCreateSelectSt.infoFooter}>
                   <img src={LearnEngLogo} alt="LearnENG Logo" className={GameCreateSelectSt.logofooter} />
                  <p className={GameCreateSelectSt.brandTagline}>Master English with confidence</p>
                   {/* Social Links */}
                          <div className={GameCreateSelectSt.socialLinks}>
                          <a>Follow us: </a>
                          <a href="https://www.facebook.com/share/1Ty9MwVs2s/" target="_blank" rel="noopener noreferrer" className={GameCreateSelectSt.socialLink}>
                        <FaFacebook />
                               </a>
                          </div>
    
                          
                   </div> 
    
           
                           
                </div>
                
    
        <div className={GameCreateSelectSt.footerinfoCon}>
       
                   <div className={GameCreateSelectSt.footerquicklinkCon}>
                {/* Quick Links */}
                <div className={GameCreateSelectSt.footerSection}>
                  <h4 className={GameCreateSelectSt.sectionTitle}>Quick Links</h4>
                  <div className={GameCreateSelectSt.linkGroup}>
                    <button onClick={()=>setaboutUsModal(true)} className={GameCreateSelectSt.footerLink}>About Us</button>
                  </div>
                </div>
                
                {/* Support */}
                <div className={GameCreateSelectSt.footerSection}>
                  <h4 className={GameCreateSelectSt.sectionTitle}>Support</h4>
                  <div className={GameCreateSelectSt.linkGroup}>
                    <button onClick={()=>setcontactUsModal(true)} className={GameCreateSelectSt.footerLink}>Contact Us</button>
                  </div>
                </div>
                
                {/* Legal */}
                <div className={GameCreateSelectSt.footerSection}>
                  <h4 className={GameCreateSelectSt.sectionTitle}>Legal</h4>
                  <div className={GameCreateSelectSt.linkGroup}>
                    <button 
                      className={GameCreateSelectSt.footerLink}
                      onClick={() => settermsConModal(true)}
                    >
                      Terms & Conditions
                    </button>
                  </div>
                </div>
    
       
    
             </div>   
              
    
              <div className={GameCreateSelectSt.footerSection}>
       <h4 className={GameCreateSelectSt.sectionTitle}>Get in Touch</h4>
       <div className={GameCreateSelectSt.linkGroup}>
        <p>&#8226; Pasay, Philippines</p>
     <p>&#8226;1987goldentreasure@gmail.com</p>
     <p>&#8226; 288512003</p>
       </div>
     </div>
    
               </div> 
    
              </div>
    
    
    
               
         {/* Divider */}
              <div className={GameCreateSelectSt.footerDivider}></div>     
    
              {/* Bottom Section */}
              <div className={GameCreateSelectSt.footerBottom}>
                <div className={GameCreateSelectSt.footerCopyright}>
                  <p>© {new Date().getFullYear()} LearnENG. All rights reserved.</p>
                  <p className={GameCreateSelectSt.madeWith}>Made with ❤️ for English learners worldwide</p>
                </div>
                
              </div>
            </div>
          </footer>
        
        

        </>

    )
}

export default GameCreateSelect;
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
import { FaStar ,FaBook, FaCrown,FaChevronDown, FaSearch, FaArrowRight,FaFacebook,FaSchool } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion, FaSquareXTwitter} from "react-icons/fa6";

import HostPlayroomSt from '../styleweb/HostPlayroomSt.module.css'
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
import Background from '../assets/Category__Game_1_BG.png';
import LearnEngLogo from '../assets/LearnEngLG.png';
import UserIcon from '../assets/Admin_Icon.png';
import { onSnapshot, addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit, getDoc,doc} from '@firebase/firestore';
import { firestore } from '../firebase';
import { elements } from 'chart.js';
import { storage } from '../firebase';
import { getStorage,ref, uploadBytes, getDownloadURL, updateMetadata,deleteObject  } from "firebase/storage";

const HostPlayroom=()=>{

//       const playrooms = [
//     { id: 1, name: 'Playroom 1', colors: ['blue', 'orange'] },
//     { id: 2, name: 'Playroom 2', colors: ['blue'] },
//     { id: 3, name: 'Playroom 3', colors: ['orange'] },
//   ];

   const navigator = useNavigate();  //navigator
     const {ProfileActive,setProfileActive}=useContext(MyContext);
       //profile img management
       const [profileUrlName,setprofileUrlName]=useState(null)

     const [playrooms,setplayrooms]=useState([]);
     const [playroomActive,setplayroomActive]=useState([])
     const {roomAccessCode,setroomAccessCode}=useContext(MyContext)
      const {roomNameAccess,setroomNameAccess}=useContext(MyContext)

           const [search, setSearch] = useState(''); //search

         const [dropdownOpen, setDropdownOpen] = useState(false);

      const formRef = useRef(null);
         //terms and conditions modal
           
       const [termsConModal,settermsConModal]=useState(false)
         
       const [aboutUsModal,setaboutUsModal]=useState(false)
         
       const [contactUsModal,setcontactUsModal]=useState(false)
      

       const [isLoading,setisLoading]=useState(false)
         
          const handleSubmit = () => {
       alert('Submitted successfully!');
         setTimeout(() => {
         if (formRef.current) {
          formRef.current.reset();
          }
       }, 100);
     };
               

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

     //render available room

     useEffect(()=>{

    const renderRoom=async()=>{

      setisLoading(true)
      
       if (!ProfileActive?.gradelevel) return;

        const joinroomlist = collection(firestore,"joinroom")
        const wherejoinroom = query(joinroomlist,
            where("teacherid","==",ProfileActive.teacherID)
        )
        const getjoin = await getDocs(wherejoinroom)
        let joinData = getjoin.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
        }))

          joinData = joinData.sort((a, b) => {
    // Firestore timestamp → convert to Date → compare
    const dateA = a.dateissued?.toDate ? a.dateissued.toDate() : new Date(0);
    const dateB = b.dateissued?.toDate ? b.dateissued.toDate() : new Date(0);
    return dateB - dateA; // newest first
  });

        const results = await Promise.all(
       joinData.map(async (element) => {
      const q = query(
        collection(firestore, "joinroom-activegame"),
        where("roomcode", "==", element.roomcode)
      );
      const snap = await getDocs(q);
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    })
  );

  // Flatten nested arrays and remove duplicates by doc.id
    const flattened = results.flat();
    const unique = Array.from(new Map(flattened.map(item => [item.id, item])).values());

     setplayroomActive(unique)
        setplayrooms(joinData)

    setisLoading(false)

    }

    renderRoom()
     },[ProfileActive])

     //color point

    const getcolorCircle = (element)=>{
      console.log(element)
       if (!element) return [];

  const colors = [];
  if (element.activefruitcatcher) colors.push(HostPlayroomSt.green);
  if (element.activesecondgame) colors.push(HostPlayroomSt.orange);
  if (element.activethirdgame) colors.push(HostPlayroomSt.purple);

  return colors;
    }

    //roomviewfunc

    const roomViewFunc=(roomcode,roomname)=>{
      setroomAccessCode(roomcode)
      setroomNameAccess(roomname)
      navigator("/HostViewPlayroom")
    }

     // Filter by search (set name)
  const filtered = playrooms.filter(s =>
    s.roomname.toLowerCase().includes(search.toLowerCase())
  );

    return(
        <>

         <div className={HostPlayroomSt.HostPlayroomContainer}>
       <div className={HostPlayroomSt.header}>
                    <img src={LearnEngLogo} alt="LearnENG Logo" className={HostPlayroomSt.logo} />
            
                    <div className={HostPlayroomSt.userDropdown} >
                      <button
                        className={HostPlayroomSt.userToggle}
                        onClick={() => setDropdownOpen((v) => !v)}
                      >
                        <span className={HostPlayroomSt.welcomeText}>Welcome, {ProfileActive.username}!</span>
                        <img src={profileUrlName} alt="User Icon" className={HostPlayroomSt.userIcon} />
                      </button>
            
                      {dropdownOpen && (
                        <div className={HostPlayroomSt.dropdownCustom}>
                          <button
                            className={HostPlayroomSt.dropdownItem}
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

      <div className={HostPlayroomSt.buttonRow}>
        <button onClick={()=>navigator('/HomePage')} className={HostPlayroomSt.backButton}>Back</button>
         {/* Search */}
                                <div style={{ width: '68%', display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
                                  <Form.Control
                                    type="text"
                                    placeholder="Search by room name"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                      borderRadius: '30px 0 0 30px',
                                      border: '1px solid #999',
                                      padding: '10px 20px'
                                    }}
                                  />
                                  <div
                                    style={{
                                      backgroundColor: 'white',
                                      border: '1px solid #999',
                                      borderLeft: 'none',
                                      borderRadius: '0 30px 30px 0',
                                      padding: '10px',
                                      color: '#6c4d4d'
                                    }}
                                  >
                                    <FaSearch />
                                  </div>
                                
                                </div>

      </div>

      <div className={HostPlayroomSt.menuBox}>
        <div className={HostPlayroomSt.menuBoxheader}>
          <button onClick={()=>navigator('/HostCreatePlayroom')} className={HostPlayroomSt.createPlayroomButton}>+ Create New Playroom</button>
          <div className={HostPlayroomSt.legend}>
            <span className={HostPlayroomSt.legendtitle}>Legend:</span>
            <div className={HostPlayroomSt.legenditem}>
              <span className={`${HostPlayroomSt.dot} ${HostPlayroomSt.green}`}></span> Fruit Basket
            </div>
            <div className={HostPlayroomSt.legenditem}>
              <span className={`${HostPlayroomSt.dot} ${HostPlayroomSt.orange}`}></span> Word Match
            </div>
            <div className={HostPlayroomSt.legenditem}>
              <span className={`${HostPlayroomSt.dot} ${HostPlayroomSt.purple}`}></span> Readventure
            </div>
          </div>
        </div>
       
        {/* <hr className={HostPlayroomSt.linegap}/> */}
 
        <div className={HostPlayroomSt.playroomGrid}>
          {filtered.map((room,index) => (
            <div onClick={()=>roomViewFunc(room.roomcode,room.roomname)} key={room.id} className={HostPlayroomSt.playroomCard}>
              <div className={HostPlayroomSt.playroomCarddots}>
               {getcolorCircle(playroomActive[index]).map((color, i) => (
                  <span key ={i} className={`${HostPlayroomSt.dot}  ${color}`}></span>
             ))}
              </div>
              <p className={HostPlayroomSt.playroomName}>Room Name: {room.roomname}</p>
              <p className={HostPlayroomSt.playroomName}>Room: {room.roomcode}</p>
              <h5>{ room.dateissued ? room.dateissued.toDate().toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                  :
                  'date not available'
                  }</h5>
            </div>
          ))}

           {filtered.filter(i => !i.archived).length === 0 && (
              <div className="text-center text-muted py-2">Empty Room</div>
            )}
        </div>
      </div>
      
    </div>

   <footer className={HostPlayroomSt.footer}>
           <div className={HostPlayroomSt.footerContent}>
   
           
             {/* Main Footer Content */}
             <div className={HostPlayroomSt.footerMain}>
             
               {/* Brand Section */}
               <div className={HostPlayroomSt.footerBrand}>
                
   
                 <div className={HostPlayroomSt.infoFooter}>
                  <img src={LearnEngLogo} alt="LearnENG Logo" className={HostPlayroomSt.logofooter} />
                 <p className={HostPlayroomSt.brandTagline}>Master English with confidence</p>
                  {/* Social Links */}
                         <div className={HostPlayroomSt.socialLinks}>
                         <a>Follow us: </a>
                         <a href="https://www.facebook.com/share/1Ty9MwVs2s/" target="_blank" rel="noopener noreferrer" className={HostPlayroomSt.socialLink}>
                       <FaFacebook />
                            </a>
                           
                         </div>
   
                         
                  </div> 
   
          
                          
               </div>
               
   
       <div className={HostPlayroomSt.footerinfoCon}>
      
                  <div className={HostPlayroomSt.footerquicklinkCon}>
               {/* Quick Links */}
               <div className={HostPlayroomSt.footerSection}>
                 <h4 className={HostPlayroomSt.sectionTitle}>Quick Links</h4>
                 <div className={HostPlayroomSt.linkGroup}>
                   <button onClick={()=>setaboutUsModal(true)} className={HostPlayroomSt.footerLink}>About Us</button>
                 </div>
               </div>
               
               {/* Support */}
               <div className={HostPlayroomSt.footerSection}>
                 <h4 className={HostPlayroomSt.sectionTitle}>Support</h4>
                 <div className={HostPlayroomSt.linkGroup}>
                   <button onClick={()=>setcontactUsModal(true)} className={HostPlayroomSt.footerLink}>Contact Us</button>
                 </div>
               </div>
               
               {/* Legal */}
               <div className={HostPlayroomSt.footerSection}>
                 <h4 className={HostPlayroomSt.sectionTitle}>Legal</h4>
                 <div className={HostPlayroomSt.linkGroup}>
                   <button 
                     className={HostPlayroomSt.footerLink}
                     onClick={() => settermsConModal(true)}
                   >
                     Terms & Conditions
                   </button>
                 </div>
               </div>
   
      
   
            </div>   
             
   
             <div className={HostPlayroomSt.footerSection}>
      <h4 className={HostPlayroomSt.sectionTitle}>Get in Touch</h4>
      <div className={HostPlayroomSt.linkGroup}>
        <p>&#8226; Pasay, Philippines</p>
     <p>&#8226;1987goldentreasure@gmail.com</p>
     <p>&#8226; 288512003</p>
      </div>
    </div>
   
              </div> 
   
             </div>
   
   
   
              
        {/* Divider */}
             <div className={HostPlayroomSt.footerDivider}></div>     
   
             {/* Bottom Section */}
             <div className={HostPlayroomSt.footerBottom}>
               <div className={HostPlayroomSt.footerCopyright}>
                 <p>© {new Date().getFullYear()} LearnENG. All rights reserved.</p>
                 <p className={HostPlayroomSt.madeWith}>Made with ❤️ for English learners worldwide</p>
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


            {/* modal loading */}
              <Modal show={isLoading} backdrop="static" centered>
              <Modal.Body className="text-center">
                 <div className={HostPlayroomSt.customloader}></div>
                <p className="mt-3 mb-0 fw-bold">Loading Playroom</p>
              </Modal.Body>
            </Modal>

   

        </>
    )

}

export default HostPlayroom;


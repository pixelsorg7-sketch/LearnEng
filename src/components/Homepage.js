import { BrowserRouter,Route, Routes } from "react-router-dom";
import React, {  forwardRef,useRef,createContext, useContext, useState , useEffect, useImperativeHandle,} from 'react';
import { MyContext } from './DataContext';
import HomePageSt from '../styleweb/HomepageSt.module.css'
import { IoIosArrowDown,IoMdArrowDropright,IoMdContact } from "react-icons/io";
import { TfiMenu } from "react-icons/tfi";
import { MdMeetingRoom,MdContactPhone  } from "react-icons/md";
import { FaBook,FaChartBar ,FaQuestion, FaTrophy, FaGamepad,FaBell,FaTrash,FaFacebook,FaSchool  } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { PiWarningCircleFill } from "react-icons/pi";
import {Link, Navigate, useNavigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';
import {firestore} from "../firebase";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit, getDoc,doc,orderBy, onSnapshot} from '@firebase/firestore';
import { Alert } from "react-bootstrap";
import projectlogo from '../assets/projectlogo.png';
import schoollogo from '../assets/schoollogo.png';
import { FaSquareXTwitter } from "react-icons/fa6";
import dayjs from 'dayjs';
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
import LearnEngLogo from '../assets/LearnEngLG.png';
import UserIcon from '../assets/Admin_Icon.png';
import { storage } from '../firebase';
import { getStorage,ref, uploadBytes, getDownloadURL, updateMetadata,deleteObject  } from "firebase/storage";

import PlusIcon from "../assets/Plus_Icon.png";
import BellIcon from "../assets/Bell_Icon.png";
import TrashIcon from "../assets/Trash_Icon.png";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

const Homepage=()=>{

       const {ProfileActive,setProfileActive}=useContext(MyContext);
        const {currentAuth,setcurrentAuth}=useContext(MyContext);
         //get room useState
         const {roomList,setroomList}=useContext(MyContext)


     const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showNav, setshowNav]=useState(false);

    //question set liist
    const {questionSetList,setquestionSetList}=useContext(MyContext);
    const {quesSetActiveCategories,setquesSetActiveCategories}=useContext(MyContext);

    //sample notifcation

      const [notifModal, setnotifModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  //profile img management
  const [profileUrlName,setprofileUrlName]=useState(null)

   const formRef = useRef(null);
      //information modal
  
      const [termsConModal,settermsConModal]=useState(false)
      const [aboutUsModal,setaboutUsModal]=useState(false)
      const [contactUsModal,setcontactUsModal]=useState(false)
      const [switchLevelModal,setswitchLevelModal]=useState(false)
      //loading state

      const [isLoading,setLoading]=useState(false)

      //switch grade level tf state

      const [switchLvltf,setswitchLvltf]=useState(ProfileActive.gradelevel)

       const handleSubmit = () => {
    alert('Submitted successfully!');
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.reset();
      }
    }, 100);
  };
      

  //get all notif

  useEffect(()=>{

    const notifRender=async()=>{

      if (!ProfileActive?.gradelevel) return;
      
    const notifdblist = collection(firestore,"notification")
    const wherenotif = query(notifdblist,
      where("teacherid","==",ProfileActive.teacherID),
    )
    // const getnotif = await getDocs(wherenotif)
    const unsubscribe = onSnapshot(wherenotif,(snapshot)=>{

    let notifdata = snapshot.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))

      notifdata = notifdata.sort((a, b) => {
    // Firestore timestamp → convert to Date → compare
    const dateA = a.notifdate?.toDate ? a.notifdate.toDate() : new Date(0);
    const dateB = b.notifdate?.toDate ? b.notifdate.toDate() : new Date(0);
    return dateB - dateA; // newest first
  });

    setNotifications(notifdata) 
  
  });

return () => unsubscribe();
 }

 notifRender()

  },[ProfileActive])

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
  

    const navigator = useNavigate();

   
//functions---------------------------------------------

    const clearNotif=async()=>{
      const confirmDelete = window.confirm("Are you sure you want to delete collection?")

        if (!confirmDelete) return;


        setLoading(true)

        const notifdblist = collection(firestore,"notification")
    const wherenotif = query(notifdblist,
      where("teacherid","==",ProfileActive.teacherID),
    )
    const getnotif = await getDocs(wherenotif)

    let notifdata = getnotif.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))

    notifdata.map((element,index)=>{

    deleteDoc(doc(firestore,"notification",element.id))

    })

      toast.success("Notification Cleared!", {
          position:'top-center',   
          autoClose: 3000,      
       hideProgressBar: false,
      closeButton:false,
      pauseOnHover: false,
        draggable: false,
         });

    

        setLoading(false)
     }

      const hostActFunc=async(e)=>{  
        e.preventDefault()
        

        navigator("/HostPlayroom")
    

      }


      //Question creation page func.....

      const QuestionGenFunc=async(e)=>{
          e.preventDefault()

        //----
        
        navigator("/GameCreateSelect")      

        

      }

      //Leaderboard page func.....

      const LeaderboardPageFunc=()=>{
        navigator("/Leaderboards")    

      }

      //Student Activity page func.....

      const AnalyticsFunc=()=>{
     navigator("/Analytics")
      }

      //logoutfunc----
      const [timeloginDocid,settimeloginDocid]=useState("")

      useEffect(()=>{

    const putlogout=async()=>{

     
      if(timeloginDocid !== ""){
      
      const datetimenow = dayjs()

        const loginrecordref = doc(firestore,"login-records",timeloginDocid)
        await updateDoc(loginrecordref,{
          timelogout:String(datetimenow.format('hh:mm:a'))
        })

        await signOut(auth);

         setProfileActive({}) 
        navigator("/")
      console.log("Alrighttt")
      settimeloginDocid("")
      }
     } 
     
     putlogout()
      },[timeloginDocid])

      const logoutFunc=async()=>{

        const loginrecordblist = collection(firestore,"login-records")
        const whereLoginrecord = query(loginrecordblist,
          where("email",'==',ProfileActive.email),
          limit(1)
        )

        const getLoginrecord = await getDocs(whereLoginrecord)
        const loginrecordData = getLoginrecord.docs.map((doc)=>({
          id:doc.id,
          ...doc.data(),
        }))
        settimeloginDocid(String(loginrecordData[0].id))
       localStorage.clear();
       
      }

      //switch grade level

      const switchGradeLevel=async()=>{
        
        try{
        //update from firebase

    const docRef = doc(firestore, "teachers", ProfileActive.id);
      await updateDoc(docRef, {
        gradelevel:switchLvltf
      });

       const updatedProf = {
                id:ProfileActive.id,
                username:ProfileActive.username,
                firstname:ProfileActive.firstname,
                lastname:ProfileActive.lastname,
                teacherID:ProfileActive.teacherID,
                email:ProfileActive.email,
                gradelevel:switchLvltf,
                profilepath:ProfileActive.profilepath
            }

        localStorage.clear();
        localStorage.setItem("profile_active", JSON.stringify(updatedProf));
        setProfileActive(updatedProf)

         toast.success("Level Successfully Switched!", {
          position:'top-center',   
          autoClose: 3000,      
       hideProgressBar: false,
      closeButton:false,
      pauseOnHover: false,
        draggable: false,
         });

         setswitchLevelModal(false)
      
      }

      catch(e){
        console.log(e)
      toast.error("Cant switch level", {
          position:'top-center',   
          autoClose: 3000,      
       hideProgressBar: false,
      closeButton:false,
      pauseOnHover: false,
        draggable: false,
         });
      }
      };

  

    return(
        <>
  <div className={HomePageSt.wrap} >
      {/* Header */}
      <div className={HomePageSt.header}>
        <img src={LearnEngLogo} alt="LearnENG Logo" className={HomePageSt.logo} />

        <div className={HomePageSt.userDropdown} >
          <button
            className={HomePageSt.userToggle}
            onClick={() => setDropdownOpen((v) => !v)}
          >
            <span className={HomePageSt.welcomeText}>Welcome, {ProfileActive.username}!</span>
            <img src={profileUrlName} alt="User Icon" className={HomePageSt.userIcon} />
          </button>

          {dropdownOpen && (
            <div className={HomePageSt.dropdownCustom}>
              <button
                className={HomePageSt.dropdownItem}
                onClick={()=>{ navigator('/Profilepage')}}
              >
                ✏️ Edit Profile
              </button>
              <button
                className={HomePageSt.dropdownItem}
                onClick={logoutFunc}
              >
                🚪 Log Out
              </button>
              <button
                className={HomePageSt.dropdownItem}
                onClick={()=>setswitchLevelModal(true)}
              >
                {">"} Switch Grade Level
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <section className={HomePageSt.stage}>
        <Container>
          <Row className={HomePageSt.cardsRow}>
              <Col
                // key={id}
                xs={12}
                sm={6}
                lg={3}
                  className={`d-flex justify-content-center ${HomePageSt.clickableColumn}`}
              >
                <button className={HomePageSt.card} onClick={QuestionGenFunc}>
                  <div className={HomePageSt.cardBadge}>
                    {/* <Icon /> */}
                    <FaQuestion/>
                  </div>
                  <h4 className={HomePageSt.cardTitle}>Assessment <br/> Questions</h4>
                  <p className={HomePageSt.cardDesc}>Create and manage assessments to measure students’ English learning skills. Choose from Grammar, Spelling, and Reading Comprehension question sets</p>
                </button>
              </Col>

               <Col
                // key={id}
                xs={12}
                sm={6}
                lg={3}
                 className={`d-flex justify-content-center ${HomePageSt.clickableColumn}`}
              >
                <button className={HomePageSt.card} onClick={hostActFunc}>
                  <div className={HomePageSt.cardBadge}>
                    {/* <Icon /> */}
                    <FaGamepad/>
                  </div>
                  <h4 className={HomePageSt.cardTitle}>Host <br/> Playrooms</h4>
                  <p className={HomePageSt.cardDesc}>Launch interactive game activities where students can join using their unique game codes. Perfect for assessments and group activities!</p>
                </button>
              </Col>

               <Col
                // key={id}
                xs={12}
                sm={6}
                lg={3}
                  className={`d-flex justify-content-center ${HomePageSt.clickableColumn}`}
              >
                <button className={HomePageSt.card} onClick={LeaderboardPageFunc}>
                  <div className={HomePageSt.cardBadge}>
                    {/* <Icon /> */}
                    <FaTrophy/>
                  </div>
                  <h4 className={HomePageSt.cardTitle}>Leaderboards</h4>
                  <p className={HomePageSt.cardDesc}>Track student scores and showcase top performers of the class! Encourage healthy competition and celebrate learning progress.</p>
                </button>
              </Col>

               <Col
                // key={id}
                xs={12}
                sm={6}
                lg={3}
                 className={`d-flex justify-content-center ${HomePageSt.clickableColumn}`}
              >
                <button className={HomePageSt.card} onClick={AnalyticsFunc}>
                  <div className={HomePageSt.cardBadge}>
                    {/* <Icon /> */}
                    <FaChartBar/>
                  </div>
                  <h4 className={HomePageSt.cardTitle}>Student<br/>Analytics</h4>
                  <p className={HomePageSt.cardDesc}>Gain valuable insights into each student’s learning progress. View results, identify strengths and areas for improvement, and monitor overall class performance.</p>
                </button>
              </Col>
    
          </Row>
        </Container>
      </section>

      {/* notif modal */}

          <Modal show={notifModal} onHide={()=>setnotifModal(false)} dialogClassName={HomePageSt.notifmodal}>
          
        <Modal.Header style = {{justifyContent:'center'}} className={HomePageSt.headerFooterDes}>
          <Modal.Title  style = {{fontSize:30,fontWeight:'bold'}}>Notifications </Modal.Title>
        </Modal.Header>

        <Modal.Body className={HomePageSt.notifCon}>
          {notifications.length === 0 ? (
            <p className="text-muted text-center">No new notifications</p>
          ) : (
            <ListGroup className={HomePageSt.notiflistcontent}>
              {notifications.map((element, idx) => (
                <>
                
                <ListGroup.Item
                  key={idx}
                  style={{ lineHeight: "2.6", fontSize: "18px" }}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                {/* <IoNotificationsCircleOutline size={29}/>  */}
                <div style = {{flexDirection:'column'}}>
                <h5>{element.notification}</h5>
                <h5 style = {{fontWeight:'bold'}}>{ element.notifdate.toDate().toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}</h5>
                 </div>
                </ListGroup.Item>
                </>
              ))}
            </ListGroup>
          )}
        </Modal.Body>

        <Modal.Footer className={HomePageSt.headerFooterDes}>
          <Button variant="secondary" onClick={()=>setnotifModal(false)}>
            Close
          </Button>
          <Button variant="secondary" onClick={clearNotif}>
            Clear Notification
          </Button>
        </Modal.Footer>
      </Modal>

      {/* nofit button */}
  
    <div className={HomePageSt.dock}>
        <button className={HomePageSt.fab} onClick={()=>setnotifModal(true)}>
          <FaBell size={24} color="white" />
           {/* <span className={HomePageSt.fabDot}></span> */}
        </button>
      </div>

      
    </div>


 <footer className={HomePageSt.footer}>
        <div className={HomePageSt.footerContent}>

          {/* Main Footer Content */}
          <div className={HomePageSt.footerMain}>
          
            {/* Brand Section */}
            <div className={HomePageSt.footerBrand}>
              <div className={HomePageSt.infoFooter}>
               <img src={LearnEngLogo} alt="LearnENG Logo" className={HomePageSt.logofooter} />
              <p className={HomePageSt.brandTagline}>Master English with confidence</p>
                      <div className={HomePageSt.socialLinks}>
                <a>Follow us: </a>
                <a href="https://www.facebook.com/share/1Ty9MwVs2s/" target="_blank" rel="noopener noreferrer" className={HomePageSt.socialLink}>
                <FaFacebook />
                </a>
                        
                      </div>
              
               </div>                
            </div>
            

    <div className={HomePageSt.footerinfoCon}>
   
               <div className={HomePageSt.footerquicklinkCon}>
            {/* Quick Links */}
            <div className={HomePageSt.footerSection}>
              <h4 className={HomePageSt.sectionTitle}>Quick Links</h4>
              <div className={HomePageSt.linkGroup}>
                <button onClick={()=>setaboutUsModal(true)} className={HomePageSt.footerLink}>About Us</button>
              </div>
            </div>
            
            {/* Support */}
            <div className={HomePageSt.footerSection}>
              <h4 className={HomePageSt.sectionTitle}>Support</h4>
              <div className={HomePageSt.linkGroup}>
                <button onClick={()=>setcontactUsModal(true)} className={HomePageSt.footerLink}>Contact Us</button>
              </div>
            </div>
            
            {/* Legal */}
            <div className={HomePageSt.footerSection}>
              <h4 className={HomePageSt.sectionTitle}>Legal</h4>
              <div className={HomePageSt.linkGroup}>
                <button 
                  className={HomePageSt.footerLink}
                  onClick={() => settermsConModal(true)}
                >
                  Terms & Conditions
                </button>
              </div>
            </div>

   

         </div>   
          

      

           </div> 

               <div className={HomePageSt.footerSection}>
   <h4 className={HomePageSt.sectionTitle}>Get in Touch</h4>
   <div className={HomePageSt.linkGroup}>
     <p> &#8226; Pasay, Philippines</p>
     <p> &#8226; 1987goldentreasure@gmail.com</p>
     <p> &#8226; 288512003</p>
   </div>
 </div>

          </div>



           
     {/* Divider */}
          <div className={HomePageSt.footerDivider}></div>     

          {/* Bottom Section */}
          <div className={HomePageSt.footerBottom}>
            <div className={HomePageSt.footerCopyright}>
              <p>© {new Date().getFullYear()} LearnENG. All rights reserved.</p>
              <p className={HomePageSt.madeWith}>Made with ❤️ for English learners worldwide</p>
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
                 <div className={HomePageSt.customloader}></div>
                <p className="mt-3 mb-0 fw-bold">Loading</p>
              </Modal.Body>
            </Modal>

   
    {/* switch grade level modal */}

        <Modal show={switchLevelModal} onHide={()=>setswitchLevelModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Switch grade level</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>

         <h3>Level</h3>
          <select value={switchLvltf} onChange={(text)=>setswitchLvltf(Number(text.target.value))} className={HomePageSt.switchlevel}> {/* Added custom-select for specific styling */}
          {/* <option  value="">--Select Grade--</option> */}
          <option value="2">Grade 2</option>
          <option value="3">Grade 3</option>
          <option value="4">Grade 4</option>
         
          </select>
        
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setswitchLevelModal(false)}>
            Close
          </Button>
           <Button variant="secondary" onClick={switchGradeLevel}>
            Switch grade level
          </Button>
          
        </Modal.Footer>
      </Modal>

        </>
    )
}

export default Homepage;
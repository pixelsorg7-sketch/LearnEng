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
import { FaRegTrashAlt,FaEllipsisV ,FaBook, FaCrown,FaChevronDown, FaSearch, FaArrowRight,FaFacebook,FaSchool } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion, FaSquareXTwitter} from "react-icons/fa6";
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
import { getStorage,ref, uploadBytes, getDownloadURL, updateMetadata,deleteObject  } from "firebase/storage";
import { storage } from '../firebase';
import ReadingCreateViewSt from '../styleweb/ReadingCreateViewSt.module.css'
import { v4 } from "uuid";

import Background from '../assets/Category__Game_1_BG.png';
import LearnEngLogo from '../assets/LearnEngLG.png';
import UserIcon from '../assets/Admin_Icon.png';
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit, getDoc,doc,onSnapshot} from '@firebase/firestore';
import { firestore } from '../firebase';
import { toast } from "react-toastify";
const ReadingCreateView=()=>{

     const navigator = useNavigate();  //navigator

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

      const [stories, setStories] = useState([]);
      const [archiveStories,setarchiveStories]=useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showRenameModal,setshowRenameModal]=useState(false)
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

     const [search, setSearch] = useState(''); //search
  //archive modal show/hide
  
const [showArchivemodal,setshowArchivemodal]=useState(false)

   const {ProfileActive,setProfileActive}=useContext(MyContext); //active profile holder
    //profile img management
    const [profileUrlName,setprofileUrlName]=useState(null)

     const {editPrevSet,seteditPrevSet}=useContext(MyContext); //activate edit mode
  const {randThirdGameVal,setrandThirdGameVal}=useContext(MyContext); //ThirdGameval setter 
   const {holdTitleCreate,setholdTitleCreate}=useContext(MyContext);

     //dropdown on profile
   const [dropdownOpen, setDropdownOpen] = useState(false);

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

  //get data from firebase

  useEffect(()=>{

    const renderReading=async()=>{

       if (!ProfileActive?.gradelevel) return;
        const readingSetdblist = collection(firestore,'comprehension-collection')
        const wherereadingSet = query(readingSetdblist,
        where("teacherid","==",ProfileActive.teacherID),
        where("isarchived","==",false)
        );
          const unsubscribe = onSnapshot(wherereadingSet, (snapshot) => {
        const readingsetData = snapshot.docs.map((doc)=>({
             id:doc.id,
             ...doc.data(),
        }))

        setStories(readingsetData)
      
      })

  return () => unsubscribe();
    }

    renderReading()
  },[stories,ProfileActive])

  useEffect(()=>{

    const archiveReading=async()=>{

       if (!ProfileActive?.gradelevel) return;
        const readingSetdblist = collection(firestore,'comprehension-collection')
        const wherereadingSet = query(readingSetdblist,
        where("teacherid","==",ProfileActive.teacherID),
        where("isarchived","==",true)
        );
          const unsubscribe = onSnapshot(wherereadingSet, (snapshot) => {
        const readingsetData = snapshot.docs.map((doc)=>({
             id:doc.id,
             ...doc.data(),
        }))

        setarchiveStories(readingsetData)
      
      })
     
    return () => unsubscribe();
    }

    archiveReading()
  },[ProfileActive])

  //functions


  // ✅ MOVE handleEdit inside too
  const handleEdit = (thirdgameval,storytitle) => {

    console.log(thirdgameval)
   setrandThirdGameVal(thirdgameval)
  setholdTitleCreate(storytitle)
   seteditPrevSet(true)
   navigator('/ReadingCreate')
  };

  const handleCreate = () => {

    
    const trimmed = newStoryTitle.trim();

    if (trimmed === '') {
      // alert("⚠️ Please enter a story title.");
         toast.error("⚠️ Please enter a story title.", {
      position:'top-center',   
      autoClose: 3000,      
   hideProgressBar: false,
  closeButton:false,
  pauseOnHover: false,
    draggable: false,
     });
      return;
    }

    if (trimmed.length > 20) {
      // alert("⚠️ Title must be 20 characters or less.");
      toast.error("⚠️ Title must be 20 characters or less.", {
      position:'top-center',   
      autoClose: 3000,      
   hideProgressBar: false,
  closeButton:false,
  pauseOnHover: false,
    draggable: false,
     });
      return;
    }

    const isDuplicate = stories.some(
      (story) => story.setname.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      // alert("⚠️ This story already exists!");
       toast.error("⚠️ This story already exists!", {
      position:'top-center',   
      autoClose: 3000,      
   hideProgressBar: false,
  closeButton:false,
  pauseOnHover: false,
    draggable: false,
     });
      return;
    }

     const min = Math.ceil(0);   // Ensure min is an integer (rounds up)
    const max = Math.floor(999999);  // Ensure max is an integer (rounds down)
    setrandThirdGameVal(Math.floor(Math.random() * (max - min + 1)) + min)
    setholdTitleCreate(newStoryTitle)
    setNewStoryTitle("")
    navigator("/ReadingCreate")

  };

  //delete collection
  const handleDelete = async (thirdgameval) => {
     const confirmDelete = window.confirm("Are you sure you want to delete collection?")
       if(confirmDelete){
    //get and delete comprehension-collection
    const comprecollectiondblist = collection(firestore,"comprehension-collection")
    const wherecomprecollection = query(comprecollectiondblist,
      where("thirdgameval",'==',thirdgameval),
       where("teacherid","==",ProfileActive.teacherID),
    )
    const getcomprecollection = await getDocs(wherecomprecollection)
    const comprehensiondata = getcomprecollection.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }));

      deleteDoc(doc(firestore,"comprehension-collection",comprehensiondata[0].id))

    //get and delete story-readingques
    const readquesdblist = collection(firestore,"story-readingques")
    const wherereadques = query(readquesdblist,
      where("thirdgameval","==",thirdgameval),
       where("teacherid","==",ProfileActive.teacherID),
    )
    const getreadques = await getDocs(wherereadques)
    const readquesdata = getreadques.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }));

    readquesdata.map((element,index)=>{
     deleteDoc(doc(firestore,"story-readingques",element.id))
    })


     

    //get and delete storyreading

    const storyreadingdblist = collection(firestore,"storyreading")
    const wherestoryreading = query(storyreadingdblist,
      where("thirdgameval","==",thirdgameval),
       where("teacherid","==",ProfileActive.teacherID),
    )
    const getstoryreading = await getDocs(wherestoryreading)
    const storyreadingdata = getstoryreading.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }));

      deleteDoc(doc(firestore,"storyreading",storyreadingdata[0].id))

      //delete images 

   storyreadingdata[0].imagepath.map(async(element,index)=>{
    const delimageRef = ref(storage, element);
    await deleteObject(delimageRef);
    })

    setActiveDropdown(null)
    // setStories([])

    toast.success(`Assessment Permanently deleted!`, {
             position:'top-center',   
             autoClose: 3000,      
          hideProgressBar: false,
         closeButton:false,
         pauseOnHover: false,
           draggable: false,
        });
  }
  };

  //rename
const openRename = (readingdocid,setname) => {

    setrandThirdGameVal(readingdocid)
    setNewStoryTitle(setname);
    setshowRenameModal(true);
    setActiveDropdown(null);
  };

const renameNow=async()=>{
    
    const trimmed = newStoryTitle.trim();

    if (trimmed === '') {
      // alert("⚠️ Please enter a story title.");
       toast.error("⚠️ Please enter a story title", {
      position:'top-center',   
      autoClose: 3000,      
   hideProgressBar: false,
  closeButton:false,
  pauseOnHover: false,
    draggable: false,
     });
      return;
    }

    if (trimmed.length > 20) {
      // alert("⚠️ Title must be 20 characters or less.");
       toast.error("⚠️ Title must be 20 characters or less.", {
      position:'top-center',   
      autoClose: 3000,      
   hideProgressBar: false,
  closeButton:false,
  pauseOnHover: false,
    draggable: false,
     });
      return;
    }

    const isDuplicate = stories.some(
      (story) => story.setname.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      // alert("⚠️ This story already exists!");
       toast.error("⚠️ This story already exists!", {
      position:'top-center',   
      autoClose: 3000,      
   hideProgressBar: false,
  closeButton:false,
  pauseOnHover: false,
    draggable: false,
     });
      return;
    }

    
 //rename it to firebase
const readEditnow = doc(firestore,"comprehension-collection",randThirdGameVal)
  await updateDoc(readEditnow,{
  setname:newStoryTitle
})


       setrandThirdGameVal("")
       setNewStoryTitle("")
       setshowRenameModal(false)
}


 //archive

     
   const handleArchive=async(docid)=>{
   const confirmArchive = window.confirm('are you sure you want to delete')
         
     if(confirmArchive){
       const readingDocRef = doc(firestore, "comprehension-collection", docid);
     await updateDoc(readingDocRef,{
        isarchived:true
     })

     
       toast.success(`Assessment deleted!`, {
             position:'top-center',   
             autoClose: 3000,      
          hideProgressBar: false,
         closeButton:false,
         pauseOnHover: false,
           draggable: false,
        });
             
      }

      setActiveDropdown(null)
    
         
     }
    

     //archive retrive
    
   const handleRetrieve=async(docid)=>{
    const confirmDelete = window.confirm('are you sure you want to retrieve')
         
      if(confirmDelete){
       const readingDocRef = doc(firestore, "comprehension-collection", docid);
        await updateDoc(readingDocRef,{
         isarchived:false
        })

        toast.success(`Assessment Retrieved!`, {
             position:'top-center',   
             autoClose: 3000,      
          hideProgressBar: false,
         closeButton:false,
         pauseOnHover: false,
           draggable: false,
        });
        
       
         }
         }


            // Filter by search (set name)
  const filtered = stories.filter(s =>
    s.setname.toLowerCase().includes(search.toLowerCase())
  );
         

  return (
    <>
    <div
      className={ReadingCreateViewSt.backgroundwrapper}
      style={{ backgroundImage: `url(${Background})` }}
    >

         <div className={ReadingCreateViewSt.header}>
             <img src={LearnEngLogo} alt="LearnENG Logo" className={ReadingCreateViewSt.logo} />
                          
               <div className={ReadingCreateViewSt.userDropdown} >
                <button
                 className={ReadingCreateViewSt.userToggle}
                 onClick={() => setDropdownOpen((v) => !v)}
               >
                  <span className={ReadingCreateViewSt.welcomeText}>Welcome, {ProfileActive.username}!</span>
                 <img src={profileUrlName} alt="User Icon" className={ReadingCreateViewSt.userIcon} />
                     </button>
                          
                     {dropdownOpen && (
                        <div className={ReadingCreateViewSt.dropdownCustom}>
                     <button
                          className={ReadingCreateViewSt.dropdownItem}
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
        

        <div className={ReadingCreateViewSt.backbuttonwrapper}>
        <button className={ReadingCreateViewSt.backbutton} onClick={()=>navigator("/GameCreateSelect")}>
        Back
        </button>
     </div>


      {/* Content */}
      <Container className={`${ReadingCreateViewSt.storycontainer} p-4`}>
      <div className={ReadingCreateViewSt.centerTitle}>
        <h2 className="mb-4" style = {{fontSize:35,fontWeight:'bold'}}> Stories Created for grade {ProfileActive.gradelevel}</h2>
        </div>
        {/* Search */}
                        <div style={{ maxWidth: '950px', display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                          <Form.Control
                            type="text"
                            placeholder="Search by assessment name"
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
        <div className={`${ReadingCreateViewSt.storyscrollbox} mb-3`}>
          {filtered.map((story, idx) => (
            <>
            {activeDropdown === idx && (
                  <div className={ReadingCreateViewSt.menudropdown}>
                    <button className={ReadingCreateViewSt.dropdownitem} onClick={() => handleEdit(story.thirdgameval,story.setname)}>
                      Edit
                    </button>
                    <button className={ReadingCreateViewSt.dropdownitem} onClick={()=>openRename(story.id,story.setname)} >
                      Rename
                    </button>
                    <button className="dropdown-item text-danger" onClick={() => handleArchive(story.id)}>
                      Delete
                    </button>
                  </div>
                )}   

            <div className={ReadingCreateViewSt.titleRowcon}>
            <div className={ReadingCreateViewSt.storycard} onClick={() => handleEdit(story.thirdgameval,story.setname)} key={idx}>
              <span>{story.setname}</span>
              
            </div>
            <div style={{ position: 'relative' }}>
                <FaEllipsisV
                  className={ReadingCreateViewSt.gearicon}
                  onClick={() =>
                    setActiveDropdown(activeDropdown === idx ? null : idx)
                  }
                  style={{ cursor: 'pointer' }}
                />
             
              </div>
              </div>
              
              </>
          ))}

          {filtered.filter(i => !i.archived).length === 0 && (
              <div className="text-center text-muted py-2">Empty Set</div>
            )}
        </div>

        <Button className={ReadingCreateViewSt.createbtn} onClick={() => setShowModal(true)}>
          + Create New Story
        </Button>
      </Container>

       <div className={ReadingCreateViewSt.dock}>
            <button className={ReadingCreateViewSt.fab}>
          <FaRegTrashAlt color='white' size={20} onClick={()=>setshowArchivemodal(true)}/>
          </button>
          </div>

      {/* Modal create */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Story</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="form-control"
            value={newStoryTitle}
            onChange={(e) => {
              if (e.target.value.length <= 20) {
                setNewStoryTitle(e.target.value);
              }
            }}
            placeholder="Enter story name (max 20 chars)"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal rename */}
      <Modal show={showRenameModal} onHide={() => setshowRenameModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Rename</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="form-control"
            value={newStoryTitle}
            onChange={(e) => {
              if (e.target.value.length <= 20) {
                setNewStoryTitle(e.target.value);
              }
            }}
            placeholder="Enter story name (max 20 chars)"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setshowRenameModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={renameNow}>
            Rename
          </Button>
        </Modal.Footer>
      </Modal>

      {/* archive */}
      <Modal show={showArchivemodal} onHide={()=>setshowArchivemodal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Archived Reading Assessments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>

          {archiveStories.map((element,index)=>(
           
              <ListGroup.Item  className="d-flex align-items-center justify-content-between">
              
                <div style={{display:'flex',flexDirection:'column'}}>
                  <strong>{element.setname}</strong>
                  <div className="text-muted">Assessment # {index + 1}</div>
                </div>

                <div style = {{display:'flex',flexDirection:'row',columnGap:'15px'}}>

                 <Button style={{
          backgroundColor: '#6c4d4d',
          border: 'none',
           maxWidth: '70px',
          borderRadius: '25px',
          padding: '10px 25px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={()=>handleRetrieve(element.id)}
        >
          Retrieve
        </Button>

           <Button style={{
          backgroundColor: '#6c4d4d',
          border: 'none',
           maxWidth: '70px',
          borderRadius: '25px',
          padding: '10px 25px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}

        onClick={()=>handleDelete(element.thirdgameval)}
        >
          Delete
        </Button>
    </div> 
      </ListGroup.Item>
              
          ))}

          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setshowArchivemodal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

   <footer className={ReadingCreateViewSt.footer}>
           <div className={ReadingCreateViewSt.footerContent}>
   
           
             {/* Main Footer Content */}
             <div className={ReadingCreateViewSt.footerMain}>
             
               {/* Brand Section */}
               <div className={ReadingCreateViewSt.footerBrand}>
                
   
                 <div className={ReadingCreateViewSt.infoFooter}>
                  <img src={LearnEngLogo} alt="LearnENG Logo" className={ReadingCreateViewSt.logofooter} />
                 <p className={ReadingCreateViewSt.brandTagline}>Master English with confidence</p>
                  {/* Social Links */}
                         <div className={ReadingCreateViewSt.socialLinks}>
                         <a>Follow us: </a>
                           <a href="https://www.facebook.com/share/1Ty9MwVs2s/" target="_blank" rel="noopener noreferrer" className={ReadingCreateViewSt.socialLink}>
                        <FaFacebook />
                          </a>
                           
                         </div>
   
                         
                  </div> 
   
          
                          
               </div>
               
   
       <div className={ReadingCreateViewSt.footerinfoCon}>
      
                  <div className={ReadingCreateViewSt.footerquicklinkCon}>
               {/* Quick Links */}
               <div className={ReadingCreateViewSt.footerSection}>
                 <h4 className={ReadingCreateViewSt.sectionTitle}>Quick Links</h4>
                 <div className={ReadingCreateViewSt.linkGroup}>
                   <button onClick={()=>setaboutUsModal(true)} className={ReadingCreateViewSt.footerLink}>About Us</button>
                 </div>
               </div>
               
               {/* Support */}
               <div className={ReadingCreateViewSt.footerSection}>
                 <h4 className={ReadingCreateViewSt.sectionTitle}>Support</h4>
                 <div className={ReadingCreateViewSt.linkGroup}>
                   <button onClick={()=>setcontactUsModal(true)} className={ReadingCreateViewSt.footerLink}>Contact Us</button>
                 </div>
               </div>
               
               {/* Legal */}
               <div className={ReadingCreateViewSt.footerSection}>
                 <h4 className={ReadingCreateViewSt.sectionTitle}>Legal</h4>
                 <div className={ReadingCreateViewSt.linkGroup}>
                   <button 
                     className={ReadingCreateViewSt.footerLink}
                     onClick={() => settermsConModal(true)}
                   >
                     Terms & Conditions
                   </button>
                 </div>
               </div>
   
      
   
            </div>   
             
   
             <div className={ReadingCreateViewSt.footerSection}>
      <h4 className={ReadingCreateViewSt.sectionTitle}>Get in Touch</h4>
      <div className={ReadingCreateViewSt.linkGroup}>
       <p>&#8226; Pasay, Philippines</p>
     <p>&#8226;1987goldentreasure@gmail.com</p>
     <p>&#8226; 288512003</p>
      </div>
    </div>
   
              </div> 
   
             </div>
   
   
   
              
        {/* Divider */}
             <div className={ReadingCreateViewSt.footerDivider}></div>     
   
             {/* Bottom Section */}
             <div className={ReadingCreateViewSt.footerBottom}>
               <div className={ReadingCreateViewSt.footerCopyright}>
                 <p>© {new Date().getFullYear()} LearnENG. All rights reserved.</p>
                 <p className={ReadingCreateViewSt.madeWith}>Made with ❤️ for English learners worldwide</p>
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
  );
}

export default ReadingCreateView;
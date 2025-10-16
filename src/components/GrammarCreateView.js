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
import {FaRegTrashAlt, FaBook, FaCrown,FaChevronDown, FaSearch, FaArrowRight,FaEllipsisV, FaPlus,FaFacebook,FaSchool } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion,FaSquareXTwitter } from "react-icons/fa6";
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

import GrammarCreateViewSt from '../styleweb/GrammarCreateViewSt.module.css'


import Background from '../assets/Category__Game_1_BG.png';
import LearnEngLogo from '../assets/LearnEngLG.png';
import UserIcon from '../assets/Admin_Icon.png';
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit, getDoc,doc,onSnapshot} from '@firebase/firestore';
import { firestore } from '../firebase';
import { storage } from '../firebase';
import { getStorage,ref, uploadBytes, getDownloadURL, updateMetadata,deleteObject  } from "firebase/storage";
import { toast } from "react-toastify";

const GrammarCreateView = ()=>{


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
    
  //useState
  const [questionSetList,setquestionSetList]=useState([]); 
  const [archiveQuestionSet,setarchiveQuestionSet]=useState([]);

  const {ProfileActive,setProfileActive}=useContext(MyContext); //active profile holder
  //profile img management
  const [profileUrlName,setprofileUrlName]=useState(null)

   const {editPrevSet,seteditPrevSet}=useContext(MyContext); //activate edit mode

const {randSecondGameVal,setrandSecondGameVal}=useContext(MyContext); //SecondGameval setter 

const {holdGrammarsetName,setholdGrammarsetName}=useContext(MyContext)
 //for create modal
      const [showCreate, setShowCreate] = useState(false);
      const [newName, setNewName] = useState("");
  //for rename modal
   const [showRename, setShowRename] = useState(false);
    const [grammarName,setgrammarName]=useState("")
     const [activeIdx, setActiveIdx] = useState(null);

      //dropdown on profile
    const [dropdownOpen, setDropdownOpen] = useState(false);

      //archive modal show/hide
    
 const [showArchivemodal,setshowArchivemodal]=useState(false)

    const [search, setSearch] = useState(''); //search
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

  //upon entering this page, render available questionset------------

  useEffect(()=>{

    const renderQuesSet=async()=>{

    //   let allGrammarSets = [];

    //   for(let i = 0; i < ProfileActive.gradelevel.length; i++){
    // const grammarSetdblist = collection(firestore,'grammar-collection')
    //     const wheregrammarSet = query(grammarSetdblist,
    //         where("gradelevel","==",ProfileActive.gradelevel[i])
    //     );
    //     const getgrammarset = await getDocs(wheregrammarSet)
    //     const grammarsetData = getgrammarset.docs.map((doc)=>({
    //         id:doc.id,
    //         ...doc.data(),
    //     }))

    //     console.log(grammarsetData)
    //      allGrammarSets = [...allGrammarSets, ...grammarsetData];

    //   }
    //   const newGrammarArray = Array.from(new Map(allGrammarSets.map((x) => [x.id, x])).values());
    //  setquestionSetList(newGrammarArray)

     if (!ProfileActive?.gradelevel) return;

        const grammarSetdblist = collection(firestore,'grammar-collection')
        const wheregrammarSet = query(grammarSetdblist,
            where("teacherid","==",ProfileActive.teacherID),
            where("isarchived","==",false)
        );
         const unsubscribe = onSnapshot(wheregrammarSet, (snapshot) => {
        const grammarsetData = snapshot.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
        }))

        setquestionSetList(grammarsetData)

      })

    return () => unsubscribe();
 

    }

    renderQuesSet()

  },[ProfileActive])

  useEffect(()=>{

    const archiveSet=async()=>{
       if (!ProfileActive?.gradelevel) return;

      const grammarSetdblist = collection(firestore,'grammar-collection')
        const wheregrammarSet = query(grammarSetdblist,
            where("teacherid","==",ProfileActive.teacherID),
            where("isarchived","==",true)
        );
         const unsubscribe = onSnapshot(wheregrammarSet, (snapshot) => {
        const grammarsetData = snapshot.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
        }))

        console.log(grammarsetData)

        setarchiveQuestionSet(grammarsetData)

      })

    return () => unsubscribe();
    }

    archiveSet()

  },[ProfileActive])

  //functions

const openRename = (grammardocid,setname) => {

     setrandSecondGameVal(grammardocid)
    setgrammarName(setname);
    setShowRename(true);
    setActiveIdx(null);
  };

  const quesSetEditFunc=(secondgameval,setname)=>{  //activate edit

    setrandSecondGameVal(secondgameval)
    setholdGrammarsetName(setname)
    seteditPrevSet(true)
     navigator("/GrammarCreate")
  }

  const grammarCreateFunc=()=>{

     const min = Math.ceil(0);   // Ensure min is an integer (rounds up)
    const max = Math.floor(999999);  // Ensure max is an integer (rounds down)
    setrandSecondGameVal(Math.floor(Math.random() * (max - min + 1)) + min)
     setholdGrammarsetName(newName)
    navigator("/GrammarCreate")

  }

   const grammarRename=async()=> {
      const trimmed = grammarName.trim();
      if (!trimmed) return;
  
      const duplicate = questionSetList.some(
        (s, i) =>
          // i !== renameIdx &&
          // !s.archived &&
          s.setname.toLowerCase() === trimmed.toLowerCase()
      );
      if (duplicate) {
        // alert("That name is already taken. Choose a different one.");
            toast.error("That name is already taken. Choose a different one.");
        return;
      }
  
      //rename it to firebase
      const spellEditnow = doc(firestore,"grammar-collection",randSecondGameVal)
      await updateDoc(spellEditnow,{
      setname:grammarName
      })
  
        //close edit name modal
          setShowRename(false)
          setgrammarName("")
        setrandSecondGameVal("")
        setActiveIdx(null)
        //  setquestionSetList([])
       }

       //delete collection
    const deleteCollection = async(secondgameval) => {

  const confirmDelete = window.confirm("Are you sure you want to delete collection?")

  if(confirmDelete){

          const grammardblist = collection(firestore,"grammar")
            const wheregrammar = query(grammardblist,
                where("secondgameval","==",secondgameval),
                 where("teacherid","==",ProfileActive.teacherID),
            );
            const getgrammar = await getDocs(wheregrammar)
            const grammardata = getgrammar.docs.map((doc)=>({
             id:doc.id,
             ...doc.data()
            }))

             const grammardbcollectlist = collection(firestore,"grammar-collection")
            const wheregrammarcollect = query(grammardbcollectlist,
                where("secondgameval","==",secondgameval),
                 where("teacherid","==",ProfileActive.teacherID),
            );
            const getgrammarcollect = await getDocs(wheregrammarcollect)
            const grammarcollectdata = getgrammarcollect.docs.map((doc)=>({
             id:doc.id,
             ...doc.data()
            }))

            //delete grammar
            grammardata.map((element,index)=>{
            deleteDoc(doc(firestore,"grammar",element.id))
            })

            //delete grammar-collection
       deleteDoc(doc(firestore,"grammar-collection",grammarcollectdata[0].id))

       toast.success(`Assessment Permanently deleted!`, {
             position:'top-center',   
             autoClose: 3000,      
          hideProgressBar: false,
         closeButton:false,
         pauseOnHover: false,
           draggable: false,
            });
    setActiveIdx(null)
    }

    }

    //archive

     
   const handleArchive=async(docid)=>{
   const confirmArchive = window.confirm('are you sure you want to delete')
         
     if(confirmArchive){
       const grammarDocRef = doc(firestore, "grammar-collection", docid);
     await updateDoc(grammarDocRef,{
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

       setActiveIdx(null);
    
         
     }
    

     //archive retrive
    
   const handleRetrieve=async(docid)=>{
    const confirmDelete = window.confirm('are you sure you want to retrieve')
         
      if(confirmDelete){
       const grammarDocRef = doc(firestore, "grammar-collection", docid);
        await updateDoc(grammarDocRef,{
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
  const filtered = questionSetList.filter(s =>
    s.setname.toLowerCase().includes(search.toLowerCase())
  );


    return(
        <>

        <div className={GrammarCreateViewSt.fbBg}>
     

      <div className={GrammarCreateViewSt.header}>
                 <img src={LearnEngLogo} alt="LearnENG Logo" className={GrammarCreateViewSt.logo} />
                  
                    <div className={GrammarCreateViewSt.userDropdown} >
                      <button
                        className={GrammarCreateViewSt.userToggle}
                         onClick={() => setDropdownOpen((v) => !v)}
                       >
                         <span className={GrammarCreateViewSt.welcomeText}>Welcome, {ProfileActive.username}!</span>
                         <img src={profileUrlName} alt="User Icon" className={GrammarCreateViewSt.userIcon} />
                      </button>
                  
                      {dropdownOpen && (
                        <div className={GrammarCreateViewSt.dropdownCustom}>
                          <button
                            className={GrammarCreateViewSt.dropdownItem}
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

      {/* Back */}
      <div className={GrammarCreateViewSt.fbBackWrap}>
        <button className={GrammarCreateViewSt.fbBack} onClick={()=>navigator("/GameCreateSelect")}>Back</button>
      </div>

      {/* Main */}
      <Container className={GrammarCreateViewSt.fbOuter}>
        <h3 className={GrammarCreateViewSt.fbTitle}>Word Match Created for grade {ProfileActive.gradelevel}:</h3>
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

                        {/* // */}
        <div className={GrammarCreateViewSt.fbInner}>
          <div className={GrammarCreateViewSt.fbListScroll}>
            {filtered.map((s, idx) => (
              <div className={GrammarCreateViewSt.fbRow} key={s.id}>
                <button
                  className={GrammarCreateViewSt.fbRowMain}
                  // TODO later → navigate(`/word-match/${s.id}`)
                  onClick={()=>quesSetEditFunc(s.secondgameval,s.setname)}
                >
                  <span className={GrammarCreateViewSt.fbRowName}>{s.setname}</span>
                </button>

                <button
                  className={GrammarCreateViewSt.fbEllipsis}
                  aria-expanded={activeIdx === idx}
                  onClick={() => setActiveIdx(activeIdx === idx ? null : idx)}
                >
                  <FaEllipsisV />
                </button>

                {activeIdx === idx && (
                  <div className={GrammarCreateViewSt.fbMenu}>
                    <button onClick={()=>quesSetEditFunc(s.secondgameval,s.setname)}>Edit</button>
                    <button onClick={()=>openRename(s.id,s.setname)} >Rename</button>
                    <button onClick={()=>handleArchive(s.id)} className={GrammarCreateViewSt.textArchive} >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}

            {questionSetList.filter(i => !i.archived).length === 0 && (
              <div className="text-center text-muted py-4">No word-match sets yet — create one below.</div>
            )}
          </div>
        </div>

        <Button className={GrammarCreateViewSt.fbCreate} onClick={() => setShowCreate(true)}>
          <FaPlus className="me-2" /> Create New
        </Button>
      </Container>

      {/* Create Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered>
        <Modal.Header closeButton><Modal.Title>Create New Word Match</Modal.Title></Modal.Header>
        <Modal.Body>
          <input className="form-control" value={newName}
            onChange={(e) => setNewName(e.target.value.slice(0, 30))}
            placeholder="Enter set name (max 30 chars)" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button variant="primary" onClick={grammarCreateFunc} disabled={!newName.trim()}>Create</Button>
        </Modal.Footer>
      </Modal>

      {/* Rename Modal */}
      <Modal show={showRename} onHide={() => setShowRename(false)} centered>
        <Modal.Header closeButton><Modal.Title>Rename Word Match</Modal.Title></Modal.Header>
        <Modal.Body>
          <input className="form-control" value={grammarName}
            onChange={(e) => setgrammarName(e.target.value.slice(0, 30))}
            placeholder="New name" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRename(false)}>Cancel</Button>
          <Button variant="primary" onClick={()=>grammarRename()} disabled={!grammarName.trim()}>Save</Button>
        </Modal.Footer>
      </Modal>

      <div className={GrammarCreateViewSt.dock}>
              <button className={GrammarCreateViewSt.fab}>
          <FaRegTrashAlt color='white' size={20} onClick={()=>setshowArchivemodal(true)} />
             </button>
            </div>


                    {/* archive */}

       <Modal show={showArchivemodal} onHide={()=>setshowArchivemodal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Archived Grammar Assessments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>

          {archiveQuestionSet.map((element,index)=>(
           
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

        onClick={()=>deleteCollection(element.secondgameval)}
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


<footer className={GrammarCreateViewSt.footer}>
        <div className={GrammarCreateViewSt.footerContent}>

        
          {/* Main Footer Content */}
          <div className={GrammarCreateViewSt.footerMain}>
          
            {/* Brand Section */}
            <div className={GrammarCreateViewSt.footerBrand}>
             

              <div className={GrammarCreateViewSt.infoFooter}>
               <img src={LearnEngLogo} alt="LearnENG Logo" className={GrammarCreateViewSt.logofooter} />
              <p className={GrammarCreateViewSt.brandTagline}>Master English with confidence</p>
               {/* Social Links */}
                      <div className={GrammarCreateViewSt.socialLinks}>
                      <a>Follow us: </a>
                       <a href="https://www.facebook.com/share/1Ty9MwVs2s/" target="_blank" rel="noopener noreferrer" className={GrammarCreateViewSt.socialLink}>
                      <FaFacebook />
                         </a>
                        
                      </div>

                      
               </div> 

       
                       
            </div>
            

    <div className={GrammarCreateViewSt.footerinfoCon}>
   
               <div className={GrammarCreateViewSt.footerquicklinkCon}>
            {/* Quick Links */}
            <div className={GrammarCreateViewSt.footerSection}>
              <h4 className={GrammarCreateViewSt.sectionTitle}>Quick Links</h4>
              <div className={GrammarCreateViewSt.linkGroup}>
                <button onClick={()=>setaboutUsModal(true)} className={GrammarCreateViewSt.footerLink}>About Us</button>
              </div>
            </div>
            
            {/* Support */}
            <div className={GrammarCreateViewSt.footerSection}>
              <h4 className={GrammarCreateViewSt.sectionTitle}>Support</h4>
              <div className={GrammarCreateViewSt.linkGroup}>
                <button onClick={()=>setcontactUsModal(true)} className={GrammarCreateViewSt.footerLink}>Contact Us</button>
              </div>
            </div>
            
            {/* Legal */}
            <div className={GrammarCreateViewSt.footerSection}>
              <h4 className={GrammarCreateViewSt.sectionTitle}>Legal</h4>
              <div className={GrammarCreateViewSt.linkGroup}>
                <button 
                  className={GrammarCreateViewSt.footerLink}
                  onClick={() => settermsConModal(true)}
                >
                  Terms & Conditions
                </button>
              </div>
            </div>

   

         </div>   
          

          <div className={GrammarCreateViewSt.footerSection}>
   <h4 className={GrammarCreateViewSt.sectionTitle}>Get in Touch</h4>
   <div className={GrammarCreateViewSt.linkGroup}>
     <p>&#8226; Pasay, Philippines</p>
     <p>&#8226;1987goldentreasure@gmail.com</p>
     <p>&#8226; 288512003</p>
   </div>
 </div>

           </div> 

          </div>



           
     {/* Divider */}
          <div className={GrammarCreateViewSt.footerDivider}></div>     

          {/* Bottom Section */}
          <div className={GrammarCreateViewSt.footerBottom}>
            <div className={GrammarCreateViewSt.footerCopyright}>
              <p>© {new Date().getFullYear()} LearnENG. All rights reserved.</p>
              <p className={GrammarCreateViewSt.madeWith}>Made with ❤️ for English learners worldwide</p>
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

export default GrammarCreateView;


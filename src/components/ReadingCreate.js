import React, { useRef,createContext, useContext, useState , useEffect} from 'react';
import {Link,Navigate,redirect,useNavigate} from 'react-router-dom'
import { MyContext } from './DataContext';
import { GoogleLogin,GoogleOAuthProvider,useGoogleOneTapLogin  } from '@react-oauth/google';
import {gapi}from 'gapi-script';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import { HiSortAscending } from 'react-icons/hi';
import { IoIosArrowDown,IoMdArrowDropright,IoMdContact } from "react-icons/io";
import { TfiMenu } from "react-icons/tfi";
import { MdMeetingRoom,MdContactPhone, MdSynagogue  } from "react-icons/md";
import { FaBook, FaCrown,FaChevronDown, FaSearch, FaArrowRight } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { Container, Button, Form, Row, Col, Modal} from 'react-bootstrap';
import { getStorage,ref, uploadBytes, getDownloadURL, updateMetadata,deleteObject  } from "firebase/storage";
import { storage } from '../firebase';
import ReadingCreateSt from '../styleweb/ReadingCreateSt.module.css'
import { v4 } from "uuid";
import Background from '../assets/Category__Game_1_BG.png';
import LearnEngLogo from '../assets/LearnEngLG.png';
import UserIcon from '../assets/Admin_Icon.png';
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit, getDoc,doc} from '@firebase/firestore';
import { firestore } from '../firebase';
import { elements, Title } from 'chart.js';
import { toast } from "react-toastify";
import { AiImage } from '../firebase';
import { AIinit } from '../firebase';
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });

const ReadingCreateView=()=>{

   const {ProfileActive,setProfileActive}=useContext(MyContext); 

   const navigator = useNavigate();  //navigator

   //data needed for modification
        const {editPrevSet,seteditPrevSet}=useContext(MyContext); //activate edit mode
     const {randThirdGameVal,setrandThirdGameVal}=useContext(MyContext); //ThirdGameval setter 
       const {holdTitleCreate,setholdTitleCreate}=useContext(MyContext);

       //story docid
       const [storyReadingDocid,setstoryReadingDocid]=useState("")
      const [readingQuesDocid,setreadingQuesDocid]=useState([]);

      //story image management state
      const [storyReadImgRemPrev,setstoryReadImgRemPrev]=useState([])
      const [storyReadImgRemPan,setstoryReadImgRemPan]=useState([])

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingUploadIndex, setPendingUploadIndex] = useState(null);
  
 //loading state

 const [isLoading,setisLoading]=useState(false)

    //when user reloads
  
      useEffect(() => {
      const handleBeforeUnload = (event) => {
         sessionStorage.setItem('isReloading',true)
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      // Cleanup
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);
  
  
    useEffect(()=>{
      if(sessionStorage.getItem('isReloading')){
        sessionStorage.clear();
        backbtnFunc()
      }
    },[])
  
  


    const [panels, setPanels] = useState([
    {
      question: '',
      choices: ['', '', ''],
      correctanswer: null,
      // imageFile: null,
      imagepath: null,
      tellstory: '',
      imagename:''
    },
  ]);

      const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(()=>{


     
    const editgetData=async()=>{
      
      setisLoading(true)

          if(editPrevSet === true){
      const storyreadingdblist = collection(firestore,"storyreading")
      const wherestoryreading = query(storyreadingdblist,
        where("thirdgameval",'==',randThirdGameVal),
        where("teacherid",'==',ProfileActive.teacherID)
      )
      const getstoryreading = await getDocs(wherestoryreading)
      const storyreadingdata = getstoryreading.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
      }))

      //set story docid

      setstoryReadingDocid(storyreadingdata[0].id)

     

      const readingquesdblist = collection(firestore,"story-readingques")
      const wherereadingques = query(readingquesdblist,
        where("thirdgameval",'==',randThirdGameVal),
        where("teacherid",'==',ProfileActive.teacherID)
      )
      const getreadingques = await getDocs(wherereadingques)
      const readingquesdata = getreadingques.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
      }))

      //set ques docid
     const quesdocIds = readingquesdata.map(element => element.id);
      setreadingQuesDocid(quesdocIds);


    //apply readques
    const PromisereadquesAll = await Promise.all(

      readingquesdata.map(async(element,index)=>{

        const readquesArray={
          question:element.question,
          choices:element.choices,
          correctanswer:element.correctanswer,
          imagepath:null,
          tellstory:'',
          imagename:''
        }

        return(readquesArray)
      })
    );

 

 //get story reading
    let readingCompo = PromisereadquesAll

    // readingCompo[1].imagepath = "oke"

    for(let i = 0; i < readingCompo.length; i++){

      const imageRef = ref(storage, storyreadingdata[0].imagepath[i]);
        const url = await getDownloadURL(imageRef); 
      
      readingCompo[i].imagepath = url
      readingCompo[i].imagename = storyreadingdata[0].imagepath[i]
      readingCompo[i].tellstory = storyreadingdata[0].tellstory[i]

    }

  
    console.log(readingCompo)

    setPanels(readingCompo)
  
  }
  setisLoading(false)

    }

    editgetData()
  


  },[])

  

//   const { storyTitle } = useParams();

  //functions

  const handleImageChange = (panelIndex, file) => {
  

    let randImageCode = v4()

    //update image
    if(panels[panelIndex].imagepath !== null){

   const imageRef = ref(storage, `gameassets/image/${"Reading-img" + " " + randImageCode + " " + file.name}`);
    uploadBytes(imageRef, file).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((url) => {

      setstoryReadImgRemPrev([...storyReadImgRemPrev,`gameassets/image/${"Reading-img" + " " + randImageCode + " " + file.name}`])

      const replacenewImg=async()=>{
         const storyreadingdblist = collection(firestore,"storyreading")
      const wherestoryreading = query(storyreadingdblist,
        where("thirdgameval",'==',randThirdGameVal)
      )
      const getstoryreading = await getDocs(wherestoryreading)
      let storyreadingdata = getstoryreading.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
      }))

      const updated = [...panels];
    updated[panelIndex].imagename = `gameassets/image/${"Reading-img" + " " + randImageCode + " " + file.name}`;
    updated[panelIndex].imagepath = url;
    setPanels(updated);




      }

      replacenewImg()

      });
    });

  
    }
    else{
      //add new fresh image

     const imageRef = ref(storage, `gameassets/image/${"Reading-img" + " " + randImageCode + " " + file.name}`);
    uploadBytes(imageRef, file).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((url) => {
       setstoryReadImgRemPrev([...storyReadImgRemPrev,`gameassets/image/${"Reading-img" + " " + randImageCode + " " + file.name}`])
      const updated = [...panels];
    updated[panelIndex].imagename = `gameassets/image/${"Reading-img" + " " + randImageCode + " " + file.name}`;
    updated[panelIndex].imagepath = url;
    setPanels(updated);
    });
  });
    }

    



    setShowUploadModal(false);
    setPendingUploadIndex(null);
  };

  //generate sample via ai
     const [isAiLoading,setisAiLoading]=useState(false)

  const generateAi=async(panelIndex)=>{

      let randImageCode = v4()

    const updated = [...panels]; //get panel question
    
    setisAiLoading(true)

    try{
    //story ai
    const prompt1 = panelIndex === 0 ? 
      `Can you generate me a short story scenario. Only one paragraph. Suitable for grade 2-4 students. No commentary for you` 
      :
       `Can you add up a story for this. Only include the new paragraph, Dont display the current paragrpah of  ${updated[panelIndex - 1].tellstory}.No commentary for you. My current story: ${updated[panelIndex - 1].tellstory}`
      const result1 = await AIinit.generateContent(prompt1)
      const storyAi = result1.response


    //question ai

    const prompt2 =  `
      Generate me a question regarding this story: ${storyAi.candidates[0].content.parts[0].text}. Straight to the point. no commentary for you
      `
      const result2 = await AIinit.generateContent(prompt2)
      const questionAi = result2.response


    const prompt3 = `
     Reveal the correct answer of this question: ${questionAi.candidates[0].content.parts[0].text}. This is the basis of the question: ${storyAi.candidates[0].content.parts[0].text}. No commentary for you. Straight to the point.
     make the answer short as possible
      `
      const result3 = await AIinit.generateContent(prompt3)
      const AnswercorrectAi = result3.response



    const prompt4 =  `
     Think of the incorrect answer from this question: ${questionAi.candidates[0].content.parts[0].text} and the correct answer: ${AnswercorrectAi.text}. This is the basis of the question: ${storyAi.candidates[0].content.parts[0].text}. No commentary for you. Straight to the point. 
    make sure isnt same as ${AnswercorrectAi.candidates[0].content.parts[0].text}.
     Return only the incorrect annswer.
          make the answer short as possible
      `
      const result4 = await AIinit.generateContent(prompt4)
      const AnswerwrongAi1 = result4.response

 

    const prompt5 = `
     Think of the incorrect answer from this question: ${questionAi.candidates[0].content.parts[0].text} and the correct answer: ${AnswercorrectAi.candidates[0].content.parts[0].text}. This is the basis of the question: ${storyAi.candidates[0].content.parts[0].text}. No commentary for you. Straight to the point. 
     make sure isnt same as ${AnswercorrectAi.candidates[0].content.parts[0].text} and ${AnswerwrongAi1.candidates[0].content.parts[0].text}.
     Return only the incorrect annswer.
          make the answer short as possible
      `
      const result5 = await AIinit.generateContent(prompt5)
      const AnswerwrongAi2 = result5.response

   
//image generation
const promptImg = `Can you generate an image illustration with this story:
${storyAi.candidates[0].content.parts[0].text}

Make the illustration cartoonize
`
const response = await AiImage.generateImages(promptImg);
const resimage = response.images[0];

console.log(resimage)
const mimeType  =  resimage.mimeType;
const imgBase64 = resimage.bytesBase64Encoded; 

//generate image function
function base64ToBlob(base64, mime = "image/png") {

  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

const blob = base64ToBlob(imgBase64, mimeType);
//firebase upload view
const imageRef = ref(storage, `gameassets/image/Reading-img-${randImageCode}-AI.png`);
const snapshot = await uploadBytes(imageRef, blob, { contentType: mimeType });
const url = await getDownloadURL(snapshot.ref);
const imgnameHold = snapshot.metadata.fullPath;
const imgurl = url;


    updated[panelIndex].tellstory = storyAi.candidates[0].content.parts[0].text
    updated[panelIndex].question = questionAi.candidates[0].content.parts[0].text
    updated[panelIndex].choices[0] = AnswercorrectAi.candidates[0].content.parts[0].text
    updated[panelIndex].choices[1] =  AnswerwrongAi1.candidates[0].content.parts[0].text
    updated[panelIndex].choices[2] = AnswerwrongAi2.candidates[0].content.parts[0].text
    updated[panelIndex].correctanswer = AnswercorrectAi.candidates[0].content.parts[0].text
    updated[panelIndex].imagename = imgnameHold
    updated[panelIndex].imagepath = imgurl
    setPanels(updated)
  }
  catch(e){

     toast.error(`Error generating. Pls try again Later`, {
                  position:'top-center',   
                  autoClose: 3000,      
               hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
                draggable: false,
                 });

  }
  setisAiLoading(false)
  }

  const handleQuestionChange = (index, value) => {
    if (value.length > 200) return;
    const updated = [...panels];
    updated[index].question = value;
    setPanels(updated);
  };

  const handleChoiceChange = (panelIndex, choiceIndex, value) => {
    if (value.length > 150) return;
    const updated = [...panels];
    updated[panelIndex].choices[choiceIndex] = value;
    updated[panelIndex].correctanswer = value;
    setPanels(updated);
  };

  const handleCorrectSelect = (panelIndex, choice) => {
    const updated = [...panels];
    updated[panelIndex].correctanswer = choice;
    setPanels(updated);
  };

  const handleImageContextChange = (panelIndex, value) => {
    const updated = [...panels];
    updated[panelIndex].tellstory = value;
    setPanels(updated);
  };

  const addPanel = () => {
    setPanels([
      ...panels,
      {
        question: '',
        choices: ['', '', ''],
        correctanswer: null,
        // imageFile: null,
        imagepath: null,
        tellstory: '',
        imagename:''
      },
    ]);
  };

  //remove data/panel
  const removePanel = async(index,imagename) => {

  
  
  if(imagename !== ""){
  setstoryReadImgRemPan([...storyReadImgRemPan,imagename])
  }
    const updated = [...panels];
    updated.splice(index, 1);
    setPanels(updated);

 
  };

  

  const handleSave = async () => {

    
    for (const [i, panel] of panels.entries()) {
      if (!panel.imagepath) {
        // alert(`Panel ${i + 1}: Please upload an image.`);
          toast.error(`Panel ${i + 1}: Please upload an image.`, {
                  position:'top-center',   
                  autoClose: 3000,      
               hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
                draggable: false,
                 });
        return;
      }
      if (!panel.question.trim()) {
        // alert(`Panel ${i + 1}: Question is required.`);
        toast.error(`Panel ${i + 1}: Question is required.`, {
                  position:'top-center',   
                  autoClose: 3000,      
               hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
                draggable: false,
                 });
        return;
      }

      const trimmedChoices = panel.choices.map(c => c.trim());
      if (trimmedChoices.some(c => !c)) {
        // alert(`Panel ${i + 1}: All choices must be filled.`);
        toast.error(`Panel ${i + 1}: All choices must be filled.`, {
                  position:'top-center',   
                  autoClose: 3000,      
               hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
                draggable: false,
                 });
        return;
      }

      const uniqueChoices = new Set(trimmedChoices);
      if (uniqueChoices.size < 3) {
        // alert(`Panel ${i + 1}: All choices must be different.`);
         toast.error(`Panel ${i + 1}: All choices must be different.`, {
                  position:'top-center',   
                  autoClose: 3000,      
               hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
                draggable: false,
                 });
        return;
      }

      if (panel.correctanswer === null) {
        // alert(`Panel ${i + 1}: You must select a correct answer.`);
         toast.error(`Panel ${i + 1}: You must select a correct answer.`, {
                  position:'top-center',   
                  autoClose: 3000,      
               hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
                draggable: false,
                 });
        return;
      }
    }


    
      //   readingQuesDocid.map((element,index)=>{
      //   console.log(element)
      //  })
    
       

    try {
      //if editPrev is true--


      if(editPrevSet === true){
         //edit question

        readingQuesDocid.map((element,index)=>{
        deleteDoc(doc(firestore,"story-readingques",element))
       })

       //replace new question now

       panels.map((element,index)=>{
       addDoc(collection(firestore,"story-readingques"),{

        choices:element.choices,
        correctanswer:element.correctanswer,
        question:element.question,
        thirdgameval:randThirdGameVal,
        title:holdTitleCreate,
        teacherid:ProfileActive.teacherID
       })
    });
      
      

       //edit read

      let holdtellstory = []
      let holdimagepath = []
      for(let i2 = 0; i2 < panels.length; i2++){
        holdtellstory.push(panels[i2].tellstory)
        holdimagepath.push(panels[i2].imagename)
      }

      const readDocRef = doc(firestore,"storyreading",storyReadingDocid)
      await updateDoc(readDocRef,{
        tellstory:holdtellstory,
        imagepath:holdimagepath,
        teacherid:ProfileActive.teacherID
      });   

   


    }
    else{ //if add new set--

      //add new Question 

      panels.map((element,index)=>{
       addDoc(collection(firestore,"story-readingques"),{

        choices:element.choices,
        correctanswer:element.correctanswer,
        question:element.question,
        thirdgameval:randThirdGameVal,
        title:holdTitleCreate,
        teacherid:ProfileActive.teacherID
       })
    });

    //add new Read

      let holdtellstory = []
      let holdimagepath = []

      for(let i2 = 0; i2 < panels.length; i2++){
        holdtellstory.push(panels[i2].tellstory)
        holdimagepath.push(panels[i2].imagename)
      }


      addDoc(collection(firestore,"storyreading"),{
        imagepath:holdimagepath,
        tellstory:holdtellstory,
        thirdgameval:randThirdGameVal,
        title:holdTitleCreate,
        teacherid:ProfileActive.teacherID
      })

      //add set collection

      addDoc(collection(firestore,"comprehension-collection"),{
        setname:holdTitleCreate,
        teacherid:ProfileActive.teacherID,
        thirdgameval:randThirdGameVal,
        gradelevel:ProfileActive.gradelevel,
        isarchived:false
      })


    }


   //delete previous image/s
   if(storyReadImgRemPan.length !== 0){
    storyReadImgRemPan.map(async(element,index)=>{    
    const delimageRef = ref(storage, element);
    await deleteObject(delimageRef);
    })
   }
      
  //  alert('Questions and images saved successfully!');
   toast.success(`Questions and images saved successfully!`, {
                  position:'top-center',   
                  autoClose: 3000,      
               hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
                draggable: false,
                 });

    } catch (error) {
      alert(error);
      console.error(error);
         alert('Somethings wrong');
    }


  
    navigator('/ReadingCreateView');
    seteditPrevSet(false)
    setrandThirdGameVal(0)
    setholdTitleCreate("")
  };

  //backbtnfunc

  const backbtnFunc=()=>{

    //remove pending upload image
    if(storyReadImgRemPrev.length !== 0){

      storyReadImgRemPrev.map(async(element,index)=>{
        const delimageRef = ref(storage, element);
       await deleteObject(delimageRef);
      })
      
    }
     setrandThirdGameVal(0)
    setholdTitleCreate("")
    seteditPrevSet(false)
    navigator("/ReadingCreateView")
  }

  //panel navigator
  
         const panelRefs = useRef([]);
           panelRefs.current = panels.map((_, i) => panelRefs.current[i] ?? React.createRef());
  const prevLenRef = useRef(panels.length);
   const [activeIdx, setActiveIdx] = useState(0); 
    useEffect(() => {
  
        if (panels.length > prevLenRef.current) {
      const last = panels.length - 1;
  
      // wait for DOM to paint, then scroll
      requestAnimationFrame(() => {
        panelRefs.current[last]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setActiveIdx(last);
      });
    }
    prevLenRef.current = panels.length;
    
      const obs = new IntersectionObserver(
        (entries) => {
          // pick the most visible entry
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible) return;
          const idx = panelRefs.current.findIndex((r) => r.current === visible.target);
          if (idx !== -1) setActiveIdx(idx);
        },
        {
          // start highlighting a panel a little before it reaches the top
          root: null,
          rootMargin: "-20% 0px -60% 0px",
          threshold: [0.2, 0.6, 0.9],
        }
      );
  
      panelRefs.current.forEach((r) => r.current && obs.observe(r.current));
      return () => obs.disconnect();
    }, [panels.length]);

    
     // smooth scroll to a panel
  const goTo = (i) => {
    panelRefs.current[i]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className={ReadingCreateSt.backgroundwrapper} style={{ backgroundImage: `url(${Background})` }}>
      <div className={ReadingCreateSt.header}>
                         <img src={LearnEngLogo} alt="LearnENG Logo" className={ReadingCreateSt.logo} />
                 
                         <div className={ReadingCreateSt.userDropdown} >
                           <button
                             className={ReadingCreateSt.userToggle}
                             onClick={() => setDropdownOpen((v) => !v)}
                           >
                             <span className={ReadingCreateSt.welcomeText}>Welcome, {ProfileActive.username}!</span>
                             <img src={UserIcon} alt="User Icon" className={ReadingCreateSt.userIcon} />
                           </button>
                 
                           {dropdownOpen && (
                             <div className={ReadingCreateSt.dropdownCustom}>
                               <button
                                 className={ReadingCreateSt.dropdownItem}
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

      <div className={ReadingCreateSt.backbuttonwrapper}>
        <button className={ReadingCreateSt.backbutton} onClick={() => backbtnFunc()}>
        Back
        </button>
        <div className={ReadingCreateSt.titlePanelcon}>
          <h2> Assessment Name: <strong>{holdTitleCreate}</strong></h2>
          </div>
      </div>
         {/* Floating navigator */}
            <nav className={ReadingCreateSt.panelNav} aria-label="Question navigator">
              <div className={ReadingCreateSt.panelNavTitle}>Navigate to</div> 
               <div className={ReadingCreateSt.navdotCon}>
              {panels.map((q, i) => (
              
                <button
                  key={q.id}
                  className={`${ReadingCreateSt.navDot} ${i === activeIdx ? "active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${q.title}`}
                >
                  {i + 1}
                </button>
               
              ))}
              <button
                  className={ReadingCreateSt.navDot}
                 onClick={()=>{
                  addPanel()
                  setActiveIdx(panels.length + 1)
                 }}
                >
                 <h2>+</h2>
                </button>
               </div>
            </nav>
              
      <Container className={ReadingCreateSt.questionpanelcontainer}>

        <div className={ReadingCreateSt.QuestionOverflow}>
        {panels.map((panel, panelIndex) => (
          <section ref={panelRefs.current[panelIndex]}  key={panelIndex} className={ReadingCreateSt.panelbox}>
            {/* Image Upload */}
            <Form.Group className="mb-3">
            <div className={ReadingCreateSt.backbtnWrapper}>
            {/* <div className="d-flex justify-content-end"> */}
             
            {/* </div> */}
              <Form.Label className={ReadingCreateSt.textHeaders}> Question {panelIndex + 1}</Form.Label>

              <div className={ReadingCreateSt.modifybtncon}>

             <Button
             onClick={()=>generateAi(panelIndex)}
             disabled={isAiLoading}
              className={ReadingCreateSt.aibtn}
                > {'\u2605'} {!isAiLoading ? <a> {panelIndex === 0 ? 'Generate story' : 'Generate next'}</a> : <a>Generating..</a>}</Button>

               {panels.length > 1 && (

                <Button
                disabled={isAiLoading}
                  onClick={() => removePanel(panelIndex,panel.imagename)}
                  className={ReadingCreateSt.removebtn}
                >
                 {'\u232B'} Remove Panel
                </Button>
                
              )}
               </div>
              </div>
              {panel.imagepath ? (
                <div className={ReadingCreateSt.imagepreview}>
                  <img src={panel.imagepath} alt={`Preview ${panelIndex + 1}`} className={ReadingCreateSt.uploadedimg} />
                    <Button className={ReadingCreateSt.removepanelBtn} variant="warning" size="sm" onClick={() => setPendingUploadIndex(panelIndex)}>Replace Image</Button>
                </div>
              ) : (
                <Button disabled={isAiLoading} variant="secondary" onClick={() => setPendingUploadIndex(panelIndex)}>
                  Upload Image
                </Button>
              )}
            </Form.Group>

            {/* Image Context */}
            <Form.Group className="mb-3">
              <Form.Label className={ReadingCreateSt.textHeaders}>Put a scenario story </Form.Label>
              <Form.Control
                as="textarea"
                className={ReadingCreateSt.textfieldStandard}
                rows={2}
                placeholder="Tell a story or scenario here...."
                value={panel.tellstory}
                onChange={(e) => handleImageContextChange(panelIndex, e.target.value)}
              />
            </Form.Group>

            {/* Question */}
            <Form.Group className="mb-3">
              <Form.Label className={ReadingCreateSt.textHeaders}>Question for the story panel</Form.Label>
              <Form.Control
                type="text"
                className={ReadingCreateSt.textfieldStandard}
                placeholder="Type your question here..."
                value={panel.question}
                onChange={(e) => handleQuestionChange(panelIndex, e.target.value)}
              />
            </Form.Group>

            {/* Choices */}
            <Form.Label className={ReadingCreateSt.textHeaders}>Choices</Form.Label>
            {panel.choices.map((choice, choiceIndex) => (
              <div className="d-flex align-items-center mb-2" key={choiceIndex}>
                <Form.Check
                  type="radio"
                  name={`correct-${panelIndex}`}
                  checked={panel.correctanswer === choice}
                  onChange={() => handleCorrectSelect(panelIndex, choice)}
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  placeholder={`Choice ${choiceIndex + 1}`}
                  value={choice}
                  onChange={(e) => handleChoiceChange(panelIndex, choiceIndex, e.target.value)}
                />
              </div>
            ))}

            
          </section>
        ))}
            </div>
        <Button disabled={isAiLoading} variant="success" className="me-3" onClick={addPanel}>
          + Add Panel
        </Button>
        <Button disabled={isAiLoading} variant="primary" onClick={handleSave}>
         { editPrevSet ? 'Save Text Changes':'Save Changes'} 
        </Button>
      </Container>

      {/* Modal: Confirm Upload */}
      <Modal show={pendingUploadIndex !== null} onHide={() => setPendingUploadIndex(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to upload/replace the image for this question?</Modal.Body>
        <Modal.Footer>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) {
                const file = e.target.files[0];
               const maxSize = 15 * 1024 * 1024; // 2 MB in bytes
             if (file.size > maxSize) {
                alert("File is too large! Maximum allowed size is 15 MB.");
                 return;
               }
                handleImageChange(pendingUploadIndex, e.target.files[0]);
              }
            }}
          />
        </Modal.Footer>
      </Modal>

       {/* modal loading */}
            <Modal show={isLoading} backdrop="static" centered>
           <Modal.Body className="text-center">
             <div className={ReadingCreateSt.customloader}></div>
            <p className="mt-3 mb-0 fw-bold">Loading Assessment</p>
         </Modal.Body>
          </Modal>
    </div>
  );
};

export default ReadingCreateView;
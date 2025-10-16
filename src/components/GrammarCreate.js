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
import { FaBook, FaCrown,FaChevronDown, FaSearch, FaArrowRight } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion } from "react-icons/fa6";


import GrammarCreateSt from '../styleweb/GrammarCreateSt.module.css'

import Background from '../assets/Category__Game_1_BG.png';
import LearnEngLogo from '../assets/LearnEngLG.png';
import UserIcon from '../assets/Admin_Icon.png';
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit,ref, getDoc,doc} from '@firebase/firestore';
import { firestore } from '../firebase';
import { toast } from "react-toastify";
import { AIinit } from '../firebase';
import { AiImage } from '../firebase';
import { GoogleGenAI } from "@google/genai";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
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
const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });


const GrammarCreate=()=>{

    const navigator = useNavigate();  //navigator

     const {ProfileActive,setProfileActive}=useContext(MyContext); 

const {randSecondGameVal,setrandSecondGameVal}=useContext(MyContext); //SecondGameval setter 
const {editPrevSet,seteditPrevSet}=useContext(MyContext); //activate edit mode

const [questions, setQuestions] = useState([createNewQuestion(1)]); //store question

const [quesSetName,setquesSetName]=useState("");  //hold setname
const {holdGrammarsetName,setholdGrammarsetName}=useContext(MyContext)

//get grammar docid for editing
const [grammarcollectDocid,setgrammarcollectDocid]=useState(0)
const [grammarDocid,setgrammarDocid]=useState([])

   const [dropdownOpen, setDropdownOpen] = useState(false);

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

     //question and answers format

     function createNewQuestion(id){
        return{
            id,
            secondgameval:randSecondGameVal,
            quesfirst:"",
            quessecond:"",
            correctanswer:"",
            choices:["","",""],
            difficulty:"",
            score:1
        }
     }

     //load selected question set

     useEffect(()=>{

     const renderQuesAll=async()=>{

        if(editPrevSet === true){

          setisLoading(true)
        //render setname's grammar collection

        const grammarcollectdblist = collection(firestore,"grammar-collection")
        const wheregrammarcollect = query(grammarcollectdblist,
            where("secondgameval","==",randSecondGameVal),
            where("teacherid",'==',ProfileActive.teacherID)
        );
        const getgrammarcollect = await getDocs(wheregrammarcollect)
        const grammarcollectdata = getgrammarcollect.docs.map((doc)=>({
         id:doc.id,
         ...doc.data()
        }))

        setgrammarcollectDocid(grammarcollectdata[0].id)
        setholdGrammarsetName(grammarcollectdata[0].setname)

        //render grammar questions
         const grammardblist = collection(firestore,"grammar")
        const wheregrammar = query(grammardblist,
            where("secondgameval","==",randSecondGameVal),
            where("teacherid",'==',ProfileActive.teacherID)
        );
        const getgrammar = await getDocs(wheregrammar)
        const grammardata = getgrammar.docs.map((doc)=>({
         id:doc.id,
         ...doc.data()
        }))

        const PromiseQuesAll = await Promise.all(
            grammardata.map(async(element,index)=>{

                const QuestionArray={

                id:index + 1,
                secondgameval:randSecondGameVal,
                quesfirst:element.quesfirst,
                quessecond:element.quessecond,
                correctanswer:element.correctanswer,
                choices:element.choices,
                difficulty:element.difficulty,
                score:element.score

                }

                return(QuestionArray)
            })
        );

        setQuestions(PromiseQuesAll)

        //get all grammar docid

       const ids = grammardata.map((element) => element.id);
        setgrammarDocid(ids);


    }

        setisLoading(false)
     }

        renderQuesAll()
     },[])

     //panel navigator

       const panelRefs = useRef([]);
         panelRefs.current = questions.map((_, i) => panelRefs.current[i] ?? React.createRef());
     //add new blank question

     const addNewQuestion=()=>{
     
        // if(
        //     questions[index].choices[0] === "" &&
        //     questions[index].choices[1] === "" &&
        //     questions[index].choices[2] === "" &&
        //     questions[index].correctanswer === "" 
            
        // ){
        //     window.alert("Fill all required fields")
        // }
        const newId = questions.length + 1;
        setQuestions([...questions,createNewQuestion(newId)])
        console.log(questions)
     }

     //delete previous question

     const deleteQuestion=(id)=>{

    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated.map((q, i) => ({ ...q, id: i + 1 })));
     
     } 

     const [isAiLoading,setisAiLoading]=useState(false)
     
     const generateAI = async(quesid,index) => {

      if(questions[index].difficulty === ""){
         toast.error(`Select a difficulty first and generate`, {
      position:'top-center',   
      autoClose: 3000,      
   hideProgressBar: false,
  closeButton:false,
  pauseOnHover: false,
    draggable: false,
     });
     return;
      }


      setisAiLoading(true)

      try{

       const prompt1 = `
      Create a fill-in-the-blank English grammar sentence suitable for 2nd to 4th graders.
        
        Requirements:
        - Place the blank in the middle or near the end (not at the very end)
        - Use the format: "The cat _____ on the mat."
         - Make it grammatically simple
         - Focus on common words (verbs, adjectives, prepositions)
         - Return only the sentence with one blank represented by underscores: _____
        - Every generate think of the another example
         - difficulty ${questions[index].difficulty}
         Example: "The dog _____ in the park."
       `
       const result1 = await AIinit.generateContent(prompt1);
       const sentenceRes = result1.response
    

  const fullSentence =  sentenceRes.candidates[0].content.parts[0].text;
  let choicesArray = [];
  let correctAns = ""

  const prompt2 = `
   For this fill-in-the-blank sentence: "${fullSentence}"
        
    Provide only the single word that correctly fills the blank. 
    Choose the most common, appropriate word for 2nd-4th graders.
    Return only the word, no punctuation or explanation.
  `
  const result2 = await AIinit.generateContent(prompt2)
  const answerRes = result2.response

    choicesArray.push(answerRes.candidates[0].content.parts[0].text)
    correctAns = answerRes.candidates[0].content.parts[0].text


    const prompt3 = `
         The correct word for this fill-in-the-blank sentence is "${answerRes.candidates[0].content.parts[0].text}".
    
     Generate one grammatically incorrect version of "${answerRes.candidates[0].content.parts[0].text}".
     - Keep the same general meaning or part of speech.
     - Make it wrong by changing tense, number (singular/plural), or agreement.
     - Do NOT give a random word that changes the meaning completely.
     - Return only the incorrect word, no punctuation or explanation.
     - make sure isnt same as ${answerRes.candidates[0].content.parts[0].text}
    `
      const result3 = await AIinit.generateContent(prompt3)
  const wrongAnswerRes1 = result3.response
  

        choicesArray.push(wrongAnswerRes1.candidates[0].content.parts[0].text)


    const prompt4 = `
      The correct word for this fill-in-the-blank sentence is "${answerRes.candidates[0].content.parts[0].text}".
    
     Generate one grammatically incorrect version of "${answerRes.candidates[0].content.parts[0].text}".
     - Keep the same general meaning or part of speech.
     - Make it wrong by changing tense, number (singular/plural), or agreement.
     - Do NOT give a random word that changes the meaning completely.
     - Return only the incorrect word, no punctuation or explanation.
     - make sure isnt same as ${answerRes.candidates[0].content.parts[0].text} and ${wrongAnswerRes1.candidates[0].content.parts[0].text}
    `
    const result4 = await AIinit.generateContent(prompt4);
    const wrongAnswerRes2 = result4.response;

        choicesArray.push(wrongAnswerRes2.candidates[0].content.parts[0].text)

    // Split the sentence into parts
    const parts = fullSentence.split('_____');
    const quesfirst = parts[0]?.trim() || '';
    const quessecond = parts[1]?.trim() || '';

 console.log(choicesArray)


  const updated = questions.map((q) => {
  if (q.id === quesid) {
    return {
      ...q,
      quesfirst:quesfirst,
      quessecond: quessecond,
      choices:choicesArray,
      correctanswer:correctAns
    };
  }
  return q;
});

    setQuestions(updated);
  
  }

  catch(e){
        toast.error(`Failed to genrate. Try again later`, {
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

     //every question change 1

     const questionChangefirst=(id,value)=>{
      const updated = questions.map((q) =>
      q.id === id ? { ...q, quesfirst: value } : q
    );
    setQuestions(updated);
     }

      //every question change 2

     const questionChangesecond=(id,value)=>{
      const updated = questions.map((q) =>
      q.id === id ? { ...q, quessecond: value } : q
    );
    setQuestions(updated);
     }

     //choices field change

     const AnswerChange = (quesindex,qid,idx,value)=>{
        const updatedAnswers = [...questions];
        updatedAnswers[quesindex].choices[idx] = value;
        updatedAnswers[quesindex].correctanswer = value;
     setQuestions(updatedAnswers);
     }

     //every change correct answer

     const AnswerChoices=(quesindex,qid,value)=>{

      const updated = [...questions]
      updated[quesindex].correctanswer = value
      setQuestions(updated);
     }

     //difficulty change

     const difficultyChange = (quesindex,qid,value)=>{
      const updated = [...questions]
      updated[quesindex].difficulty = value
      setQuestions(updated);
     }

     //score change

     const scoreChangeIncrement = (quesindex,qid,value)=>{
      const newValue = Number(value + 1)
      if(newValue < 6){
      const updated = [...questions]
      updated[quesindex].score = newValue
      setQuestions(updated);
    }
     }

      const scoreChangeDecrement = (quesindex,qid,value)=>{
      const newValue = Number(value - 1)
       if(newValue > 0){
      const updated = [...questions]
      updated[quesindex].score = newValue
      setQuestions(updated);
       }
     }


  

     //save changes

     const saveExecute=async()=>{


        //ADD from grammar-collection firebase
        addDoc(collection(firestore,"grammar-collection"),{
            secondgameval:randSecondGameVal,
            setname:holdGrammarsetName,
            teacherid:ProfileActive.teacherID,
            gradelevel:ProfileActive.gradelevel,
            isarchived:false,
            teacherid:ProfileActive.teacherID
        })

        //ADD from grammar firebase
        questions.map((element,index)=>{
            addDoc(collection(firestore,"grammar"),{
                choices:element.choices,
                correctanswer:element.correctanswer,
                quesfirst:element.quesfirst,
                quessecond:element.quessecond,
                difficulty:element.difficulty,
                score:element.score,
                secondgameval:randSecondGameVal,
                teacherid:ProfileActive.teacherID
            })
        })

     }

     const saveChanges=()=>{
      //validations

      if(holdGrammarsetName.trim() === ""){
        alert(`Fill out set name.`);
        return;
      }
      
     for(let i = 0; i < questions.length; i++){
      if(questions[i].quesfirst === ""){
        // alert(`Panel ${i + 1}: First half question is required.`);
         toast.error(`Panel ${i + 1}: First half question is required.`, {
      position:'top-center',   
      autoClose: 3000,      
   hideProgressBar: false,
  closeButton:false,
  pauseOnHover: false,
    draggable: false,
     });
        return;
      }
       if(questions[i].quessecond === ""){
        // alert(`Panel ${i + 1}: Second half question is required.`);
         toast.error(`Panel ${i + 1}: Second half question is required.`, {
      position:'top-center',   
      autoClose: 3000,      
   hideProgressBar: false,
  closeButton:false,
  pauseOnHover: false,
    draggable: false,
     });
        return;
      }

    const trimmedChoices = questions[i].choices.map(c=>c.trim());
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
      
      if (questions[i].correctanswer === null) {
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

    if(editPrevSet === true){ //if edited -> delete previous record

    grammarDocid.map((element,index)=>{ //get docid to delete old record and replace to new
     deleteDoc(doc(firestore,"grammar",element))
    })
    deleteDoc(doc(firestore,"grammar-collection",grammarcollectDocid))

        console.log(questions)
        seteditPrevSet(false)
    }

    toast.success(`Questions saved successfully!`, {
      position:'top-center',   
      autoClose: 3000,      
   hideProgressBar: false,
  closeButton:false,
  pauseOnHover: false,
    draggable: false,
     });
        saveExecute()
        setQuestions([createNewQuestion(1)])
        setrandSecondGameVal(0)
        setgrammarDocid([])
        setholdGrammarsetName("")
        setgrammarcollectDocid(0)
        navigator('/GrammarCreateView')

    console.log(questions)
     }


   
    //back funtion

    const backbtnFunc=()=>{

       setQuestions([createNewQuestion(1)])
        setrandSecondGameVal(0)
        setgrammarDocid([])
        setholdGrammarsetName("")
        setgrammarcollectDocid(0)
       seteditPrevSet(false)
      navigator('/GrammarCreateView')
       

    }

    const [activeIdx, setActiveIdx] = useState(0); //for panel smooth redirection
  // highlight the nav item for the panel currently in view
const prevLenRef = useRef(questions.length);
  useEffect(() => {

      if (questions.length > prevLenRef.current) {
    const last = questions.length - 1;

    // wait for DOM to paint, then scroll
    requestAnimationFrame(() => {
      panelRefs.current[last]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveIdx(last);
    });
  }
  prevLenRef.current = questions.length;
  
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
  }, [questions.length]);

     // smooth scroll to a panel
  const goTo = (i) => {
    panelRefs.current[i]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

   


    return(

        <>

          <div className={GrammarCreateSt.secondGameContainer}>
      <div className={GrammarCreateSt.header}>
                   <img src={LearnEngLogo} alt="LearnENG Logo" className={GrammarCreateSt.logo} />
           
                   <div className={GrammarCreateSt.userDropdown} >
                     <button
                       className={GrammarCreateSt.userToggle}
                       onClick={() => setDropdownOpen((v) => !v)}
                     >
                       <span className={GrammarCreateSt.welcomeText}>Welcome, {ProfileActive.username}!</span>
                       <img src={UserIcon} alt="User Icon" className={GrammarCreateSt.userIcon} />
                     </button>
           
                     {dropdownOpen && (
                       <div className={GrammarCreateSt.dropdownCustom}>
                         <button
                           className={GrammarCreateSt.dropdownItem}
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

      <div className={GrammarCreateSt.buttonRow}>
        <button onClick={backbtnFunc} className={GrammarCreateSt.backButton}>Back</button>
      </div>
<div className={GrammarCreateSt.formHeader}>
          <label className={GrammarCreateSt.setNameLabel}>Word Match Set Name:</label>
          <input type="text" disabled={true} value={holdGrammarsetName} onChange={(e)=>setholdGrammarsetName(e.target.value)} className={GrammarCreateSt.setNameInput} />
          <button onClick={saveChanges} className={GrammarCreateSt.saveButton}>Save</button>
        </div> 

          {/* Floating navigator */}
      <nav className={GrammarCreateSt.panelNav} aria-label="Question navigator">
        <div className={GrammarCreateSt.panelNavTitle}>Navigate to</div> 
         <div className={GrammarCreateSt.navdotCon}>
        {questions.map((q, i) => (
        
          <button
            key={q.id}
            className={`${GrammarCreateSt.navDot} ${i === activeIdx ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to ${q.title}`}
          >
            {i + 1}
          </button>
         
        ))}
        <button
            className={GrammarCreateSt.navDot}
           onClick={()=>{
            addNewQuestion()  
            setActiveIdx(questions.length + 1)
           }}
          >
           <h2>+</h2>
          </button>
         </div>
      </nav>
        
        <div className={GrammarCreateSt.QuestionOverflow}>
        {/* panel question */}
        {questions.map((q,index)=>(<>
        
      <section key={q.id} ref={panelRefs.current[index]}  className={GrammarCreateSt.formBox}>
        <h1>Question #{index + 1}</h1>

        <div className={GrammarCreateSt.btnModifycon}>
        <button onClick={()=>deleteQuestion(q.id)} disabled={questions.length === 1} className={GrammarCreateSt.deleteButton}>🗑 Delete Question</button>
         <button disabled={isAiLoading} onClick={()=>generateAI(q.id,index)} className={GrammarCreateSt.deleteButton}>  {'\u2605'} Generate Sample </button>
         </div>


        <div key={q.id} className={GrammarCreateSt.formContentGrid}>  
        {/* left side */}
          <div className={GrammarCreateSt.leftColumnInputs}>
        
            <div className={GrammarCreateSt.phraseHeaders}>
              <span>Input first phrase:</span>
            </div>
            <div className={GrammarCreateSt.matchRow}>
              <input type="text" className={GrammarCreateSt.phraseInput} value={q.quesfirst} onChange={(e)=>questionChangefirst(q.id,e.target.value)} />
            </div>

            <div className={GrammarCreateSt.phraseHeaders}>
              <span>Input second phrase:</span>
            </div>
            <div className={GrammarCreateSt.matchRow}>
              <input type="text" className={GrammarCreateSt.matchInput} value={q.quessecond} onChange={(e)=>questionChangesecond(q.id,e.target.value)} />
            </div>


           
        
          

              <div className={GrammarCreateSt.AnswersCon}> 
             <div className={GrammarCreateSt.phraseHeaders}>
              <span>Select correct answers:</span>
            </div>
              {/* start of radiobutton */}
              {q.choices.map((choices,idx)=>(
              <div className={GrammarCreateSt.optionRow}>
                <input type="radio" id="option1" value = {choices}  name={`matchOption-${q.id}`} checked={q.correctanswer === choices}  className={GrammarCreateSt.optionRadio} onClick={(e)=>AnswerChoices(index,q.id,e.target.value)}/>
                <label htmlFor="option1" className={GrammarCreateSt.optionLabel}>
                  <input type="text" className={GrammarCreateSt.optionInput} placeholder={`Option ${idx + 1}`} value={choices} onChange={(e)=>AnswerChange(index,q.id, idx,e.target.value)}/>
                </label>
              </div>    
              
              ))}
              </div>

          
          </div>

          <div className={GrammarCreateSt.rightColumnOptions}>
            <div className={GrammarCreateSt.matchOptionsSection}>
              <div className={GrammarCreateSt.matchOptionsHeader}>
                <span>Set points:</span>
                <button className={GrammarCreateSt.scoreButton} onClick={(e)=>scoreChangeDecrement(index,q.id,q.score)}>-</button>
                <input type="text" className={GrammarCreateSt.optionPointInput} value={q.score}/>
                <button className={GrammarCreateSt.scoreButton} onClick={(e)=>scoreChangeIncrement(index,q.id,q.score)}>+</button>
              </div>
            <br/>
               <div className={GrammarCreateSt.difficultyHeaders}>
                 <span>Select difficulty:</span>

               <label className={GrammarCreateSt.Columndifficulty}>
              <input
              className={GrammarCreateSt.optionRadio} 
              type='radio'
              value={"easy"}
              checked={q.difficulty === "easy"}
              onClick={(e)=>difficultyChange(index,q.id,e.target.value)}
              />
              <span>Easy</span>
              </label>

               <label className={GrammarCreateSt.Columndifficulty}>
              <input
              className={GrammarCreateSt.optionRadio} 
              type='radio'
              value={"medium"}
              checked={q.difficulty === "medium"}
              onClick={(e)=>difficultyChange(index,q.id,e.target.value)}
              />
              <span>Medium</span>
              </label>

               <label className={GrammarCreateSt.Columndifficulty}>
              <input
              className={GrammarCreateSt.optionRadio} 
              type='radio'
              value={"hard"}
              checked={q.difficulty === "hard"}
              onClick={(e)=>difficultyChange(index,q.id,e.target.value)}
             
              />
              <span>Hard</span>
              </label>


              
              
            </div>



             
            </div>
          </div>
        </div>
       
        
        {/* sample question 2 */}

      
      {/* end ques */}
      
 </section> 
       </>))} 
       
     </div>

         <div className={GrammarCreateSt.actionButtons}> 
         <button onClick={()=>addNewQuestion()} className={GrammarCreateSt.createbuttonq}>➕ Create New</button>
        </div>
     
       {/* modal loading */}
              <Modal show={isLoading} backdrop="static" centered>
              <Modal.Body className="text-center">
                 <div className={GrammarCreateSt.customloader}></div>
                <p className="mt-3 mb-0 fw-bold">Loading Assessment</p>
              </Modal.Body>
            </Modal>

       
    </div>

        </>
    )
}

export default GrammarCreate;
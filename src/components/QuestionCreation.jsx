import React, { useRef,createContext, useContext, useState , useEffect} from 'react';
import {Link,Navigate,useNavigate} from 'react-router-dom'
import { MyContext } from './DataContext';
import { GoogleLogin,GoogleOAuthProvider,useGoogleOneTapLogin  } from '@react-oauth/google';
import {gapi}from 'gapi-script';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import QuestionCreationSt from '../styleweb/QuestionCreationSt.module.css'
import { HiSortAscending } from 'react-icons/hi';
import { IoIosArrowDown,IoMdArrowDropright,IoMdContact } from "react-icons/io";
import { TfiMenu } from "react-icons/tfi";
import { MdMeetingRoom,MdContactPhone, MdSynagogue  } from "react-icons/md";
import { FaBook, FaCrown,FaChevronDown } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion } from "react-icons/fa6";

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
  Image
} from 'react-bootstrap';
import { firestore } from '../firebase';
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit,ref, getDoc,doc} from '@firebase/firestore';


const QuestionCreation = ()=>{

  //toggle loading
  
   const [QuesRendered,setQuesRendered]=useState(false) //overall completion of rendered page
  

      const [showNav, setshowNav]=useState(false);

              const navigator = useNavigate();  //navigator
    
         //useState
    
         
          const {ProfileActive,setProfileActive}=useContext(MyContext);
           const {currentAuth,setcurrentAuth}=useContext(MyContext);
            const {quesSetActiveCategories,setquesSetActiveCategories}=useContext(MyContext);
            
                //question creation--
            
              const {newquestionSetref,setnewquestionSetref}=useContext(MyContext)
              const {newanswerModule,setnewanswerModule}=useContext(MyContext)
               const {newQuesSetname,setnewQuesSetname}=useContext(MyContext)
                const {editPrevSet,seteditPrevSet}=useContext(MyContext)

              //isChecked

              const [isAnsChecked,setisAnsChecked]=useState(false)
              
                      //editing docuid referencing                 
          const {docuIdquesCollect,setdocuIdquesCollect}=useContext(MyContext);
          const {docuIdques,setdocuIdques}=useContext(MyContext);
          const {docuIdquesactiveCat,setdocuIdquesactiveCat}=useContext(MyContext);
          const {docuIdanswer,setdocuIdanswer}=useContext(MyContext);

const [questions, setQuestions] = useState([
    createNewQuestion(1),
  ]);

  useEffect(()=>{
  
      const cleardocuidreferencing=()=>{
    // setdocuIdquesCollect([])
    // setdocuIdques([])
    // setdocuIdquesactiveCat([])
    // setdocuIdanswer([])
      }
  
      window.addEventListener('popstate',cleardocuidreferencing)
    },[])
  function createNewQuestion(id) {  //question and answers format
    return {
      id,
      answermodule:newanswerModule,
      questionsetref:newquestionSetref,
      category: 'grammar',
      text: '',
      answers: [[""],[""],[""]],
      isCorrect:[[false],[false],[false]]

    };
  };

  //Load selected Question Set........

  useEffect(()=>{
    setQuesRendered(true)
    
    const ApplyAll = async ()=>{

    if(editPrevSet === true){

      //questions
   const questiondblist = collection(firestore,"questions")
   const WhereQuestion = query(questiondblist,
    where("questionsetref","==",newquestionSetref)
   );
   const getQuestion = await getDocs(WhereQuestion)
   const QuestionData = getQuestion.docs.map((doc)=>({
    id:doc.id,
    ...doc.data()
   }))

  const LoadingAns = await Promise.all(
   QuestionData.map(async(element,index)=>{
    
    const QuestionArray={
      id:index + 1,
      answermodule:element.answermodule,
      questionsetref:newquestionSetref,
      category:element.category,
      text:element.question,
      answers:[],
      isCorrect:[]
    }

    //answers
   const answerdblist = collection(firestore,"answers")
   const whereAnswer = query(answerdblist,
    where("answermodule","==",element.answermodule)
   );
   const getAnswer = await getDocs(whereAnswer)
   const AnswerData = getAnswer.docs.map((doc)=>({
    id:doc.id,
    ...doc.data()
    
   }))

   AnswerData.map((element,index)=>{
       QuestionArray.answers.push(...[element.answer])
       QuestionArray.isCorrect.push(...[Boolean(element.iscorrect)])
   })

 return(QuestionArray)
   })
  );
 console.log(LoadingAns)
  setQuestions(LoadingAns)

   seteditPrevSet(false)

 
    }
    setQuesRendered(false)
    }

    ApplyAll()
  
    
  },[]);

  //answeModule id generator..........  
 useState(()=>{
  if(editPrevSet === false){
  const min = Math.ceil(0);   // Ensure min is an integer (rounds up)
   const max = Math.floor(999999);  // Ensure max is an integer (rounds down)
  setnewanswerModule(Math.floor(Math.random() * (max - min + 1)) + min)
  seteditPrevSet(true)
  }
 
 },[questions])
 
  //add new blank Question
  const handleAddQuestion = () => {
    if(isAnsChecked === true){
    const newId = questions.length + 1;
  const min = Math.ceil(0);   // Ensure min is an integer (rounds up)
   const max = Math.floor(999999);  // Ensure max is an integer (rounds down)
  setnewanswerModule(Math.floor(Math.random() * (max - min + 1)) + min)

    setQuestions([...questions, createNewQuestion(newId)]);
    setisAnsChecked(false)
    }

    else{
      window.alert("Pls Select an Answer")
    }
   
    
  };

  const handleDeleteQuestion = (id) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated.map((q, i) => ({ ...q, id: i + 1 })));
  };

  const handleQuestionChange = (id, value) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, text: value } : q
    );
    setQuestions(updated);
  };

  const handleCategoryChange = (id, value) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, category: value } : q
    );
    setQuestions(updated);
  };

  const handleAnswerChange = (qid, idx, value) => {
    const updated = questions.map((q) => {
      if (q.id === qid) {
        const updatedAnswers = [...q.answers];
        updatedAnswers[idx] = value;
        return { ...q, answers: updatedAnswers };
      }
      return q;
    });
    setQuestions(updated);
  };

  const answerChoiceChange=(qid,idx)=>{
    const updated = questions.map((q) => {
    if (q.id === qid) {
      // Create new isCorrect array with all false values
      const updatedCorrectAnsChoice = new Array(q.isCorrect.length).fill(false);
      // Set only the selected index to true
      updatedCorrectAnsChoice[idx] = true;
      
      return { ...q, isCorrect: updatedCorrectAnsChoice };
    }
    return q;
  });
 
  setQuestions(updated);
   setisAnsChecked(true)
  }

  //save changes
const saveExecute=async()=>{

  //save from question-collection server
  addDoc(collection(firestore,"question-collection"),{
    questionsetref:newquestionSetref,
    setname:newQuesSetname,
    teacherid:ProfileActive.teacherID
  })

  //save from question-activecategories server

  let isGrammarIncluded = false
  let isVocabularyIncluded = false
  let isSituationalIncluded = false

  questions.map((element,index)=>{
    if(element.category === "grammar"){
      isGrammarIncluded = true
    }
    if(element.category === "vocabulary"){
      isVocabularyIncluded = true
    }

    if(element.category === "situational"){
      isSituationalIncluded = true
    }

  })

  addDoc(collection(firestore,"questions-activecategories"),{
      grammar:isGrammarIncluded,
      vocabulary:isVocabularyIncluded,
      situational:isSituationalIncluded,
      questionsetref:newquestionSetref
    })

    //save from questions server

    questions.map((element,index)=>{

      addDoc(collection(firestore,"questions"),{
        answermodule:element.answermodule,
        category:element.category,
        question:element.text,
        questionsetref:newquestionSetref
      })
      })


      //save from answer server

      questions.map(async(ques,quesindex)=>{

        //pass answers
        ques.answers.map(async(ans,ansindex)=>{

          await addDoc(collection(firestore,"answers"),{
            answer:ans,
            answermodule:ques.answermodule,
            iscorrect:Boolean(ques.isCorrect[ansindex])    
          })
        })
      })


}
  const saveChanges=async()=>{

    //  const QuestionArray={
    //   id:index + 1,
    //   answermodule:element.answermodule,
    //   questionsetref:newquestionSetref,
    //   category:element.category,
    //   text:element.question,
    //   answers:[],
    //   isCorrect:[]
    // }
     setdocuIdquesCollect([])
    setdocuIdques([])
    setdocuIdquesactiveCat([])
    setdocuIdanswer([])

    if(editPrevSet === true){ //if edited 
 
      
      seteditPrevSet(false)
    }

  saveExecute()
  setQuestions([createNewQuestion(1)])
  navigator('/QuestionGenPage')
  console.log(questions)
  }
    return(
        <>

        <div className={QuestionCreationSt.QuestionCreContainer}>
         {/* home header  */}
      
             <nav className={QuestionCreationSt.QuestionCreHeader}>
      
             <ul className = {showNav ? QuestionCreationSt.sidebarShow : QuestionCreationSt.sidebarHide}>
              <li onClick={()=>setshowNav(false)}><a><ImCross /></a></li>
              <li><a>Welcome, Userdfgdgdgdgddg</a></li>
              <li><a>Classroom</a></li>
              <li><a>sdfsfsfsf</a></li>
              <li><a>sdfsfsfsf</a></li>
              <li><a>sdfsfsfsf</a></li>
              
      
             </ul>
      
             <ul>
              <li onClick={()=>console.log("df")}><a className={QuestionCreationSt.Logoname}>LearnEng</a></li>
              <li onClick={()=>navigator("/HelpNote")} className={QuestionCreationSt.hideonMobile}><a>Help</a></li>
              <li onClick={()=>navigator("/AboutPage")} className={QuestionCreationSt.hideonMobile}><a> About us</a></li>
              {/* <li onClick={()=>{}} className={QuestionCreationSt.hideonMobile}></li> */}
              <li className={QuestionCreationSt.hideonMobile} onClick={()=>{ navigator('/Profilepage')
               console.log(ProfileActive.id)}}><a> Welcome, {ProfileActive.username}</a></li>
              <li className={QuestionCreationSt.navbtn} onClick={()=>setshowNav(true)}><a><TfiMenu/></a></li>
              {/* <li onClick={()=>{setProfileActive({}) 
              navigator("/")}} className={QuestionCreationSt.hideonMobile}><a>LOGOUT</a></li> */}
             </ul>
      
             </nav>

             {/* start form */}

             
      <Container fluid className="py-4 px-5" style={{ backgroundColor: 'rgba(132, 139, 238, 0.23)', borderRadius: '10px' }}>
        <Row className="justify-content-between align-items-center mb-3">
          <Col className="text-end">
            <Button variant="primary" onClick={saveChanges}>Save changes</Button>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Card>
              <Card.Body>
                <strong>Note:</strong><br />
                Some of the questions might be filtered out in-game due to category filtering. Please set the category carefully.
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h5>Create question</h5>
        {questions.map((q) => (
          <Card key={q.id} className="mb-4">
            <Card.Body>
              <Row className="align-items-center mb-2">
                <Col><strong>Question #{q.id}</strong></Col>
                <Col className="text-end">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteQuestion(q.id)}
                    disabled={questions.length === 1}
                  >
                    Delete Question
                  </Button>
                </Col>
              </Row>

              <Row className="mb-2 align-items-center">
                <Col sm="3"><Form.Label>Select Category:</Form.Label></Col>
                <Col sm="9">
                  <Form.Select
                    size="sm"
                    value={q.category}
                    onChange={(e) => handleCategoryChange(q.id, e.target.value)}
                  >
                    <option>grammar</option>
                    <option>vocabulary</option>
                    <option>situational</option>
                  </Form.Select>
                </Col>
              </Row>

              <Row className="mb-3 justify-content-center">
                <Col md={10}>
                  <Form.Control
                    type="text"
                    placeholder={`Question ${q.id}`}
                    value={q.text}
                    onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                  />
                </Col>
              </Row>

              {q.answers.map((ans, idx) => (
                <Row key={idx} className="mb-2 justify-content-center">
                  <Col xs="auto">
                    <Form.Check type="radio" name={`answer-${q.id}`}  onClick={()=>answerChoiceChange(q.id,idx)} />
                  </Col>
                  <Col md={10}>
                    <Form.Control
                      type="text"
                      placeholder={`Answer ${idx + 1}`}
                      value={ans}
                      onChange={(e) => handleAnswerChange(q.id, idx, e.target.value)}
                    />
                  </Col>
                </Row>
              ))}
            </Card.Body>
          </Card>
        ))}

        <Row className="text-center">
          <Col>
            <Button
              variant="success"
              onClick={handleAddQuestion}
            >
              Add New Question
            </Button>
          </Col>
        </Row>
        
        {/* loading modal */}
          <Modal show = {QuesRendered} onHide={() => setQuesRendered(false)} centered>
          <Modal.Body style={{ color: 'white' }}>
           <div className="d-flex mb-3">
              <span style={{width:50,height:50,color:'black',color:'blue'}} class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span  style={{fontSize:30,color:'black'}} class="sr-only">Loading...</span>
            </div>
          </Modal.Body>
          </Modal>
      </Container>

        
          
             
             </div>

{/*start form */}
        </>
    )
}

export default QuestionCreation;
import React, { useRef,createContext, useContext, useState , useEffect} from 'react';
import {Link,Navigate,useNavigate} from 'react-router-dom'
import { MyContext } from './DataContext';
import { GoogleLogin,GoogleOAuthProvider,useGoogleOneTapLogin  } from '@react-oauth/google';
import {gapi}from 'gapi-script';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import QuestionGenPageSt from '../styleweb/QuestionGenPageSt.module.css'
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

const QuestionGenPage=()=>{

  const [showModal, setShowModal] = useState(false);  //toggle create new form modal
  const [showModal2, setShowModal2] = useState(false);  //toggle editname form modal
  
  //useState text holder
  const [formName, setFormName] = useState(''); 
  const [formType, setFormType] = useState('');

  // const [forms, setForms] = useState([]);
  const {questionSetList,setquestionSetList}=useContext(MyContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

     const [showNav, setshowNav]=useState(false);

  //toggle loading

 const [QuesRendered,setQuesRendered]=useState(false) //overall completion of rendered page

     //upon entering this page render available questionset............
     useEffect(()=>{

      const renderQuesSet= async () =>{
        setQuesRendered(true)
          //put the question from the storage questiionSetList
                const questionSetlist = collection(firestore,"question-collection")
                const whereQuestionSet = query(questionSetlist,
                  where("teacherid",'==',ProfileActive.teacherID)
                );
                const getquestionset = await getDocs(whereQuestionSet)
                const QuestionsetData = getquestionset.docs.map((doc)=>({
                    id:doc.id,
                  ...doc.data(),
                }))
        
                setquestionSetList(QuestionsetData)
        
                //rearranging categories----------------------
        
                // QuestionsetData.map(async(element,index)=>{  //get questionsetref
        
                //   let quesSetIndex = Number(element.questionsetref)
                //  const categoriesSetList = collection(firestore,"questions-activecategories")
                // const whereCategoryset = query(categoriesSetList,
                //   where("questionsetref","==",element.questionsetref)
                // )
                // const getCategories = await getDocs(whereCategoryset)
                // const CategorySetData = getCategories.docs.map((doc)=>({
                //   id:doc.id,
                //   ...doc.data()
                // }))
                //  setquesSetActiveCategories(...quesSetActiveCategories,CategorySetData)      
                
                // })

                  setQuesRendered(false)

      }

      renderQuesSet()

     },[])

     //useState
      const {ProfileActive,setProfileActive}=useContext(MyContext);
       const {currentAuth,setcurrentAuth}=useContext(MyContext);
        const {quesSetActiveCategories,setquesSetActiveCategories}=useContext(MyContext);

        const navigator = useNavigate();  //navigator

        //question creation--

       const {newquestionSetref,setnewquestionSetref}=useContext(MyContext)
        const {newanswerModule,setnewanswerModule}=useContext(MyContext)
        const {newQuesSetname,setnewQuesSetname}=useContext(MyContext)
        const {editPrevSet,seteditPrevSet}=useContext(MyContext)

        //editing docuid referencing

        
           const {docuIdquesCollect,setdocuIdquesCollect}=useContext(MyContext);
           const {docuIdques,setdocuIdques}=useContext(MyContext);
           const {docuIdquesactiveCat,setdocuIdquesactiveCat}=useContext(MyContext);
           const {docuIdanswer,setdocuIdanswer}=useContext(MyContext);
  //functions............

  //create new question set
  const handleCreate = async () => {
      setQuesRendered(true)
    // || formType === ''
    if (formName.trim() === '' ) {  
      setError('Please provide both form name and question type.');
      return;
    }

    if (questionSetList.some(form => form.setname.toLowerCase() === formName.toLowerCase())) {
      setError('Form name already exists.');
      return;
    }

      const min = Math.ceil(0);   // Ensure min is an integer (rounds up)
   const max = Math.floor(999999);  // Ensure max is an integer (rounds down)
    setnewquestionSetref(Math.floor(Math.random() * (max - min + 1)) + min)
       setnewanswerModule(Math.floor(Math.random() * (max - min + 1)) + min)
       setnewQuesSetname(formName)
         setQuesRendered(false)
      navigator('/QuestionCreation')
    // setForms([...questionSetList, { name: formName, type: formType }]);
    //  setquestionSetList([...questionSetList, { name: formName, type: formType }]);
    setFormName('');
    setFormType('');
    setShowModal(false);
    setError('');

  };

  ///search bar data
  const filteredForms = questionSetList.filter(form =>
   
     form.setname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //delete question set---------------------

  const deleteQuesFunc=async(e,questionsetref)=>{
       setQuesRendered(true)
    //confirm delete
  const confirmDelete = window.confirm("Are you sure you want to Delete?")  
  if(confirmDelete === true){
  
  //update local questionsetlist
   //delete question-collection
    deleteDoc(doc(firestore,"question-collection",e))

      //get question-collection
      const questionSetlist = collection(firestore,"question-collection")
      const whereQuestionSet = query(questionSetlist,
        where("teacherid",'==',ProfileActive.teacherID),
        // where("questionsetref",'==',questionsetref)
      );
      const getquestionset = await getDocs(whereQuestionSet)
      const QuestionsetData = getquestionset.docs.map((doc)=>({
          id:doc.id,
        ...doc.data(),
       }))

    
       //get active-categories by questionsetref

       const questionActiveList = collection(firestore,"questions-activecategories")
       const whereQuestionactive = query(questionActiveList,
        where("questionsetref",'==',questionsetref)
       );

       const getquestionActive = await getDocs(whereQuestionactive)
       const questionActiveData = getquestionActive.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
       }))

         deleteDoc(doc(firestore,"questions-activecategories",questionActiveData[0].id))

    //get questions by questionsetref
        const questionList = collection(firestore,"questions")
        const whereQuestion = query(questionList,
          where("questionsetref",'==',questionsetref)
        );

        const getquestion = await getDocs(whereQuestion)
        const questionData = getquestion.docs.map((doc)=>({
          id:doc.id,
          ...doc.data()
        }))

        //get and delete answers by question's answermodule

        questionData.map(async(elementques,index)=>{

           const AnswerList = collection(firestore,"answers")
       const whereAnswer = query(AnswerList,
        where("answermodule",'==',elementques.answermodule)
       );

       const getanswerActive = await getDocs(whereAnswer)
       const answerData = getanswerActive.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
       }))

       //delete answers by docuid
       answerData.map((elementans,index)=>{
           deleteDoc(doc(firestore,"answers",elementans.id))
       })
       //delete questions by docuid
         deleteDoc(doc(firestore,"questions",elementques.id))

        });
        

  


      setquestionSetList(QuestionsetData)
        setQuesRendered(false)
   
  }
 
  }

  //edit setname only func--------------

   const [editFormName,seteditFormName]=useState('');
  const [editDocuid,setDocuid]=useState("")
  const [editIndex,seteditIndex]=useState(0)
   
  const editnamePend=(name,docuid,index)=>{

    console.log(name)
    console.log(docuid)
    console.log(index)
    seteditFormName(name)
    setDocuid(docuid)
    seteditIndex(index)
    setShowModal2(true)
  }

  const editnameFunc=async(e)=>{
       e.preventDefault()
         setQuesRendered(true)
   //edit to database

   const quesSetList = doc(firestore,"question-collection",editDocuid);

   //update name now

   await updateDoc(quesSetList,{
    questionsetref:questionSetList[editIndex].questionsetref,
    setname:editFormName,
    teacherid:questionSetList[editIndex].teacherid
   })

   //update local storage questionSetList

   const setUpdQuesList = {
    id:questionSetList[editIndex].id,
    questionsetref:questionSetList[editIndex].questionsetref,
    setname:editFormName,
    teacherid:questionSetList[editIndex].teacherid
   }
   const UpdatedQuesList = questionSetList.map((element,index)=>{
    return index===editIndex?setUpdQuesList : element
   })

   setquestionSetList(UpdatedQuesList)

     seteditFormName("")
    setDocuid("")
    seteditIndex(0)
   setShowModal2(false)
     setQuesRendered(false)

  }
 
  //edit set...............................
  

  useEffect(()=>{

    const docidgetforedit=async()=>{

    if(editPrevSet === true){
    //get document id for editing........

   //get all docid (answers, question-collection questions, questions-active categories)

   //question-collection..
   const questioncollectdblist = collection(firestore,"question-collection")
   const wherequestioncollection = query(questioncollectdblist,
    where('questionsetref','==',newquestionSetref)
  )
  const getquescollection = await getDocs(wherequestioncollection)
  const quescollectionData = getquescollection.docs.map((doc)=>({
    id:doc.id,
    ...doc.data(),
  }))
  quescollectionData.map((element,index)=>{
    setdocuIdquesCollect(...docuIdquesCollect,element.id)
  })

  //for questions..

  const questionsdblist = collection(firestore,"questions")
  const wherequestions = query(questionsdblist,
    where('questionsetref','==',newquestionSetref)
  )
  const getques = await getDocs(wherequestions)
  const quesData = getques.docs.map((doc)=>({
    id:doc.id,
    ...doc.data(),
  }))

    setdocuIdques(quesData.map(e => e.id))
  //answers..

  const allAnsIdPromise = await Promise.all(
  quesData.map(async(element,index)=>{

    const answerdblist = collection(firestore,"answers")
    const whereanswer = query(answerdblist,
      where('answermodule','==',element.answermodule)
    )
    const getans = await getDocs(whereanswer)
    const ansData = getans.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))


   return ansData.map(e => e.id);
  })
);
const flatIds = allAnsIdPromise.flat();
  setdocuIdanswer(flatIds);

  //questions-activecategories

  const quesactiveactdblist = collection(firestore,"questions-activecategories")
  const wherequesactive = query(quesactiveactdblist,
    where("questionsetref",'==',newquestionSetref)
  )
  const getquesact = await getDocs(wherequesactive)
  const quesactData = getquesact.docs.map((doc)=>({
     id:doc.id,
    ...doc.data()
  }))

  quesactData.map((element,index)=>{
     setdocuIdquesactiveCat(...docuIdquesactiveCat,element.id)
  })
}

}

  docidgetforedit()
 
  },[newquestionSetref])

  const QuesSeteditFunc=async(ref)=>{

     setdocuIdquesCollect([])
    setdocuIdques([])
    setdocuIdquesactiveCat([])
    setdocuIdanswer([])

   setnewquestionSetref(ref) 
   seteditPrevSet(true)
   navigator("/QuestionCreation")
  }

 //setup each set a category badge
  const getBadgeGrammar = (type) => {

    // const gram = quesSetActiveCategories[type].grammar
    // switch (gram) {
    //   case true: return <Badge bg="warning" className="me-1">G</Badge>;
    //   default: 
    // }
    //   return null;
  
  };

   const getBadgeVocabulary = (type) => {
    switch (type) {  
      case true: return <Badge bg="danger" className="me-1">V</Badge>;
      default: return null;
    }

  };

   const getBadgeSituational = (type) => {
    switch (type) {
      case true: return <Badge bg="primary" className="me-1">L</Badge>;
      default: return null;
    }

  };

 
    return(
        <>

        <div className={QuestionGenPageSt.QuestionContainer}>

        {/* header */}

          <nav className={QuestionGenPageSt.QuestionHeader}>
          
                 <ul className = {showNav ? QuestionGenPageSt.sidebarShow : QuestionGenPageSt.sidebarHide}>
                  <li onClick={()=>setshowNav(false)}><a><ImCross /></a></li>
                  <li><a>{ProfileActive.username}</a></li>
                  <li><a>Classroom</a></li>
                  <li><a>sdfsfsfsf</a></li>
                  <li><a>sdfsfsfsf</a></li>
                  <li><a>sdfsfsfsf</a></li>
                  
          
                 </ul>
          
                 <ul>
                  <li onClick={()=>console.log("df")}><a className={QuestionGenPageSt.Logoname}>LearnENG</a></li>
                  <li onClick={()=>navigator("/HelpNote")} className={QuestionGenPageSt.hideonMobile}><a>Help</a></li>
                  <li onClick={()=>navigator("/AboutPage")} className={QuestionGenPageSt.hideonMobile}><a> About us</a></li>
                  {/* <li onClick={()=>{}} className={QuestionGenPageSt.hideonMobile}></li> */}
                  <li className={QuestionGenPageSt.hideonMobile} onClick={()=>{ navigator('/Profilepage')
                   console.log(ProfileActive.id)}}><a>{currentAuth === false ? <PiWarningCircleFill color="red" /> : ''} Welcome, {ProfileActive.username}</a></li>
                  <li className={QuestionGenPageSt.navbtn} onClick={()=>setshowNav(true)}><a><TfiMenu/></a></li>
          
                 </ul>
          
                 </nav>

                {/*  start form */}

                
      <Container className="pt-4">
        <InputGroup className="my-3">
          <FormControl
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <div className="mb-3 d-flex align-items-center">
          <Card
            className="text-center"
            style={{ width: '250px', height: '140px', backgroundColor: '#f1f1f1', color: '#000', cursor: 'pointer' }}
            onClick={() => setShowModal(true)}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <div style={{ fontSize: '2rem' }}>+</div>
              <div>Create new form</div>
            </Card.Body>
          </Card>

          <div className="ms-4">
            <Badge bg="warning" className="me-2">G</Badge> Grammar
            <Badge bg="danger" className="mx-2">V</Badge> Vocabulary
            <Badge bg="primary">L</Badge> Logical
          </div>
        </div>

        <h6>Question set</h6>
        <Row>
          {filteredForms.map((form, idx) => (
            <Col key={idx} xs={6} md={4} lg={3} className="mb-4" >
              <Card style={{ backgroundColor: '#f1f1f1', color: '#000' }} >
                <Card.Body>
                  {/* {getBadgeGrammar(idx)} */}
                   {/* {getBadgeVocabulary(quesSetActiveCategories[idx])}
                  {getBadgeSituational(quesSetActiveCategories[idx])} */}
                  <Dropdown className="float-end">
                    <Dropdown.Toggle variant="light" size="sm" id="dropdown-basic">
                      ⋮
                    </Dropdown.Toggle>
                 
                    <Dropdown.Menu>
                      {/* <Dropdown.Item onClick={()=>editnameFunc(questionSetList[idx].id,idx)}>Edit Name</Dropdown.Item> */}
                       <Dropdown.Item onClick={()=>editnamePend(questionSetList[idx].setname,questionSetList[idx].id,idx)}>Edit Name</Dropdown.Item>
                      <Dropdown.Item onClick={()=>deleteQuesFunc(questionSetList[idx].id,questionSetList[idx].questionsetref)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Card.Title style={{cursor:'pointer'}} onClick={()=>QuesSeteditFunc(form.questionsetref)} className="mt-2">{form.setname}</Card.Title>
                  
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>


        {/* for create new form modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#a5b4fc' }}>
          <Modal.Title>Create new Form</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#1e40af', color: 'white' }}>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Form Name:</Form.Label>
              <Form.Control
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mt-3" controlId="formType">
              {/* <Form.Label>Question Type:</Form.Label> */}
              {/* <Form.Select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
              >
                <option value="">Select type</option>
                <option value="Grammar">Grammar</option>
                <option value="Vocabulary">Vocabulary</option>
                <option value="Logical">Logical</option>
              </Form.Select> */}
            </Form.Group>

            {error && <div className="mt-3 text-danger">{error}</div>}

            <div className="d-flex justify-content-between mt-4">
              <Button variant="primary" onClick={handleCreate}>Create</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Back</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

        {/* for edit name form modal */}

         <Modal show={showModal2} onHide={() => setShowModal2(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#a5b4fc' }}>
          <Modal.Title>Edit Name</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#1e40af', color: 'white' }}>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Form Name:</Form.Label>
              <Form.Control
                type="text"
                value={editFormName}
                onChange={(e) => seteditFormName(e.target.value)}
              />
            </Form.Group>

            

            {error && <div className="mt-3 text-danger">{error}</div>}

            <div className="d-flex justify-content-between mt-4">
              <Button variant="primary" onClick={editnameFunc}>Edit Now</Button>
              <Button variant="secondary" onClick={() => setShowModal2(false)}>Back</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* loading modal */}
    <Modal show = {QuesRendered} onHide={() => setQuesRendered(false)} centered>
    <Modal.Body style={{ color: 'white' }}>
     <div className="d-flex mb-3">
        <span style={{width:50,height:50,color:'black',color:'blue'}} class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  <span  style={{fontSize:30,color:'black'}} class="sr-only">Loading...</span>
      </div>
    </Modal.Body>
    </Modal>
    
                </div>

        </>
    )
}

export default QuestionGenPage;
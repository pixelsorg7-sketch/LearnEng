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
import {FaSave ,FaCog,FaPlus,FaPuzzlePiece , FaStar ,FaBook, FaCrown,FaChevronDown, FaSearch, FaArrowRight } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import DiceIcon from "../assets/Dice_Icon.png";
import SpellCreateSt from '../styleweb/SpellCreateSt.module.css'
import UploadIcon from "../assets/Upload_Icon.png";
import Background from '../assets/Category__Game_1_BG.png';
import LearnEngLogo from '../assets/LearnEngLG.png';
import UserIcon from '../assets/Admin_Icon.png';
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit, getDoc,doc} from '@firebase/firestore';
import { firestore, storage } from '../firebase';
import { v4 } from "uuid";
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
import { elements } from 'chart.js';
import { getStorage,ref, uploadBytes, getDownloadURL, updateMetadata,deleteObject  } from "firebase/storage";
import { AIinit } from '../firebase';
import { AiImage } from '../firebase';
import { GoogleGenAI } from "@google/genai";
import { toast } from "react-toastify";
import { CgSandClock } from "react-icons/cg";
const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });

const SpellCreate=()=>{

      const navigator = useNavigate();  //navigator
    const {ProfileActive,setProfileActive}=useContext(MyContext);

    
     const {holdSpellsetName,setholdSpellsetName}=useContext(MyContext)
const [setName, setSetName] = useState('');

  
  const [showModal, setShowModal] = useState(false);
  const [showImage,setshowImage]=useState(false);
  
  const [words, setWords] = useState([]);
  const [editingWord, setEditingWord] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [activeGearIndex, setActiveGearIndex] = useState(null);
  //create/edit textfield usestate
  const [wordtf, setWordtf] = useState('');
  const [descriptionTf,setdescriptionTf] = useState("");
  const [imageHold,setimageHold] = useState("");
  const [imageUrl,setimageUrl] = useState(null);
  const [scoreHold,setscoreHold] = useState(1);
  const [difficultyHold,setdifficultyHold] = useState("")

  //image deletion responses
   const [imagePrevUpload,setimagePrevUpload] = useState([])
  const [imageDeleted,setimageDeleted] = useState([])
  const [imageBacked,setimageBacked]=useState([])


  const {editPrevSet,seteditPrevSet}=useContext(MyContext); //activate edit mode
  const {randFruitCatcherVal,setrandFruitCatcherVal}=useContext(MyContext);

   const [spellingcollectDocid,setspellingcollectDocid]=useState(0)
   const [spellingDocid,setspellingDocid]=useState([]);

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

   //load selected spelling set

   useEffect(()=>{

    const renderSpell=async()=>{

    if(editPrevSet === true){

      setisLoading(true)
           //render setname's spelling collection
        const spellingsetdblist = collection(firestore,"spellings-collection")
        const wherespelling = query(spellingsetdblist,
         where("teacherid",'==',ProfileActive.teacherID),
         where("fruitcatcherval",'==',randFruitCatcherVal)
        );
        const getspellingset = await getDocs(wherespelling)
        const spellingData = getspellingset.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
         }))

         setspellingcollectDocid(spellingData[0].id)
         setholdSpellsetName(spellingData[0].setname)
        
       //render spellings

       const spellingdblist = collection(firestore,"spellings")
        const wherespell = query(spellingdblist,
         where("fruitcatcherval",'==',randFruitCatcherVal),
          where("teacherid",'==',ProfileActive.teacherID)
        );
        const getspelling = await getDocs(wherespell)
        const spellData = getspelling.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
         }))

        const spellings = spellData.map((element)=> element)
        setWords(spellings)

         const ids = spellData.map((element)=>element.id);
         setspellingDocid(ids)

    }

    setisLoading(false)

    }

    renderSpell()

   },[])

   //functions------------------

   //confirm modal note

   
// function ConfirmModal({ message, onConfirm, onCancel }) {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
//         <h2 className="text-lg font-semibold">{message}</h2>
//         <div className="mt-4 flex justify-end gap-3">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 rounded-xl border hover:bg-gray-100"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

   //open modify modal for create
   const openModifyModal=()=>{

    setWordtf("")
    setdescriptionTf("")
    setimageHold("")
    setimageUrl(null)
    setscoreHold(1)
    setdifficultyHold("")
    setShowModal(true) 
   }

   //add word - edit/create
  const handleAddWord = () => {
  const trimmedWord = wordtf.trim();

  if (!/^[a-zA-Z]+$/.test(trimmedWord)) {
    // alert("❌ Only letters A-Z are allowed!");
      toast.error(" Only letters A-Z are allowed!", {
      position:'top-center',   
      autoClose: 3000,      
     hideProgressBar: false,
     closeButton:false,
   pauseOnHover: false,
   draggable: false,
   });
    return;
  }

  const isDuplicate = words.some((w) => w.word.toUpperCase() === trimmedWord.toUpperCase());
  if (isDuplicate) {
    // alert("❌ That word is already registered!");
    toast.error(" That word is already registered!", {
      position:'top-center',   
      autoClose: 3000,      
     hideProgressBar: false,
     closeButton:false,
   pauseOnHover: false,
   draggable: false,
   });
    return;
  }

  if(descriptionTf === "" || imageHold === "" || imageUrl === null || difficultyHold === ""){
        // alert("❌ Empty field/s!");
        toast.error("Empty field/s!", {
      position:'top-center',   
      autoClose: 3000,      
     hideProgressBar: false,
     closeButton:false,
   pauseOnHover: false,
   draggable: false,
   });
        return;
  }

  setWords([
   ...words,
   {
      word:wordtf,
      description:descriptionTf,
      imagepath:imageHold,
      imageurl:imageUrl,
      score:scoreHold,
      difficulty:difficultyHold
    },
  ]);

  setEditIndex(null)
  setShowModal(false)


};

  const handleDelete = async(index) => {

    const { word,imagepath } = words[index];
      if (window.confirm(`Delete "${word}" from this list? This cannot be undone.`)) {
     //image 

     
      setWords((prev) => prev.filter((_, i) => i !== index));
     setEditIndex(null)
    setActiveGearIndex(null);
    }
 
    
  };

  //open menu
   const openMenu = (idx) => setActiveGearIndex(activeGearIndex === idx ? null : idx);

  const handleEdit =async (idx) => {

    console.log(idx)
    const w = words[idx]
    setWordtf(w.word)
    setdescriptionTf(w.description)
    setimageHold(w.imagepath)
 
    setscoreHold(w.score)
    setdifficultyHold(w.difficulty) 
    setEditIndex(idx)
    setShowModal(true)
   const imageRef = ref(storage,w.imagepath);
  const url = await getDownloadURL(imageRef);
  setimageUrl(url)
  setActiveGearIndex(null)
  };

  const handleSaveEdit = () => {
  const trimmedEdit = wordtf.trim();

  //validations
  if (!/^[a-zA-Z]+$/.test(trimmedEdit)) {
    // alert("❌ Only letters A-Z are allowed!");
    toast.error("Only letters A-Z are allowed!", {
      position:'top-center',   
      autoClose: 3000,      
     hideProgressBar: false,
     closeButton:false,
   pauseOnHover: false,
   draggable: false,
   });
    return;
  }

  

  const isDuplicate = words.some((w, idx) =>
    idx !== editIndex && w.word.toUpperCase() === trimmedEdit.toUpperCase()
  );

  if (isDuplicate) {
    // alert("❌ This word already exists in the list!");
     toast.error(" This word already exists in the list!", {
      position:'top-center',   
      autoClose: 3000,      
     hideProgressBar: false,
     closeButton:false,
   pauseOnHover: false,
   draggable: false,
   });
    return;
  }

    if(descriptionTf === "" || imageHold === "" || imageUrl === null || difficultyHold === ""){
        // alert("❌ Empty field/s!");
        toast.error(" Empty field/s!", {
      position:'top-center',   
      autoClose: 3000,      
     hideProgressBar: false,
     closeButton:false,
   pauseOnHover: false,
   draggable: false,
   });
        return;
  }

  //update now

  setWords((prev)=>{
   const copy = [...prev];
   copy[editIndex] = {
      word:wordtf,
      description:descriptionTf,
      imagepath:imageHold,
      imageurl:imageUrl,
      score:scoreHold,
      difficulty:difficultyHold
    };
    return copy;
  });
  setEditIndex(null)
  setShowModal(false)

   setWordtf("")
    setdescriptionTf("")
    setimageHold("")
    setimageUrl(null)
    setscoreHold(1)
    setdifficultyHold("")

};

//upload image func 

const onChooseFile = async(file)=>{

  let randImageCode = v4()


    const imageRef = ref(storage, `gameassets/image/${"Spelling-img" + " " + randImageCode + " " + file.name}`);
     uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url)=>{
     setimageHold(`gameassets/image/${"Spelling-img" + " " + randImageCode + " " + file.name}`)
     setimageUrl(url)
      })
     });


 

  // }

};

//save collection

const saveChanges=async()=>{


  setisLoading(true)
  //check if have any content

  if(words.length === 0){
    toast.error(`Please add any content`, {
      position:'top-center',   
      autoClose: 3000,      
   hideProgressBar: false,
  closeButton:false,
  pauseOnHover: false,
    draggable: false,
     })
    return;
  }

     if(editPrevSet === true){ //if edited 0> delete previous record

    spellingDocid.map((element,index)=>{ //get docid to delete old record and replace to a new one
    deleteDoc(doc(firestore,"spellings",element))
    })

    deleteDoc(doc(firestore,"spellings-collection",spellingcollectDocid))

    }


    //add word/s
    words.map((element)=>{ 
   addDoc(collection(firestore,"spellings"),{
    fruitcatcherval:randFruitCatcherVal,
    word:element.word,
    description:element.description,
    imagepath:element.imagepath,
    score:element.score,
    difficulty:element.difficulty,
    teacherid:ProfileActive.teacherID
    })
    })

    //add word collection

    addDoc(collection(firestore,"spellings-collection"),{
        fruitcatcherval:randFruitCatcherVal,
        setname: holdSpellsetName,
        teacherid:ProfileActive.teacherID,
        gradelevel:ProfileActive.gradelevel,
        isarchived:false,
        teacherid:ProfileActive.teacherID
    })

  //delete panel removed / cancelled image


    toast.success(`Spellings saved successfully!`, {
      position:'top-center',   
      autoClose: 3000,      
   hideProgressBar: false,
  closeButton:false,
  pauseOnHover: false,
    draggable: false,
     });
    setWords([])
    setrandFruitCatcherVal(0)
    setholdSpellsetName("")
    seteditPrevSet(false)
      setisLoading(false)
    navigator("/SpellCreateSelect")


}


//back func

const backbtnFunc=async()=>{

    
setWords([])
setholdSpellsetName("")
setrandFruitCatcherVal(0)
seteditPrevSet(false)
navigator("/SpellCreateSelect")

}

//AI assist
const [aiLoading,setaiLoading]=useState(false)

const aiAssist=async(difficulty)=>{

    let randImageCode = v4()
    
  if(difficulty === ""){
    toast.error("Select a difficulty first and generate", {
     position:'top-center',   
       autoClose: 3000,      
    hideProgressBar: false,
    closeButton:false,
    pauseOnHover: false,
       draggable: false,
       });
       return;
  }
  setaiLoading(true)

  try{
  let wordAi = ""

  const prompt1 = `Generate me one word sutiable for spelling ranging grades 2-4. Straight to the point. Without asterisk pls. Capital letter only. Think of a new word everytime i generate.Difficulty ${difficulty}.`
  const result1 = await AIinit.generateContent(prompt1)
  const response = result1.response

    setWordtf(response.candidates[0].content.parts[0].text)
    wordAi = response.candidates[0].content.parts[0].text

  const prompt2 = ` meaning of ${wordAi}. straight to the point. Without the actual word needed. no asterisk. no paragraph spacing`
  const result2 = await AIinit.generateContent(prompt2)
  const response2 = result2.response


      setdescriptionTf(response2.candidates[0].content.parts[0].text)

    //generate image

    const promptImg =  `
Generate a colorful, cartoon-style illustration that visually represents the concept or meaning of the word: "${wordAi}". 
Do NOT include any text, letters, or the actual word itself in the image. 
Make it simple, clear, and child-friendly — like an educational picture for a spelling lesson.
`;

const responseimg = await AiImage.generateImages(promptImg);
const resimage = responseimg.images[0];


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

const imageRef = ref(storage,`gameassets/image/Spelling-img-${randImageCode}-AI.png`)
const snapshot = await uploadBytes(imageRef,blob,{contentType:mimeType});
const url = await getDownloadURL(snapshot.ref);

setimageHold(snapshot.metadata.fullPath)
setimageUrl(url)
}
catch(e){ //error generating
  console.log(e)

  toast.error(`Error generating. Pls try again Later`, {
     position:'top-center',   
       autoClose: 3000,      
    hideProgressBar: false,
    closeButton:false,
    pauseOnHover: false,
       draggable: false,
       });

}
    setaiLoading(false)
  
}

//cancel func

const cancelFunc =async ()=>{

  try{
  }
  catch(e){
    console.log("error")
  }
  if(aiLoading){
    return '';
  }

    setShowModal(false)
    setEditIndex(null)
}


const ConfirmSelect=()=>{

  if(aiLoading){
    return true
  }

  if(
    wordtf === "" ||
    // imagePrevUpload === null ||
    imageHold === "" ||
    imageUrl === null ||
    descriptionTf === "" ||
    difficultyHold === "" 
  ){
 
    return true;
   

  }

  return false;
}


    return(
        <>

         <div className={SpellCreateSt.fbBg} style={{ backgroundImage: `url(${Background})` }}>
      {/* Header */}
         <div className={SpellCreateSt.header}>
                    <img src={LearnEngLogo} alt="LearnENG Logo" className={SpellCreateSt.logo} />
            
                    <div className={SpellCreateSt.userDropdown} >
                      <button
                        className={SpellCreateSt.userToggle}
                        onClick={() => setDropdownOpen((v) => !v)}
                      >
                        <span className={SpellCreateSt.welcomeText}>Welcome, {ProfileActive.username}!</span>
                        <img src={UserIcon} alt="User Icon" className={SpellCreateSt.userIcon} />
                      </button>
            
                      {dropdownOpen && (
                        <div className={SpellCreateSt.dropdownCustom}>
                          <button
                            className={SpellCreateSt.dropdownItem}
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
      <div className={SpellCreateSt.fbBackWrap}>
        <button className={SpellCreateSt.fbBack} onClick={backbtnFunc}>Back</button>
      </div>

      {/* Main */}
      <Container className={SpellCreateSt.fbOuter}>
        <h3 className={SpellCreateSt.fbTitle}>
          Assessment No.  {holdSpellsetName}– <span>Word List</span>
        </h3>

        <div className={SpellCreateSt.fbInner}>
          <div className={SpellCreateSt.fbListScroll} >
            {words.map((w, idx) => (
              <div key={w.id} className={SpellCreateSt.fbRow}>
                <button className={SpellCreateSt.fbRowMain} onClick={()=>handleEdit(idx)}>
                  <span className={SpellCreateSt.fbRowName}>{w.word}</span>
                </button>

                <button
                  className={SpellCreateSt.fbGearBtn}
                  aria-expanded={activeGearIndex === idx}
                  title="Options"
                  onClick={() => openMenu(idx)}
                >
                  <FaCog />
                </button>

                {activeGearIndex === idx && (
                  <div className={SpellCreateSt.fbMenu}>
                    <button onClick={()=>handleEdit(idx)} >Edit</button>
                    <button onClick={()=>handleDelete(idx)} className={SpellCreateSt.danger}>Delete</button>
                  </div>
                )}
              </div>
            ))}

            {words.length === 0 && (
              <div className="text-center text-muted py-4">No words yet — add one below.</div>
            )}
          </div>
        </div>
        <div className="d-flex gap-3">
        <Button className={SpellCreateSt.fbCreate} onClick={openModifyModal}>
          <FaPlus className="me-2" />
          Create New
        </Button>
         <Button className={SpellCreateSt.fbCreate} onClick={saveChanges}>
          <FaSave className="me-2" />
         Save changes
        </Button>
        </div>
      </Container>

      {/* Unified CREATE/EDIT modal */}
      <Modal show={showModal} onHide={cancelFunc} centered dialogClassName={SpellCreateSt.bigModal}>
        <div className={SpellCreateSt.editCard}>
          <div className={SpellCreateSt.editHead}>
            <button disabled={aiLoading} className={SpellCreateSt.closeRound} onClick={cancelFunc} aria-label="Close">×</button>
            <h4>Fruit Basket – Assessment No. 1111</h4>
          </div>

          <div className={SpellCreateSt.editGrid}>
            {/* LEFT */}
            <div>
              {/* Word + Dice */}
              <div className={SpellCreateSt.formRow}>
                <label className={SpellCreateSt.label} htmlFor="fbWord">* Input Word:</label>
                <div className={SpellCreateSt.wordWrap}>
                  <input
                    id="fbWord"
                    className={SpellCreateSt.wordInput}
                    value={aiLoading ? "Generating word..." : wordtf}
                    onChange={(e) => setWordtf(e.target.value.toUpperCase().slice(0, 30))}
                    placeholder="Enter word…"
                    disabled={aiLoading}
                  />
                  <Button
                  disabled={aiLoading}
                    className={SpellCreateSt.diceBtn}
                    onClick={()=>aiAssist(difficultyHold)}
                    // disabled={aiLoading}
                  >
                    {aiLoading ? <CgSandClock color='green' size={25}/> : <img src={DiceIcon} alt="" />}
                    {/* <img src={DiceIcon} alt="" /> */}
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className={SpellCreateSt.formRow}>
                <label className={SpellCreateSt.label} htmlFor="fbDesc" aria-hidden />
                <div className={SpellCreateSt.descWrap}>
                  <textarea
                  disabled={aiLoading}
                    id="fbDesc"
                    className={SpellCreateSt.desc}
                    rows={5}
                    value={ aiLoading ? "Generating Description..." : descriptionTf}
                    placeholder="Write a short, 1-sentence explanation (end with a period)."
                    onChange={(e) => setdescriptionTf(e.target.value.slice(0, 180))}
                  />
                  <div className={SpellCreateSt.counter}>Limit 180 char.</div>
                </div>
              </div>

              {/* Upload */}
              <div className={SpellCreateSt.formRow}>
                <label className={SpellCreateSt.label} aria-hidden />
                <div className={SpellCreateSt.actionsRow}>
                  <label className={SpellCreateSt.uploadBtn}>
                    <span className={SpellCreateSt.upIconWrap}> {aiLoading ?  <CgSandClock color='green' size={20}/> :<img src={UploadIcon} alt="" />}</span>
                  { aiLoading ? "Generating Image..." :  " * Upload Image "}
                    <input disabled={aiLoading} type="file" accept="image/*" onChange={(e)=>{
                       const file = e.target.files[0];
                      if (e.target.files[0]) {
                        const maxSize = 15 * 1024 * 1024; // 2 MB in bytes
                        if (file.size > maxSize) {
                          // alert("File is too large! Maximum allowed size is 15 MB.");
                          toast.error("File is too large! Maximum allowed size is 15 MB.", {
                                position:'top-center',   
                                autoClose: 3000,      
                             hideProgressBar: false,
                            closeButton:false,
                            pauseOnHover: false,
                              draggable: false,
                               });
                          return;
                        }
                      onChooseFile(e.target.files[0])
                       }
                      }}  style={{ display: "none" }} />
                  </label>
                  {imageUrl && (
                    <a className={SpellCreateSt.viewInline} onClick={()=>{ aiLoading ? setshowImage(false) : setshowImage(true)}} target="_blank" rel="noreferrer">
                     { aiLoading ? "Renewing Image..." : "View Image" }
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className={SpellCreateSt.rightCol}>
              <div className={SpellCreateSt.pointsBlock}>
                <span className={SpellCreateSt.pointsLabel}>* Set Points:</span>
                <div className={SpellCreateSt.stepper}>
                  <button className={SpellCreateSt.stepBtn} disabled={aiLoading} onClick={scoreHold > 1 ? ()=>setscoreHold(scoreHold - 1) : ()=>setscoreHold(scoreHold)} type="button" >–</button>
                  <input className={SpellCreateSt.stepValue} value={scoreHold}  readOnly />
                  <button className={SpellCreateSt.stepBtn} disabled={aiLoading} onClick={scoreHold < 5 ? ()=>setscoreHold(scoreHold + 1) : ()=>setscoreHold(scoreHold)} type="button" >+</button>
                </div>
              </div>

              <div className={SpellCreateSt.diffBlock}>
                <span className={SpellCreateSt.diffTitle}>* Select Difficulty:</span>
                <label className={SpellCreateSt.radio}>
                  <input
                    type="radio"
                    name="diff"
                    disabled={aiLoading}
                    checked={difficultyHold === "easy"}
                    onChange={() => setdifficultyHold("easy")}
                  />
                  <span>Easy</span>
                </label>
                <label className={SpellCreateSt.radio}>
                  <input
                    type="radio"
                    name="diff"
                    disabled={aiLoading}
                    checked={difficultyHold === "medium"}
                    onChange={() => setdifficultyHold("medium")}
                  />
                  <span>Medium</span>
                </label>
                <label className={SpellCreateSt.radio}>
                  <input
                    type="radio"
                    name="diff"
                    disabled={aiLoading}
                    checked={difficultyHold === "hard"}
                    onChange={() => setdifficultyHold("hard")}
                  />
                  <span>Hard</span>
                </label>
              </div>
            </div>
          </div>

          <div className={SpellCreateSt.footerRow}>
            <button disabled={aiLoading} type="button" className={SpellCreateSt.secondaryBtn} onClick={cancelFunc}>
              Cancel
            </button>
            <button disabled={ConfirmSelect()} type="button"  onClick={editIndex === null ?  handleAddWord : handleSaveEdit} className={SpellCreateSt.saveBtn} >
             <h2> {editIndex === null ? "ADD WORD" : "SAVE"}</h2> 

            </button>
          </div>
        </div>
      </Modal>


{/*   view image */}

<Modal show={showImage} onHide={()=>setshowImage(false)} centered>

     <div className={SpellCreateSt.viewImagecard}>
     <img style = {{width:200,height:200}} src={imageUrl}/>
     </div>

</Modal>

 {/* modal loading */}
              <Modal show={isLoading} backdrop="static" centered>
              <Modal.Body className="text-center">
                 <div className={SpellCreateSt.customloader}></div>
                <p className="mt-3 mb-0 fw-bold">Loading Assessment</p>
              </Modal.Body>
            </Modal>

    </div>

      

        </>
    )
}

export default SpellCreate;
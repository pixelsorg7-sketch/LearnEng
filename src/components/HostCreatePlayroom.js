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
import { FaStar ,FaBook, FaCrown,FaChevronDown, FaSearch, FaArrowRight } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion } from "react-icons/fa6";

import HostCreatePlayroomSt from '../styleweb/HostCreatePlayroomSt.module.css'

import Background from '../assets/Category__Game_1_BG.png';
import LearnEngLogo from '../assets/LearnEngLG.png';
import UserIcon from '../assets/Admin_Icon.png';
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit,ref, getDoc,doc,serverTimestamp } from '@firebase/firestore';
import { firestore } from '../firebase';
import { toast } from "react-toastify";

const HostCreatePlayroom=()=>{

       const navigator = useNavigate();  //navigator


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
              navigator("/HostPlayroom")
              setSelectedTypes([])
             }
           },[])
    //useState
    const {ProfileActive,setProfileActive}=useContext(MyContext);

        const [dropdownOpen, setDropdownOpen] = useState(false);

    //  const gameSets = [
    //     { name: "Set 1", gameType: "fruitBasket" },
    //     { name: "Set 2", gameType: "wordMatch" },
    //     { name: "Set 3", gameType: "game3" },
    //     { name: "Set 4", gameType: "fruitBasket" },
    //     { name: "Set 5", gameType: "wordMatch" },
        
    // ];

    //useState-----------
    const [gameSets,setgameSets]=useState([]);
    const [filtergameSets,setfiltergameSets]=useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    //game selected
    const [selectedGame1,setselectedGame1]=useState(null)
    const [selectedGame2,setselectedGame2]=useState(null)
    const [selectedGame3,setselectedGame3]=useState(null)
    //time and date
      const [time, setTime] = useState({ hour: "", minute: "", period: "AM" });
      const [date, setDate] = useState("");
    //code
    const [code, setCode] = useState("");

    //room name

    const [roomName,setroomName]=useState("")

    useEffect(()=>{

        const renderallAvailsets=async()=>{

        if (!ProfileActive?.gradelevel) return;
       //get grammar-collection
        const grammarcollectdblist = collection(firestore,"grammar-collection")
        const wheregrammarcollect = query(grammarcollectdblist,
            where("teacherid",'==',ProfileActive.teacherID)
        );
        const getgrammarcollect = await getDocs(wheregrammarcollect)
        const grammarcollectdata = getgrammarcollect.docs.map((doc)=>({
            id:doc.id,
         ...doc.data(),
         type:'grammar'
        }))
        //get spelling-collection
        const spellingsetdblist = collection(firestore,"spellings-collection")
        const wherespelling = query(spellingsetdblist,
            where("teacherid",'==',ProfileActive.teacherID),
        );
        const getspellingset = await getDocs(wherespelling)
        const spellingData = getspellingset.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
            type:'spelling'
             }))

        //get comprehension-collection

        const getreadingdblist = collection(firestore,"comprehension-collection")
        const wherereading = query(getreadingdblist,
            where("teacherid",'==',ProfileActive.teacherID)
        );
        const getreadingset = await getDocs(wherereading)
        const readingdata = getreadingset.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
            type:'comprehension'
        }))

     const combinedData = [...grammarcollectdata, ...spellingData,...readingdata];  

     setgameSets(combinedData)
     setfiltergameSets(combinedData)


        }

        renderallAvailsets()

    },[])

    //random generate code
    const generateCode = () => {
     const min = Math.ceil(0);   // Ensure min is an integer (rounds up)
   const max = Math.floor(999999);  // Ensure max is an integer (rounds down)
    setCode(Math.floor(Math.random() * (max - min + 1)) + min);
   };

   //selected game type/s

   const selectedGameTypes=(gametype,fruitval,secondval,thirdval,setname)=>{


   if(gametype === "spelling"){

    const holdSpelldata={
        fruitcatcherval:fruitval,
        setname:setname
    }

    setselectedGame1(holdSpelldata)

   }

   else if(gametype === "grammar"){

      const holdGrammardata={
        secondgameval:secondval,
        setname:setname
    }


    setselectedGame2(holdGrammardata)
   }

   else if(gametype === "comprehension"){
        const holdreadingData={
         thirdgameval:thirdval,
         setname:setname
        }
    setselectedGame3(holdreadingData)
   }

   }

   //save changes

   const saveChanges=async()=>{
   
    //validations
     if (selectedGame1 === null && selectedGame2 === null && selectedGame3 === null) {
        // window.alert("Pls select a form")
         toast.error("Pls select a form", {
            position:'top-center',   
          autoClose: 3000,      
        hideProgressBar: false,
        closeButton:false,
      pauseOnHover: false,
      draggable: false,
       })
      return;
    }
    if(code === ""){
    //  window.alert("Pls Enter a code")
     toast.error("Pls Enter a code", {
            position:'top-center',   
          autoClose: 3000,      
        hideProgressBar: false,
        closeButton:false,
      pauseOnHover: false,
      draggable: false,
       })
      return;
    }
    if(time.hour === "" || time.minute === "" || date === ""){
    // window.alert("Fill up date and time")
     toast.error("Fill up date and time", {
            position:'top-center',   
          autoClose: 3000,      
        hideProgressBar: false,
        closeButton:false,
      pauseOnHover: false,
      draggable: false,
       })
      return;
    }

    if(roomName === ""){
        // window.alert("Empty room name")
         toast.error("Empty room name", {
            position:'top-center',   
          autoClose: 3000,      
        hideProgressBar: false,
        closeButton:false,
      pauseOnHover: false,
      draggable: false,
       })
        return;
    }

    //create room now

    const dateValue = date + " " + time.hour +":"+ time.minute +" " + time.period //combine ddate and time
    const datern = new Date(dateValue) //convert to date

    let spellingeasy = false
    let spellingmedium = false
    let spellinghard = false

    let grammareasy = false
    let grammarmedium = false
    let grammarhard = false
    //get all category assessment list-----


    //for grammar checking difficulty

    if(selectedGame2!=null){

    
     const grammardblist = collection(firestore,"grammar")
        const wheregrammar = query(grammardblist,
            where("secondgameval",'==',selectedGame2.secondgameval)
        );
 const getgrammar = await getDocs(wheregrammar)
 getgrammar.docs.forEach((doc) => {
  const data = doc.data();
  switch(data.difficulty){
    case "easy":
        grammareasy = true
        break;
    case "medium":
        grammarmedium = true
        break;
    case "hard":
        grammarhard = true
        break;
    default:
    // do nothing
    break;
  }
});
}


//for spelling checking difficulty
  if(selectedGame1!=null){
 const spellingdblist = collection(firestore,"spellings")
        const wherespelling = query(spellingdblist,
            where("fruitcatcherval",'==',selectedGame1.fruitcatcherval)
        );
 const getspelling = await getDocs(wherespelling)
 getspelling.docs.forEach((doc) => {
  const data = doc.data();
  switch(data.difficulty){
    case "easy":
        spellingeasy = true
        break;
    case "medium":
        spellingmedium = true
        break;
    case "hard":
        spellinghard = true
        break;
    default:
    // do nothing
    break;
  }
});
}

//check if have duplicate room name

 const joinroomdblist = collection(firestore,"joinroom")
        const wherejoinroom = query(joinroomdblist,
          where('roomname','==',roomName)
         )
            
         const getjoinroom = await getDocs(wherejoinroom)
         const joinroomdata = getjoinroom.docs.map((doc)=>({
           id:doc.id,
           ...doc.data(),
         }))

         if(joinroomdata.length > 0){
            // alert("Room name already exist")
             toast.error("Room name already exist", {
            position:'top-center',   
          autoClose: 3000,      
        hideProgressBar: false,
        closeButton:false,
      pauseOnHover: false,
      draggable: false,
       })
            
            return;
         }

    //add to joinroom
    addDoc(collection(firestore,"joinroom"),{
        roomcode:code,
        teacherid:ProfileActive.teacherID,
        timeopen:datern,
        gradelevel:ProfileActive.gradelevel,
        roomname:roomName,
        dateissued: serverTimestamp()
    })

    // add to joinroom activegame

    addDoc(collection(firestore,"joinroom-activegame"),{
        activefruitcatcher:selectedGame1 !== null ? true : false,
        activesecondgame:selectedGame2 !== null ? true : false,
        activethirdgame:selectedGame3 !== null ? true : false,
        fruitcatcherval:selectedGame1 !== null ? selectedGame1.fruitcatcherval : 0,
        secondgameval:selectedGame2 !== null ? selectedGame2.secondgameval : 0,
        thirdgameval:selectedGame3 !== null ? selectedGame3.thirdgameval : 0,
        grammareasy:grammareasy,
        grammarmedium:grammarmedium,
        grammarhard:grammarhard,
        spellingeasy:spellingeasy,
        spellingmedium:spellingmedium,
        spellinghard:spellinghard,
        roomcode:code,
        teacherid:ProfileActive.teacherID
    })

   setSelectedTypes([])
    // window.alert("Room created")
     toast.success("Room created", {
            position:'top-center',   
          autoClose: 3000,      
        hideProgressBar: false,
        closeButton:false,
      pauseOnHover: false,
      draggable: false,
       })
    navigator("/HostPlayroom")
   
   }

    //sort color
    const getDotColorClass = (gameType) => {
        switch (gameType) {
            case "spelling": return  HostCreatePlayroomSt.dotblue;
            case "grammar": return  HostCreatePlayroomSt.dotorange;
            case "comprehension": return  HostCreatePlayroomSt.dotpurple;
            default: return "";
        }
    };

    //filter by gameplay

    const handleCheckboxChange = (type) => {
  setSelectedTypes(prev => {
    if (prev.includes(type)) {
      return prev.filter(t => t !== type); // uncheck
    } else {
      return [...prev, type]; // check
    }
  });
};

useEffect(() => {
  if (selectedTypes.length === 0) {
    setfiltergameSets(gameSets); // if no filter, show all
  } else {
    const filtered = gameSets.filter(item => selectedTypes.includes(item.type));
    setfiltergameSets(filtered);
  }
}, [selectedTypes, filtergameSets]);
    return(
        <>

         <div className={HostCreatePlayroomSt.CreateHostPlayroomContainer}>
         
               <div className={HostCreatePlayroomSt.header}>
                          <img src={LearnEngLogo} alt="LearnENG Logo" className={HostCreatePlayroomSt.logo} />
                  
                          <div className={HostCreatePlayroomSt.userDropdown} >
                            <button
                              className={HostCreatePlayroomSt.userToggle}
                              onClick={() => setDropdownOpen((v) => !v)}
                            >
                              <span className={HostCreatePlayroomSt.welcomeText}>Welcome, {ProfileActive.username}!</span>
                              <img src={UserIcon} alt="User Icon" className={HostCreatePlayroomSt.userIcon} />
                            </button>
                  
                            {dropdownOpen && (
                              <div className={HostCreatePlayroomSt.dropdownCustom}>
                                <button
                                  className={HostCreatePlayroomSt.dropdownItem}
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

                        
            <div className={HostCreatePlayroomSt.buttonRow}>
                <button onClick={()=>{navigator("/HostPlayroom")
                setSelectedTypes([])
                }} className={HostCreatePlayroomSt.backButton}>Back</button>
            </div>

            <div className={HostCreatePlayroomSt.mainContentBox}>
                <div className={HostCreatePlayroomSt.gameSetupSection}>
                    <div className={HostCreatePlayroomSt.gameAssessments}>
                        <h3>Game Assessments:</h3>
                        <div className={HostCreatePlayroomSt.checkboxGroup}>
                            <input type="checkbox" id="fruitBasket" name="gameAssessment" value="fruitBasket" onClick={()=>setselectedGame1(null)}  checked={selectedGame1 === null ? false : true} />
                            <label htmlFor="fruitBasket">
                                <span className={`${HostCreatePlayroomSt.gameDot} ${HostCreatePlayroomSt.dotblue}`}></span> Fruit Basket
                            </label>
                          <div style = {{width:'200px',height:'50px',alignContent:'center',overflowY:'auto'}}><span style={{ margin: '0 0px' }}>|| {selectedGame1?.setname}</span></div>
                        </div>
                        <div className={HostCreatePlayroomSt.checkboxGroup}>
                            <input type="checkbox" id="wordMatch" name="gameAssessment" value="wordMatch" onClick={()=>setselectedGame2(null)} checked={selectedGame2 === null ? false : true} />
                            <label htmlFor="wordMatch">
                                <span className={`${HostCreatePlayroomSt.gameDot} ${HostCreatePlayroomSt.dotorange}`}></span> Word Match
                            </label>
                           
                          <div style = {{width:'200px',height:'50px',alignContent:'center',overflowY:'auto'}}><span style={{ margin: '0 0px' }}>|| {selectedGame2?.setname}</span></div> 
                        </div>
                        <div className={HostCreatePlayroomSt.checkboxGroup}>
                            <input type="checkbox" id="game3" name="gameAssessment" value="game3" onClick={()=>setselectedGame3(null)}  checked={selectedGame3 === null ? false : true} />
                            <label htmlFor="game3">
                                <span className={`${HostCreatePlayroomSt.gameDot} ${HostCreatePlayroomSt.dotpurple}`}></span> Readventure
                            </label>
                            
                          <div style = {{width:'200px',height:'50px',alignContent:'center',overflowY:'auto'}}><span style={{ margin: '0 0px' }}>|| {selectedGame3?.setname}</span></div>
                        </div>
                    </div>

                    <div className={HostCreatePlayroomSt.timeDateCodeSection}>
                        <div className={HostCreatePlayroomSt.inputRow}>
                            <label>Set Open Time:</label>
                            <div className={HostCreatePlayroomSt.timeInputGroup}>
                                <input  type='number' placeholder="HH" value={time.hour > 12 ? 1 : time.hour && time.hour < 1 ? 1 : time.hour}
                                 className={`${HostCreatePlayroomSt.timeInput} ${HostCreatePlayroomSt.smallInput}`} 
                                onChange={(e) => setTime({ ...time, hour: e.target.value })}
                                 />
                               
                                <input type="number" placeholder="MM"  value={time.minute > 59 ? 0: time.minute && time.minute < 0 ? 0: time.minute} 
                                className={`${HostCreatePlayroomSt.timeInput} ${HostCreatePlayroomSt.smallInput}`}
                                onChange={(e) => setTime({ ...time, minute: e.target.value })}
                                />
                                
                                {/* <input type="text" placeholder="PM" maxLength="2"  /> */}
                                <select value={time.period} className={`${HostCreatePlayroomSt.timeInput} ${HostCreatePlayroomSt.extraSmallInput}`}
                                onChange={(e) => setTime({ ...time, period: e.target.value })}>

                                 <option>AM</option>
                                 <option>PM</option>

                                </select>
                            </div>
                        </div>

                        <div className={HostCreatePlayroomSt.inputRow}>
                            <label>Set Open Date:</label>
                            <div className={HostCreatePlayroomSt.dateInputGroup}>
                                <input type="date" value={date} placeholder="dd/mm/yyyy" className={HostCreatePlayroomSt.dateInput}  onChange={(e) => setDate(e.target.value)} />
                                📅
                            </div>
                        </div>

                        {/* NEW WRAPPER FOR GAME CODE AND BUTTON */}
                        <div className={`${HostCreatePlayroomSt.inputRow} ${HostCreatePlayroomSt.gameCodeInputButtonRow}`}> {/* Added gameCodeInputButtonRow class */}
                            <label>Game Code:</label>
                            <input type="text" value={code} className={HostCreatePlayroomSt.gameCodeInput} />
                            <button onClick={generateCode} className={HostCreatePlayroomSt.generateCodeButton}>Generate Code</button>
                        </div>

                        <div className={`${HostCreatePlayroomSt.inputRow} ${HostCreatePlayroomSt.gameCodeInputButtonRow}`}> {/* Added gameCodeInputButtonRow class */}
                            <label>Room Name:</label>
                            <input type="text" value={roomName} className={HostCreatePlayroomSt.gameCodeInput} onChange={(e)=>setroomName(e.target.value)} />
                        </div>
                        {/* The button is now inside the new row, so no separate button here */}
                    </div>
                </div>

                <h3 className={HostCreatePlayroomSt.selectGameSetsTitle}>Select Game Sets:</h3>
                <div className={HostCreatePlayroomSt.filterCheckcon}>
                <label>Sort by:</label>
                <label>
                <input 
                    type="checkbox" 
                    checked={selectedTypes.includes("grammar")} 
                    onChange={() => handleCheckboxChange("grammar")} 
                /> Grammar
                </label>

                <label>
                <input 
                    type="checkbox" 
                    checked={selectedTypes.includes("spelling")} 
                    onChange={() => handleCheckboxChange("spelling")} 
                /> Spelling
                </label>

                <label>
                <input 
                    type="checkbox" 
                    checked={selectedTypes.includes("comprehension")} 
                    onChange={() => handleCheckboxChange("comprehension")} 
                /> Reading
                </label>
                </div>
                <div className={HostCreatePlayroomSt.gameSetList}>
                    {filtergameSets.map((set, index) => (
                        <div onClick={()=>selectedGameTypes(set.type,set.fruitcatcherval,set.secondgameval,set.thirdgameval,set.setname)} key={index} className={HostCreatePlayroomSt.setCardview}>
                             <span className={`${HostCreatePlayroomSt.gameDot} ${getDotColorClass(set.type)}`}></span>
                            {set.setname}
                        </div>
                    ))}
                    
                </div>
                 
                 <button onClick={saveChanges} className={HostCreatePlayroomSt.generateCodeButton}>CREATE ROOM</button>
               
            </div>
        </div>

     

        </>
    );

};

export default HostCreatePlayroom;
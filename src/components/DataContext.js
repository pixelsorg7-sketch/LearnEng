import React, { useRef,createContext, useContext, useState , useEffect} from 'react';

const MyContext = createContext();

const DataContext = ({children}) =>{

    const [ProfileActive,setProfileActive]=useState({});

    //session for profile whenever changes

//      useEffect(() => {
//      const savedProfileStr = localStorage.getItem("profile_active");
//      setProfileActive(savedProfileStr)
//      console.log("pp")

//   }, [ProfileActive]);

//       useEffect(() => {
//     const savedProfile = localStorage.getItem("profile_active");
//     if (savedProfile) {
//       setProfileActive(JSON.parse(savedProfile));
//     }
//     console.log(savedProfile)
//   }, []);
    
    //for account creation verification
    const [AuthCode,setAuthCode]=useState("");
    const [isFullAuth,setisFullAuth]=useState(false); 
     const [currentAuth,setcurrentAuth]=useState(false); //current situation of the account
    //for room list 
    const [roomList,setroomList]=useState([]);

    //for grammar questionsetlist
    // const [questionSetList,setquestionSetList]=useState([]);//question set list storage
    // const [quesSetActiveCategories,setquesSetActiveCategories]=useState([]) //question set active categories
 

   //for question creation
const [randSecondGameVal,setrandSecondGameVal]=useState(0);
const [holdGrammarsetName,setholdGrammarsetName]=useState("")
//for spelling creation
const [randFruitCatcherVal,setrandFruitCatcherVal]=useState(0);
const [holdSpellsetName,setholdSpellsetName]=useState("")
//for reading creation
const [randThirdGameVal,setrandThirdGameVal]=useState(0);
const [holdTitleCreate,setholdTitleCreate]=useState("")
//    const [newquestionSetref,setnewquestionSetref]=useState(0)
//    const [newanswerModule,setnewanswerModule]=useState(0)
//    const [newQuesSetname,setnewQuesSetname]=useState("")
   //for editing question set.................................
   const [editPrevSet,seteditPrevSet]=useState(false)

//    const [docuIdquesCollect,setdocuIdquesCollect]=useState([]);
//    const [docuIdques,setdocuIdques]=useState([]);
//    const [docuIdquesactiveCat,setdocuIdquesactiveCat]=useState([]);
//    const [docuIdanswer,setdocuIdanswer]=useState([]);
//        console.log("question docuid: "+docuIdques)
//         console.log("answer docuid: "+docuIdanswer)
//         console.log("question collection docid " + docuIdquesCollect)
//         console.log("questionactivecat docid " + docuIdquesactiveCat)
//signup useState hold

    const [unameHold,setunameHold]=useState("");
    const [firstnameHold,setfirstnameHold]=useState("");
    const [lastnameHold,setlastnameHold]=useState("");
    const [teacherIDHold,setteacherIDHold]=useState(0);
    const [emailHold,setemailHold]=useState("");
    const [passHold,setpassHold]=useState("");
    const [repassHold,setrepassHold]=useState("");
    const [gradeHold,setgradeHold]=useState(0);
    const [profimageHold,setprofimageHold]=useState(null)

 
    //roomcode save for accessing room'

    const [roomAccessCode,setroomAccessCode]=useState(0)

    const [roomNameAccess,setroomNameAccess]=useState(0)

    return(
        <>

        <MyContext.Provider value={{
            ProfileActive,setProfileActive,
        AuthCode,setAuthCode,
        unameHold,setunameHold,
        firstnameHold,setfirstnameHold,
        lastnameHold,setlastnameHold,
        teacherIDHold,setteacherIDHold,
        emailHold,setemailHold,
        passHold,setpassHold,
        repassHold,setrepassHold,
        roomList,setroomList,
        isFullAuth,setisFullAuth,
        currentAuth,setcurrentAuth,
        // questionSetList,setquestionSetList,
        // quesSetActiveCategories,setquesSetActiveCategories,
        // newquestionSetref,setnewquestionSetref,
        // newanswerModule,setnewanswerModule,
        // newQuesSetname,setnewQuesSetname,
        editPrevSet,seteditPrevSet,
        roomAccessCode,setroomAccessCode,
        // docuIdquesCollect,setdocuIdquesCollect,
        // docuIdques,setdocuIdques,
        // docuIdquesactiveCat,setdocuIdquesactiveCat,
        // docuIdanswer,setdocuIdanswer,
        gradeHold,setgradeHold,
        randSecondGameVal,setrandSecondGameVal,
       randFruitCatcherVal,setrandFruitCatcherVal,
       randThirdGameVal,setrandThirdGameVal,
       holdTitleCreate,setholdTitleCreate,
       profimageHold,setprofimageHold,
       holdSpellsetName,setholdSpellsetName,
       holdGrammarsetName,setholdGrammarsetName,
       roomNameAccess,setroomNameAccess
        
        }}>
        {children}
        </MyContext.Provider>

        </>
    )

}

export {MyContext,DataContext}


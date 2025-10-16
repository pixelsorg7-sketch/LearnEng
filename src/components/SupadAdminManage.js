import React, { useRef,createContext, useContext, useState , useEffect,useMemo} from 'react';
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
import { FaSearch, FaCog, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import SupadAdminManageSt from '../styleweb/SupadAdminManageSt.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import CryptoJS from 'crypto-js';
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
  ListGroup
} from 'react-bootstrap';
import { firestore } from '../firebase';
import {onSnapshot, addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit, getDoc,doc} from '@firebase/firestore';
import LearnEngLogo from '../assets/LearnEngLG.png';
// import BgImage from '../assets/Web_Admin_Modules_BG.png';
import BgImage from '../assets/Web_Admin_Modules_BG.png';
import { getFunctions, httpsCallable } from "firebase/functions";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from "react-toastify";
import { getStorage,ref, uploadBytes, getDownloadURL, updateMetadata,deleteObject  } from "firebase/storage";
import { storage } from '../firebase';

const SupadAdminManage=()=>{

    const navigator = useNavigate();

    const [search, setSearch] = useState('');
  // const [adminData, setAdminData] = useState([
  //   { uname: 'Jiyan', email: 'Jiyan@gmail.com', password: 'gandalang', date: '03/04/2004' },
  //   { uname: 'Montelli', email: '', password: '', date: '' },
  //   { uname: 'Zhezhi', email: '', password: '', date: '' }
  // ]);

 const [adminData, setAdminData] = useState([]);
 const [adminArchived,setadminArchived]=useState([]);

//  loading 

const [isLoading,setisLoading]=useState(false)



  useEffect(()=>{ //render all admin data

    const renderallAdmin=async()=>{

      //for unarchived
    const teacherdblist = collection(firestore,"teachers")
    const whereteacherRecord = query(teacherdblist,
      where("isarchived",'==',false)
    )
    // const getteacher = await getDocs(whereteacherRecord)

    const unsubscribe = onSnapshot(whereteacherRecord, (snapshot) => {

    const teacherData = snapshot.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))

    
    setAdminData(teacherData)
})

 return () => unsubscribe();

  }

  renderallAdmin()
  },[])

  useEffect(()=>{
    const ArchivedTeach=async()=>{
      //for archived
        const teacherdblist = collection(firestore,"teachers")
    const whereArchiveteacher = query(teacherdblist,
      where('isarchived','==',true)
    )
    // const getArchivedteacher = await getDocs(whereArchiveteacher)
      const unsubscribe = onSnapshot(whereArchiveteacher, (snapshot) => {
    const archiveData = snapshot.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))


    setadminArchived(archiveData)
  
  })

  return () => unsubscribe();
    }

    ArchivedTeach()
  },[])

  //edit data hold

  const [editunameHold,seteditunameHold]=useState("")
  const [editfnameHold,seteditfnameHold]=useState("")
  const [editlnameHold,seteditlnameHold]=useState("")
  const [editemailHold,seteditemailHold]=useState("")
  const [editgradelevelHold,seteditgradelevelHold]=useState(0)
  const [editteacherIdHold,seteditteacherIdHold]=useState(0)
  
  
  const [modifyDocid,setmodifyDocid]=useState("")

  const [showModal, setShowModal] = useState(false);
  const [showArchivemodal,setshowArchivemodal]=useState(false)
  // const [editData, setEditData] = useState({ uname: '', email: '', password: '', date: '' });
  const [editIndex, setEditIndex] = useState(null);
  // Track which passwords are visible
  const [showPasswords, setShowPasswords] = useState([]);


  // Open modal for editing
  const handleEdit = (docid,username,firstname,lastname,email,teacherID,gradelevel) => {
    // admin.username,admin.firstname,admin.lastname,admin.email,admin.teacherID
    // setEditData(adminData[index]);
    // setEditIndex(index);
    setmodifyDocid(docid)
    seteditunameHold(username)
    seteditfnameHold(firstname)
    seteditlnameHold(lastname)
    seteditemailHold(email)
    seteditteacherIdHold(teacherID)
    seteditgradelevelHold(gradelevel)
    setShowModal(true);
  };

  // Save changes
  const saveEdit = async() => {
    if (editunameHold === "" || editfnameHold === "" || editlnameHold === "" || editemailHold === "" || editteacherIdHold === "") {
      // alert('All fields are required!');
       toast.error(`All fields are required!`, {
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
     const teacherDocRef = doc(firestore, "teachers", modifyDocid);
    await updateDoc(teacherDocRef,{
        username:editunameHold,
        firstname:editfnameHold,
        lastname:editlnameHold,
        teacherID:Number(editteacherIdHold),
        email:editemailHold,
        gradelevel:Number(editgradelevelHold)
    })

     toast.success(`Account Edited!`, {
          position:'top-center',   
         autoClose: 3000,      
        hideProgressBar: false,
    closeButton:false,
      pauseOnHover: false,
  draggable: false,
      });
    setShowModal(false);
  };

  //archived

  const handleArchive=async(docid)=>{
 const confirmArchive = window.confirm('are you sure you want to delete')

   if(confirmArchive){
       setisLoading(true)
     const teacherDocRef = doc(firestore, "teachers", docid);
    await updateDoc(teacherDocRef,{
      isarchived:true
    });
     toast.success(`Account Archived!`, {
          position:'top-center',   
         autoClose: 3000,      
        hideProgressBar: false,
    closeButton:false,
      pauseOnHover: false,
  draggable: false,
      });
   }

      setisLoading(false)

  }

  //retrieve

const handleRetrieve=async(docid)=>{
 const confirmDelete = window.confirm('are you sure you want to retrieve')

   if(confirmDelete){
       setisLoading(true)

      const teacherDocRef = doc(firestore, "teachers", docid);
    await updateDoc(teacherDocRef,{
      isarchived:false
    })

    toast.success(`Account Retrieved!`, {
          position:'top-center',   
         autoClose: 3000,      
        hideProgressBar: false,
    closeButton:false,
      pauseOnHover: false,
  draggable: false,
      });
   }

      setisLoading(false)
}
  const functions = getFunctions();
  // Delete
  const handleDelete =async (docid,emailuser,teacherid) => {
   const confirmDelete = window.confirm('are you sure you want to delete')

   if(confirmDelete){
    
    setisLoading(true)

     const deleteUserByEmail = httpsCallable(functions, "deleteUserByEmail");
    
     
    // Try to delete from Firebase Auth first------
   const result = await deleteUserByEmail({ emailuser });
    if (result.data.success) {  
    console.log("Success")
       } else {
     console.error("Function returned error:", result.data.error);
    console.log("Failed")
      toast.error(`Cant delete account`, {
          position:'top-center',   
         autoClose: 3000,      
        hideProgressBar: false,
    closeButton:false,
      pauseOnHover: false,
     draggable: false,
      });
    return;
     }

     //delete spelling

     const spellingcollectdblist = collection(firestore,"spellings-collection")
          const wherecollectspelling = query(spellingcollectdblist,
            where("teacherid","==",teacherid),
             );
     
      const getcollectspelling = await getDocs(wherecollectspelling)
      const spellingcollectdata = getcollectspelling.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
       }))

       if(spellingcollectdata.length !== 0){
      deleteDoc(doc(firestore,"spellings-collection",spellingcollectdata[0].id))
      }

      const spellingdblist = collection(firestore,"spellings")
           const wherespelling = query(spellingdblist,
             where("teacherid","==",teacherid),
              );
      
           const getspelling = await getDocs(wherespelling)
             const spellingdata = getspelling.docs.map((doc)=>({
                 id:doc.id,
                ...doc.data()
             }))

        if(spellingdata.length !== 0){
        spellingdata.map((element,index)=>{
        deleteDoc(doc(firestore,"spellings",element.id))
        });
       }
        //delete reading

      const comprecollectiondblist = collection(firestore,"comprehension-collection")
      const wherecomprecollection = query(comprecollectiondblist,
         where("teacherid","==",teacherid),
      )
      const getcomprecollection = await getDocs(wherecomprecollection)
      const comprehensiondata = getcomprecollection.docs.map((doc)=>({
         id:doc.id,
       ...doc.data()
     }));

     if(comprehensiondata.length !== 0){
      deleteDoc(doc(firestore,"comprehension-collection",comprehensiondata[0].id))
    }


      const readquesdblist = collection(firestore,"story-readingques")
          const wherereadques = query(readquesdblist,
            where("teacherid","==",teacherid),
          )
          const getreadques = await getDocs(wherereadques)
          const readquesdata = getreadques.docs.map((doc)=>({
            id:doc.id,
            ...doc.data()
          }));

          if(readquesdata.length !==0){
          readquesdata.map((element,index)=>{
           deleteDoc(doc(firestore,"story-readingques",element.id))
          })
        }

          const storyreadingdblist = collection(firestore,"storyreading")
              const wherestoryreading = query(storyreadingdblist,
                 where("teacherid","==",teacherid),
              )
              const getstoryreading = await getDocs(wherestoryreading)
              const storyreadingdata = getstoryreading.docs.map((doc)=>({
                id:doc.id,
                ...doc.data()
              }));

            if(storyreadingdata.length !== 0){
              storyreadingdata[0].imagepath.map(async(element,index)=>{
              const delimageRef = ref(storage, element);
              await deleteObject(delimageRef);
            })
          
            deleteDoc(doc(firestore,"storyreading",storyreadingdata[0].id))
           }

        //delete grammar

        const grammardblist = collection(firestore,"grammar")
          const wheregrammar = query(grammardblist,
            where("teacherid","==",teacherid),
             );
            const getgrammar = await getDocs(wheregrammar)
            const grammardata = getgrammar.docs.map((doc)=>({
             id:doc.id,
             ...doc.data()
             }))

            if(grammardata.length !== 0){
           grammardata.map((element,index)=>{
          deleteDoc(doc(firestore,"grammar",element.id))
        })
         }


          const grammardbcollectlist = collection(firestore,"grammar-collection")
              const wheregrammarcollect = query(grammardbcollectlist,
              where("teacherid","==",teacherid),
              );
              const getgrammarcollect = await getDocs(wheregrammarcollect)
            const grammarcollectdata = getgrammarcollect.docs.map((doc)=>({
             id:doc.id,
            ...doc.data()
            }))

          if(grammarcollectdata.length !== 0){
         deleteDoc(doc(firestore,"grammar-collection",grammarcollectdata[0].id))
          }

         //delete joinroom list

          const joinroomlistdblist = collection(firestore,"joinroom-list")
                 const wherejoinroomlist = query(joinroomlistdblist,
                where('teacherid','==',teacherid)
                 )
                 const getjoinroomlist = await getDocs(wherejoinroomlist)
                 const joinroomlistdata = getjoinroomlist.docs.map((doc)=>({
                 id:doc.id,
              ...doc.data(),
            }))

            if(joinroomlistdata.length !== 0){
             joinroomlistdata?.map((element,index)=>{
             deleteDoc(doc(firestore,"joinroom-list",element.id))
            })
          }

          //delete joinroom active game

            const joinroomactivegamedblist = collection(firestore,"joinroom-activegame")
            const wherejoinroomactivegame = query(joinroomactivegamedblist,
               where('teacherid','==',teacherid)
            )
          
        const getjoinroomactivegame = await getDocs(wherejoinroomactivegame)
        const joinroomactivegamedata = getjoinroomactivegame.docs.map((doc)=>({
           id:doc.id,
          ...doc.data(),
        }))

        if(joinroomactivegamedata.length !== 0){
      deleteDoc(doc(firestore,"joinroom-activegame",joinroomactivegamedata[0].id))
         }

      //delete joinroom progress

       const joinroomprogressdblist = collection(firestore,"joinroom-progress")
               const wherejoinroomprogress = query(joinroomprogressdblist,
               where('teacherid','==',teacherid)
               )
      
         const getjoinroomprogress = await getDocs(wherejoinroomprogress)
          const joinroomprogressdata = getjoinroomprogress.docs.map((doc)=>({
            id:doc.id,
           ...doc.data(),
         }))

         if(joinroomprogressdata.length !== 0){
          joinroomprogressdata?.map((element,index)=>{
          deleteDoc(doc(firestore,"joinroom-progress",element.id)) 
          })
         }

            //delete joinroom

        const joinroomdblist = collection(firestore,"joinroom")
        const wherejoinroom = query(joinroomdblist,
          where('teacherid','==',teacherid)
        )

        const getjoinroom = await getDocs(wherejoinroom)
        const joinroomData = getjoinroom.docs.map((doc)=>({
          id:doc.id,
          ...doc.data(),
        }))

        if(joinroomData.length !== 0){
      deleteDoc(doc(firestore,"joinroom",joinroomData[0].id)) 
       }

         //delete profile from firestore
       deleteDoc(doc(firestore,"teachers",docid))


       //toast remind
        toast.success(`Account Deleted`, {
          position:'top-center',   
         autoClose: 3000,      
        hideProgressBar: false,
    closeButton:false,
      pauseOnHover: false,
     draggable: false,
      });

   }

    setisLoading(false)
           


  };

    //paginator feature-----------------
    
      // Pagination state
      const [currentPage, setCurrentPage] = useState(1);
      const [itemsPerPage, setItemsPerPage] = useState(7);
    
       // Calculate pagination
      const totalItems = adminData.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
      const currentData = useMemo(() => 
        adminData.slice(startIndex, endIndex),
        [adminData, startIndex, endIndex]
      );
    
       // Handle page changes
      const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
        }
      };
    
      // Handle items per page change
      const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page
      };
    
      // Generate simple page numbers (show max 5 pages)
      const getVisiblePages = () => {
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
          start = Math.max(1, end - maxVisible + 1);
        }
        
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      };
    
      const visiblePages = getVisiblePages();

  // Search filter
  const filtered = (currentData || []).filter(a =>
    a?.username?.toLowerCase().includes(search.toLowerCase())
  );


  //  const togglePasswordVisibility = (index) => {
  //   setShowPasswords(prev => ({ ...prev, [index]: !prev[index] }));
  // };

    return(<>

        <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundImage: `url(${BgImage})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundColor: '#fff3b0' // yellow background
    }}>
      <div style={{
        width: '230px',
        backgroundColor: '#e1f4c3', // light green sidebar
        padding: '30px 20px',
        borderTopRightRadius: '100px',
        borderBottomRightRadius: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Image src={LearnEngLogo} alt="logo" className={SupadAdminManageSt.sidebarlogo} />
        <Button onClick={()=>navigator('/SuperAdminPage')} style={{
          backgroundColor: '#6c4d4d',
          border: 'none',
          borderRadius: '25px',
          padding: '10px 25px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Back <FaArrowLeft style={{ marginLeft: '10px' }} />
        </Button>
       
      </div>

      <div style={{ flex: 1, padding: '40px' }}>
        <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#6c4d4d', marginBottom: '20px' }}>
          Welcome, Admin!
        </div>
        <h2 style={{ color: '#6c4d4d', fontWeight: 'bold', marginBottom: '25px' }}>
          Teacher Account Management
        </h2>

        <div style={{
          maxWidth: '450px',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              borderRadius: '30px 0 0 30px',
              border: '1px solid #999',
              padding: '10px 20px'
            }}
          />
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #999',
            borderLeft: 'none',
            borderRadius: '0 30px 30px 0',
            padding: '10px',
            color: '#6c4d4d'
          }}>
            <FaSearch />
          </div>
          
        </div>

        <div style={{
          // maxWidth: '450px',
          display: 'flex',
          flexDirection:'column',
          rowGap:'10px',
          // alignItems: 'center',
          marginBottom: '25px'
        }}>
         <Button style={{
          backgroundColor: '#6c4d4d',
          border: 'none',
           maxWidth: '250px',
          borderRadius: '25px',
          padding: '10px 25px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={()=>setshowArchivemodal(true)}
        >
          Archive
        </Button>

        <Table bordered className={SupadAdminManageSt.teachertable}>
          <thead>
            <tr>
             <th className={SupadAdminManageSt.teachertable}>Username</th>
              <th className={SupadAdminManageSt.teachertable}>Firstname</th>
              <th className={SupadAdminManageSt.teachertable}>Lastname</th>
              <th className={SupadAdminManageSt.teachertable}>Email</th>
              <th className={SupadAdminManageSt.teachertable}>gradelevel</th>
              {/* <th style={{ textAlign: 'center', backgroundColor: '#f3fdb0', color: '#6c4d4d' }}>Password</th> */}
              {/* <th style={{ textAlign: 'center', backgroundColor: '#f3fdb0', color: '#6c4d4d' }}>Teacher ID</th> */}
              <th className={SupadAdminManageSt.teachertable}>Action</th>
            </tr>
          </thead>
          <tbody>
            {(filtered || []).map((admin, index) => (
              <tr key={index}> 

              <td style = {{fontSize:18,fontWeight:'bold'}}>{admin.username}</td>
               <td>{admin.firstname}</td>
                <td>{admin.lastname}</td>
                <td>{admin.email}</td>
                <td>{admin.gradelevel}</td>
                {/* <td>
                  {showPasswords[index] ? CryptoJS.SHA256(admin.password).toString() : '••••••'}
                  <Button
                    variant="link"
                    onClick={() => togglePasswordVisibility(index)}
                    style={{ padding: '0 8px' }}>
                    {showPasswords[index] ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </td> */}
                {/* <td>{admin.teacherID}</td> */}
                <td>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" size="sm">
                      <FaCog />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleEdit(admin.id,admin.username,admin.firstname,admin.lastname,admin.email,admin.teacherID,admin.gradelevel)}>Edit</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleArchive(admin.id)}>Archive</Dropdown.Item>
                      {/* <Dropdown.Item onClick={() => handleDelete(admin.id,admin.username,admin.firstname,admin.lastname,admin.email,admin.teacherID,admin.password)}>Delete</Dropdown.Item> */}
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>

           {/* Simple Pagination Controls */}
                      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div style = {{fontSize:20,fontWeight:'bold'}}>
                          Page <span>{currentPage}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
                        </div>
                        
                        <div className={SupadAdminManageSt.paginationcon}>
                          {/* Previous Button */}
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={SupadAdminManageSt.pagibtn}
                          >
                            <ChevronLeft size={16} color='white'/>
                          <h6 className={SupadAdminManageSt.pagitextbtn}>Prev</h6>
                          </button>
                
                          {/* Page Numbers */}
                          <div className={SupadAdminManageSt.pagenumbercon}>
                            {visiblePages.map(page => (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                 className={[currentPage === page ? `${SupadAdminManageSt.pagipageclicked}` : SupadAdminManageSt.pagipage]}
                              >
                                {page}
                              </button>
                            ))}
                          </div>
                
                          {/* Next Button */}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                             className={SupadAdminManageSt.pagibtn}
                          > 
                           <ChevronRight size={16} color='white'/>
                           <h6 className={SupadAdminManageSt.pagitextbtn}>Next</h6>
                          
                          </button>
                        </div>
                      </div>
        
      </div>

      {/* archive */}

       <Modal show={showArchivemodal} onHide={()=>setshowArchivemodal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Archived Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>

          {(adminArchived || []).map((element,index)=>(

        
           
              <ListGroup.Item  className="d-flex align-items-center justify-content-between">
                {/* <Image
                  src={profile.img}
                  roundedCircle
                  className="me-3"
                  width={50}
                  height={50}
                /> */}
                <div style={{display:'flex',flexDirection:'column'}}>
                  <strong>{element.username}</strong>
                  <div className="text-muted">{element.email}</div>
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

        onClick={()=>handleDelete(element.id,element.email,element.teacherID)}
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

      {/* edit */}

       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Teacher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={editunameHold}
               onChange={(e) => seteditunameHold(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>firstname</Form.Label>
              <Form.Control
                value={editfnameHold}
              onChange={(e) => seteditfnameHold(e.target.value)}
              />
              
            </Form.Group>
             <Form.Group className="mb-2">
              <Form.Label>firstname</Form.Label>
              <Form.Control
                 value={editlnameHold}
                onChange={(e) => seteditlnameHold(e.target.value)}
              />
              
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
              value={editemailHold}
              disabled={true}
             onChange={(e) => seteditemailHold(e.target.value)}
              />
             </Form.Group>
            {/* <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={editData.password}
                // onChange={(e) => setEditData({ ...editData, password: e.target.value })}
              />
            </Form.Group>  */}
            <Form.Group className="mb-2">
              <Form.Label>Grade Level</Form.Label>
              <Form.Control
                   value={editgradelevelHold}
                  onChange={(e) => seteditgradelevelHold(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveEdit}>Save</Button>
        </Modal.Footer>
      </Modal> 

      
            {/* modal loading */}
              <Modal show={isLoading} backdrop="static" centered>
              <Modal.Body className="text-center">
                 <div className={SupadAdminManageSt.customloader}></div>
                <p className="mt-3 mb-0 fw-bold">Loading</p>
              </Modal.Body>
            </Modal>
    </div>



    </>)

}
export default SupadAdminManage;
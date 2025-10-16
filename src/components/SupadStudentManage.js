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
import LearnEngLogo from '../assets/LearnEngLG.png';
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
import {onSnapshot, addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit,ref, getDoc,doc} from '@firebase/firestore';
import SupadStudentManageSt from '../styleweb/SupadStudentManageSt.module.css'
import BgImage from '../assets/Web_Admin_Modules_BG.png';
import { getAuth, deleteUser } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from "react-toastify";


const SupadStudentManage=()=>{
    const navigator = useNavigate();

    const [search, setSearch] = useState('');

  const [students, setStudents] = useState([]);
  const [archivedStudents,setarchivedStudents]=useState([])

  const [showModal, setShowModal] = useState(false);
  // const [editIndex, setEditIndex] = useState(null);
  // const [editData, setEditData] = useState({ fname: '', lname: '', id: '', password: '', date: '' });
  // const [showPasswords, setShowPasswords] = useState([]);
    const [showPasswords, setShowPasswords] = useState({});

    //edit data hold

    const [editunameHold,seteditunameHold]=useState("")
    const [editfnameHold,seteditfnameHold]=useState("")
    const [editlnameHold,seteditlnameHold]=useState("")
    const [editstudentidHold,seteditstudentidHold]=useState(0)
    const [editgradelevelHold,seteditgradelevelHold]=useState(0)
    const [editpassHold,seteditpassHold]=useState("")

      const [modifyDocid,setmodifyDocid]=useState("")

      //show archive modal

const [showArchivemodal,setshowArchivemodal]=useState(false)

//  loading 

const [isLoading,setisLoading]=useState(false)

  useEffect(()=>{

    const renderallAdmin=async()=>{

      const studentdblist = collection(firestore,"students")
      const wherestudentRecord = query(studentdblist,
        where("isarchived",'==',false)
      )
      // const getstudent = await getDocs(wherestudentRecord)
        const unsubscribe = onSnapshot(wherestudentRecord, (snapshot) => {

      const studentData = snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
      }))

      setStudents(studentData)
    
    })

    return () => unsubscribe();
    }

    renderallAdmin()

  },[])

  //archive render
  useEffect(()=>{
     const studentdblist = collection(firestore,"students")
      const wherestudentRecord = query(studentdblist,
        where("isarchived",'==',true)
      )
      // const getstudent = await getDocs(wherestudentRecord)
        const unsubscribe = onSnapshot(wherestudentRecord, (snapshot) => {

      const studentData = snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
      }))

      setarchivedStudents(studentData)
    
    })

    return () => unsubscribe();

  },[])


 

  const handleEditOpen = (docid,username,firstname,lastname,studentid,gradelevel,password) => {

    setmodifyDocid(docid)
    seteditunameHold(username)
    seteditfnameHold(firstname)
    seteditlnameHold(lastname)
    seteditstudentidHold(studentid)
    seteditgradelevelHold(gradelevel)
    // seteditpassHold(password)
  
    setShowModal(true);
  };

  const handleEditSave = async() => {

    setisLoading(true)
    //validations

    if(editunameHold === "" || editfnameHold === "" || editlnameHold === "" || editstudentidHold === "" || editgradelevelHold === 0 ){
      // alert('All fields are required!');
      toast.error(`All fields are required!`, {
                position:'top-center',   
               autoClose: 3000,      
              hideProgressBar: false,
          closeButton:false,
            pauseOnHover: false,
        draggable: false,
            });
      setisLoading(false)
      return
     }

     if(editgradelevelHold > 4){
      // alert('Accept only grade level 2-4');
      toast.error(`Accept only grade level 2-4`, {
                position:'top-center',   
               autoClose: 3000,      
              hideProgressBar: false,
          closeButton:false,
            pauseOnHover: false,
        draggable: false,
            });
      setisLoading(false)
      return;
     }

     const studentDocRef = doc(firestore,"students",modifyDocid)
     await updateDoc(studentDocRef,{
      username:editunameHold,
      firstname:editfnameHold,
      lastname:editlnameHold,
      studentID:editstudentidHold,
      gradelevel:Number(editgradelevelHold),
      // password:editpassHold
     })

     //update analytics student name
     const analyticsdblist = collection(firestore,"analytics")
     const whereanalytics = query(analyticsdblist,
      where("studentid",'==',editstudentidHold)
     )
     const getAnalyticsrecord = await getDocs(whereanalytics)
     const analyticsData = getAnalyticsrecord.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
     }))

     const analyticsupdate = doc(firestore,"analytics",analyticsData[0].id)
     await updateDoc(analyticsupdate,{
      studentname: `${editfnameHold} ${editlnameHold}`,
      gradelevel:Number(editgradelevelHold)
     })

     //toast

     toast.success(`Account Edited`, {
                position:'top-center',   
               autoClose: 3000,      
              hideProgressBar: false,
          closeButton:false,
            pauseOnHover: false,
        draggable: false,
            });

    

    //  setStudents([])
     setisLoading(false)
     setShowModal(false);
  };

   //archived
  
    const handleArchive=async(docid)=>{
   const confirmArchive = window.confirm('are you sure you want to delete')
  
     if(confirmArchive){
       setisLoading(true)

       const studentDocRef = doc(firestore, "students", docid);
      await updateDoc(studentDocRef,{
        isarchived:true
      })
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
          const studentDocRef = doc(firestore, "students", docid);
        await updateDoc(studentDocRef,{
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

  const handleDelete = async (docid, emailuser) => {

    if (!emailuser || typeof emailuser !== "string") {
    console.error("Invalid email provided to handleDelete:", emailuser);
    return;
  }

  const confirmDelete = window.confirm('Are you sure you want to delete this student?');

  if (confirmDelete) {

    setisLoading(true)
    //delete email from firebase auth--------

    const deleteUserByEmail = httpsCallable(functions, "deleteUserByEmail");
 
      // Try to delete from Firebase Auth first
      const result = await deleteUserByEmail({ emailuser });
     if (result.data.success) {  
      } else {
        toast.error(`Cant delete account`, {
         position:'top-center',   
        autoClose: 3000,      
        hideProgressBar: false,
        closeButton:false,
        pauseOnHover: false,
        draggable: false,
        });
        console.log(result)
      return;
      }
     
      
    //delete from firestore---------------

    //delete join room progress

    const roomprogressdblist = collection(firestore,"joinroom-progress")
    const wherejoinroomprog = query(roomprogressdblist,
     where("studentid",'==',emailuser)
    )

    const getjoinroomRecord = await getDocs(wherejoinroomprog)
    const joinroomprogData = getjoinroomRecord.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))

    if(joinroomprogData.length !== 0){
    await deleteDoc(doc(firestore, "joinroom-progress", joinroomprogData[0].id));
     }

    //delete analytics

     const analyticsdblist = collection(firestore,"analytics")
     const whereanalytics = query(analyticsdblist,
      where("studentid",'==',emailuser)
     )
     const getAnalyticsrecord = await getDocs(whereanalytics)
     const analyticsData = getAnalyticsrecord.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
     }))

    await deleteDoc(doc(firestore, "analytics", analyticsData[0].id));

     //delete inventories
     const inventorydblist = collection(firestore,"inventory")
     const whereinventory = query(inventorydblist,
      where('studentid','==',emailuser)
     )
    const getinventory = await getDocs(whereinventory)
    const inventoryData = getinventory.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))

    inventoryData?.map(async(element,index)=>{
      console.log("Delete invetories" ,element.id)
      await deleteDoc(doc(firestore, "inventory", element.id));
    })

    //delete player-assets

    const playerassetsdblist = collection(firestore,"player-assets")
     const whereplayerassets = query(playerassetsdblist,
      where('studentid','==',emailuser)
     )
    const getplayerassets = await getDocs(whereplayerassets)
    const playerassData = getplayerassets.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))

     await deleteDoc(doc(firestore, "player-assets", playerassData[0].id));

    //delete student-achievement

    const achievementdblist = collection(firestore,"student_achievement")
     const whereachievement = query(achievementdblist,
      where('studentid','==',emailuser)
     )
    const getachievement = await getDocs(whereachievement)
    const achievementData = getachievement.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))

    await deleteDoc(doc(firestore, "student_achievement", achievementData[0].id));


     //delete student profile
    await deleteDoc(doc(firestore, "students", docid));

    //toast

    toast.success(`Account Deleted Successfully`, {
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
      const totalItems = students.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
      const currentData = useMemo(() => 
        students.slice(startIndex, endIndex),
        [students, startIndex, endIndex]
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

       // Filter by search (first name)
  const filtered = currentData.filter(s =>
    s.username.toLowerCase().includes(search.toLowerCase())
  );


    return(
        <>

        <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundImage: `url(${BgImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#fff3b0'
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: '230px',
          backgroundColor: '#e1f4c3',
          padding: '30px 20px',
          borderTopRightRadius: '100px',
          borderBottomRightRadius: '100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Image src={LearnEngLogo} alt="logo" className={SupadStudentManageSt.sidebarlogo} />
        <Button onClick={()=>navigator("/SuperAdminPage")}
          style={{
            backgroundColor: '#6c4d4d',
            border: 'none',
            borderRadius: '25px',
            padding: '6px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-start',
            marginLeft: '10px'
          }}
        >
          Back <FaArrowLeft style={{ marginLeft: '10px' }} />
        </Button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#6c4d4d', marginBottom: '20px' }}>
          Welcome, Admin!
        </div>
        <h2 style={{ color: '#6c4d4d', fontWeight: 'bold', marginBottom: '25px' }}>Student Account Management</h2>

        {/* Search */}
        <div style={{ maxWidth: '450px', display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
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

        <div style={{
            display:'flex',
            flexDirection:'column',
            rowGap:'20px'
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
        

        {/* Table */}
        <Table bordered className={SupadStudentManageSt.studenttable}>
          <thead>
            <tr>
            <th>Student User Name</th>
              <th>Student First Name</th>
              <th>Student Last Name</th>
              <th>Email</th>
               <th>gradelevel</th>
              {/* <th>Password</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student, index) => (
              <tr key={index}>
                 <td style = {{fontSize:18,fontWeight:'bold'}}>{student.username}</td>
                <td>{student.firstname}</td>
                <td>{student.lastname}</td>
                <td>{student.studentID}</td>
                <td>{student.gradelevel}</td>
                
                <td>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" size="sm">
                      <FaCog />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleEditOpen(student.id,student.username,student.firstname,student.lastname,student.studentID,student.gradelevel,student.password)}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={() =>handleArchive(student.id)}>Archive</Dropdown.Item>
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
                                
                                <div className={SupadStudentManageSt.paginationcon}>
                                  {/* Previous Button */}
                                  <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={SupadStudentManageSt.pagibtn}
                                  >
                                    <ChevronLeft size={16} color='white'/>
                                  <h6 className={SupadStudentManageSt.pagitextbtn}>Prev</h6>
                                  </button>
                        
                                  {/* Page Numbers */}
                                  <div className={SupadStudentManageSt.pagenumbercon}>
                                    {visiblePages.map(page => (
                                      <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                       className={[currentPage === page ? `${SupadStudentManageSt.pagipageclicked}` : SupadStudentManageSt.pagipage]}
                                      >
                                        {page}
                                      </button>
                                    ))}
                                  </div>
                        
                                  {/* Next Button */}
                                  <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                     className={SupadStudentManageSt.pagibtn}
                                  > 
                                   <ChevronRight size={16} color='white'/>
                                   <h6 className={SupadStudentManageSt.pagitextbtn}>Next</h6>
                                  
                                  </button>
                                </div>
                              </div>

      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
           <Form.Group className="mb-2">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                value={editunameHold}
                onChange={(e) => seteditunameHold(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                value={editfnameHold}
                  onChange={(e) => seteditfnameHold(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                value={editlnameHold}
              onChange={(e) => seteditlnameHold(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Student Email</Form.Label>
              <Form.Control
                value={editstudentidHold}
                disabled={true}
                onChange={(e) => seteditstudentidHold(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Grade Level</Form.Label>
              <Form.Control
              type='number'
                value={editgradelevelHold}
                onChange={(e) => seteditgradelevelHold(e.target.value)}
              />
            </Form.Group>

            {/* <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={editpassHold}
                  onChange={(e) => seteditpassHold(e.target.value)}
              />
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEditSave}>Save</Button>
        </Modal.Footer>
      </Modal>

       {/* archive */}

       <Modal show={showArchivemodal} onHide={()=>setshowArchivemodal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Archived Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>

          {archivedStudents.map((element,index)=>(

              <ListGroup.Item  className="d-flex align-items-center justify-content-between">
                {/* <Image
                  src={profile.img}
                  roundedCircle
                  className="me-3"
                  width={50}
                  height={50}
                /> */}
                <div style={{display:'flex',flexDirection:'column'}}>
                  <strong>{element.firstname}  {element.lastname}</strong>
                  <div className="text-muted"> Grade {element.gradelevel}</div>
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

        onClick={()=>handleDelete(element.id,element.studentID)}
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

      {/* modal loading */}
                    <Modal show={isLoading} backdrop="static" centered>
                    <Modal.Body className="text-center">
                       <div className={SupadStudentManageSt.customloader}></div>
                      <p className="mt-3 mb-0 fw-bold">Loading</p>
                    </Modal.Body>
                  </Modal>
    </div>


        </>
    )
}

export default SupadStudentManage;
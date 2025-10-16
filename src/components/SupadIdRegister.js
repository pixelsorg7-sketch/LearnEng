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
import { FaBook, FaCrown,FaChevronDown, FaSearch, FaCog, FaArrowRight } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import SupadIdRegisterSt from '../styleweb/SupadIdRegisterSt.module.css'
import dayjs from 'dayjs';
import BgImage from '../assets/Web_Admin_Modules_BG.png';
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
  Image,
  Table
} from 'react-bootstrap';
import { firestore } from '../firebase';
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit,ref, getDoc,doc} from '@firebase/firestore';
import projectlogo from '../assets/projectlogo.png';
import schoollogo from '../assets/schoollogo.png';
import LearnEngLogo from '../assets/LearnEngLG.png';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SupadIdRegister=()=>{

     const navigator = useNavigate();

 const [studentID, setStudentID] = useState('');
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editID, setEditID] = useState('');
  const [editDocid,seteditDocid]=useState('');
  const [editIndex, setEditIndex] = useState(null);
 

  //render available id

  useEffect(()=>{

    const renderstudid=async()=>{
    const studentidlist = collection(firestore,"studentid-list")
    const wherestudentid = query(studentidlist)
    const getstudentid = await getDocs(wherestudentid)

    const studentidData = getstudentid.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
    }))

    setRecords(studentidData)


       }

       renderstudid()
  },[records])


  // Handle Register button
  const handleRegister = async () => {
    if (studentID === "") {
      alert('Please enter a valid email');
      return;
    }

    if(!studentID.includes("@")){
        alert('Please enter a valid email');
      return;
    }

    //check if have duplicate

    const studentidlist = collection(firestore,"studentid-list")
    const wherestudentid = query(studentidlist,
       where('studentid','==',studentID)
    )
    const getstudentid = await getDocs(wherestudentid)
    const studentidData = getstudentid.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
    }))

        if(studentidData.length > 0){
            window.alert("Duplicate email found")
            return;
        }
    
    //add to server
     const now = dayjs();

    addDoc(collection(firestore,"studentid-list"),{
        dateregistered:String(now.format('MM/DD/YYYY')),
        timeregistered:String(now.format('hh:mm a')),
        studentid:studentID.toLowerCase()
    })
       
    setStudentID('');
    setRecords([])
  };

  // Handle Delete
  const handleDelete = (docid) => {
    const confirm = window.confirm(`Are you sure you want to delete`);
    if (!confirm) return;

    //delete now
    deleteDoc(doc(firestore,"studentid-list",docid))
    setRecords([])
  };

  // Show Edit Modal
  const handleEditOpen = (docid,studentid) => {
    setEditID(studentid)
    seteditDocid(docid)
    // setEditIndex(index);
    setShowEdit(true);
  };

  // Save Edit
  const handleEditSave = async() => {
    if (editID === "") {
      alert('Enter valid email');
      return;
    }

     if(!editID.includes("@")){
        alert('Please enter a valid email');
      return;
    }

      //check if have duplicate

    const studentidlist = collection(firestore,"studentid-list")
    const wherestudentid = query(studentidlist,
      where('studentid','==',Number(editID))
    )
    const getstudentid = await getDocs(wherestudentid)
    console.log(editID)

    const studentidData = getstudentid.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
    }))

      if(studentidData.length > 0){
      window.alert("Duplicate id found")
    return;
    }

    //update now
    const studentidlistRef = doc(firestore,"studentid-list",editDocid)
    await updateDoc(studentidlistRef,{
        studentid:editID
    })



    // // const updated = [...records];
    // // updated[editIndex].id = editID;
    // // setRecords(updated);
    seteditDocid("")
    setRecords([])
    setShowEdit(false);
  };

  //paginator feature-----------------
  
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(7);
  
     // Calculate pagination
    const totalItems = records.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
    const currentData = useMemo(() => 
      records.slice(startIndex, endIndex),
      [records, startIndex, endIndex]
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

  // Filter data based on search
  const filteredRecords = currentData.filter(record =>
    record.studentid.toString().includes(search)
  );

    return(
        <>

                <div
        className={SupadIdRegisterSt.studentlayout}
        style={{
           backgroundImage: `url(${BgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >

      <div className={SupadIdRegisterSt.sidebar}>
        <Image src={LearnEngLogo} alt="logo" className={SupadIdRegisterSt.sidebarlogo} />
        <div className={SupadIdRegisterSt.logoutwrapper}>
          <Button onClick={()=>navigator("/SuperAdminPage")} className={SupadIdRegisterSt.logoutbutton}>
            Back <FaArrowRight/>
          </Button>
        </div>
      </div>

      <div className={SupadIdRegisterSt.maincontent}>
        <div className={SupadIdRegisterSt.topheader}>
          <span className={SupadIdRegisterSt.welcometext}>Welcome, Admin!</span>
        </div>

        <h2 className={SupadIdRegisterSt.maintitle}>Student Register Email</h2>

        <div className={SupadIdRegisterSt.inputsection}>
          <Form.Control
            className={SupadIdRegisterSt.studentinput}
            type="text"
            placeholder="Enter Student Email"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
          />
          <Button className={SupadIdRegisterSt.registerbtn} onClick={handleRegister}>
            Register
          </Button>
        </div>

        <div className="search-wrapper d-flex mb-3">
          <Form.Control
            type="text"
            placeholder="Search..."
            value={search}
           onChange={(e) => setSearch(e.target.value)}
          />
          <span className="search-icon d-flex align-items-center px-3">
            <FaSearch />
          </span>
        </div>

        <div className={SupadIdRegisterSt.tablesection}>
          <Table bordered className={SupadIdRegisterSt.recordstable}>
            <thead>
              <tr>
                <th>Registered Student Email</th>
                <th>Time Registered</th>
                <th>Date Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.studentid}</td>
                  <td>{record.timeregistered}</td>
                  <td>{record.dateregistered}</td>
                  <td>
                    <Dropdown drop="down-centered">
                      <Dropdown.Toggle variant="light" size="sm">
                        <FaCog />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleEditOpen(record.id,record.studentid)}>Edit</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(record.id)}>Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

   {/* Simple Pagination Controls */}
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div style = {{fontSize:20,fontWeight:'bold'}}>
                  Page <span>{currentPage}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
                </div>
                
                <div className={SupadIdRegisterSt.paginationcon}>
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={SupadIdRegisterSt.pagibtn}
                  >
                    <ChevronLeft size={16} color='white'/>
                  <h6 className={SupadIdRegisterSt.pagitextbtn}>Prev</h6>
                  </button>
        
                  {/* Page Numbers */}
                  <div className={SupadIdRegisterSt.pagenumbercon}>
                    {visiblePages.map((page,index) => (
                      <button
                         key={`${page}-${index}`}
                          onClick={() => page !== '...' ? handlePageChange(page) : null}
                         className={[currentPage === page ? `${SupadIdRegisterSt.pagipageclicked}` : SupadIdRegisterSt.pagipage]}
                          disabled={page === '...'}
                          aria-label={page === '...' ? 'More pages' : `Go to page ${page}`}
                          title={page === '...' ? 'More pages' : `Page ${page}`}
                          >
                        {page}
                      </button>
                    ))}
                  </div>
        
                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                     className={SupadIdRegisterSt.pagibtn}
                  > 
                   <ChevronRight size={16} color='white'/>
                   <h6 className={SupadIdRegisterSt.pagitextbtn}>Next</h6>
                  
                  </button>
                </div>
              </div>
          
        </div>    
      </div>

      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={editID}
            onChange={(e) => setEditID(e.target.value)}
            placeholder="Enter new Student ID"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEditSave}>Save</Button>
        </Modal.Footer>
      </Modal>


    </div>

       

        </>
    )
}

export default SupadIdRegister;
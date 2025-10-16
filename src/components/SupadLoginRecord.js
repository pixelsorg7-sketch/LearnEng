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
import { FaBook, FaCrown,FaChevronDown, FaSearch, FaArrowRight } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import SupadLoginRecordSt from '../styleweb/SupadLoginRecordSt.module.css'
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
import BgImage from '../assets/Web_Admin_Modules_BG.png';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SupadLoginRecord=()=>{

     const navigator = useNavigate();

     // State to store the search input
  const [search, setSearch] = useState('');

  // Sample data for the login records table
  // const data = [];

const [loginData,setloginData]=useState([])

  //render login data

  useEffect(()=>{

    const renderallLogin=async()=>{

      const loginrecordsdblist = collection(firestore,"login-records")
      const whereloginrecord = query(loginrecordsdblist)
      const getloginrecords = await getDocs(whereloginrecord)
      const loginrecordData = getloginrecords.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
      }))

      setloginData(loginrecordData)

    }

    renderallLogin()

  },[])

  

  //sample data

  const [sampleData,setsampleData]=useState([
    {samp1:"dfgdgdg"},
     {samp1:"dfd"},
      {samp1:"aaafgdsdfgdg"},
      {samp1:"dfgdgfdffdg"},
      {samp1:"sdfsgdgdg"},
        {samp1:"fghf"},
        {samp1:"sdfsf"},
        {samp1:"dfgdgdg"},
        {samp1:"dfgdgdg"},
        {samp1:"dfgdgdg"},
      {samp1:"dfgdgdg"},
       {samp1:"dfgdgdg"},
        {samp1:"dfgdgdg"}
  ])

  //paginator feature-----------------

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

   // Calculate pagination
  const totalItems = loginData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const currentData = useMemo(() => 
    loginData.slice(startIndex, endIndex),
    [loginData, startIndex, endIndex]
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

// Filter data based on the search term (case insensitive)
  const filtered = currentData.filter((item) =>
    item.username.toLowerCase().includes(search.toLowerCase())
  );
    return(
        <>

           <div
  className={SupadLoginRecordSt.loginrecordslayout}
  style={{
    backgroundImage: `url(${BgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>

      {/* Sidebar */}
      <div className={SupadLoginRecordSt.sidebar}>
        <Image src={LearnEngLogo} alt="logo" className={SupadLoginRecordSt.sidebarlogo}/>

        <div className={SupadLoginRecordSt.logoutwrapper}>
          <Button onClick={()=>navigator('/SuperAdminPage')} className={SupadLoginRecordSt.logoutbutton}>
            Back <FaArrowRight />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={SupadLoginRecordSt.maincontent}>
        <div className={SupadLoginRecordSt.topheader}>
          <span className={SupadLoginRecordSt.welcometext}>Welcome, Admin!</span>
          <div className={SupadLoginRecordSt.searchbar}>
            <Form.Control
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className={SupadLoginRecordSt.searchicon}><FaSearch /></span>
          </div>
        </div>

        <h2 className={SupadLoginRecordSt.maintitle}>Teacher Log In Records</h2>

        <div className={SupadLoginRecordSt.tablesection}>
          <Table bordered className={SupadLoginRecordSt.recordstable}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Time Log In</th>
                <th>Time Log Out</th>
                <th>Date Logged In</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record, index) => (
                <tr key={index}>
                  <td>{record.username}</td>
                  <td>{record.email}</td>
                  <td>{record.timelogin}</td>
                  <td>{record.timelogout}</td>
                  <td>{record.datelogin}</td>
                </tr>
              ))}

          
              {/* {filtered.map((element,index)=>(
              <tr>
                <td>{element.samp1}</td>
                <td>sdfsfd</td>
                 <td>sdfsfd</td>
                  <td>sdfsfd</td>
                   <td>sdfsfd</td>
              </tr>
              ))} */}
            </tbody>
          </Table>

            
         {/* Simple Pagination Controls */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div style = {{fontSize:20,fontWeight:'bold'}}>
          Page <span>{currentPage}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
        </div>
        
        <div className={SupadLoginRecordSt.paginationcon}>
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={SupadLoginRecordSt.pagibtn}
          >
            <ChevronLeft size={16} color='white'/>
          <h6 className={SupadLoginRecordSt.pagitextbtn}>Prev</h6>
          </button>

          {/* Page Numbers */}
          <div className={SupadLoginRecordSt.pagenumbercon}>
            {visiblePages.map((page,index) => (
              <button
                  key={`${page}-${index}`}
                onClick={() => page !== '...' ? handlePageChange(page) : null}
                 className={[currentPage === page ? `${SupadLoginRecordSt.pagipageclicked}` : SupadLoginRecordSt.pagipage]}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
             className={SupadLoginRecordSt.pagibtn}
          > 
           <ChevronRight size={16} color='white'/>
           <h6 className={SupadLoginRecordSt.pagitextbtn}>Next</h6>
          
          </button>
        </div>
      </div>

        </div>
      </div>
    </div>
{/* 
    <Row style={{ minHeight: '100vh', overflow: 'hidden' }}>
      
  
      <Col md={2} style={{
        background: 'linear-gradient(to bottom, #f8cf5f, #aa82f5)', // Gradient background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
        position: 'relative'
      }}>
        
   
        <Image
          src={projectlogo}
          alt="logo"
          style={{
            width: '140px',
            height: 'auto',
            objectFit: 'contain',
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 0 5px rgba(0,0,0,0.1)'
          }}
        />

   
        <Button variant="danger" style={{
          width: '100%',
          background: 'linear-gradient(to right, #f98f73, #fadc7b)',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '20px',
          border: 'none',
          boxShadow: '0 0 5px #fff',
          fontSize: '0.8rem',
          padding: '8px 10px',
          marginBottom: 'auto'
        }}>
          Super Admin Dashboard
        </Button>

     
        <div style={{ position: 'absolute', bottom: '30px', width: '100%', padding: '0 10px' }}>
          <Button
            variant="warning"
            className="w-100 d-flex justify-content-between align-items-center"
            style={{ borderRadius: '999px' }}
          >
            Log Out <FaArrowRight />
          </Button>
        </div>
      </Col>


      <Col md={10} style={{ backgroundColor: '#fff3da', padding: '0' }}>

 
        <div style={{
          background: 'linear-gradient(to right, #b86dd8, #d77dd8)',
          color: 'white',
          padding: '10px 20px',
          textAlign: 'right',
          fontWeight: 'bold'
        }}>
          Welcome, Super Admin!
        </div>


        <div style={{ padding: '30px' }}>
      
          <Row className="mb-3 justify-content-between">
            <Col><h4><strong>Admin Log-in Records</strong></h4></Col>

      
            <Col xs="auto">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <InputGroup.Text><FaSearch /></InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>


          <div style={{ overflowX: 'auto' }}>
            <Table bordered style={{ backgroundColor: '#fff7e6' }}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Time Log-in</th>
                  <th>Time Log-out</th>
                  <th>Date Log-in</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record, index) => (
                  <tr key={index}>
                    <td>{record.username}</td>
                    <td>{record.email}</td>
                    <td>{record.timelogin}</td>
                    <td>{record.timelogout}</td>
                    <td>{record.datelogin}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Col>
    </Row> */}

        </>
    )
}


export default SupadLoginRecord;
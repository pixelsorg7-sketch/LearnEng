

import { Bar } from 'react-chartjs-2';
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
import { FaStar ,FaBook, FaCrown,FaChevronDown, FaSearch, FaArrowRight,FaFacebook,FaSchool,FaFilePdf  } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiLevelEndFlag } from "react-icons/gi";
import {PiStudentBold , PiWarningCircleFill } from "react-icons/pi";
import { FaFileCircleQuestion,FaSquareXTwitter } from "react-icons/fa6";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { toast } from "react-toastify";
import { RiResetLeftFill } from "react-icons/ri";

import { GoogleGenAI } from "@google/genai";


import jsPDF from 'jspdf';
import AnalyticsSt from '../styleweb/AnalyticsSt.module.css'

import Background from '../assets/Category__Game_1_BG.png';
import LearnEngLogo from '../assets/LearnEngLG.png';
import SchoolLogo from '../assets/schoollogo.png';
import { serverTimestamp ,onSnapshot,addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit, getDoc,doc,Timestamp} from '@firebase/firestore';
import { firestore } from '../firebase';
import { storage } from '../firebase';
import { AIinit } from '../firebase';
import { getStorage,ref, uploadBytes, getDownloadURL, updateMetadata,deleteObject  } from "firebase/storage";

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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });


const Analytics =()=>{
       const navigator = useNavigate();  //navigator
      const {ProfileActive,setProfileActive}=useContext(MyContext);
      //profile img management
        const [profileUrlName,setprofileUrlName]=useState(null)

      const [dropdownOpen, setDropdownOpen] = useState(false);

      const formRef = useRef(null);
            //terms and conditions modal
        
            const [termsConModal,settermsConModal]=useState(false)
      
            const [aboutUsModal,setaboutUsModal]=useState(false)
      
            const [contactUsModal,setcontactUsModal]=useState(false)
      
      
             const handleSubmit = () => {
          alert('Submitted successfully!');
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.reset();
            }
          }, 100);
        };
            

  //useState----
 
  const [search, setSearch] = useState('');

const [studentList,setstudentList]=useState([]);
   const [selected, setSelected] = useState(null);
   const [studSelectedindex,setstudSelectedindex]=useState(null);
   const [studSummarize,setstudSummarize]=useState("NALL")
   const [sumLoading,setsumLoading]=useState(false);
   const [overallStudentAverage,setoverallStudentAverage]=useState(0)
    const [overallStudentAssessment,setoverallStudentAssessment]=useState(0)
   //overall assessment to all graade lvel state
 const [gradeOverall,setgradeOverall]=useState([
    {type:"grammar",average:1},
    {type:"spelling",average:1},
   {type:"reading",average:1}
  ])
const [gradeOverallAverage,setgradeOverallAverage]=useState(0);
const [gradeOverallAssessment,setgradeOverallAssessment]=useState(0);
const [startDate2, setStartDate2] = useState('');
const [endDate2, setEndDate2] = useState('');



//summarize gradeoverall
const [gradeOverallSummarize,setgradeOverallSummarize]=useState("NALL")

   //dropdown 

   const [dropDownChart,setdropDownChart]=useState(false)

   //select analytics

   const [showAnalyticsType,setshowAnalyticsType]=useState("overall assessment")

   //overall certain aassessment

   const [overallAssessment,setoverallAssessment]=useState(0);
  // Add this state near your other useState declarations

  //filter student year
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//graph certain student filter by day-month


const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');

// Generate array of years for dropdown (last 10 years)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

const [isLoading,setisLoading]=useState(false)


// Month options
const months = [
  { value: 'all', label: 'All Months' },
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' }
];
//useEffect----

//print all students----



useEffect(()=>{
  
  const RenderAnalytics=()=>{

    setisLoading(true)

   if (!ProfileActive?.gradelevel) return;

      //  let startDate, endDate;
const startDate = Timestamp.fromDate(new Date(selectedYear, 0, 1, 0, 0, 0));
  const endDate = Timestamp.fromDate(new Date(selectedYear, 11, 31, 23, 59, 59));


  const analyticsdblist = collection(firestore,"analytics")
  const whereAnalytics = query(analyticsdblist,
    where("gradelevel",'==',ProfileActive.gradelevel),
 
  );
//  const getAnalytics = await getDocs(whereAnalytics)
   const unsubscribe = onSnapshot(whereAnalytics, (snapshot) => {
  const AnalyticsData = snapshot.docs.map((doc)=>({
    id:doc.id,
    ...doc.data()
  })).filter((item) => {
if (!item.datecreated) return false;
const docDate = item.datecreated.toDate();
return docDate >= startDate.toDate() && docDate <= endDate.toDate();
});

  

  setstudentList(AnalyticsData)
   if (AnalyticsData.length > 0) {
      setSelected(AnalyticsData[0]);
      setstudSelectedindex(0) // ✅ set first student
    }

});

     setisLoading(false)
  return () => unsubscribe();
  
   }

   RenderAnalytics()

},[ProfileActive,selectedYear])

//render profile pic
useEffect(()=>{
  
        const imageRender=async()=>{

          if (!ProfileActive?.profilepath) return;

        console.log(ProfileActive.profilepath)
        const imageRef = ref(storage,ProfileActive.profilepath);
        const url = await getDownloadURL(imageRef);
        setprofileUrlName(url)
        console.log(url)
         }
  
         imageRender()
      },[ProfileActive])
  

      //search func
  const filteredList = studentList.filter((s) =>
    s.studentname.toLowerCase().includes(search.toLowerCase())
  );

  //compute certain assessment average

  useEffect(()=>{

      if (!ProfileActive?.profilepath) return;
      if (!selected) return;

      if(showAnalyticsType === "overall assessment"){

          const filtered = filterByDateRange(selected.performance, selected.performancedate);
    if (filtered.data.length > 0) {
      const totalperformance = filtered.data.reduce((sum, score) => sum + score, 0);
      const averageperformance = Math.round(totalperformance / filtered.data.length);
      // setoverallAssessment(averagegrammar);
      setoverallStudentAverage(averageperformance)
      setoverallStudentAssessment(filtered.data.length)
    } else {
      setoverallStudentAssessment(0)
       setoverallStudentAverage(0)
    }

      }

      else if (showAnalyticsType === "grammar assessment") {
    const filtered = filterByDateRange(selected.grammarassessment, selected.grammardate);
    if (filtered.data.length > 0) {
      const totalgrammar = filtered.data.reduce((sum, score) => sum + score, 0);
      const averagegrammar = Math.round(totalgrammar / filtered.data.length);
      // setoverallAssessment(averagegrammar);
      setoverallStudentAverage(averagegrammar)
       setoverallStudentAssessment(filtered.data.length)
    } else {
      setoverallStudentAssessment(0)
       setoverallStudentAverage(0)
    }
  }
  else if (showAnalyticsType === "spelling assessment") {
    const filtered = filterByDateRange(selected.spellingassessment, selected.spellingdate);
    if (filtered.data.length > 0) {
      const totalspelling = filtered.data.reduce((sum, score) => sum + score, 0);
      const averagespelling = Math.round(totalspelling / filtered.data.length);
      // setoverallAssessment(averagespelling);
      setoverallStudentAverage(averagespelling)
      setoverallStudentAssessment(filtered.data.length)

    } else {
       setoverallStudentAssessment(0)
       setoverallStudentAverage(0)
    }
  }
  else if (showAnalyticsType === "reading assessment") {
    const filtered = filterByDateRange(selected.readingassessment, selected.readingdate);
    if (filtered.data.length > 0) {
      const totalreading = filtered.data.reduce((sum, score) => sum + score, 0);
      const averagereading = Math.round(totalreading / filtered.data.length);
      // setoverallAssessment(averagereading);
        setoverallStudentAverage(averagereading)
        setoverallStudentAssessment(filtered.data.length)
    } else {
      // setoverallAssessment(0);
       setoverallStudentAssessment(0)
       setoverallStudentAverage(0)
    }
  }



  },[selected,showAnalyticsType,ProfileActive,startDate,endDate, selectedYear])


//  filterByMonth function with date range support on certain student

const filterByDateRange  = (assessments, dates) => {
  // If no date range is set, return all data
  if (!startDate && !endDate) {
    return {
      data: assessments || [],
      indices: assessments ? assessments.map((_, i) => i) : []
    };
  }

  if (!dates) {
    return {
      data: assessments || [],
      indices: assessments ? assessments.map((_, i) => i) : []
    };
  }

  const filtered = (assessments || [])
    .map((value, index) => ({
      value,
      date: dates[index],
      originalIndex: index
    }))
    .filter(item => {
      if (!item.date) return false;
      
      const date = item.date.toDate ? item.date.toDate() : new Date(item.date.seconds * 1000);
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      // If both dates are set
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return dateOnly >= start && dateOnly <= end;
      }
      
      // If only start date is set
      if (startDate) {
        const start = new Date(startDate);
        return dateOnly >= start;
      }
      
      // If only end date is set
      if (endDate) {
        const end = new Date(endDate);
        return dateOnly <= end;
      }

      return true;
    });

  return {
    data: filtered.map(item => item.value),
    indices: filtered.map(item => item.originalIndex)
  };
};



// Updated filterByMonth function with date range support for overall


const filterByDateRange2  = (assessments, dates) => {
  // If no date range is set, return all data
  if (!startDate2 && !endDate2) {
    return {
      data: assessments || [],
      indices: assessments ? assessments.map((_, i) => i) : []
    };
  }

  if (!dates) {
    return {
      data: assessments || [],
      indices: assessments ? assessments.map((_, i) => i) : []
    };
  }

  const filtered = (assessments || [])
    .map((value, index) => ({
      value,
      date: dates[index],
      originalIndex: index
    }))
    .filter(item => {
      if (!item.date) return false;
      
      const date = item.date.toDate ? item.date.toDate() : new Date(item.date.seconds * 1000);
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      // If both dates are set
      if (startDate2 && endDate2) {
        const start = new Date(startDate2);
        const end = new Date(endDate2);
        return dateOnly >= start && dateOnly <= end;
      }
      
      // If only start date is set
      if (startDate2) {
        const start = new Date(startDate2);
        return dateOnly >= start;
      }
      
      // If only end date is set
      if (endDate2) {
        const end = new Date(endDate2);
        return dateOnly <= end;
      }

      return true;
    });

  return {
    data: filtered.map(item => item.value),
    indices: filtered.map(item => item.originalIndex)
  };
};


  //chart embedded Data

  const whiteBackgroundPlugin = {
  id: 'whiteBackground',
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white'; // <-- background color here
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};
  
  const chartData = selected ? (()=> {

     const filtered = filterByDateRange(selected.performance, selected.performancedate);
        if (filtered.data.length === 0) return null;

    return{
    labels: filtered.data.map((element, index) => `Session ${index + 1}`),
    datasets: [
      {
        label: 'Overall Playroom Grade (Max. Cap 100%)',
        backgroundColor: ['#d1a640', '#f9db63', '#96c25f', '#467845', '#b8a537', '#9b7832'],
        data: filtered.data,

        categoryPercentage: 0.7,
      barPercentage: 0.6, 
      },
      
    ],
   };
    
  })() : null;

   const spellingData = selected ? (()=> {
      const filtered = filterByDateRange(selected.spellingassessment, selected.spellingdate);
        if (filtered.data.length === 0) return null;

      return{
    labels: filtered.data.map((element, index) => `Spelling ${index + 1}`),
    datasets: [
      {
        label: 'Overall Spelling Grade (Max. Cap 100%)',
        backgroundColor: ['#d1a640', '#f9db63', '#96c25f', '#467845', '#b8a537', '#9b7832'],
        data: filtered.data,

      categoryPercentage: 0.7,
      barPercentage: 0.6,   
      },
    ],
  };
  })(): null;

   const grammarData = selected ? (()=>{

    const filtered = filterByDateRange(selected.grammarassessment, selected.grammardate);
    if (filtered.data.length === 0) return null;

    return{ 
    labels: filtered.data.map((element, index) => `Grammar ${index + 1}`),
    datasets: [
      {
        label: 'Overall Grammar Grade (Max. Cap 100%)',
        backgroundColor: ['#d1a640', '#f9db63', '#96c25f', '#467845', '#b8a537', '#9b7832'],
        data: filtered.data,

        categoryPercentage: 0.7,
      barPercentage: 0.6, 
      },
    ],
  };
  })() : null;

   const readingData = selected ? (()=> {

     const filtered = filterByDateRange(selected.readingassessment, selected.readingdate);
    if (filtered.data.length === 0) return null;

    return{
    labels: filtered.data.map((element, index) => `Reading  ${index + 1}`),
    datasets: [
      {
        label: 'Overall Reading Grade (Max. Cap 100%)',
        backgroundColor: ['#d1a640', '#f9db63', '#96c25f', '#467845', '#b8a537', '#9b7832'],
        data: filtered.data,

          categoryPercentage: 0.7,
      barPercentage: 0.6,
      },
    ],
  }
  })() : null;

  //overall student data

  const overallData = gradeOverall ? (()=> {
  // Check if gradeOverall has valid data
  if (!gradeOverall || gradeOverall.length === 0) return null;
  
  // Check if any average is valid (greater than 0)
  const hasValidData = gradeOverall.some(element => element.average > 0);
  if (!hasValidData) return null;

  return {
    labels: gradeOverall.map((element) => {
      return element.type === "grammar" ? "Grammar" : 
             element.type === "spelling" ? "Spelling" : "Reading";
    }),
    datasets: [
      {
        label: ` Grade ${ProfileActive.gradelevel}'s Overall Performance (Max. Cap 100%)`,
        backgroundColor: ['#d1a640', '#f9db63', '#96c25f', '#467845', '#b8a537', '#9b7832'],
        data: gradeOverall.map(element => element.average),
        categoryPercentage: 0.7,
        barPercentage: 0.6,
      },
    ],
  };
})() : null;



//bar design

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // allow full container height
  plugins: {
    legend: { 
    display: true,
      labels: {     
      boxWidth: 0,    
      color: '#000',
       font: {
          size: 16,    // 🔹 change font size
          weight: 'bold', // optional
          family: 'Arial' // optional
        }
      }

    },

    
  },
   scales: {
    x: {
      ticks: {
        color: "#000",
        callback: function(value, index, ticks) {
          return this.getLabelForValue(value).toUpperCase();
        }
      },
      grid: {
        color: "rgba(0,0,0,0.1)"
      }
    },
    y: {
      ticks: {
        color: "#000",
      },
      grid: {
        color: "rgba(0,0,0,0.1)"
      }
    }
  }
  
};

//select student func
const selectStudFunc=async(student,index)=>{


  setSelected(student)
  setstudSelectedindex(index)            
}

//reset date filter

const ResetDateFilterStudent=(con)=>{

  if(con === "studentfilterreset"){
  setEndDate('')
  setStartDate('')
}

else{
  setEndDate2('')
  setStartDate2('')
}

}

//genrate Donwloadable PDF to summary overall

const SummaryRef = useRef(null);

const downloadSummaryPDF =async () => {

    if(startDate2 !== "" && endDate2 ==="" || 
    startDate2 === "" && endDate2 !==""
  ){
    toast.error(`Incomplete filter`, {
                 position:'top-center',   
                 autoClose: 3000,      
                hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
               draggable: false,
            });
    return;
  }


  const chartInstance = SummaryRef.current;

  if (!chartInstance) {
    toast.error(`Empty chart`, {
                 position:'top-center',   
                 autoClose: 3000,      
                hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
               draggable: false,
            });
    return;
  }

  try {
    // Export chart as base64 image
    const chartImage = chartInstance.toBase64Image();

    // Create new PDF document
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    /** ---------------------------
     *  Title & Header Information
     * --------------------------- */
  const LatestDate = new Date().toLocaleDateString('en-US', {
   year: 'numeric',
     month: 'short',
  day: 'numeric',
});

     const getImageAsBase64 = async (url) => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('Error fetching image:', error);
          throw error;
        }
      };


       // Load and convert logo to base64

     const logoWidth = 70;
      const logoHeight = 15;

       const schoollogoWidth = 30;
      const schoollogoHeight = 15;

     const logoBase64 = await getImageAsBase64(LearnEngLogo);
         const logoschoolBase64 = await getImageAsBase64(SchoolLogo);

// Get page width for centering
const pageWidth = pdf.internal.pageSize.getWidth(); // 297mm for landscape A4
const centerX = (pageWidth - logoWidth) / 1.6;
const centerX2 = (pageWidth - logoWidth) / 2.3;

   pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
// Logo centered at top

// Logo centered at top
pdf.addImage(logoBase64, 'PNG', centerX, 10, logoWidth, logoHeight);

const lineX = pageWidth / 2.2;
const lineStartY = 10;
const lineEndY = 25;
pdf.setDrawColor(0, 0, 0);
pdf.setLineWidth(0.5);
pdf.line(lineX, lineStartY, lineX, lineEndY);

pdf.addImage(logoschoolBase64, 'PNG', centerX2, 10, schoollogoWidth, schoollogoHeight);


    pdf.text('LearnENG Grade Level Yearly Summary Report', 148, 43, { align: 'center' });
    
    pdf.setDrawColor(150);
    pdf.setLineWidth(0.5);
pdf.line(20, 48, pageWidth - 20, 48); // divider under header


    // Reset font to normal and add text
    // pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
pdf.text("Grade Level:", 20, 55);
pdf.setFont("helvetica", "normal");
pdf.text(`${selected.gradelevel}`, 50, 55);

pdf.setFont("helvetica", "bold");
pdf.text("School Year:", 20, 65);
pdf.setFont("helvetica", "normal");
pdf.text(`${selectedYear} / ${selectedYear + 1}`, 50, 65);

pdf.setFont("helvetica", "bold");
pdf.text("Prepared By:", 20, 75);
pdf.setFont("helvetica", "normal");
pdf.text(`${ProfileActive.firstname} ${ProfileActive.lastname}`, 50, 75);


pdf.setFont("helvetica", "bold");
pdf.text("Date Created:", 160, 55);
pdf.setFont("helvetica", "normal");
pdf.text(`${LatestDate}`, 190, 55);

pdf.setFont("helvetica", "bold");
pdf.text("Average score:", 160, 65);
pdf.setFont("helvetica", "normal");
pdf.text(`${gradeOverallAverage}%`, 200, 65);


pdf.setFont("helvetica", "bold");
pdf.text("Total assessment taken:", 160, 75);
pdf.setFont("helvetica", "normal");
pdf.text(`${gradeOverallAssessment}`, 215, 75);

pdf.setFont('helvetica', 'bold');
pdf.text('Month Range:', 105, 91);
pdf.setFont('helvetica', 'italic');

if(startDate2 !== '' && endDate2 !== ''){

  const startDateObj = new Date(startDate2);
  const endDateObj = new Date(endDate2);

  const startfullDate = startDateObj.toLocaleDateString('en-US', { 
  year: 'numeric',    // "2024"
  month: 'long',      // "March"
  day: 'numeric'      // "15"
  });
    
  const endfullDate = endDateObj.toLocaleDateString('en-US', { 
  year: 'numeric',    // "2024"
  month: 'long',      // "March"
  day: 'numeric'      // "15"
  });

pdf.text(
 `${startfullDate} / ${endfullDate}`,
  140,
  91
);
}else{
pdf.text(
 `All Month`,
   140,
  91
); 
}
    // Add the graph (adjusted Y position to avoid overlap)
    const imgWidth = 270;
    const imgHeight = 100;
    pdf.addImage(chartImage, 'PNG', 20, 98, imgWidth, imgHeight); // Changed from 45 to 50

    // Summary report
    if (
      gradeOverallSummarize &&
      !["Loading response.....", "NALL", "Error generating Summary :("].includes(gradeOverallSummarize)
    ) {
      pdf.addPage();
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('Performance Summary', 20, 20);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);

      const formattedSummary = pdf.splitTextToSize(gradeOverallSummarize, 257);
      pdf.text(formattedSummary, 20, 35);
    }

    /** ---------------------------
     *  Save PDF
     * --------------------------- */
    // const fileName = `LearnEng Summary Report (SY ${selectedYear}).pdf`;
    // pdf.save(fileName);
      const pdfBlob = pdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');

  } catch (error) {
    console.error('PDF Generation Error:', error);
     toast.error(`❌ Failed to generate PDF. Please try again.`, {
                 position:'top-center',   
                 autoClose: 3000,      
                hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
               draggable: false,
            });
  }
};


// Generate Downloadable PDF per student
const chartRef = useRef(null);

const downloadChartAsPDF =() => {

  if(startDate !== "" && endDate ==="" || 
    startDate === "" && endDate !==""
  ){
    toast.error(`Incomplete filter`, {
                 position:'top-center',   
                 autoClose: 3000,      
                hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
               draggable: false,
            });
    return;
  }

  setTimeout(async() => {   
    
    console.log('Inside setTimeout');
    const chartInstance = chartRef.current;
    console.log('Chart instance:', chartInstance); //

    if (!chartInstance) {
       toast.error(`Empty chart`, {
                 position:'top-center',   
                 autoClose: 3000,      
                hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
               draggable: false,
            });
      return;
    }

    try {
      // Export chart as base64 image
      console.log('Starting PDF generation');
      const chartImage = chartInstance.toBase64Image();

      // Create new PDF document
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

       const imgWidth = 270;
      const imgHeight = 80;
      
       const logoWidth = 70;
      const logoHeight = 15;

       const schoollogoWidth = 20;
      const schoollogoHeight = 15;


      /** ---------------------------
       *  Title & Header Information
       * --------------------------- */
    const getImageAsBase64 = async (url) => {
        try {

          const response = await fetch(url);
          const blob = await response.blob();
          
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('Error fetching image:', error);
          throw error;
        }
      };

      // Load and convert logo to base64
     const logoBase64 = await getImageAsBase64(LearnEngLogo);
    const logoschoolBase64 = await getImageAsBase64(SchoolLogo);


// Get page width for centering
const pageWidth = pdf.internal.pageSize.getWidth(); // 297mm for landscape A4
const centerX = (pageWidth - logoWidth) / 1.6;
const centerX2 = (pageWidth - logoWidth) / 2.3;
// Logo centered at top
pdf.addImage(logoBase64, 'PNG', centerX, 10, logoWidth, logoHeight);

const lineX = pageWidth / 2.3;
const lineStartY = 10;
const lineEndY = 25;
pdf.setDrawColor(0, 0, 0);
pdf.setLineWidth(0.5);
pdf.line(lineX, lineStartY, lineX, lineEndY);

pdf.addImage(logoschoolBase64, 'PNG', centerX2, 10, schoollogoWidth, schoollogoHeight);

// Title centered below logo
pdf.setFont('helvetica', 'bold');
pdf.setFontSize(25);
pdf.text('LearnENG Analytics Report', pageWidth / 2, 43, { align: 'center' });

// Divider line below title
pdf.setDrawColor(150);
pdf.setLineWidth(0.5);
pdf.line(20, 48, pageWidth - 20, 48);

// ✅ Student information in TWO COLUMNS (side by side)
pdf.setFontSize(13);
pdf.setFont('helvetica', 'normal');

const leftColumn = 20;
const rightColumn = 150;
let yPos = 58;

 const dateCreated = selected.datecreated.toDate().toLocaleDateString('en-US', {
    year: 'numeric',
  });  
  
  const LatestDate = new Date().toLocaleDateString('en-US', {
   year: 'numeric',
     month: 'short',
  day: 'numeric',
});

const nextYear = currentYear + 1;

// Left column
pdf.setFont('helvetica', 'bold');
pdf.text('Student:', leftColumn, yPos);
pdf.setFont('helvetica', 'normal');
pdf.text(`${selected.studentname}`, leftColumn + 20, yPos);

pdf.setFont('helvetica', 'bold');
pdf.text('Grade Level:', leftColumn, yPos + 7);
pdf.setFont('helvetica', 'normal');
pdf.text(`${selected.gradelevel}`, leftColumn + 30, yPos + 7);


// Right column
pdf.setFont('helvetica', 'bold');
pdf.text('Assessment Type:', rightColumn, yPos);
pdf.setFont('helvetica', 'normal');
pdf.text(`${showAnalyticsType}`, rightColumn + 45, yPos);


pdf.setFont('helvetica', 'bold');
pdf.text('School Year:', rightColumn, yPos + 7);
pdf.setFont('helvetica', 'normal');
pdf.text(`${dateCreated} / ${nextYear}`, rightColumn + 35, yPos + 7);


// ✅ Statistics section
yPos += 15;

pdf.setFontSize(12);
pdf.setFont('helvetica', 'italic');



pdf.setFont('helvetica', 'bold');
pdf.text('Total Average Score:', leftColumn, yPos);
pdf.setFont('helvetica', 'italic');
pdf.text(`${overallStudentAverage}%`, leftColumn + 45, yPos);

pdf.setFont('helvetica', 'bold');
pdf.text('Total Assessments:', rightColumn, yPos);
pdf.setFont('helvetica', 'italic');
pdf.text(`${overallStudentAssessment}`, rightColumn + 50, yPos);

pdf.setFont('helvetica', 'bold');
pdf.text('Date Created:', rightColumn, 81);
pdf.setFont('helvetica', 'italic');
pdf.text(`${LatestDate}`, rightColumn + 35, 81);

pdf.setFont('helvetica', 'bold');
pdf.text('Prepared By:', leftColumn, yPos + 10);
pdf.setFont('helvetica', 'italic');
pdf.text(`${ProfileActive.firstname} ${ProfileActive.lastname}`, leftColumn + 35, yPos + 10);
// ✅ Chart section (with more space above)
pdf.setFont('helvetica', 'bold');

pdf.text('Month Range:', 110, 91);
pdf.setFont('helvetica', 'italic');

if(startDate !== '' && endDate !== ''){

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const startfullDate = startDateObj.toLocaleDateString('en-US', { 
  year: 'numeric',    // "2024"
  month: 'long',      // "March"
  day: 'numeric'      // "15"
  });
    
  const endfullDate = endDateObj.toLocaleDateString('en-US', { 
  year: 'numeric',    // "2024"
  month: 'long',      // "March"
  day: 'numeric'      // "15"
  });

pdf.text(
 `${startfullDate} / ${endfullDate}`,
  140,
  91
);
}
else{
 pdf.text(
 `All Month`,
  140,
  91
); 
}
yPos += 25;
pdf.addImage(chartImage, 'PNG', (pageWidth - imgWidth) / 2, yPos, imgWidth, imgHeight);

      /** ---------------------------
       *  Summary Section
       * --------------------------- */
      if (
        studSummarize &&
        !["Loading response.....", "NALL", "Error generating Summary :("].includes(studSummarize)
      ) {
        pdf.addPage();
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text(' Performance Summary', 20, 20);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);

        const formattedSummary = pdf.splitTextToSize(studSummarize, 257);
        pdf.text(formattedSummary, 20, 35);
      }

      /** ---------------------------
       *  Footer (Page / Date)
       * --------------------------- */
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(120);
        pdf.text(
          `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
          148,
          200,
          { align: 'center' }
        );
      }

      /** ---------------------------
       *  Save PDF
       * --------------------------- */
       const pdfBlob = pdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');

      // const fileName = `${selected.studentname}-${showAnalyticsType.replace(/\s+/g, '-')}.pdf`;
      // pdf.save(fileName);

    } catch (error) {
      console.error('PDF Generation Error:', error);
      // alert('❌ Failed to generate PDF. Please try again.');
      toast.error(`Failed to generate PDF. Please try again.`, {
                 position:'top-center',   
                 autoClose: 3000,      
                hideProgressBar: false,
              closeButton:false,
              pauseOnHover: false,
               draggable: false,
            });
    }
  }, 300);
};


//summarize overall gradelvel ai

useEffect(()=>{

     if (!ProfileActive?.gradelevel) return;

setgradeOverallSummarize("Loading Response....")
setsumLoading(true)

  let grammarOverall = []
  let spellingOverall = []
 let readingOverall = []

 const gradeOverallupdate = [...gradeOverall]
 studentList.map((element,index)=>{

 //compute per student average 
  if (element.grammarassessment?.length > 0 && element.grammardate) {
  const filtered = filterByDateRange2(element.grammarassessment, element.grammardate);
   if (filtered.data?.length > 0) {

  const totalgrammar = filtered.data.reduce((sum, score) => sum + score, 0);
  const averagegrammar =  Math.round(totalgrammar / filtered.data.length);
   grammarOverall.push(averagegrammar)
 }
}

  if (element.spellingassessment?.length > 0 && element.spellingdate) {
   const filtered = filterByDateRange2(element.spellingassessment, element.spellingdate);
      if (filtered.data.length > 0) {
        const totalspelling = filtered.data.reduce((sum, score) => sum + score, 0);
        const averagespelling = Math.round(totalspelling / filtered.data.length);
        spellingOverall.push(averagespelling);
      }
}

  if (element.readingassessment?.length > 0 && element.readingdate) {
      const filtered = filterByDateRange2(element.readingassessment, element.readingdate);
      if (filtered.data.length > 0) {
        const totalreading = filtered.data.reduce((sum, score) => sum + score, 0);
        const averagereading = Math.round(totalreading / filtered.data.length);
        readingOverall.push(averagereading);
      }
    }

 
})

 //compute overall average

  const overallgrammar = grammarOverall.reduce((sum, score) => sum + score, 0);
  const averageoverallgrammar =  Math.round(overallgrammar / grammarOverall.length);
 gradeOverallupdate[0].average = averageoverallgrammar

   const overallspelling = spellingOverall.reduce((sum, score) => sum + score, 0);
  const averageoverallspelling =  Math.round(overallspelling / spellingOverall.length);
  gradeOverallupdate[1].average = averageoverallspelling

    const overallreading = readingOverall.reduce((sum, score) => sum + score, 0);
  const averageoverallreading =  Math.round(overallreading / readingOverall.length);
  gradeOverallupdate[2].average = averageoverallreading

setgradeOverall(gradeOverallupdate)

 const overallgrade = Math.min(
  100,
  Math.round((averageoverallgrammar + averageoverallspelling + averageoverallreading) / 3)
);

setgradeOverallAverage(overallgrade)
setgradeOverallAssessment(grammarOverall.length + spellingOverall.length + readingOverall.length)
   setsumLoading(false)

//ai overall summary

const aiSum=async()=>{

  if (studentList.length === 0) return; 

  try{
 const prompt = `Can you summarize the performance of all overall students performance of grade ${ProfileActive.gradelevel}.

 - Grammar Assessment Average: ${averageoverallgrammar}

 - Spelling Assessment Average: ${averageoverallspelling}

  - Reading Assessment Average: ${averageoverallreading}

      Talk like a person but professionally. Straight to the point.Make it short if possible.Dont make the summarization complex.Dont put too much unnecessary symbols.Tell me your thoughts about it`;

       const result = await AIinit.generateContent(prompt);
    const response = result.response;

    setgradeOverallSummarize(response.candidates[0].content.parts[0].text)
  
  }

  catch(e){
    setgradeOverallSummarize("Error generating Summary :(")
  }
}

aiSum();
},[studentList,endDate2,startDate2])

//summarize per student ai
useEffect(()=>{

  const sumAi=async()=>{

       setstudSummarize("Loading response.....")
       setsumLoading(true)

   if (selected === null) return; 

    try{

      const totalperformance = selected.performance.reduce((sum, score) => sum + score, 0);
  const average =  Math.round(totalperformance / selected.performance.length);

   const totalgrammar = selected.grammarassessment.reduce((sum, score) => sum + score, 0);
  const averagegrammar =  Math.round(totalgrammar / selected.grammarassessment.length);

   const totalspelling = selected.spellingassessment.reduce((sum, score) => sum + score, 0);
  const averagespelling =  Math.round(totalspelling / selected.spellingassessment.length);

   const totalreading = selected.readingassessment.reduce((sum, score) => sum + score, 0);
  const averagereading =  Math.round(totalreading / selected.readingassessment.length);

  const prompt = `Can you summarize the performance of ${selected.studentname}.

      Overall Performance:

      ${selected.performance.length} <- total playroom assessment completed
      ${average} <- overall average in playroom assessment

      Grammar assessment Performance:

     
      ${averagegrammar} <- overall average in grammar assessment
      Spelling assessment Peformance:

    
       ${averagespelling} <- overall average in spelling assessment
      Reading assessment Performance: 

    
      ${averagereading} <- overall average in reading assessment

      Talk like a person but profesionally. Straight to the point.Dont make the summarization complex.Tell me your thoughts about it.
      Dont use you,we,I if possible.
      Make the explanation short
      `;

   const result = await AIinit.generateContent(prompt);
    const response = result.response;

    setstudSummarize(response.candidates[0].content.parts[0].text)
}

catch(e){
setstudSummarize("Error generating Summary :(")
}

     setsumLoading(false)
  }
   

  sumAi();



},[selected])


  return (
    <>
    <div className={AnalyticsSt.analyticswrapper} style={{ backgroundImage: `url(${Background})` }}>
     <div className={AnalyticsSt.header}>
                        <img src={LearnEngLogo} alt="LearnENG Logo" className={AnalyticsSt.logo} />
                
                        <div className={AnalyticsSt.userDropdown} >
                          <button
                            className={AnalyticsSt.userToggle}
                            onClick={() => setDropdownOpen((v) => !v)}
                          >
                            <span className={AnalyticsSt.welcomeText}>Welcome, {ProfileActive.username}!</span>
                            <img src={profileUrlName} alt="User Icon" className={AnalyticsSt.userIcon} />
                          </button>
                
                          {dropdownOpen && (
                            <div className={AnalyticsSt.dropdownCustom}>
                              <button
                                className={AnalyticsSt.dropdownItem}
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

      <div className={AnalyticsSt.analyticsbody}>
        <div className={AnalyticsSt.sidebar}>
            <button onClick={()=>navigator("/HomePage")} className={AnalyticsSt.backbtn}>Back</button>
        <div className={AnalyticsSt.backbtnwrapper}>
        <div className={AnalyticsSt.studentTitleCon}>
        <h3>Student Demographics</h3>
        </div>
          </div>
          <div className={AnalyticsSt.searchbar}>
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className={AnalyticsSt.searchicon}/>
          </div>

          {/* year filter */}
          <div className={AnalyticsSt.yearFilterContainer}>
  <label htmlFor="year-select" style={{ 
    fontSize: '14px', 
    fontWeight: '600', 
    marginBottom: '8px',
    display: 'block'
  }}>
    Filter by Year:
  </label>
  <select
    id="year-select"
    value={selectedYear}
    onChange={(e) => setSelectedYear(Number(e.target.value))}
    style={{
      width: '100%',
      padding: '8px 12px',
      fontSize: '14px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: 'white',
      cursor: 'pointer',
      marginBottom: '15px'
    }}
  >
    {years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
{/* 
  list of students */}
</div>
{filteredList.length !== 0 ?
          <div className={AnalyticsSt.studentlistpanel}>
            {filteredList.map((student, index) => (
              <button
                key={index}
                className={ AnalyticsSt.studentbtn}
                onClick={() => selectStudFunc(student,index)}
              >
                {student.studentname}
              </button>
            ))}
          </div>
          :
        <div className={AnalyticsSt.studentlistpanel}>
        </div>
          }
        </div> 

        {/* per student summary panel */}
        {filteredList.length!==0 ?
         <div className={AnalyticsSt.mainpanel}>
      {selected && (   //display null if data has not been rendered fully yet otherwise render
      <>
          <h2 className={AnalyticsSt.studenttitle}>{selected.studentname} – Student Data Overview</h2>
          <div className={AnalyticsSt.contentbox}>
            <div className={AnalyticsSt.profilesection}>
              <div className={AnalyticsSt.avatarcircle}>
                <PiStudentBold color='white' size={80}/>
              </div>
              <h4>Grade {selected.gradelevel} Student</h4>
              {/* <p>{selected.title}</p> */}

              <div className={AnalyticsSt.statbox}>
                <p className={AnalyticsSt.stattitle}>
                {showAnalyticsType==="overall assessment" ? 
                'Total Playroom Completed' : 
                showAnalyticsType==="spelling assessment" ?
                 'Total Spelling Assessment Taken' : 
                 showAnalyticsType === "grammar assessment" ?
                  'Total Grammar Assessment Taken' : 
                  'Total Reading Assessment Taken'
                }
                </p>
                <h2>{overallStudentAssessment}</h2>
              </div>

              <div className={AnalyticsSt.statbox}>
                <p className={AnalyticsSt.stattitle}>
                 {showAnalyticsType==="overall assessment" ? 
                'Overall Average per Playroom Session' : 
                showAnalyticsType==="spelling assessment" ?
                 'Overall Average per Spelling Assessment Taken' : 
                 showAnalyticsType === "grammar assessment" ?
                  'Overall Average per Grammar Assessment Taken' : 
                  'Overall Average per Reading Assessment Taken'
                }
                </p>
                <h2>{overallStudentAverage} %</h2>
              </div>
            </div>

            <div className={AnalyticsSt.chartsection}>
            {/* dropdown */}
             <div className={AnalyticsSt.dropdown}>
         {/* Toggle Button */}
         <div className={AnalyticsSt.dropdowncon}>

         <h3>From:</h3>
  

        <input
    id="start-date"
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    max={endDate || undefined}
    style={{
      padding: '8px 12px',
      fontSize: '14px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: 'white',
      cursor: 'pointer'
    }}
  />

<h3>To:</h3>

        <input
    id="end-date"
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    min={startDate || undefined}
    style={{
      padding: '8px 12px',
      fontSize: '14px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: 'white',
      cursor: 'pointer'
    }}
  />

         <button
        className={AnalyticsSt.dropdowntoggle}
        onClick={() => setdropDownChart(!dropDownChart)}
        >
        {showAnalyticsType} <FaChevronDown size={12} />
      </button>

       <button
       disabled={sumLoading}
       onClick={downloadChartAsPDF}
        className={AnalyticsSt.dropdowntoggle}
        >
      Save as PDF
      <FaFilePdf />
      </button>
      </div>

      {/* Dropdown Menu */}
      {dropDownChart && (
        <div className={AnalyticsSt.dropdownmenu}>
          <button onClick={()=>{setshowAnalyticsType("overall assessment")
          setdropDownChart(!dropDownChart)}} className={AnalyticsSt.dropdownitem}>Overall Asessment</button>
          <button onClick={()=>{setshowAnalyticsType("spelling assessment")
          setdropDownChart(!dropDownChart)}} className={AnalyticsSt.dropdownitem}>Spelling Assessment</button>
          <button onClick={()=>{setshowAnalyticsType("grammar assessment")
          setdropDownChart(!dropDownChart)}} className={AnalyticsSt.dropdownitem}>Grammar Assessment</button>
          <button onClick={()=>{setshowAnalyticsType("reading assessment")
          setdropDownChart(!dropDownChart)}} className={AnalyticsSt.dropdownitem}>Reading Asessment</button>
        </div>
      )}
    </div>
              <div className={AnalyticsSt.chartscroll}>

               {/* overall assessment bar */}

                {showAnalyticsType === "overall assessment" ?
                
                   <div className={AnalyticsSt.chartcard} style={{
                width: selected.performance.length <= 1 
                ? "400px" 
               : `${selected.performance.length * 250}px`
                 }}>

                  {selected.performance.length > 0 ? chartData ? <Bar  ref={chartRef} options={chartOptions}  data={chartData} plugins={[whiteBackgroundPlugin]} /> : "No Record to specific month" : "No Record"}
                

                </div>
                
                 : showAnalyticsType === "spelling assessment"  ?
                 <>
                {/* spelling assessment bar */}
                 <div className={AnalyticsSt.chartcard} style={{
                width: selected.spellingassessment.length <= 1 
                ? "400px" 
               : `${selected.spellingassessment.length * 250}px`
                 }}>

                {selected.spellingassessment.length > 0 ? spellingData ? <Bar ref={chartRef}  options={chartOptions}  data={spellingData} plugins={[whiteBackgroundPlugin]} /> : "No Record to specific month" : "No Record"}

                </div>
                    </>

                  :
                  showAnalyticsType === "grammar assessment" ?
                  <>
                 {/* grammar assessment bar */}

                 <div className={AnalyticsSt.chartcard} style={{
                width: selected.grammarassessment.length <= 1 
                ? "400px" 
               : `${selected.grammarassessment.length * 250}px`
                 }}>
             
              {selected.grammarassessment.length > 0 ? grammarData ? <Bar ref={chartRef} options={chartOptions}  data={grammarData} plugins={[whiteBackgroundPlugin]} /> : "No Record to specific month" : "No Record"}

                   </div> 

                   </>

                  :
                  showAnalyticsType === "reading assessment" ?
                  <>

                   {/* reading assessment bar */}

                    <div className={AnalyticsSt.chartcard} style={{
                width: selected.readingassessment.length <= 1 
                ? "400px" 
               : `${selected.readingassessment.length * 250}px`
                 }}>

                    {selected.readingassessment.length > 0 ? readingData ? <Bar ref={chartRef}  options={chartOptions}  data={readingData} plugins={[whiteBackgroundPlugin]} /> : "No Record to specific month" : "No Record"}

                </div>    
                    </>
                  :
                  ''
                  }

              

                
              </div>
            </div>
          </div>

<div className={AnalyticsSt.dropdowncon}>
 <button
       onClick={()=>{ResetDateFilterStudent('studentfilterreset')}}
        className={AnalyticsSt.dropdowntoggle}
        >
    Reset Filter
   <RiResetLeftFill />
      </button>
</div>
{/* summary */}
  <div className={AnalyticsSt.studsummarizeCon}>
<h1>As for student {selected.studentname}'s Performance</h1>
<h3>{studSummarize}</h3>
</div>

</>
      
)}
  </div>

  :

  <div className={AnalyticsSt.mainpanel}>

  <div className={AnalyticsSt.noRecordPanel}>
 NO RECORD
  </div>

  </div>
 }

      </div>

      {/* overall grade summary */}

      

    {filteredList.length!==0 ?
<div className={AnalyticsSt.gradesummaryCon}>
      <div className={AnalyticsSt.studentTitleCon2}>
      <h3>Overall Grade Level Summary Grade {ProfileActive.gradelevel} (SY. {selectedYear} - {selectedYear + 1})</h3>
      </div>

<div className={AnalyticsSt.filterDateCon}>
         <h3>From:</h3>
        <input
    id="start-date"
    type="date"
    value={startDate2}
    onChange={(e) => setStartDate2(e.target.value)}
    max={endDate2 || undefined}
    style={{
      padding: '8px 12px',
      fontSize: '14px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: 'white',
      cursor: 'pointer'
    }}
  />

<h3>To:</h3>

        <input
    id="end-date"
    type="date"
    value={endDate2}
    onChange={(e) => setEndDate2(e.target.value)}
    min={startDate2 || undefined}
    style={{
      padding: '8px 12px',
      fontSize: '14px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: 'white',
      cursor: 'pointer'
    }}
  />

   <button
       onClick={()=>{ResetDateFilterStudent('overallfilterreset')}}
        className={AnalyticsSt.dropdowntoggle}
        >
    Reset Filter
     <RiResetLeftFill />
      </button>

</div>


 <div className={AnalyticsSt.chartcard} style={{ width: `100%` }}>

{overallData !== null ? <Bar ref={SummaryRef} options={chartOptions}  data={overallData}  plugins={[whiteBackgroundPlugin]} /> : 'No Record'  } 
 </div>

   <div className={AnalyticsSt.studsummarizeCon} style={{marginTop:'2%'}}>
<h1>As the Grade level {ProfileActive.gradelevel} students perform</h1>
<h3>{gradeOverallSummarize}</h3>
</div>
  <button
        disabled={sumLoading}
         onClick={downloadSummaryPDF}
        className={AnalyticsSt.downloadoverallsum}
        >
      Save Summary as PDF
      <FaFilePdf />
      </button>

</div>
    : ''}    
    </div>

    <footer className={AnalyticsSt.footer}>
        <div className={AnalyticsSt.footerContent}>

        
          {/* Main Footer Content */}
          <div className={AnalyticsSt.footerMain}>
          
            {/* Brand Section */}
            <div className={AnalyticsSt.footerBrand}>
             

              <div className={AnalyticsSt.infoFooter}>
               <img src={LearnEngLogo} alt="LearnENG Logo" className={AnalyticsSt.logofooter} />
              <p className={AnalyticsSt.brandTagline}>Master English with confidence</p>
               {/* Social Links */}
                      <div className={AnalyticsSt.socialLinks}>
                      <a>Follow us: </a>
                        <a href="https://www.facebook.com/share/1Ty9MwVs2s/" target="_blank" rel="noopener noreferrer" className={AnalyticsSt.socialLink}>
                         <FaFacebook />
                        </a>
                        
                      </div>

                      
               </div> 

       
                       
            </div>
            

    <div className={AnalyticsSt.footerinfoCon}>
   
               <div className={AnalyticsSt.footerquicklinkCon}>
            {/* Quick Links */}
            <div className={AnalyticsSt.footerSection}>
              <h4 className={AnalyticsSt.sectionTitle}>Quick Links</h4>
              <div className={AnalyticsSt.linkGroup}>
                <button onClick={()=>setaboutUsModal(true)} className={AnalyticsSt.footerLink}>About Us</button>
              </div>
            </div>
            
            {/* Support */}
            <div className={AnalyticsSt.footerSection}>
              <h4 className={AnalyticsSt.sectionTitle}>Support</h4>
              <div className={AnalyticsSt.linkGroup}>
                <button onClick={()=>setcontactUsModal(true)} className={AnalyticsSt.footerLink}>Contact Us</button>
              </div>
            </div>
            
            {/* Legal */}
            <div className={AnalyticsSt.footerSection}>
              <h4 className={AnalyticsSt.sectionTitle}>Legal</h4>
              <div className={AnalyticsSt.linkGroup}>
                <button 
                  className={AnalyticsSt.footerLink}
                  onClick={() => settermsConModal(true)}
                >
                  Terms & Conditions
                </button>
              </div>
            </div>

   

         </div>   
          

          <div className={AnalyticsSt.footerSection}>
   <h4 className={AnalyticsSt.sectionTitle}>Get in Touch</h4>
   <div className={AnalyticsSt.linkGroup}>
     <p>&#8226; Pasay, Philippines</p>
     <p>&#8226;1987goldentreasure@gmail.com</p>
     <p>&#8226; 288512003</p>
   </div>
 </div>

           </div> 

          </div>



           
     {/* Divider */}
          <div className={AnalyticsSt.footerDivider}></div>     

          {/* Bottom Section */}
          <div className={AnalyticsSt.footerBottom}>
            <div className={AnalyticsSt.footerCopyright}>
              <p>© {new Date().getFullYear()} LearnENG. All rights reserved.</p>
              <p className={AnalyticsSt.madeWith}>Made with ❤️ for English learners worldwide</p>
            </div>
            
          </div>
        </div>
      </footer>

      {/* terms and condtion */}
      
              <Modal show={termsConModal} onHide={()=>settermsConModal(false)} centered size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Terms & Conditions</Modal.Title>
              </Modal.Header>
      
              <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                <p>
                  Welcome to our application. Please read these Terms & Conditions carefully.
                </p>
                <ol>
                  <li>
                    <strong>Acceptance:</strong> By using this app, you agree to these
                    terms and conditions.
                  </li>
                  <li>
                    <strong>Responsibilities:</strong> You must not misuse the
                    service or attempt to disrupt our systems.
                  </li>
                  <li>
                    <strong>Privacy:</strong> We respect your privacy. Check our
                    Privacy Policy for details.
                  </li>
                  <li>
                    <strong>Termination:</strong> We may suspend access if you violate
                    the terms.
                  </li>
                  <li>
                    <strong>Changes:</strong> Terms may be updated at any time, and
                    continued use means you accept them.
                  </li>
                </ol>
              </Modal.Body>
      
              <Modal.Footer>
                <Button variant="secondary" onClick={()=>settermsConModal(false)}>
                  Close
                </Button>
                
              </Modal.Footer>
            </Modal>
      
              {/* about us */}
      
              <Modal show={aboutUsModal} onHide={()=>setaboutUsModal(false)} size="lg" centered scrollable>
      <Modal.Header closeButton>
      <Modal.Title>About LearnEng — Your English, Faster</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {/* Mission */}
      <section className="mb-4">
      <p className="lead text-muted">LearnEng is an English-learning app built for real-world learners. Bite-sized lessons, AI-backed practice, and friendly progress tracking — all in one place.</p>
      <div className="card border-0 shadow-sm">
      <div className="card-body">
      <h2 className="h5">Our mission</h2>
      <p className="mb-0 text-muted">We help motivated learners gain confidence in English through short, practical lessons and smart feedback. Whether you need conversational fluency, better writing for work, or exam prep — LearnEng adapts to your goals.</p>
      </div>
      </div>
      </section>
      
      
      {/* Features */}
      <section className="mb-4">
      <h3 className="h6 mb-2">What you'll get</h3>
      <ul className="list-unstyled mb-0">
      <li className="mb-2">✅ <strong>Interactive Lessons:</strong> Play room sessions covering spelling, grammar and reading</li>
      <li className="mb-2">✅ <strong>Interactive practice:</strong> Assessments, speaking prompts, and instant feedback.</li>
      <li>✅ <strong>Personalized path:</strong> A plan tailored to your goals, with progress tracking.</li>
      </ul>
      </section>
      
      
      {/* How it works */}
      <section className="mb-4">
      <h3 className="h6 mb-2">How it works</h3>
      <ol className="mb-0">
      <li className="mb-1"><strong>Take a quick assessment</strong> — we estimate your level in minutes.</li>
      <li className="mb-1"><strong>Follow a weekly plan</strong> — daily short lessons that fit your schedule.</li>
      <li><strong>Practice with feedback</strong> — improve speaking and writing with tips that matter.</li>
      </ol>
      </section>
      
      
      
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={()=>setaboutUsModal(false)}>Close</Button>
      </Modal.Footer>
      </Modal>
      
      {/* contact us */}
      
      <Modal show={contactUsModal} onHide={()=>setcontactUsModal(false)} centered>
      <Modal.Header closeButton>
      <Modal.Title>Contact Us</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form 
       action="https://docs.google.com/forms/d/e/1FAIpQLSe49UXJTJwhWfxeWirlvjeyF1FxafWmXxtB7gMTwpNlHF52Og/formResponse"
       method="POST"
        target="hidden_iframe"
      onSubmit={handleSubmit}>
      
                  <select name="entry.196762833" required defaultValue="">
                    <option value="" disabled>Select User Type</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                  </select>
      
      <Form.Group className="mb-3" controlId="contactName">
      <Form.Label>Name</Form.Label>
      <Form.Control
      type="text"
      placeholder="Enter your name"
      name="entry.694285260"
      // value={formData.name}
      // onChange={handleChange}
      // required
      />
      </Form.Group>
      
      
      <Form.Group className="mb-3" controlId="contactEmail">
      <Form.Label>Email</Form.Label>
      <Form.Control
      type="email"
      placeholder="Enter your email"
      name="entry.1792390226"
      // value={formData.email}
      // onChange={handleChange}
      required
      />
      </Form.Group>
      
      
      
      
      <Form.Group className="mb-3" controlId="contactMessage">
      <Form.Label>Message</Form.Label>
      <Form.Control
      as="textarea"
      rows={4}
      placeholder="Write your message here..."
      name="entry.660316505"
      // value={formData.message}
      // onChange={handleChange}
      required
      />
      </Form.Group>
      
      
      
      <Button variant="primary" type="submit" className="w-100">
      Send Message
      </Button>
      </Form>
      
       <iframe
                  name="hidden_iframe"
                  style={{ display: 'none' }}
                  title="hidden_iframe"
                ></iframe>
      </Modal.Body>
      </Modal>

        {/* modal loading */}
                    <Modal show={isLoading} backdrop="static" centered>
                    <Modal.Body className="text-center">
                       <div className={AnalyticsSt.customloader}></div>
                      <p className="mt-3 mb-0 fw-bold">Loading Playroom</p>
                    </Modal.Body>
                  </Modal>
      
   </>
  );
}

export default Analytics;
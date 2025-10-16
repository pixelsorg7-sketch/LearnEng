import React, { useRef,createContext, useContext, useState , useEffect} from 'react';

import {Link,Navigate,useNavigate} from 'react-router-dom'
import { MyContext } from './DataContext';
import { GoogleLogin,GoogleOAuthProvider,useGoogleOneTapLogin  } from '@react-oauth/google';
import {gapi}from 'gapi-script';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import { HiSortAscending } from 'react-icons/hi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TfiMenu } from "react-icons/tfi";
import { MdMeetingRoom,MdContactPhone  } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import {firestore} from "../firebase";
import { addDoc,collection,getDocs, updateDoc, deleteDoc, where, query, limit,ref, getDoc,doc} from '@firebase/firestore';
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
const HelpNote=()=>{

    return(
        <>

          <Container className="mt-5 mb-5 p-4 rounded" style={{ backgroundColor: '#FFF8E7', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
      <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#6A1B9A' }}>🛠️ Website Help Guide</h2>
      <p className="text-center text-muted mb-4">Learn how to use our website step by step!</p>

      <Accordion defaultActiveKey="0" alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>🔐 How to Log In or Sign Up</Accordion.Header>
          <Accordion.Body>
            Click the <strong>Login</strong> button at the top right to access your account. If you’re new, press <strong>Register</strong> and fill out your name, email, and password. It’s quick and safe!
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>🧭 Navigating the Website</Accordion.Header>
          <Accordion.Body>
            Use the menu bar at the top to explore pages like <strong>Home</strong>, <strong>Games</strong>, <strong>Progress</strong>, or <strong>Help</strong>. Each page is designed to guide your learning or fun!
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>🎮 Using the Features</Accordion.Header>
          <Accordion.Body>
            Inside your dashboard, you can:
            <ul>
              <li>🎯 Track your progress</li>
              <li>📝 Answer quizzes</li>
              <li>🏆 Collect rewards</li>
              <li>📖 Access learning materials</li>
            </ul>
            Make sure to save your changes before leaving!
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>❓ Common Questions</Accordion.Header>
          <Accordion.Body>
            <ul>
              <li><strong>💡 Forgot Password?</strong> Click <em>"Forgot Password"</em> on the login screen.</li>
              <li><strong>🌐 Site not loading?</strong> Check your internet connection or try refreshing the page.</li>
              <li><strong>📩 Need Help?</strong> Go to the <strong>Contact</strong> page and message our team.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
        </>
    )
}

export default HelpNote;
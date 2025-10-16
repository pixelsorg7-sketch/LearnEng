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

const AboutPage=()=>{

    return(
        <>
               <Container className="mt-5 mb-5 p-4 rounded" style={{ backgroundColor: '#F3F8FF', boxShadow: '0 0 12px rgba(0, 0, 0, 0.1)' }}>
      <h2 className="text-center mb-4" style={{ color: '#2C3E50', fontWeight: 'bold' }}>
        📚 About Our English Learning App & Website
      </h2>
      <p className="text-center text-muted mb-5">Empowering kids to read, think, and speak with confidence.</p>

      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>🧠 What is It?</Card.Title>
              <Card.Text>
                Our English Learning platform is a fun, interactive tool designed for children to improve their grammar, vocabulary, and comprehension through games and quizzes. Whether on mobile or web, learning is just a tap away!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>🎮 Features</Card.Title>
              <Card.Text>
                • Interactive quizzes & lessons<br />
                • Cute avatars & rewards<br />
                • Real-time score tracking<br />
                • Mobile app for learning anywhere
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>🌍 Accessibility</Card.Title>
              <Card.Text>
                Our platform is available both on web and mobile. Teachers can monitor progress on the web, while students enjoy the app at home. Learning is inclusive, safe, and engaging for all users.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>🚀 Our Mission</Card.Title>
              <Card.Text>
                To make English learning enjoyable and effective for young minds. We believe education should be fun, rewarding, and available to every child, everywhere.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    <Card.Text>Pixels Company</Card.Text>
      <Card.Text>Read <a href = "#">Terms</a> and <a href = "#">Condition</a></Card.Text>
        </>
    )

}

export default AboutPage;
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

const TermsandConditions=()=>{
    return(
        <>

          <Container className="mt-5 mb-5 p-4">
      <Card className="p-4 shadow-sm rounded" style={{ backgroundColor: '#FAFAFA' }}>
        <h2 className="text-center mb-4" style={{ color: '#2C3E50' }}>📄 Terms & Conditions</h2>

        <p><strong>Last Updated:</strong> May 2025</p>

        <h5>1. Introduction</h5>
        <p>
          Welcome to our English Learning App and Website. These Terms and Conditions govern your use of our digital platforms. By accessing or using the platform, you agree to comply with and be bound by these Terms.
        </p>

        <h5>2. Eligibility</h5>
        <p>
          Our services are intended for children, parents, and educators. Users under 13 must have parental or guardian consent. Educators using our platform must ensure appropriate use in educational environments.
        </p>

        <h5>3. Account Registration</h5>
        <p>
          You may need to create an account to use certain features. All information provided must be accurate and updated. You are responsible for maintaining the confidentiality of your account.
        </p>

        <h5>4. Platform Usage</h5>
        <p>
          Users agree not to misuse the platform by posting inappropriate content, attempting unauthorized access, or disrupting services. Educational content must be used in the intended way.
        </p>

        <h5>5. Intellectual Property</h5>
        <p>
          All content, graphics, text, and software are the property of the platform and protected by intellectual property laws. Unauthorized use or reproduction is strictly prohibited.
        </p>

        <h5>6. Payment and Subscriptions</h5>
        <p>
          Some features may be accessed via a paid subscription. By subscribing, you agree to our pricing and billing policies. Subscriptions will automatically renew unless cancelled.
        </p>

        <h5>7. Privacy Policy</h5>
        <p>
          Your privacy is important to us. We collect and process data in accordance with our Privacy Policy. This includes data provided during registration, as well as usage data.
        </p>

        <h5>8. User-Generated Content</h5>
        <p>
          Users may be able to post comments, answers, or other content. We reserve the right to review, remove, or moderate any content that violates our guidelines.
        </p>

        <h5>9. Limitation of Liability</h5>
        <p>
          We strive to provide accurate and up-to-date information, but we do not guarantee the completeness or accuracy of the content. The platform is provided "as-is" without warranty of any kind.
        </p>

        <h5>10. Indemnification</h5>
        <p>
          You agree to indemnify and hold harmless our platform and its affiliates from any claims, liabilities, or damages arising from your use or misuse of the platform.
        </p>

        <h5>11. Termination of Access</h5>
        <p>
          We may suspend or terminate access to your account at our sole discretion, with or without notice, for any violation of these Terms or for other reasons.
        </p>

        <h5>12. Changes to the Terms</h5>
        <p>
          We reserve the right to modify these Terms at any time. Updates will be posted on this page, and your continued use of the service constitutes acceptance of the revised Terms.
        </p>

        <h5>13. Governing Law</h5>
        <p>
          These Terms shall be governed and interpreted in accordance with the laws of your country of residence, without regard to its conflict of law principles.
        </p>

        <h5>14. Contact Information</h5>
        <p>
          If you have questions about these Terms and Conditions, please contact our support team through the app or by email at support@englishapp.com.
        </p>

        <p className="text-center text-muted mt-5">© 2025 Pixels. All rights reserved.</p>
      </Card>
    </Container>

        </>
    )
}

export default TermsandConditions;
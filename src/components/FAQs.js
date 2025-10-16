import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
// import './FAQs.css';
import FAQsSt from '../styleweb/FAQsSt.module.css'
import logo from '../assets/LearnEngLG.png';

const faqsData = [
  {
    question: 'Who can sign up for LearnENG?',
    answer:
      'Only verified elementary teachers can create accounts. Admins are added manually by the system administrator.',
  },
  {
    question: 'How do I register a student?',
    answer:
      'Teachers can register students through the dashboard using the "Register ID" feature, assigning each one a unique ID.',
  },
  {
    question: 'What can Admins manage?',
    answer:
      'Admins can approve teacher accounts, manage quiz sets, monitor student progress, and oversee the platform’s usage.',
  },
  {
    question: 'What can teachers do inside the portal?',
    answer:
      'Teachers can create rooms, assign quizzes, track student performance, and reward students with in-game currency.',
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const answerRefs = useRef([]);

  useEffect(() => {
    answerRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.style.maxHeight = openIndex === i ? ref.scrollHeight + 'px' : '0px';
        ref.style.opacity = openIndex === i ? '1' : '0';
      }
    });
  }, [openIndex]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={FAQsSt.faqwrapper}>
      {/* Header only */}
      <header className={FAQsSt.faqheader}>
        <Image src={logo} alt="LearnENG Logo" className={FAQsSt.faqlogo} />
        <nav className="faq-nav">
          <a href="/">Home</a>
          <a href="/FAQs">FAQs</a>
          <a href="/ContactUs">Contact Support</a>
        </nav>
      </header>

      {/* Main FAQ Content */}
      <Container className={FAQsSt.faqbody}>
        <Row className={`align-items-start ${FAQsSt.faqRow}`}>
          <Col md={6} className={FAQsSt.faqleft}>
            <h1 className={FAQsSt.faqtitle}>Frequently Asked Questions</h1>
            <p className={FAQsSt.faqsub}>
              <strong>Find quick answers to common questions about using the LearnENG web platform.</strong>{' '}
              Whether you're an admin or a teacher, this section provides helpful info to guide your experience.
            </p>
          </Col>

          <Col md={6} className={FAQsSt.faqright}>
            {faqsData.map((faq, index) => (
              <div
                key={index}
                className={`faq-box ${openIndex === index ? 'open' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className={FAQsSt.faqquestion}>
                  <strong>{faq.question}</strong>
                  <span className={FAQsSt.faqicon}>
                    {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>
                <div
                  className={FAQsSt.faqanswer}
                  ref={(el) => (answerRefs.current[index] = el)}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FAQs;
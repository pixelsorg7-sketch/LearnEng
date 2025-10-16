import React, { useRef } from 'react';
import logo from '../assets/LearnEngLG.png';
// import './ContactUs.css';
import ContactUsSt from '../styleweb/ContactUsSt.module.css'
const ContactUs = () => {
  const formRef = useRef(null);

  const handleSubmit = () => {
    alert('Submitted successfully!');
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.reset();
      }
    }, 100);
  };

  return (
    <div className={ContactUsSt.container}>
      <div className={ContactUsSt.leftsection}>
        <img src={logo} alt="LearnENG Logo" className={ContactUsSt.logo} />

        <div className={ContactUsSt.supportcontent}>
          <h1>Contact our<br />Support Team!</h1>
          <p>
            <strong>Feel free to contact us any time.</strong><br /> We will get back to you as soon as we can.
          </p>
        </div>
      </div>

      <div className={ContactUsSt.rightsection}>
        <nav>
           <a href="/">Home</a>
          <a href="/FAQs">FAQs</a>
          <a href="/ContactUs">Contact Support</a>
        </nav>

        <div className={ContactUsSt.formwrapper}>
          <form
            ref={formRef}
            className={ContactUsSt.contactform}
            action="https://docs.google.com/forms/d/e/1FAIpQLSe49UXJTJwhWfxeWirlvjeyF1FxafWmXxtB7gMTwpNlHF52Og/formResponse"
            method="POST"
            target="hidden_iframe"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="entry.694285260"
              placeholder="Name"
              required
            />
            <input
              type="email"
              name="entry.1792390226"
              placeholder="Email"
              required
            />
            <select name="entry.196762833" required defaultValue="">
              <option value="" disabled>Select User Type</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
            <textarea
              name="entry.660316505"
              placeholder="Message / Concern"
              required
            />
            <button type="submit">Submit</button>
          </form>

          <iframe
            name="hidden_iframe"
            style={{ display: 'none' }}
            title="hidden_iframe"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
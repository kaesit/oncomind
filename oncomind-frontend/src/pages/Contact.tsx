// src/pages/Contact.tsx
import React from "react";
import "../css/Contact.css";
import "../css/index.css";
// import Footer from "../components/Footer"; // Uncomment if you want the footer here too

export default function Contact() {
     return (
          <div className="contact_container">
               <h1 className="contact-page-title">Get in Touch</h1>

               <div className="contact-content-wrapper">
                    <div className="contact-card">
                         {/* Left Column: Information */}
                         <div className="contact-info-col">
                              <h2 className="contact-section-subtitle">Collaborate</h2>
                              <p className="contact-text">
                                   We are always looking for partners in clinical research,
                                   bioinformatics, and healthcare technology.
                                   Whether you are a researcher, clinician, or developer,
                                   let's build the future of medicine together.
                              </p>

                              <div className="contact-details-list">
                                   <div className="contact-detail-item">
                                        <span>📧</span>
                                        <span>oncomind@info.com</span>
                                   </div>
                                   <div className="contact-detail-item">
                                        <span>📱</span>
                                        <span>+1 111 111 11 11</span>
                                   </div>
                                   <div className="contact-detail-item">
                                        <span>📍</span>
                                        <span>Elazığ, Türkiye</span>
                                   </div>
                              </div>
                         </div>

                         {/* Right Column: The Form */}
                         <div className="contact-form-col">
                              <form className="contact-form-col">
                                   <div className="form-group">
                                        <label className="form-label">NAME</label>
                                        <input className="form-input" type="text" placeholder="Name" />
                                   </div>

                                   <div className="form-group">
                                        <label className="form-label">EMAIL</label>
                                        <input className="form-input" type="email" placeholder="your@emailprovider.com" />
                                   </div>

                                   <div className="form-group">
                                        <label className="form-label">SUBJECT</label>
                                        <input className="form-input" type="text" placeholder="Research Collaboration" />
                                   </div>

                                   <div className="form-group">
                                        <label className="form-label">MESSAGE</label>
                                        <textarea className="form-textarea" placeholder="Tell us about your project..."></textarea>
                                   </div>

                                   <button type="submit" className="submit-btn">
                                        Send Message
                                   </button>
                              </form>
                         </div>
                    </div>
               </div>
          </div>
     );
}
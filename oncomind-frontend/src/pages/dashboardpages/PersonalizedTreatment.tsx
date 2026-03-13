import React, { useState, useMemo, useEffect } from "react";
import TextBox from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { Popup } from "devextreme-react/popup";
import { SelectBox } from "devextreme-react/select-box";
import { useNavigate } from "react-router-dom"; // For navigation
import { patientService, PatientDto } from "../../services/patientService";
import "../../css/DataSets.css";
import "../../css/PersonalizedTreatment.css";
import Form, { Item, Label, RequiredRule, RangeRule } from "devextreme-react/form";
import notify from "devextreme/ui/notify"; // Nice toast notifications

/* ------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------ */
const Patients: React.FC = () => {
     const navigate = useNavigate(); // Hook for navigation

     return (
          <div className="container">
            <h1>Personalized Treatment</h1>
            <p>This page is under construction</p>
            <p>this page will provide very first experimental features of future personalized treatment options</p>
            <h2>Main</h2>
            <div className="pt_container">
               <div className="pt_box">
                  <h2>Drugs</h2>
                  <a className="linker" href="">Search</a>
               </div>
               <div className="pt_box">
                  <h2>Patients</h2>
                  <a className="linker" href="">Search</a>
               </div>
               <div className="pt_box">
                  <h2>Test</h2>
                  <a className="linker" href="">Search</a>
               </div>
            </div>
            <pre></pre>
            <h2>Experimental Features</h2>
            <div className="pt_container experimental">
               <div className="pt_box">
                  <h2>Particle Based Drug Simulation</h2>
                  <a className="linker" href="">Search</a>
               </div>
               <div className="pt_box">
                  <h2>Toxicity</h2>
                  <a className="linker" href="">Search</a>
               </div>
               <div className="pt_box">
                  <h2>Lab</h2>
                  <a className="linker" href="">Search</a>
               </div>
            </div>
            <pre></pre>

          </div>
     );
};

export default Patients;
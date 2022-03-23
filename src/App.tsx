import React from 'react';
import './App.css';
import 'jsoneditor-react/es/editor.min.css';
import { Color, FontSize } from './utils/commonStyles';
import json from "./resources/curriculum.json"
import * as jsPDF from "jspdf";
import {Curriculum} from "./classes/Curriculum";
import {Candidate} from "./classes/Candidate";
import {Job} from "./classes/Job";


const App = () => {

  const { jsPDF } = require("jspdf");
  const doc = new jsPDF({ lineHeight: 2 });
  const Limits = {
    Horizontal: { start: 20, end: doc.internal.pageSize.width - 16 },
    Vertical: { start: 20, end: doc.internal.pageSize.height - 40 },
  }
  let x = 0;
  let y = 0;

  const generatePDF = (): string => {
    console.log("Generating PDF...")
    readJson();
    return doc.output('datauristring');
  }

  const getPageWidth = (): number => doc.internal.pageSize.width;

  const setX = (value: number) => {
    return x += value;
  }

  const setY = (value: number) => {
    return y += value;
  }

  const readJson = () => {
    const curriculum: Curriculum = new Curriculum(JSON.stringify(json));
    addContactInfo(curriculum.candidate);
    addWorkExperiences(curriculum.jobs);
    doc.setProperties({ title: `Curriculum ${new Date().toLocaleDateString()}`, author: curriculum.candidate.name, creator: "Adrián García Estaún", keywords: "Resume, CV, Curriculum", subject: "Curriculum Vitae"});
  }

  const addContactInfo = (candidate: Candidate) => {
    doc.setFillColor(Color.accent);
    setX(32);
    setY(32);
    doc.ellipse(x, y, 20, 20, 'F');
    setFontStyle('title');
    doc.text(candidate.name, setX(-7), y);
    setFontStyle('subtitle');
    const subtitle = candidate.position;
    const subtitleWidth = doc.getTextWidth(subtitle);
    doc.text(subtitle, x, setY(7));
    doc.setLineWidth(0.5);
    doc.line(setX(subtitleWidth + 2), y - 1, Limits.Vertical.end, y - 1);
    const image = getImage('ic_phone.png');
    doc.addImage(image, 'jpeg', x, setY(10), 10, 10);
    doc.addImage(candidate.picture, 'PNG', x, setY(30), 30, 30);
  }

  const getImage = (imgWithExtension: string): HTMLImageElement => {
    const img = new Image();
    img.src = './assets/' + imgWithExtension;
    return img;
  }

  function addWorkExperiences(jobs: Array<Job>) {

  }

  const setFontStyle = (style: 'title' | 'subtitle' | 'body') => {
    switch (style) {
      case "title":
        doc.setFontSize(FontSize.title);
        doc.setTextColor(Color.text.black);
        doc.setFont('Helvetica', 'normal', 'bold');
        break;
      case "subtitle":
        doc.setFontSize(FontSize.subtitle);
        doc.setTextColor(Color.text.gray);
        doc.setFont('Helvetica', 'normal', 'normal');
        break;
      case "body":
        doc.setFontSize(FontSize.subtitle);
        doc.setTextColor(Color.text.black);
        doc.setFont('Helvetica', 'normal', 'bold');
        break;
    }
  }

  const addSection = () => {

  }

  const addSectionPoint = () => {

  }

  const data = generatePDF();

  return (
    <div id="container">
      <div id="leftContainer"/>
      <div id="rightContainer">
        <object width="100%" height="100%" data={data} type="application/pdf"/>
      </div>
    </div>
  );
}

export default App;

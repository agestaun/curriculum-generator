import React, {useEffect, useState} from 'react';
import './App.css';
import 'jsoneditor-react/es/editor.min.css';
import EditorJS from '@editorjs/editorjs';
import * as jsPDF from "jspdf";


const Color = {
  black: '#000',
  yellow: '#FFDE02'
}

const FontSize = {
  title: 30,
  subtitle: 24,
  boy: 16,
}

function App() {
  const { jsPDF } = require("jspdf");
  const doc = new jsPDF();
  let x = 34;
  let y = 32;
  const [document, setDocument] = useState('');

  const generatePDF = (): string => {
    console.log("Generating PDF...")
    addHeader();
    return doc.output('datauristring');
  }

  const setX = (value: number) => {
    x += value;
    return x;
  }

  const setY = (value: number) => {
    y += value;
    return y;
  }

  const addHeader = () => {
    doc.setFillColor(Color.yellow);
    doc.ellipse(x, y, 20, 20, 'F');
    setFontStyle('title');
    doc.text("Adrián García Estaún", setX(-5), y);
  }

  const setFontStyle = (style: 'title' | 'subtitle' | 'body') => {
    switch (style) {
      case "title":
        doc.setFontSize(FontSize.title);
        doc.setFont('Helvetica', 'normal', 'bold');
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

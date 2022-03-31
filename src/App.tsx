import React, {useEffect, useState} from 'react'
import './App.css'
import 'jsoneditor-react/es/editor.min.css'
import {Color, FontSize} from './style/commonStyles'
import json from './resources/curriculum.json'
import {Curriculum} from './classes/Curriculum'
import {Candidate} from './classes/Candidate'
import {Job} from './classes/Job'
import {SwatchesPicker} from 'react-color'
import CropperDialog from './components/CropperDialog'

const App = () => {
  const [accentColor, setAccentColor] = useState(Color.accent)
  const [profileImg, setProfileImg] = useState('')
  const [openCropper, setOpenCropper] = useState(false)
  const [data, setData] = useState('')
  const { jsPDF } = require('jspdf')
  const doc = new jsPDF({ lineHeight: 2 })

  useEffect(() => {
    generatePDF()
  }, [accentColor, profileImg])

  const Limits = {
    Horizontal: { start: 20, end: doc.internal.pageSize.width - 16 },
    Vertical: { start: 20, end: doc.internal.pageSize.height - 40 },
  }
  let x = 0
  let y = 0

  const generatePDF = async () => {
    console.log('Generating PDF...')
    await readJson()
    setData(doc.output('datauristring'))
  }

  const getPageWidth = (): number => doc.internal.pageSize.width

  const setX = (value: number) => {
    return (x += value)
  }

  const setY = (value: number) => {
    return (y += value)
  }


  const readJson = async () => {
    if (profileImg) json.candidate.picture = profileImg
    const curriculum: Curriculum = new Curriculum(JSON.stringify(json))
    await addContactInfo(curriculum.candidate)
    addWorkExperiences(curriculum.jobs)
    doc.setProperties({
      title: `Curriculum ${new Date().toLocaleDateString()}`,
      author: curriculum.candidate.name,
      creator: 'Adrián García Estaún',
      keywords: 'Resume, CV, Curriculum',
      subject: 'Curriculum Vitae',
    })
  }


  const addContactInfo = async (candidate: Candidate) => {
    doc.setFillColor(accentColor)
    setX(32)
    setY(32)
    doc.ellipse(x, y, 20, 20, 'F')
    setFontStyle('title')
    doc.text(candidate.name, setX(-7), y)
    setFontStyle('subtitle')
    const subtitle = candidate.position
    const subtitleWidth = doc.getTextWidth(subtitle)
    doc.text(subtitle, x, setY(7))
    doc.setLineWidth(0.5)
    doc.line(setX(subtitleWidth + 2), y - 1, Limits.Horizontal.end, y - 1)
    //const profileImgBAse64 = profileImg.
    let image = new Image()
    image.src = candidate.picture
    doc.addImage(candidate.picture, 'PNG', x, setY(30), 30, 30)
  }

  const getImage = (imgWithExtension: string): HTMLImageElement => {
    const img = new Image()
    img.src = './assets/' + imgWithExtension
    return img
  }

  function addWorkExperiences(jobs: Array<Job>) {}

  const setFontStyle = (style: 'title' | 'subtitle' | 'body') => {
    switch (style) {
      case 'title':
        doc.setFontSize(FontSize.title)
        doc.setTextColor(Color.text.black)
        doc.setFont('Helvetica', 'normal', 'bold')
        break
      case 'subtitle':
        doc.setFontSize(FontSize.subtitle)
        doc.setTextColor(Color.text.gray)
        doc.setFont('Helvetica', 'normal', 'normal')
        break
      case 'body':
        doc.setFontSize(FontSize.subtitle)
        doc.setTextColor(Color.text.black)
        doc.setFont('Helvetica', 'normal', 'bold')
        break
    }
  }

  const addSection = () => {}

  const addSectionPoint = () => {}

  const onImageChanged = (e) => {
    console.log(e.target.files[0])
    setProfileImg(e.target.files[0])
    const file = e.target.files[0]
    getBase64(file, (base64) => base64 && setProfileImg(base64))
    setOpenCropper(true)
  }


  const getBase64 = (file: File, callback: (base64: string) => void) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      return callback(reader.result?.toString() ?? '')
    }
    reader.onerror = (error) => {
      console.log('Error getting base 64 from image.', error)
      alert(error)
    }
  }

  const onImageCropped = (img: string) => {
    setProfileImg(img)
    setOpenCropper(false)
  }

  return (
    <div id="container">
      <div id="leftContainer">
        <h3>Configurations</h3>
        <h5>Choose the highlight color</h5>
        <SwatchesPicker id="colorPicker" color={Color.accent} onChange={(color)=> setAccentColor(color.hex)} />
        <h5>Upload your profile image</h5>
        <input type={'file'} accept={'image/*'} onChange={onImageChanged} onClick={(e) => e.currentTarget.value = ''}/>
      </div>
      <div id="rightContainer">
        <object width="100%" height="100%" data={data} type="application/pdf" />
      </div>
      <CropperDialog open={openCropper} img={profileImg} onCropped={onImageCropped}/>
    </div>
  )
}

export default App

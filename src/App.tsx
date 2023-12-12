import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import { SwatchesPicker } from 'react-color';
import './App.css';
import CropperDialog from './components/CropperDialog';
import { Address } from './model/Address';
import { Candidate } from './model/Candidate';
import { Curriculum } from './model/Curriculum';
import { Job } from './model/Job';
import json from './resources/curriculum.json';
import { Color, font, spacing } from './style/commonStyles';

const doc = new jsPDF();

const HORIZONTAL_PAGE_START = 20;
const HORIZONTAL_PAGE_END = doc.internal.pageSize.width - 20;
const VERTICAL_PAGE_START = 20;
const VERTICAL_PAGE_END = doc.internal.pageSize.height - 20;
const FIRST_COLUMN_START = 20;
const SECOND_COLUMN_START = 65;

const App = () => {
  const [accentColor, setAccentColor] = useState(Color.accent);
  const [profileImg, setProfileImg] = useState('');
  const [openCropper, setOpenCropper] = useState(false);
  const [data, setData] = useState('');
  let x = 0;
  let y = 0;

  doc.setLineHeightFactor(1.4);

  useEffect(() => {
    generatePDF();
  }, [accentColor, profileImg]);

  const Limits = {
    Horizontal: { start: HORIZONTAL_PAGE_START, end: HORIZONTAL_PAGE_END },
    Vertical: { start: VERTICAL_PAGE_START, end: VERTICAL_PAGE_END },
  };

  const generatePDF = async () => {
    console.log('Generating PDF...');
    await readJson();
    setData(doc.output('datauristring'));
  };

  const sumX = (value: number): number => x += value;
  const sumY = (value: number): number => {
    const currentPage = doc.getCurrentPageInfo().pageNumber;
    const totalPages = doc.getNumberOfPages();
    if (y + value > VERTICAL_PAGE_END && currentPage === totalPages) {
      doc.addPage();
      setY(VERTICAL_PAGE_START);
    }
    return y += value;
  };
  const setX = (value: number): number => x = value;
  const setY = (value: number): number => y = value;

  const readJson = async () => {
    if (profileImg) json.candidate.picture = profileImg;
    const curriculum: Curriculum = new Curriculum(JSON.stringify(json));
    addHeader(curriculum.candidate);
    addAddress(curriculum.candidate.address);
    addContactDetails(curriculum.candidate);
    addProfilePicture(curriculum.candidate.picture);

    const introduction = curriculum.candidate.introduction;
    if (introduction) addIntroduction(introduction);

    addWorkExperiences(curriculum.jobs);
    doc.setProperties({
      title: `Curriculum ${new Date().toLocaleDateString()}`,
      author: curriculum.candidate.name,
      creator: 'Adrian Garcia Estaun',
      keywords: 'Resume, CV, Curriculum',
      subject: 'Curriculum Vitae',
    });
  };

  const addHeader = (candidate: Candidate) => {
    doc.setFillColor(accentColor);
    sumX(32);
    sumY(32);
    doc.ellipse(x, y, 20, 20, 'F');
    setFontStyle('title');
    doc.text(candidate.name, sumX(-7), y);
    setFontStyle('subtitle');

    const subtitle = candidate.position ?? '';
    const subtitleWidth = doc.getTextWidth(subtitle);
    doc.text(subtitle, x, sumY(7));
    doc.setLineWidth(0.5);
    doc.line(sumX(subtitleWidth + spacing.xxs), y - 1, Limits.Horizontal.end, y - 1);
  };

  const addAddress = (address: Address) => {
    setFontStyle('headline');

    const sectionTitle = 'Address';
    const width = doc.getTextWidth(sectionTitle);
    doc.text(sectionTitle, FIRST_COLUMN_START, sumY(spacing.xl));

    doc.setLineWidth(0.5);
    doc.line(FIRST_COLUMN_START, sumY(spacing.xxs), FIRST_COLUMN_START + width, y);

    setFontStyle('body');
    const { city, country, town, postalCode } = address;
    doc.text(`${town}, ${postalCode}`, FIRST_COLUMN_START, sumY(spacing.xxs * 3));
    doc.text(`${city}, ${country}`, FIRST_COLUMN_START, sumY(spacing.xs));
  };

  const addContactDetails = (candidate: Candidate) => {
    const { phoneNumber, email } = candidate;

    const phoneWidth = phoneNumber ? doc.getTextWidth(phoneNumber):  0;

    if (phoneNumber) {
      setFontStyle('headline');
      doc.text('Phone', x, setY(55));
      setFontStyle('body');
      doc.text(phoneNumber, x, sumY(6));
    }

    setFontStyle('headline');
    doc.text('Email', sumX(phoneWidth + spacing.sm), sumY(-6));
    setFontStyle('body');
    doc.text(email, x, sumY(6));
  };

  const addProfilePicture = (base64: string) => {
    setFontStyle('headline');
    doc.text('Profile', setX(90.5), sumY(15));
    doc.addImage(base64, 'PNG', setX(83), sumY(5), 30, 30, 'Profile picture', 'NONE');
  };

  const addIntroduction = (introduction: string) => {
    setFontStyle('body');
    const splitTitle = doc.splitTextToSize(introduction, 75); // TODO fix and calculate the width left.
    doc.text(splitTitle, sumX(30 + spacing.sm), y);
  };

  function addWorkExperiences(jobs: Array<Job>) {
    setFontStyle('section');
    const text = 'Work Experiences';
    const dimensions = doc.getTextDimensions(text);
    doc.text(text, FIRST_COLUMN_START, sumY(50));
    doc.line(FIRST_COLUMN_START + dimensions.w + spacing.sm, setY(y -dimensions.h / 3), HORIZONTAL_PAGE_END, y);

    jobs.forEach((job) => {
      // Job left section (year, name, place, current, etc)
      setFontStyle('headline');
      doc.text(job.startYear, FIRST_COLUMN_START, sumY(spacing.md));
      const initialYPos = y;
      sumY(spacing.xxs);

      setFontStyle('bodySmall');
      if (job.current) {
        setFontStyle('bodyBold', accentColor);
        doc.text('Current', FIRST_COLUMN_START, sumY(spacing.xs + 1));
        setFontStyle('bodySmall');
      } else if (job.duration) {
        doc.text(job.duration, FIRST_COLUMN_START, sumY(spacing.xs + 1));
      }
      if (job.additionalData) {
        doc.text(job.additionalData, FIRST_COLUMN_START, sumY(spacing.xs + 1));
      }
      doc.text(job.companyName, FIRST_COLUMN_START, sumY(spacing.xs + 1));
      doc.text(job.companyLocation, FIRST_COLUMN_START, sumY(spacing.xs + 1));

      setY(initialYPos - spacing.xs); // FIXME sumY should add only a page if needed. when we write the second column, it adds another page again.

      job.tasks.forEach((task) => {
        const text = doc.splitTextToSize(task, 130);
        doc.text(text, SECOND_COLUMN_START, sumY(spacing.xs + 1), { });
      });

      sumY(spacing.md);
    });
  }

  const addSection = () => {
    // TODO
  };

  const addSectionPoint = () => {
    // TODO
  };

  const setFontStyle = (style: 'title' | 'subtitle' | 'section' | 'headline' | 'bodyBold' | 'body' | 'bodySmall', color?: string) => {
    switch (style) {
      case 'title':
        doc.setFontSize(font.size.title);
        doc.setTextColor(color ?? Color.text.black);
        doc.setFont('Helvetica', 'normal', 'bold');
        break;
      case 'subtitle':
        doc.setFontSize(font.size.subtitle);
        doc.setTextColor(color ?? Color.text.black);
        doc.setFont('Helvetica', 'normal', 'normal');
        break;
      case 'section':
        doc.setFontSize(font.size.subtitle);
        doc.setTextColor(color ??Color.text.black);
        doc.setFont('Helvetica', 'normal', 'bold');
        break;
      case 'headline':
        doc.setFontSize(font.size.headline);
        doc.setTextColor(color ?? Color.text.black);
        doc.setFont('Helvetica', 'normal', 'bold');
        break;
      case 'bodyBold':
        doc.setFontSize(font.size.body);
        doc.setTextColor(color ?? Color.text.gray);
        doc.setFont('Helvetica', 'bold');
        break;
      case 'body':
        doc.setFontSize(font.size.body);
        doc.setTextColor(color ?? Color.text.gray);
        doc.setFont('Helvetica', 'normal');
        break;
      case 'bodySmall':
        doc.setFontSize(font.size.bodySmall);
        doc.setTextColor(color ?? Color.text.gray);
        doc.setFont('Helvetica', 'normal');
        break;
    }
  };

  const onImageChanged = (e) => {
    const file = e.target.files[0];
    getBase64(file, (base64) => base64 && setProfileImg(base64));
    setOpenCropper(true);
  };

  const getBase64 = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      return callback(reader.result?.toString() ?? '');
    };
    reader.onerror = (error) => {
      console.log('Error getting base 64 from image.', error);
      alert(error);
    };
  };

  const onImageCropped = (base64: string) => {
    setProfileImg(base64);
    setOpenCropper(false);
    addProfilePicture(base64);
  };

  return (
    <div id="container">
      <div id="leftContainer">
        <h3>Configurations</h3>
        <h5>Choose the highlight color</h5>
        <SwatchesPicker
          id="colorPicker"
          color={Color.accent}
          onChange={(color) => setAccentColor(color.hex)}
        />
        <h5>Upload your profile image</h5>
        <input
          type={'file'}
          accept={'image/*'}
          onChange={onImageChanged}
          onClick={(e) => (e.currentTarget.value = '')}
        />
      </div>
      <div id="rightContainer">
        <object width="100%" height="100%" data={data} type="application/pdf" />
      </div>
      <CropperDialog
        open={openCropper}
        img={profileImg}
        onCropped={onImageCropped}
      />
    </div>
  );
};

export default App;

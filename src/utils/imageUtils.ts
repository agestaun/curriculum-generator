import fs from 'fs';

export const base64Encode = (filePath: string): string => {
	const bitmap = fs.readFileSync(filePath);
	return new Buffer(bitmap).toString('base64');
};

export const getImage = (imgWithExtension: string): string => {
	const img = new Image();
	img.src = './assets/' + imgWithExtension;
	return new Buffer(img.src).toString('base64');
};

import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ImageCropper from './ImageCropper';

type Props = {
	open: boolean;
	img: string;
	onCropped : (img: string) => void;
}

const CropperDialog = ({ open, img, onCropped }: Props) => {

	console.log('⚠️ image from cropper', img);

	const [image, setImage] = useState(img);
	const onSaveClicked = () => onCropped(image);

	return (
		<Dialog fullWidth maxWidth={'xs'} open={open}>
			<DialogTitle>Crop the image if needed</DialogTitle>
			<DialogContent dividers>
				<ImageCropper img={img} onCropped={(img: string) => setImage(img)}/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onSaveClicked}>It is okay</Button>
				<Button autoFocus variant="contained" onClick={onSaveClicked}>Save</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CropperDialog;

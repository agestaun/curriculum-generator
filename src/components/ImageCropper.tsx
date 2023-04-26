import React, { useRef, useState } from 'react';
import Slider from '@material-ui/core/Slider';
import Cropper from 'react-easy-crop';
import { DialogContentText } from '@mui/material';
import { Area } from 'react-easy-crop/types';
import { Color } from '../style/commonStyles';
import { getCroppedImg } from './Crop';

type Props = {
	img: string;
	onCropped: (img: string) => void;
}

const ImageCropper = ({ img, onCropped }: Props) => {

	const [zoom, setZoom] = useState(1);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [aspect, setAspect] = useState(1);
	const currentCroppedArea = useRef<Area>();

	const onCropChange = (crop: {x: number, y: number}) => {
		setCrop(crop);
	};

	const onZoomChange = (zoom) => {
		setZoom(zoom);
	};

	const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
		currentCroppedArea.current = croppedAreaPixels;
		handleCrop();
	};

	const handleCrop = async () => {
		try {
			const croppedImage = await getCroppedImg(img, currentCroppedArea.current);
			onCropped(croppedImage);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div className="App">
			<div style={{ position: 'relative', width: '100%', height: 200 }}>
				<Cropper
					image={img}
					crop={crop}
					zoom={zoom}
					aspect={aspect}
					cropShape="round"
					showGrid={true}
					onCropChange={onCropChange}
					onCropComplete={onCropComplete}
					onZoomChange={onZoomChange}
				/>
			</div>
			<div style={{ marginTop: 20, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
				<DialogContentText color={Color.text}>Use the slider to apply zoom</DialogContentText>
				<Slider
					value={zoom}
					min={1}
					max={3}
					step={0.1}
					aria-labelledby="Zoom"
					onChange={(e, zoom) => onZoomChange(zoom)}
				/>
			</div>
		</div>
	);
};

export const styles = (theme) => ({
	cropContainer: {
		position: 'relative',
		width: '100%',
		height: 200,
		background: '#333',
		[theme.breakpoints.up('sm')]: {
			height: 400,
		},
	},
	cropButton: {
		flexShrink: 0,
		marginLeft: 16,
	},
	controls: {
		padding: 16,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'stretch',
		[theme.breakpoints.up('sm')]: {
			flexDirection: 'row',
			alignItems: 'center',
		},
	},
	sliderContainer: {
		display: 'flex',
		flex: '1',
		alignItems: 'center',
	},
	sliderLabel: {
		[theme.breakpoints.down('xs')]: {
			minWidth: 65,
		},
	},
	slider: {
		padding: '22px 0px',
		marginLeft: 32,
		[theme.breakpoints.up('sm')]: {
			flexDirection: 'row',
			alignItems: 'center',
			margin: '0 16px',
		},
	},
});


export default ImageCropper;

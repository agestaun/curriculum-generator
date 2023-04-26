export const getCroppedImg = async (imageSrc, pixelCrop) => {
	const image = new Image();
	image.src = imageSrc;
	const canvas = document.createElement('canvas');
	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;
	const ctx = canvas.getContext('2d');
	if (ctx !== null) {
		ctx.drawImage(
			image,
			pixelCrop.x,
			pixelCrop.y,
			pixelCrop.width,
			pixelCrop.height,
			0,
			0,
			pixelCrop.width,
			pixelCrop.height
		);
		const croppedImage = canvas.toDataURL('image/jpeg');
		return croppedImage;
	} else {
		throw new Error('Could not get 2D context from canvas element');
	}
};

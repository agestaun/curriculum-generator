import fs from 'fs'

export const base64Encode = (filePath: string): string => {
	const bitmap = fs.readFileSync(filePath)
	return new Buffer(bitmap).toString('base64')
}

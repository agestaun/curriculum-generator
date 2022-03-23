export interface Job {
	companyName: string;
	companyLocation: string;
	startYear: string;
	duration?: string;
	additionalData?: string;
	current?: boolean;
	tasks: Array<string>;
}

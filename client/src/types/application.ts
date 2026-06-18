
export type JobType =
	| 'FULL_TIME'
	| 'PART_TIME'
	| 'INTERNSHIP'
	| 'CONTRACT'
	| 'FREELANCE';

export type ApplicationStatus =
	| 'APPLIED'
	| 'INTERVIEWING'
	| 'OFFER'
	| 'REJECTED';

export interface Application {
	id: number;
	company_name: string;
	job_title: string;
	job_type: JobType;
	status: ApplicationStatus;
	applied_date: string;
	notes: string | null;
	created_at: string;
	updated_at: string;
}

export interface CreateApplicationPayload {
	company_name: string;
	job_title: string;
	job_type: JobType;
	status?: ApplicationStatus;
	applied_date: string;
	notes?: string;
}

export type UpdateApplicationPayload = Partial<CreateApplicationPayload>;

export interface ApplicationsResponse {
	data: Application[];
	count: number;
}

export interface ApplicationResponse {
	data: Application;
}

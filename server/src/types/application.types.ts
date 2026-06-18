import { ApplicationStatus, JobType } from "../generated/prisma";
export { ApplicationStatus, JobType };

export interface CreateApplicationDto {
	company_name: string;
	job_title: string;
	job_type: JobType;
	status?: ApplicationStatus;
	applied_date: string;
	notes?: string;
}

export type UpdateApplicationDto = Partial<CreateApplicationDto>;

export interface ApplicationQuery {
	status?: ApplicationStatus;
	search?: string;
}

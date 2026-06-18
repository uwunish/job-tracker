import axios from "axios";
import type { Application, ApplicationResponse, ApplicationsResponse, ApplicationStatus, CreateApplicationPayload, UpdateApplicationPayload } from "../types/application";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

export const getApplications = async (
	status?: ApplicationStatus,
	search?: string
): Promise<Application[]> => {
	const params: Record<string, string> = {};
	if (status) params.status = status;
	if (search) params.search = search;

	const response = await api.get<ApplicationsResponse>("/applications", { params });
	return response.data.data;
};

export const getApplicationById = async (id: number): Promise<Application> => {
	const response = await api.get<ApplicationResponse>(`/applications/${id}`);
	return response.data.data;
};

export const createApplication = async (
	payload: CreateApplicationPayload
): Promise<Application> => {
	const response = await api.post<ApplicationResponse>('/applications', payload);
	return response.data.data;
};

export const updateApplication = async (
	id: number,
	payload: UpdateApplicationPayload
): Promise<Application> => {
	const response = await api.patch<ApplicationResponse>(`/applications/${id}`, payload);
	return response.data.data;
};

export const deleteApplication = async (id: number): Promise<void> => {
	await api.delete(`/applications/${id}`);
};

import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { ApplicationQuery, ApplicationStatus, CreateApplicationDto, UpdateApplicationDto } from "../types/application.types";
import { AppError } from "../middleware/errorHandler";


export const getAllApplications = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { status, search } = req.query as ApplicationQuery;
		const where: any = {};

		if (status) {
			where.status = status;
		}

		if (search) {
			where.OR = [
				{ company_name: { contains: search, mode: 'insensitive' } },
				{ job_title: { contains: search, mode: 'insensitive' } },
			];
		}

		const applications = await prisma.application.findMany({
			where,
			orderBy: { created_at: 'desc' },
		});

		res.json({
			data: applications,
			count: applications.length,
		});
	} catch (error) {
		next(error);
	}
}

export const getApplicationById = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const rawId = Array.isArray(req.params.id)
			? req.params.id[0]
			: req.params.id;

		const id = parseInt(rawId ?? '', 10);

		if (isNaN(id)) {
			throw new AppError("Invalid application Id", 400);
		}

		const application = await prisma.application.findUnique({
			where: { id },
		});

		if (!application) {
			throw new AppError('Application not found', 404);
		}
		res.json({ data: application });

	} catch (error) {
		next(error);
	}
}

export const createApplication = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const {
			company_name,
			job_title,
			job_type,
			status,
			applied_date,
			notes,
		} = req.body as CreateApplicationDto;

		if (!company_name || !job_title || !job_type || !applied_date) {
			throw new AppError(
				"Missing required fields: company_name, job_title, job_type, applied_date",
				400
			);
		}

		const application = await prisma.application.create({
			data: {
				company_name,
				job_title,
				job_type,
				status: status ?? ApplicationStatus.APPLIED,
				applied_date: new Date(applied_date),
				notes: notes ?? null,
			},
		});

		res.status(201).json({
			message: "Application created successfully",
			data: application,
		});

	} catch (error) {
		next(error);
	}
}

export const updateApplication = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const rawId = Array.isArray(req.params.id)
			? req.params.id[0]
			: req.params.id;
		const id = parseInt(rawId ?? '', 10);

		if (isNaN(id)) {
			throw new AppError("Invalid application ID", 400);
		}

		const {
			company_name,
			job_title,
			job_type,
			status,
			applied_date,
			notes,
		} = req.body as UpdateApplicationDto;

		if (!company_name && !job_title && !job_type && !status && !applied_date && !notes) {
			throw new AppError("No field provided to update", 400);
		}

		const updateData: any = {};
		if (company_name) updateData.company_name = company_name;
		if (job_title) updateData.job_title = job_title;
		if (job_type) updateData.job_type = job_type;
		if (status) updateData.status = status;
		if (applied_date) updateData.applied_date = new Date(applied_date);
		if (notes !== undefined) updateData.notes = notes;

		const application = await prisma.application.update({
			where: { id },
			data: updateData,
		});

		res.json({
			message: "Application updated successfully",
			data: application,
		});

	} catch (error) {
		next(error);
	}
}

export const deleteApplication = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const rawId = Array.isArray(req.params.id)
			? req.params.id[0]
			: req.params.id;

		const id = parseInt(rawId ?? '', 10);
		if (isNaN(id)) {
			throw new AppError("Invalid application ID", 400);
		}

		const application = await prisma.application.delete({
			where: { id },
		});

		res.json({
			message: "Application deleted successfully",
		});

	} catch (error) {
		next(error);
	}
}

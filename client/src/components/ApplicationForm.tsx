
import { useState } from 'react';
import type {
	Application,
	CreateApplicationPayload,
	JobType,
	ApplicationStatus,
} from '../types/application';

interface Props {
	initialData?: Application;              // pre-fills the form when editing
	onSubmit: (data: CreateApplicationPayload) => Promise<void>;
	onCancel: () => void;
	isLoading: boolean;
}

// Options shown in the Job Type dropdown
const JOB_TYPE_OPTIONS: { value: JobType; label: string }[] = [
	{ value: 'FULL_TIME', label: 'Full Time' },
	{ value: 'PART_TIME', label: 'Part Time' },
	{ value: 'INTERNSHIP', label: 'Internship' },
	{ value: 'CONTRACT', label: 'Contract' },
	{ value: 'FREELANCE', label: 'Freelance' },
];

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
	{ value: 'APPLIED', label: 'Applied' },
	{ value: 'INTERVIEWING', label: 'Interviewing' },
	{ value: 'OFFER', label: 'Offer' },
	{ value: 'REJECTED', label: 'Rejected' },
];

// converts a full ISO timestamp to "YYYY-MM-DD" for the date input
const toDateInputValue = (isoString?: string): string => {
	if (!isoString) return '';
	return isoString.split('T')[0];
};

export default function ApplicationForm({ initialData, onSubmit, onCancel, isLoading }: Props) {
	// Form state — each field is a separate piece of state
	const [companyName, setCompanyName] = useState(initialData?.company_name ?? '');
	const [jobTitle, setJobTitle] = useState(initialData?.job_title ?? '');
	const [jobType, setJobType] = useState<JobType>(initialData?.job_type ?? 'INTERNSHIP');
	const [status, setStatus] = useState<ApplicationStatus>(initialData?.status ?? 'APPLIED');
	const [appliedDate, setAppliedDate] = useState(toDateInputValue(initialData?.applied_date));
	const [notes, setNotes] = useState(initialData?.notes ?? '');

	const [errors, setErrors] = useState<Record<string, string>>({});

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {};
		if (!companyName.trim()) newErrors.companyName = 'Company name is required';
		if (!jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
		if (!appliedDate) newErrors.appliedDate = 'Applied date is required';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		await onSubmit({
			company_name: companyName.trim(),
			job_title: jobTitle.trim(),
			job_type: jobType,
			status,
			applied_date: appliedDate,
			notes: notes.trim() || undefined,
		});
	};

	const isEditing = !!initialData;

	return (
		<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
				<div className="form-group">
					<label className="form-label">Company Name *</label>
					<input
						className="form-input"
						value={companyName}
						onChange={e => setCompanyName(e.target.value)}
						placeholder="e.g. Google"
					/>
					{errors.companyName && <span className="form-error">{errors.companyName}</span>}
				</div>

				<div className="form-group">
					<label className="form-label">Job Title *</label>
					<input
						className="form-input"
						value={jobTitle}
						onChange={e => setJobTitle(e.target.value)}
						placeholder="e.g. Frontend Intern"
					/>
					{errors.jobTitle && <span className="form-error">{errors.jobTitle}</span>}
				</div>
			</div>

			{/* Row 2: Job Type + Status + Date */}
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
				<div className="form-group">
					<label className="form-label">Job Type *</label>
					<select
						className="form-select"
						value={jobType}
						onChange={e => setJobType(e.target.value as JobType)}
					>
						{JOB_TYPE_OPTIONS.map(opt => (
							<option key={opt.value} value={opt.value}>{opt.label}</option>
						))}
					</select>
				</div>

				<div className="form-group">
					<label className="form-label">Status</label>
					<select
						className="form-select"
						value={status}
						onChange={e => setStatus(e.target.value as ApplicationStatus)}
					>
						{STATUS_OPTIONS.map(opt => (
							<option key={opt.value} value={opt.value}>{opt.label}</option>
						))}
					</select>
				</div>

				<div className="form-group">
					<label className="form-label">Applied Date *</label>
					<input
						type="date"
						className="form-input"
						value={appliedDate}
						onChange={e => setAppliedDate(e.target.value)}
						style={{ colorScheme: 'dark' }}
					/>
					{errors.appliedDate && <span className="form-error">{errors.appliedDate}</span>}
				</div>
			</div>

			{/* Row 3: Notes */}
			<div className="form-group">
				<label className="form-label">Notes <span style={{ color: 'var(--color-text-faint)' }}>(optional)</span></label>
				<textarea
					className="form-textarea"
					value={notes}
					onChange={e => setNotes(e.target.value)}
					placeholder="Any extra details — recruiter name, referral, interview notes..."
				/>
			</div>

			{/* Action buttons */}
			<div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '4px' }}>
				<button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isLoading}>
					Cancel
				</button>
				<button type="submit" className="btn btn-primary" disabled={isLoading}>
					{isLoading
						? (isEditing ? 'Saving...' : 'Adding...')
						: (isEditing ? 'Save Changes' : 'Add Application')
					}
				</button>
			</div>
		</form>
	);
}

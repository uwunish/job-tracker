import type { Application } from '../types/application';
import StatusBadge from './StatusBadge';

interface Props {
	application: Application;
	onEdit: (application: Application) => void;
	onDelete: (application: Application) => void;
}

// Formats "FULL_TIME" → "Full Time"
const formatJobType = (type: string): string =>
	type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// Formats ISO date string → "Jun 17, 2024"
const formatDate = (dateStr: string): string =>
	new Date(dateStr).toLocaleDateString('en-US', {
		month: 'short', day: 'numeric', year: 'numeric',
	});

export default function ApplicationCard({ application, onEdit, onDelete }: Props) {
	return (
		<div
			style={{
				display: 'grid',
				// Column layout: company | title+type | status | date | actions
				gridTemplateColumns: '1.5fr 1.5fr 130px 110px auto',
				alignItems: 'center',
				gap: '16px',
				padding: '16px 20px',
				background: 'var(--color-surface)',
				border: '1px solid var(--color-border)',
				borderRadius: 'var(--radius-md)',
				transition: 'border-color var(--transition)',
			}}
			onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-hover)')}
			onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
		>
			{/* Company Name */}
			<div>
				<div style={{ fontWeight: 600, fontSize: '15px' }}>
					{application.company_name}
				</div>
				{application.notes && (
					<div
						title={application.notes}   /* shows full note on hover */
						style={{
							fontSize: '12px',
							color: 'var(--color-text-faint)',
							marginTop: '2px',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							maxWidth: '180px',
						}}
					>
						{application.notes}
					</div>
				)}
			</div>

			{/* Job Title + Type */}
			<div>
				<div style={{ fontSize: '14px', color: 'var(--color-text)' }}>
					{application.job_title}
				</div>
				<div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
					{formatJobType(application.job_type)}
				</div>
			</div>

			{/* Status Badge */}
			<div>
				<StatusBadge status={application.status} />
			</div>

			{/* Applied Date */}
			<div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
				{formatDate(application.applied_date)}
			</div>

			{/* Action Buttons */}
			<div style={{ display: 'flex', gap: '8px' }}>
				<button
					className="btn btn-ghost btn-icon"
					onClick={() => onEdit(application)}
					title="Edit application"
				>
					✏️
				</button>
				<button
					className="btn btn-danger btn-icon"
					onClick={() => onDelete(application)}
					title="Delete application"
				>
					🗑️
				</button>
			</div>
		</div>
	);
}

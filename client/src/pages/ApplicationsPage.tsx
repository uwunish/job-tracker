
import { useState, useEffect, useCallback } from 'react';
import type { Application, ApplicationStatus, CreateApplicationPayload } from '../types/application';
import {
	getApplications,
	createApplication,
	updateApplication,
	deleteApplication,
} from '../services/api';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationForm from '../components/ApplicationForm';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';

// The filter tabs shown at the top
const STATUS_FILTERS: { label: string; value: ApplicationStatus | 'ALL' }[] = [
	{ label: 'All', value: 'ALL' },
	{ label: 'Applied', value: 'APPLIED' },
	{ label: 'Interviewing', value: 'INTERVIEWING' },
	{ label: 'Offer', value: 'OFFER' },
	{ label: 'Rejected', value: 'REJECTED' },
];

export default function ApplicationsPage() {
	// ── Data State ───────────────────────────────────────────────────────────
	const [applications, setApplications] = useState<Application[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// ── Filter & Search State ────────────────────────────────────────────────
	const [activeFilter, setActiveFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
	const [searchTerm, setSearchTerm] = useState('');

	// ── Modal State ──────────────────────────────────────────────────────────
	const [showForm, setShowForm] = useState(false);
	const [editingApp, setEditingApp] = useState<Application | null>(null);
	const [deletingApp, setDeletingApp] = useState<Application | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	// ── Fetch Applications ───────────────────────────────────────────────────
	// useCallback memoizes this function so it doesn't get recreated on every render
	const fetchApplications = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const status = activeFilter === 'ALL' ? undefined : activeFilter;
			const data = await getApplications(status, searchTerm || undefined);
			setApplications(data);
		} catch {
			setError('Failed to load applications. Is the server running?');
		} finally {
			setIsLoading(false);
		}
	}, [activeFilter, searchTerm]);

	// Re-fetch whenever filter or search changes
	useEffect(() => {
		// Small delay on search so we don't fire on every keystroke
		const timer = setTimeout(fetchApplications, searchTerm ? 300 : 0);
		return () => clearTimeout(timer);
	}, [fetchApplications, searchTerm]);

	// ── Handlers ─────────────────────────────────────────────────────────────

	const handleCreate = async (payload: CreateApplicationPayload) => {
		try {
			setIsSubmitting(true);
			await createApplication(payload);
			setShowForm(false);
			await fetchApplications();  // refresh the list
		} catch {
			alert('Failed to create application. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdate = async (payload: CreateApplicationPayload) => {
		if (!editingApp) return;
		try {
			setIsSubmitting(true);
			await updateApplication(editingApp.id, payload);
			setShowForm(false);
			setEditingApp(null);
			await fetchApplications();
		} catch {
			alert('Failed to update application. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (!deletingApp) return;
		try {
			setIsDeleting(true);
			await deleteApplication(deletingApp.id);
			setDeletingApp(null);
			await fetchApplications();
		} catch {
			alert('Failed to delete application. Please try again.');
		} finally {
			setIsDeleting(false);
		}
	};

	// ── Render ────────────────────────────────────────────────────────────────
	return (
		<div style={{ minHeight: '100vh', paddingBottom: '60px' }}>

			{/* ── Header ── */}
			<header style={{
				borderBottom: '1px solid var(--color-border)',
				padding: '20px 0',
				marginBottom: '40px',
				background: 'var(--color-surface)',
			}}>
				<div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<div>
						<h1 style={{
							fontSize: '22px',
							fontWeight: 700,
							letterSpacing: '-0.02em',
							background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}>
							JobTracker
						</h1>
						<p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
							{applications.length} application{applications.length !== 1 ? 's' : ''} tracked
						</p>
					</div>
					<button
						className="btn btn-primary"
						onClick={() => { setEditingApp(null); setShowForm(true); }}
					>
						+ Add Application
					</button>
				</div>
			</header>

			<div className="container">

				{/* ── Search + Filter Bar ── */}
				<div style={{
					display: 'flex',
					gap: '12px',
					marginBottom: '24px',
					flexWrap: 'wrap',
					alignItems: 'center',
				}}>
					{/* Search input */}
					<input
						className="form-input"
						placeholder="Search company or job title..."
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						style={{ maxWidth: '300px' }}
					/>

					{/* Status filter tabs */}
					<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
						{STATUS_FILTERS.map(f => (
							<button
								key={f.value}
								onClick={() => setActiveFilter(f.value)}
								style={{
									padding: '6px 14px',
									borderRadius: '999px',
									fontSize: '13px',
									fontWeight: 500,
									cursor: 'pointer',
									border: '1px solid',
									fontFamily: 'var(--font-sans)',
									transition: 'all var(--transition)',
									// Active tab gets accent color, inactive gets ghost style
									background: activeFilter === f.value ? 'var(--color-primary)' : 'transparent',
									color: activeFilter === f.value ? '#fff' : 'var(--color-text-muted)',
									borderColor: activeFilter === f.value ? 'var(--color-primary)' : 'var(--color-border)',
								}}
							>
								{f.label}
							</button>
						))}
					</div>
				</div>

				{/* ── Column Headers ── */}
				{applications.length > 0 && (
					<div style={{
						display: 'grid',
						gridTemplateColumns: '1.5fr 1.5fr 130px 110px auto',
						gap: '16px',
						padding: '0 20px',
						marginBottom: '8px',
					}}>
						{['Company', 'Role', 'Status', 'Applied', ''].map(h => (
							<div key={h} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
								{h}
							</div>
						))}
					</div>
				)}

				{/* ── Application List ── */}
				{isLoading ? (
					<div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
						Loading applications...
					</div>
				) : error ? (
					<div style={{ textAlign: 'center', padding: '80px 0' }}>
						<div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
						<p style={{ color: '#f87171' }}>{error}</p>
						<button className="btn btn-ghost" style={{ marginTop: '16px' }} onClick={fetchApplications}>
							Retry
						</button>
					</div>
				) : applications.length === 0 ? (
					// Empty state
					<div style={{ textAlign: 'center', padding: '80px 0' }}>
						<div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
						<h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
							{searchTerm || activeFilter !== 'ALL' ? 'No results found' : 'No applications yet'}
						</h3>
						<p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '24px' }}>
							{searchTerm || activeFilter !== 'ALL'
								? 'Try adjusting your search or filter.'
								: 'Start tracking your job search by adding your first application.'}
						</p>
						{activeFilter === 'ALL' && !searchTerm && (
							<button className="btn btn-primary" onClick={() => setShowForm(true)}>
								+ Add Your First Application
							</button>
						)}
					</div>
				) : (
					// The list of application cards
					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
						{applications.map(app => (
							<ApplicationCard
								key={app.id}
								application={app}
								onEdit={app => { setEditingApp(app); setShowForm(true); }}
								onDelete={app => setDeletingApp(app)}
							/>
						))}
					</div>
				)}

				{/* ── Status Summary ── */}
				{applications.length > 0 && activeFilter === 'ALL' && !searchTerm && (
					<div style={{
						display: 'flex', gap: '24px', flexWrap: 'wrap',
						marginTop: '40px', padding: '20px',
						background: 'var(--color-surface)',
						border: '1px solid var(--color-border)',
						borderRadius: 'var(--radius-md)',
					}}>
						<span style={{ fontSize: '13px', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
							Summary:
						</span>
						{(['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED'] as ApplicationStatus[]).map(s => {
							const count = applications.filter(a => a.status === s).length;
							return count > 0 ? (
								<div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<StatusBadge status={s} />
									<span style={{ fontSize: '13px', fontWeight: 600 }}>{count}</span>
								</div>
							) : null;
						})}
					</div>
				)}
			</div>

			{/* ── Add / Edit Form Modal ── */}
			{showForm && (
				<div
					onClick={() => { setShowForm(false); setEditingApp(null); }}
					style={{
						position: 'fixed', inset: 0,
						background: 'rgba(0,0,0,0.6)',
						backdropFilter: 'blur(4px)',
						display: 'flex', alignItems: 'center', justifyContent: 'center',
						zIndex: 900, padding: '16px',
					}}
				>
					<div
						onClick={e => e.stopPropagation()}
						style={{
							background: 'var(--color-surface)',
							border: '1px solid var(--color-border)',
							borderRadius: 'var(--radius-lg)',
							padding: '32px',
							width: '100%', maxWidth: '640px',
							maxHeight: '90vh', overflowY: 'auto',
						}}
					>
						<h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>
							{editingApp ? '✏️ Edit Application' : '+ New Application'}
						</h2>
						<ApplicationForm
							initialData={editingApp ?? undefined}
							onSubmit={editingApp ? handleUpdate : handleCreate}
							onCancel={() => { setShowForm(false); setEditingApp(null); }}
							isLoading={isSubmitting}
						/>
					</div>
				</div>
			)}

			{/* ── Delete Confirmation Dialog ── */}
			<ConfirmDialog
				isOpen={!!deletingApp}
				title="Delete Application"
				message={`Are you sure you want to delete the application for ${deletingApp?.job_title} at ${deletingApp?.company_name}? This cannot be undone.`}
				onConfirm={handleDelete}
				onCancel={() => setDeletingApp(null)}
				isLoading={isDeleting}
			/>
		</div>
	);
}


interface Props {
	isOpen: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export default function ConfirmDialog({
	isOpen,
	title,
	message,
	onConfirm,
	onCancel,
	isLoading = false,
}: Props) {
	// Don't render anything when the dialog is closed
	if (!isOpen) return null;

	return (
		// Overlay — clicking outside cancels the dialog
		<div
			onClick={onCancel}
			style={{
				position: 'fixed', inset: 0,
				background: 'rgba(0,0,0,0.6)',
				backdropFilter: 'blur(4px)',
				display: 'flex', alignItems: 'center', justifyContent: 'center',
				zIndex: 1000,
				padding: '16px',
			}}
		>
			{/* Dialog box — stop clicks from bubbling to the overlay */}
			<div
				onClick={e => e.stopPropagation()}
				style={{
					background: 'var(--color-surface)',
					border: '1px solid var(--color-border)',
					borderRadius: 'var(--radius-lg)',
					padding: '32px',
					maxWidth: '420px',
					width: '100%',
				}}
			>
				{/* Warning icon */}
				<div style={{ fontSize: '32px', marginBottom: '16px' }}>⚠️</div>

				<h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
					{title}
				</h3>
				<p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '28px' }}>
					{message}
				</p>

				<div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
					<button className="btn btn-ghost" onClick={onCancel} disabled={isLoading}>
						Cancel
					</button>
					<button className="btn btn-danger" onClick={onConfirm} disabled={isLoading}>
						{isLoading ? 'Deleting...' : 'Delete'}
					</button>
				</div>
			</div>
		</div>
	);
}

import type { ApplicationStatus } from "../types/application";

interface Props {
	status: ApplicationStatus;
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
	APPLIED: "🟢 Applied",
	INTERVIEWING: " Interviewing",
	OFFER: "⭐ Offer",
	REJECTED: "❌ Rejected"
};

export default function StatusBadge({ status }: Props) {
	return (
		<span className="{`badge ${status}`}">
			{STATUS_LABELS[status]}
		</span>
	);
}

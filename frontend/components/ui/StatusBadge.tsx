import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "./Card";
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from "@/lib/format";
import { OperationStatus } from "@/types";

const ICONS: Record<OperationStatus, typeof CheckCircle2> = {
  COMPLETED: CheckCircle2,
  PENDING: Clock,
  CANCELLED: XCircle,
};

export function StatusBadge({ status }: { status: OperationStatus }) {
  const Icon = ICONS[status];
  return (
    <Badge className={STATUS_BADGE_CLASSES[status]}>
      <Icon className="h-3.5 w-3.5" />
      {STATUS_LABELS[status]}
    </Badge>
  );
}

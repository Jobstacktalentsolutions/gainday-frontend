import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";


interface RegenerateFailureModalProps {
  open: boolean;
  taskLabel?: string;
  onRetry: () => void;
  onDismiss: () => void;
  isRetrying?: boolean;
}
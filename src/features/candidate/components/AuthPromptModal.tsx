import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ActionButton } from "@/components/ui/ActionButton"

interface AuthPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp: () => void;
  onContinueAsGuest: () => void;
}
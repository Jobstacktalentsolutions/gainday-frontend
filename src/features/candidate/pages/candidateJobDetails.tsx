import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, MapPin, Wallet, Share2 } from "lucide-react";
import { PublicNavbar } from "../components/PublicNavbar";
import { AuthPromptModal } from "../components/AuthPromptModal";
import { ActionButton } from "@/components/ui/ActionButton";
import { StepContinueButton } from "@/components/ui/StepNavigationButtons";
import { useJobBoardFilters } from "../hooks/useJobBoardFilters";
import { formatPostedDate, formatSalaryRange } from "../utils/formatters";
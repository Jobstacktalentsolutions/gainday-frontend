import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PublicNavbar } from "@/features/candidate/components/PublicNavbar";
import { FormInput } from "@/components/form/FormInput";
import { ActionButton } from "@/components/ui/ActionButton";
import { PasswordInput } from "../components/PasswordInput";
import { candidateSignUpSchema, type CandidateSignUpValues } from "../schemas";
import { useCandidateAuth } from "../hooks/useCandidateAuth";
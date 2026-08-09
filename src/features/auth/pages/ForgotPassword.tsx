import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Mail } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { ActionButton } from "@/components/ui/ActionButton";
import { FormInput } from "@/components/form/FormInput";
import AuthCard from "../component/AuthCard";
import { forgetPasswordSchema, type forgetPasswordFormValues } from "../schemas/forgetPasswordSchema";


const ForgotPassword = () => {
    const navigate = useNavigate() 
    const [sentTo, setSentTo] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<forgetPasswordFormValues>({ resolver : zodResolver(forgetPasswordSchema)});

    const  requestResetMutation = useMutation({
        mutationFn : (values : forgetPasswordFormValues) =>
            apiClient.post("/auth/request-password-reset", values),
        onSuccess : (_res, values) => setSentTo(values.email),
    })

    return (

    );
}

export default ForgotPassword;
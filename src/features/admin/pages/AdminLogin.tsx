import { useForm } from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { type AdminLoginFormValues, adminLoginSchema } from "../schemas/loginSchema";
import { apiClient } from "@/lib/api/client";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/FormInput";


const AdminLogin = () => {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState : { errors, isSubmitting },
    } = useForm<AdminLoginFormValues>({
        resolver: zodResolver(adminLoginSchema),
    })

    const loginMutation = useMutation({
        mutationFn : (values : AdminLoginFormValues) => 
            apiClient.post("/admin/auth/login", values),
        onSuccess : (res) => {
            //assume session token gets stored as adminToken by the backend

            localStorage.setItem("adminToken", res.data.token);
            navigate("/admin/dashboard");
        }
    })

    return (
        <div>

        </div>
    );
}

AdminLogin.displayName  = "AdminLogin";
export default AdminLogin;
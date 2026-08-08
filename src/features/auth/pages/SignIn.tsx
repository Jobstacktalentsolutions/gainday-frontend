import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { ActionButton } from "@/components/ui/ActionButton";
import { FormInput } from "@/components/form/FormInput";
import { AuthDivider } from "../component/AuthDivider";
import SocialAuthButton from "../component/SocialAuthButton";
import AuthSwitchLink from "../component/AuthSwitchLink";
import { signInSchema, type signInFormValues } from "../schemas/signInSchema";
import AuthCard from "../component/AuthCard";



const SignIn = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<signInFormValues>({
        resolver: zodResolver(signInSchema)
    })

    const signInMutation = useMutation({
        mutationFn: (values: signInFormValues) =>
            apiClient.post("/auth/login", values),
        onSuccess: () => navigate("/dashboard")
    })

    return (
        <AuthCard
        title = "Log in to Gainday"
        subtitle="Review submissions and manage job posts."
        open ={ true }
        onOpenChange = { (open) => !open && navigate("/")}
        >
            <form
            onSubmit = { handleSubmit((values) => signInMutation.mutate(values))}
            noValidate
            >

            </form>

        </AuthCard>
    );
}


export default SignIn;
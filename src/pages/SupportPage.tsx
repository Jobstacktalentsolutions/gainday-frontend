import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import { ActionButton } from "@/components/ui/ActionButton";
import Header from "@/features/landing/components/Header";
import { Footer } from "@/features/landing/components/footer/Footer";
import spinner from "@/assets/Spinner.svg";

const TOPIC_OPTIONS = [
  { value: "Account Suspension Appeal", label: "Account Suspension Appeal" },
  { value: "Account Access & Login", label: "Account Access & Login" },
  { value: "Technical Support / Bug Report", label: "Technical Support / Bug Report" },
  { value: "Billing & Subscriptions", label: "Billing & Subscriptions" },
  { value: "General Inquiry", label: "General Inquiry" },
];

const supportSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(255),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  topic: z.string().min(1, "Please select a topic").max(100),
  message: z
    .string()
    .trim()
    .min(10, "Please describe your inquiry or appeal in at least 10 characters"),
});

type SupportFormValues = z.infer<typeof supportSchema>;

const SupportPage = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const topicParam = searchParams.get("topic") || "";

  // Normalize topic param if it matches suspension or predefined slugs
  const initialTopic =
    topicParam.toLowerCase().includes("suspension")
      ? "Account Suspension Appeal"
      : topicParam || "Account Suspension Appeal";

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      name: "",
      email: emailParam,
      topic: initialTopic,
      message: "",
    },
  });

  useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
    if (topicParam) {
      setValue(
        "topic",
        topicParam.toLowerCase().includes("suspension")
          ? "Account Suspension Appeal"
          : topicParam
      );
    }
  }, [emailParam, topicParam, setValue]);

  const [submittedData, setSubmittedData] = useState<{
    id?: string;
    message?: string;
  } | null>(null);

  const supportMutation = useMutation({
    mutationFn: async (values: SupportFormValues) => {
      const res = await apiClient.post("/support", values);
      return res.data;
    },
    onSuccess: (data) => {
      setSubmittedData(data);
    },
  });

  const onSubmit = (values: SupportFormValues) => {
    supportMutation.mutate(values);
  };

  const handleResetForm = () => {
    setSubmittedData(null);
    reset({
      name: "",
      email: emailParam,
      topic: initialTopic,
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between">
      {/* Existing Shared Navbar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 sm:px-8 pt-32 sm:pt-38 pb-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            Support Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            Gainday Help & Support
          </h1>
          <p className="mt-2 text-base text-neutral-600 max-w-2xl">
            Need assistance with your account, encountering an issue, or appealing a suspension? Our support desk is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Direct Email Card */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">
                    Direct Email Support
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Send an email directly to our support desk:
                  </p>
                  <a
                    href="mailto:support@gainday.com"
                    className="inline-block mt-2 font-semibold text-primary-600 hover:text-primary-700 text-base underline underline-offset-2 transition-colors"
                  >
                    support@gainday.com
                  </a>
                </div>
              </div>
            </div>

            {/* Response SLA Card */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">
                    Response Turnaround
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Our team reviews all inquiries within{" "}
                    <span className="font-semibold text-neutral-900">
                      24–48 hours
                    </span>
                    . Account access and suspension appeals receive priority attention.
                  </p>
                </div>
              </div>
            </div>

            {/* Suspension Appeal Guidelines */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">
                    Suspension Appeals
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    If you believe your account was suspended by mistake, please include:
                  </p>
                  <ul className="text-xs text-neutral-600 mt-2 space-y-1 list-disc list-inside">
                    <li>The registered email address on your account</li>
                    <li>Explanation of recent account activity</li>
                    <li>Any relevant context for the moderation team</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Appeal Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs">
              {submittedData ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Support Request Received
                  </h2>
                  <p className="text-neutral-600 text-sm max-w-md mx-auto">
                    {submittedData.message ||
                      "Thank you for contacting Gainday Support. We have received your message and will get back to you shortly."}
                  </p>
                  {submittedData.id && (
                    <div className="inline-block bg-neutral-50 px-4 py-2 rounded-lg border border-neutral-200 text-xs font-mono text-neutral-600">
                      Reference ID: {submittedData.id}
                    </div>
                  )}

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <ActionButton
                      type="button"
                      variant="outline"
                      onClick={handleResetForm}
                    >
                      Submit another inquiry
                    </ActionButton>
                    <Link to="/landing">
                      <ActionButton type="button" className="w-full sm:w-auto">
                        Return to Home
                      </ActionButton>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary-500" />
                      Send us a Message
                    </h2>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      Fill out the form below and our support team will reach out directly.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="space-y-4"
                  >
                    <FormInput
                      label="Full Name"
                      type="text"
                      placeholder="Jane Doe"
                      required
                      autoComplete="name"
                      error={errors.name?.message}
                      {...register("name")}
                    />

                    <FormInput
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      error={errors.email?.message}
                      {...register("email")}
                    />

                    <FormSelect
                      label="Topic / Category"
                      required
                      error={errors.topic?.message}
                      {...register("topic")}
                    >
                      {TOPIC_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </FormSelect>

                    <FormTextarea
                      label="Message / Explanation"
                      placeholder="Please provide details about your inquiry or appeal..."
                      rows={5}
                      required
                      error={errors.message?.message}
                      {...register("message")}
                    />

                    {supportMutation.isError && (
                      <div
                        role="alert"
                        className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          {(supportMutation.error as any)?.response?.data?.message ||
                            "Failed to submit support request. Please try again or email support@gainday.com directly."}
                        </span>
                      </div>
                    )}

                    <ActionButton
                      type="submit"
                      className="w-full py-4 text-base font-semibold mt-2"
                      disabled={supportMutation.isPending}
                    >
                      {supportMutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <img
                            src={spinner}
                            alt="Loading"
                            className="w-4 h-4 animate-spin"
                          />
                          <span>Submitting...</span>
                        </span>
                      ) : (
                        <span>Submit Support Request</span>
                      )}
                    </ActionButton>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Existing Shared Footer */}
      <Footer />
    </div>
  );
};

export default SupportPage;

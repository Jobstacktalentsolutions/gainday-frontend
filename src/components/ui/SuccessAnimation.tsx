import { Lottie } from "lottie-react";
import successAnimation from "@/assets/lottie/success.json";

export function SuccessAnimation({ className = "size-40" }: { className?: string }) {
  return <Lottie animationData={successAnimation} loop={false} autoplay speed={0.85} className={className} aria-hidden="true" />;
}

import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useMyExperienceReview } from "../hooks/useExperienceReview";
import ExperienceReviewModal from "./ExperienceReviewModal";

// Never interrupt a timed simulation or its environment check.
const FOCUSED_FLOW_PATTERN = /simulation|environment-check/;
const REVIEWER_ROLES = ["JOB_SEEKER", "EMPLOYER"];

/**
 * Asks a signed-in candidate or employer to rate their experience until they have. Closing it with
 * the X hides it for this page load only, so it is asked again on the next visit.
 */
const ExperienceReviewPrompt = () => {
  const { user } = useCurrentUser();
  const { pathname } = useLocation();
  const [dismissed, setDismissed] = useState(false);

  const isReviewer = user !== null && REVIEWER_ROLES.includes(user.role);
  const isFocusedFlow = FOCUSED_FLOW_PATTERN.test(pathname);
  const { data } = useMyExperienceReview(isReviewer && !isFocusedFlow);

  if (!data || data.review !== null || dismissed || isFocusedFlow) return null;

  return <ExperienceReviewModal onDismiss={() => setDismissed(true)} />;
};

export default ExperienceReviewPrompt;

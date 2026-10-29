export interface ExperienceReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface MyExperienceReview {
  review: ExperienceReview | null;
}

export interface CreateExperienceReviewPayload {
  rating: number;
  comment?: string;
}

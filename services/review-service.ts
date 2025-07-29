import type { Review, CreateReviewData, ReviewFilters, ReviewStats } from "@/types/review"

export abstract class ReviewService {
  abstract getReviews(filters?: ReviewFilters): Promise<Review[]>
  abstract createReview(data: CreateReviewData): Promise<Review>
  abstract getStats(): Promise<ReviewStats>
  abstract uploadImages(images: File[]): Promise<string[]>
}

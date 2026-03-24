interface Review {
  user: {
    name: string;
    id: string;
    email?: string;
  };
  comment: string;
  rating: number;
  createdAt?: any;
}

interface ReviewSectionProps {
  reviews: Review[];
}

const ReviewSection = ({ reviews }: ReviewSectionProps) => {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const renderStars = (rating: number) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating})</span>
    </div>
  );

  if (reviews.length === 0) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Reviews
        </h2>
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-gray-600 dark:text-gray-400">No reviews yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Be the first to review this property!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Reviews
      </h2>
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF4FA1] rounded-full flex items-center justify-center text-white font-semibold">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {review.user.name}
                  </h4>
                  {renderStars(review.rating)}
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Recently
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;

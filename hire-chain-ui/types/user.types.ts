interface UserProfile {
  _id: string;
  userAccountId: string;
  __v: number;
  createdAt: string;
  email: string;
  name: string;
  portfolioUrl: string;
  profileType: "freelancer" | "hirer";
  skills: string[];
  type: "PROFILE_CREATE";
  updatedAt: string;
}

interface Stats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: string]: number;
  };
  xpPoints: number;
  completedGigsCount: number;
  activeGigsCount?: number;
  totalEarned?: number;
}

interface Gig {
  _id: string;
  title: string;
  budget: number;
  createdAt: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface UserProfileData {
  profile: UserProfile;
  stats: Stats;
  completedGigs: Gig[];
  recentReviews: Review[];
}

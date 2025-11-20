"use client";
import { useState, useEffect } from "react";
import { Search, Filter, Star, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import HTTP from "@/lib/http"; // adjust path as needed
import router from "next/router";
import { useRouter } from "next/navigation";

interface FreelancerStats {
  averageRating: number;
  totalReviews: number;
  xpPoints: number;
  completedGigs: number;
}

interface Freelancer {
  _id: string;
  userAccountId: string;
  name: string;
  skills: string[];
  portfolioUrl: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  stats: FreelancerStats;
  __v: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FreelancersResponse {
  freelancers: Freelancer[];
  pagination: PaginationData;
}

// Skeleton Card Component
function FreelancerCardSkeleton() {
  return (
    <div className='bg-white/95 border border-[#f0e5f0] rounded-xl p-5 space-y-4'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <Skeleton className='h-12 w-12 rounded-full' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-3 w-20' />
        </div>
      </div>

      {/* Stats */}
      <div className='space-y-2'>
        <div className='flex justify-between'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-3 w-20' />
        </div>
        <div className='flex justify-between'>
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-3 w-12' />
        </div>
        <div className='flex justify-between'>
          <Skeleton className='h-3 w-28' />
          <Skeleton className='h-3 w-8' />
        </div>
        <div className='flex justify-between'>
          <Skeleton className='h-3 w-20' />
          <Skeleton className='h-3 w-12' />
        </div>
      </div>

      {/* Skills */}
      <div className='flex gap-1'>
        <Skeleton className='h-6 w-16 rounded-full' />
        <Skeleton className='h-6 w-20 rounded-full' />
        <Skeleton className='h-6 w-14 rounded-full' />
      </div>

      {/* Button */}
      <Skeleton className='h-10 w-full rounded-lg' />
    </div>
  );
}

export function FreelancersBrowsing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [freelancersData, setFreelancersData] =
    useState<FreelancersResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const { data, err } = await HTTP.get("/api/freelancers/browse");
      if (!err) {
        setFreelancersData(data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const freelancers = freelancersData?.freelancers || [];
  const allSkills = Array.from(new Set(freelancers.flatMap((f) => f.skills)));

  const filteredFreelancers = freelancers.filter((freelancer) => {
    const matchesSearch =
      freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesSkill =
      !selectedSkill || freelancer.skills.includes(selectedSkill);
    const matchesRating = freelancer.stats.averageRating >= minRating;
    return matchesSearch && matchesSkill && matchesRating;
  });

  // Calculate success rate
  const getSuccessRate = (stats: FreelancerStats) => {
    if (stats.completedGigs === 0) return 0;
    return Math.round((stats.completedGigs / (stats.completedGigs + 1)) * 100);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-4 font-[HankenGroteskLight]'>
        <h1 className='text-3xl font-bold text-indigo-600'>Find Freelancers</h1>
        <p className='text-[#2b0a30]/70'>
          Browse and connect with talented freelancers for your projects
        </p>
      </div>

      {/* Search and Filters */}
      <div className='space-y-4 font-[HankenGroteskLight]'>
        {/* Search Bar */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-600/50' />
          <Input
            placeholder='Search by name or skill...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
            disabled={loading}
          />
        </div>

        {/* Filter Tags */}
        {loading && (
          <div className='flex flex-wrap gap-2 font-[HankenGroteskLight]'>
            {/* Rating Filter */}
            <div className='flex items-center gap-2'>
              <Filter className='h-4 w-4 text-indigo-600/70' />
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className='px-3 py-1 rounded-lg border border-indigo-600 bg-gray-300/10 backdrop-blur-lg text-sm text-[#352b37]'
              >
                <option value={0}>All Ratings</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>

            {/* Skill Filter */}
            <div className='flex items-center gap-2 flex-wrap'>
              {allSkills.slice(0, 8).map((skill) => (
                <button
                  key={skill}
                  onClick={() =>
                    setSelectedSkill(selectedSkill === skill ? null : skill)
                  }
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedSkill === skill
                      ? "bg-indigo-600 text-[#ffffff]"
                      : "bg-muted text-indigo-600 hover:bg-muted/80"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedSkill || minRating > 0) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSkill(null);
                  setMinRating(0);
                }}
                className='px-3 py-1 rounded-lg text-sm text-[#2b0a30]/70 hover:text-[#2b0a30] transition-colors'
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      {!loading && (
        <div className='text-sm text-[#2b0a30]/70 font-[HankenGroteskLight]'>
          Showing {filteredFreelancers.length} freelancer
          {filteredFreelancers.length !== 1 ? "s" : ""}
          {freelancersData && ` of ${freelancersData.pagination.total} total`}
        </div>
      )}

      {/* Loading State with Skeleton Loaders */}
      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[...Array(6)].map((_, index) => (
            <FreelancerCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        /* Freelancers Grid */
        <>
          {filteredFreelancers.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-[HankenGroteskLight]'>
              {filteredFreelancers.map((freelancer) => (
                <div
                  key={freelancer._id}
                  className='bg-white/95 border border-[#f0e5f0] rounded-xl p-5 hover:border-indigo-600/50 transition-all duration-300 hover:shadow-md space-y-4'
                >
                  {/* Header */}
                  <div className='flex items-center gap-3'>
                    <div className='h-12 w-12 rounded-full bg-indigo-600/10 shrink-0 flex items-center justify-center text-indigo-600 font-bold text-lg'>
                      {freelancer.name[0]}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-semibold text-[#2b0a30] text-base leading-tight truncate'>
                          {freelancer.name}
                        </h3>
                        {freelancer.stats.completedGigs > 0 && (
                          <CheckCircle className='h-4 w-4 text-indigo-600 shrink-0' />
                        )}
                      </div>
                      <p className='text-sm text-[#2b0a30]/70 mt-0.5'>
                        {freelancer?.email?.includes("freelancer")
                          ? "Freelancer"
                          : "Available"}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className='space-y-2 text-sm font-[HankenGroteskLight]'>
                    <div className='flex justify-between'>
                      <span className='text-[#2b0a30]/70'>XP Points</span>
                      <span className='font-semibold text-indigo-600'>
                        {freelancer.stats.xpPoints.toLocaleString()}
                      </span>
                    </div>

                    <div className='flex items-center justify-between font-[HankenGroteskLight]'>
                      <div className='flex items-center gap-1'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(freelancer.stats.averageRating)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-[#2b0a30]/20"
                            }`}
                          />
                        ))}
                      </div>
                      <span className='text-[#2b0a30]/70'>
                        ({freelancer.stats.totalReviews})
                      </span>
                    </div>

                    <div className='flex justify-between font-[HankenGroteskLight]'>
                      <span className='text-[#2b0a30]/70'>Completed Gigs</span>
                      <span className='text-[#2b0a30]'>
                        {freelancer.stats.completedGigs}
                      </span>
                    </div>

                    {freelancer.stats.completedGigs > 0 && (
                      <div className='flex justify-between font-[HankenGroteskLight]'>
                        <span className='text-[#2b0a30]/70'>Success Rate</span>
                        <span className='text-green-600 font-medium'>
                          {getSuccessRate(freelancer.stats)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div className='flex flex-wrap gap-1 font-[HankenGroteskLight]'>
                    {freelancer.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant='outline' className='text-xs'>
                        {skill}
                      </Badge>
                    ))}
                    {freelancer.skills.length > 3 && (
                      <Badge variant='outline' className='text-xs'>
                        +{freelancer.skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    variant='outline'
                    className='w-full bg-transparent font-[HankenGroteskLight]'
                    onClick={() =>
                      router.push(`/freelancers/${freelancer.userAccountId}`)
                    }
                  >
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-12 font-[HankenGroteskLight]'>
              <p className='text-[#2b0a30]/70'>
                No freelancers found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSkill(null);
                  setMinRating(0);
                }}
                className='mt-4 text-indigo-600 hover:text-indigo-600/80 transition-colors font-[HankenGroteskLight]'
              >
                Clear filters and try again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

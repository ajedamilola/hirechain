"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Star,
  Mail,
  ExternalLink,
  Briefcase,
  Award,
  TrendingUp,
  Calendar
} from "lucide-react";
import HTTP from "@/lib/http";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/auth.store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useWallet } from "@/app/context/WalletProvider";
import { Confirm, Loading } from "notiflix"

interface Profile {
  _id: string;
  userAccountId: string;
  type: string;
  name: string;
  skills: string[];
  portfolioUrl: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
  xpPoints: number;
  completedGigsCount: number;
}

interface CompletedGig {
  _id: string;
  clientId: string;
  title: string;
  budget: string;
  createdAt: string;
}

interface ReviewerProfile {
  _id: string;
  userAccountId: string;
  name: string;
  skills: string[];
  portfolioUrl: string;
  email: string;
}

interface Gig {
  _id: string;
  gigRefId: string;
  title: string;
  description: string;
  budget: string;
  duration: string;
  status: string;
  createdAt: string;
}

interface Review {
  _id: string;
  gigRefId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  reviewType: string;
  createdAt: string;
  reviewerProfile: ReviewerProfile;
  gig: Gig;
}

interface FreelancerData {
  profile: Profile;
  stats: Stats;
  completedGigs: CompletedGig[];
  recentReviews: Review[];
}

// Skeleton Components
function ProfileHeaderSkeleton() {
  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='flex flex-col md:flex-row gap-6'>
          <Skeleton className='h-32 w-32 rounded-full' />
          <div className='flex-1 space-y-4'>
            <div>
              <Skeleton className='h-8 w-64 mb-2' />
              <Skeleton className='h-4 w-48' />
            </div>
            <div className='flex flex-wrap gap-2'>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className='h-6 w-20 rounded-full' />
              ))}
            </div>
            <div className='flex gap-4'>
              <Skeleton className='h-10 w-32' />
              <Skeleton className='h-10 w-32' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className='pt-6'>
            <Skeleton className='h-4 w-24 mb-2' />
            <Skeleton className='h-8 w-16' />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const FreelancerDetails = () => {
  const [freelancerData, setFreelancerData] = useState<FreelancerData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [myGigs, setMyGigs] = useState<Gig[]>([])
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { authenticatedAccountId } = useStore()
  const { signAndExecuteTx } = useWallet()

  const fetchFreelancer = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const responses = await Promise.all([
        HTTP.get(`/api/freelancers/${id}`),
        HTTP.get(`/api/myGigs`, {
          params: {
            clientId: authenticatedAccountId!
          }
        })
      ])
      if (!responses.some(res => res.err)) {
        setFreelancerData(responses[0].data);
        setMyGigs(responses[1].data.filter((g: Gig) => g.status == "OPEN"));
      } else {
        setError("Failed to fetch freelancer data");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("An error occurred while fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancer();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className='container mx-auto p-6 space-y-6 font-[HankenGroteskLight]'>
        <ProfileHeaderSkeleton />
        <StatsSkeleton />
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-40' />
            </CardHeader>
            <CardContent className='space-y-4'>
              {[1, 2].map((i) => (
                <Skeleton key={i} className='h-24 w-full' />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-40' />
            </CardHeader>
            <CardContent className='space-y-4'>
              {[1, 2].map((i) => (
                <Skeleton key={i} className='h-32 w-full' />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto p-6'>
        <Card className='border-red-200 bg-red-50'>
          <CardContent className='pt-6'>
            <p className='text-red-600'>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!freelancerData) {
    return (
      <div className='container mx-auto p-6'>
        <Card>
          <CardContent className='pt-6'>
            <p className='text-indigo-600/70'>No freelancer data found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { profile, stats, completedGigs, recentReviews } = freelancerData;

  return (
    <div className='mx-auto lg:p-6 p-1 space-y-6 font-[HankenGroteskLight]'>
      {/* Profile Header */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col md:flex-row gap-6'>
            {/* Avatar */}
            <div className='h-32 w-32 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-500 font-bold text-4xl shrink-0'>
              {profile.name[0]}
            </div>

            {/* Profile Info */}
            <div className='flex-1 space-y-4'>
              <div>
                <h1 className='text-3xl font-bold text-indigo-500'>
                  {profile.name}
                </h1>
                <p className=' mt-1'>Account ID: {profile.userAccountId}</p>
              </div>

              {/* Skills */}
              <div className='flex flex-wrap gap-2'>
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant='outline' className='text-sm'>
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className='flex gap-4'>
                <Button
                  variant='outline'
                  onClick={() => window.open(profile.portfolioUrl, "_blank")}
                  className='gap-2'
                >
                  <ExternalLink className='h-4 w-4' />
                  Portfolio
                </Button>
                <Button
                  variant='outline'
                  onClick={() =>
                    (window.location.href = `mailto:${profile.email}`)
                  }
                  className='gap-2'
                >
                  <Mail className='h-4 w-4' />
                  Contact
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button className="bg-purple-600 hover:bg-purple-700"><Briefcase /> Assign To Gig</Button></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">My Open Gigs</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {
                        myGigs.map((gig: Gig) => (
                          <DropdownMenuItem key={gig._id} onClick={async () => {
                            Confirm.show("Confirm Action", `Are you sure you want to assign ${freelancerData.profile.name} to gig: ${gig.title}?`, "Assign", "Cancel", async () => {
                              Loading.standard("Assinging...")
                              const { data, err } = await HTTP.post(`/api/gigs/${gig.gigRefId}/prepare-assignment`, {
                                clientId: authenticatedAccountId,
                                freelancerId: id
                              })
                              if (!err) {
                                try {
                                  const contractTx = await signAndExecuteTx(data.encodedContractTx)
                                  console.log({ contractTx })
                                  await signAndExecuteTx(data.encodedHcsTx)
                                  toast.success("Freelancer Assigned successfully")

                                  const recordResult = await HTTP.post(`/api/gigs/${gig.gigRefId}/record-assignment`, {
                                    "contractTransactionId": contractTx.transactionId,
                                    "freelancerAccountId": id,
                                    "updateGigData": data.updateGigData
                                  })
                                  if (!recordResult.err) {
                                    toast.success("Freelancer Assigned successfully")
                                    fetchFreelancer()
                                  } else {
                                    toast.error(recordResult.err)
                                  }
                                } catch (error) {
                                  toast.error("Unable to complete transaction")
                                }
                              } else {
                                toast.error(err)
                              }
                              Loading.remove()
                            })
                          }}>
                            {gig.title}
                          </DropdownMenuItem>
                        ))
                      }
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2 text-[#2b0a30]/70 text-sm mb-2'>
              <Star className='h-4 w-4' />
              <span>Rating</span>
            </div>
            <div className='flex items-baseline gap-2'>
              <span className='text-3xl font-bold text-indigo-500'>
                {stats.averageRating.toFixed(1)}
              </span>
              <span className='text-[#2b0a30]/70'>/ 5.0</span>
            </div>
            <p className='text-xs text-[#2b0a30]/70 mt-1'>
              {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2 text-[#2b0a30]/70 text-sm mb-2'>
              <Briefcase className='h-4 w-4' />
              <span>Completed Gigs</span>
            </div>
            <span className='text-3xl font-bold text-indigo-500'>
              {stats.completedGigsCount}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2 text-[#2b0a30]/70 text-sm mb-2'>
              <TrendingUp className='h-4 w-4' />
              <span>XP Points</span>
            </div>
            <span className='text-3xl font-bold text-indigo-500'>
              {stats.xpPoints.toLocaleString()}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2 text-[#2b0a30]/70 text-sm mb-2'>
              <Award className='h-4 w-4' />
              <span>Success Rate</span>
            </div>
            <span className='text-3xl font-bold text-indigo-500'>
              {stats.completedGigsCount > 0 ? "98%" : "N/A"}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className='text-xl text-indigo-500'>
            Rating Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                stats.ratingDistribution[
                rating.toString() as keyof typeof stats.ratingDistribution
                ];
              const percentage =
                stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              return (
                <div key={rating} className='flex items-center gap-3'>
                  <span className='text-sm text-[#2b0a30]/70 w-8'>
                    {rating}★
                  </span>
                  <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-indigo-500'
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className='text-sm text-[#2b0a30]/70 w-12 text-right'>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Completed Gigs */}
        <Card>
          <CardHeader>
            <CardTitle className='text-xl text-indigo-500'>
              Completed Gigs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedGigs.length > 0 ? (
              <div className='space-y-4'>
                {completedGigs.map((gig) => (
                  <div
                    key={gig._id}
                    className='p-4 border border-[#f0e5f0] rounded-lg hover:border-indigo-600/50 transition-colors'
                  >
                    <h4 className='font-semibold text-[#2b0a30]'>
                      {gig.title}
                    </h4>
                    <div className='flex justify-between items-center mt-2 text-sm'>
                      <span className='text-[#2b0a30]/70'>
                        Budget: {gig.budget}
                      </span>
                      <span className='text-[#2b0a30]/70 flex items-center gap-1'>
                        <Calendar className='h-3 w-3' />
                        {formatDate(gig.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-[#2b0a30]/70 text-sm'>No completed gigs yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className='text-xl text-indigo-500'>
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentReviews.length > 0 ? (
              <div className='space-y-4'>
                {recentReviews.map((review) => (
                  <div
                    key={review._id}
                    className='p-4 border border-[#f0e5f0] rounded-lg space-y-3'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <p className='font-semibold text-[#2b0a30]'>
                          {review.reviewerProfile.name}
                        </p>
                        <p className='text-xs text-[#2b0a30]/70'>
                          {review.gig.title}
                        </p>
                      </div>
                      <div className='flex items-center gap-1'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < review.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-[#2b0a30]/20"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className='text-sm text-[#2b0a30]/80'>
                      {review.comment}
                    </p>
                    <p className='text-xs text-[#2b0a30]/70'>
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm'>No reviews yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreelancerDetails;

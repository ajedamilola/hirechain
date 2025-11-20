"use client";
import { Star, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FreelancerStats {
  averageRating: number;
  totalReviews: number;
  xpPoints: number;
  completedGigs: number;
}

interface FreelancerProfileCardProps {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  portfolioUrl: string;
  stats: FreelancerStats;
}

export function FreelancerProfileCard({
  _id,
  name,
  email,
  skills,
  portfolioUrl,
  stats
}: FreelancerProfileCardProps) {
  const isVerified = stats.completedGigs > 0;
  const title = email.includes("freelancer") ? "Freelancer" : "Available";

  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardContent className='pt-6'>
        <div className='flex items-start gap-4 mb-4'>
          <div className='h-12 w-12 rounded-full bg-primary/20 shrink-0 flex items-center justify-center font-bold text-primary'>
            {name[0]}
          </div>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <h3 className='font-semibold text-foreground'>{name}</h3>
              {isVerified && <CheckCircle className='h-4 w-4 text-primary' />}
            </div>

            <p className='text-sm text-foreground/60'>{title}</p>
          </div>
        </div>

        <div className='space-y-3'>
          <div className='flex justify-between items-center text-sm'>
            <span className='text-foreground/70'>XP Points</span>
            <span className='font-semibold text-foreground'>
              {stats.xpPoints.toLocaleString()}
            </span>
          </div>

          <div className='flex items-center gap-2 text-sm'>
            <div className='flex items-center gap-1'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(stats.averageRating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className='text-foreground/70'>({stats.totalReviews})</span>
          </div>

          <div className='flex justify-between items-center text-sm'>
            <span className='text-foreground/70'>Completed Gigs</span>
            <span className='text-foreground'>{stats.completedGigs}</span>
          </div>

          <div className='flex flex-wrap gap-2'>
            {skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant='outline' className='text-xs'>
                {skill}
              </Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant='outline' className='text-xs'>
                +{skills.length - 4}
              </Badge>
            )}
          </div>

          <Button
            variant='outline'
            className='w-full mt-4 bg-transparent'
            onClick={() => window.open(portfolioUrl, "_blank")}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

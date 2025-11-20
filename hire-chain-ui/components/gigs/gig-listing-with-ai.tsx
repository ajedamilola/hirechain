"use client";
import { useEffect, useState } from "react";
import { GigCard } from "./gig-card";
import HTTP from "@/lib/http";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GigProps } from "@/types/gigs.type";

// Detailed Gig Card Skeleton Component
function GigCardSkeleton() {
  return (
    <Card className='transition-all w-full'>
      <CardHeader className='pb-3'>
        <div className='flex justify-between items-start gap-4'>
          <div className='flex-1 space-y-2'>
            {/* Title skeleton */}
            <Skeleton className='h-5 w-3/4' />
            {/* Description skeleton - 2 lines */}
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6' />
          </div>
          {/* Badge skeleton */}
          <Skeleton className='h-6 w-20 rounded-full' />
        </div>
      </CardHeader>

      <CardContent className='space-y-3'>
        {/* Budget row */}
        <div className='flex justify-between items-center'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-24' />
        </div>

        {/* Deadline row */}
        <div className='flex justify-between items-center'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-28' />
        </div>

        {/* Match Score row (optional) */}
        <div className='flex justify-between items-center'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-12' />
        </div>
      </CardContent>
    </Card>
  );
}

export function GigListingWithAI() {
  const [loading, setLoading] = useState(false);
  const [gigsData, setGigsData] = useState<GigProps[]>([]);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const { data, err } = await HTTP.get("/api/gigs");
      if (!err) {
        setGigsData(data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  return (
    <div className='space-y-6 font-[HankenGroteskLight]'>
      <div>
        <h2 className='text-2xl font-bold text-foreground mb-4 font-[HankenGroteskLight]'>
          Available Gigs
        </h2>

        {loading ? (
          <div className='grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {Array(9)
              .fill(0)
              .map((_, index) => (
                <GigCardSkeleton key={index} />
              ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {gigsData.map((gig, index) => (
              <div key={index}>
                <GigCard {...gig} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

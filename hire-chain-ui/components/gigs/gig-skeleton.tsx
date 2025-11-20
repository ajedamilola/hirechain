"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GigDetailsSkeleton() {
  return (
    <div className='w-full mx-auto space-y-6'>
      {/* Header Skeleton */}
      <div className='space-y-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex-1 space-y-3'>
            <Skeleton className='h-9 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6' />
          </div>
          <Skeleton className='h-8 w-32 rounded-full' />
        </div>

        <div className='flex flex-wrap gap-6'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='space-y-2'>
              <Skeleton className='h-3 w-16' />
              <Skeleton className='h-6 w-24' />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className='space-y-4'>
        <Skeleton className='h-10 w-full rounded-lg' />

        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-40' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-5 w-32' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-5 w-28' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons Skeleton */}
      <Card>
        <CardContent className='pt-6 space-y-4'>
          <Skeleton className='h-5 w-48' />
          <div className='flex gap-3'>
            <Skeleton className='h-10 w-32' />
            <Skeleton className='h-10 w-28' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

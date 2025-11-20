"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GigProps } from "@/types/gigs.type";
import { useRouter } from "next/navigation";

export function GigCard({
  title,
  description,
  budget,
  duration,
  gigRefId
}: GigProps) {
  const router = useRouter();

  return (
    <Card
      className='cursor-pointer transition-all'
      onClick={() => router.push(`/gigs/${gigRefId}`)}
    >
      <CardHeader className='pb-3'>
        <div className='flex justify-between items-start gap-4'>
          <div className='flex-1'>
            <h3 className='font-semibold text-indigo-600 text-lg'>{title}</h3>
            <p className='text-sm text-[#2b0a30] mt-1 line-clamp-2'>
              {description}
            </p>
          </div>
          {/* <Badge variant='secondary' className='text-indigo-600'>
            {category}
          </Badge> */}
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex justify-between items-center text-sm'>
          <span className='text-[#2b0a30]/70'>Budget</span>
          <span className='font-semibold text-indigo-600'>{budget}</span>
        </div>
        <div className='flex justify-between items-center text-sm'>
          <span className='text-[#2b0a30]/70'>Duration</span>
          <span className='text-[#2b0a30]'>{duration || "N/A"}</span>
        </div>
      </CardContent>
    </Card>
  );
}

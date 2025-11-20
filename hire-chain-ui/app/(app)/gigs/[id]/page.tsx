"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import HTTP from "@/lib/http";
import { GigDetailsProps } from "@/types/gigs.type";
import { GigDetailPage } from "@/components/gigs/gig-detail-page";
import { GigDetailsSkeleton } from "@/components/gigs/gig-skeleton";

export default function GigDetailRoute() {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<GigDetailsProps | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const fetchGigDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, err } = await HTTP.get(`/api/gigs/${id}`);

      if (!err) {
        setDetails(data);
      } else {
        setError("Failed to fetch gig details");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("An error occurred while fetching gig details");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigDetails();
  }, [id]);

  return (
    <div className='flex lg:flex-row flex-col items-start  lg:gap-5 gap-3 w-full'>
      <Button
        variant='outline'
        onClick={() => router.back()}
        className='flex items-center gap-2'
      >
        <ArrowLeft className='h-4 w-4' />
        Back to Gigs
      </Button>

      {loading ? (
        <GigDetailsSkeleton />
      ) : error ? (
        <div className='w-full mx-auto space-y-4'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
            <p className='text-red-600'>{error}</p>
            <Button
              variant='outline'
              onClick={fetchGigDetails}
              className='mt-4'
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <GigDetailPage details={details} />
      )}
    </div>
  );
}

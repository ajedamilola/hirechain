"use client";
import { Badge } from "@/components/ui/badge";
import { GigDetailsProps } from "@/types/gigs.type";

interface GigHeaderProps {
  gig: GigDetailsProps;
}

export function GigHeader({ gig }: GigHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      OPEN: "bg-blue-500",
      IN_PROGRESS: "bg-yellow-500",
      COMPLETED: "bg-green-500",
      FINALIZED: "bg-purple-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className='space-y-4 font-[HankenGroteskLight]'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1'>
          <h1 className='md:text-3xl text-2xl font-bold text-[#2b0a30] mb-2'>
            {gig.title}
          </h1>
          <p className='text-[#2b0a30]/80'>{gig.description}</p>
        </div>
        <Badge
          className={`text-base px-3 py-1 text-white hover:opacity-90 ${getStatusColor(
            gig.status
          )}`}
        >
          {gig.status}
        </Badge>
      </div>

      <div className='flex flex-wrap gap-6 text-sm'>
        <div>
          <span className='text-[#2b0a30]/70'>Budget</span>
          <p className='font-semibold text-lg text-indigo-600'>{gig.budget}</p>
        </div>
        <div>
          <span className='text-[#2b0a30]/70'>Posted Date</span>
          <p className='font-semibold text-lg text-[#2b0a30]'>
            {formatDate(gig.createdAt)}
          </p>
        </div>
        <div>
          <span className='text-[#2b0a30]/70'>Visibility</span>
          <p className='font-semibold text-lg text-[#2b0a30]'>
            {gig.visibility}
          </p>
        </div>
        <div>
          <span className='text-[#2b0a30]/70'>Gig ID</span>
          <p className='font-semibold text-sm text-[#2b0a30]/70 font-mono'>
            {gig.gigRefId.slice(0, 8)}...
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GigDetailsProps } from "@/types/gigs.type";
import { useStore } from "@/store/auth.store";

interface GigStatusManagementProps {
  initialStatus: GigDetailsProps["status"];
  invitationStatus: GigDetailsProps["invitationStatus"];
  gigId: string;
  assignedFreelancer: string | undefined;
}

export function GigStatusManagement({
  initialStatus,
  invitationStatus,
  assignedFreelancer,
  gigId
}: GigStatusManagementProps) {
  const [gigStatus, setGigStatus] =
    useState<GigDetailsProps["status"]>(initialStatus);
  const { authenticatedAccountId } = useStore();

  const handleStatusChange = async (newStatus: GigDetailsProps["status"]) => {
    // Here you would make an API call to update the status
  };

  return (
    <Card className='bg-muted/50 border border-border font-[HankenGroteskLight]'>
      <CardContent className='pt-6 space-y-4'>
        <h3 className='font-semibold text-[#2b0a30]'>Gig Status Management</h3>

        <div className='flex gap-3 flex-wrap'>
          {invitationStatus === "PENDING" && gigStatus === "OPEN" && (
            <>
              <Button
                onClick={() => handleStatusChange("IN_PROGRESS")}
                className='bg-indigo-600 text-white hover:bg-indigo-600/90'
              >
                Accept Gig
              </Button>
              <Button variant='outline'>Decline</Button>
            </>
          )}

          {gigStatus === "IN_PROGRESS" &&
            assignedFreelancer == authenticatedAccountId && (
              <>
                <Button
                  onClick={() => handleStatusChange("COMPLETED")}
                  className='bg-green-600 text-white hover:bg-green-700'
                >
                  Mark as Done (Freelancer)
                </Button>
                <Button variant='outline'>Request Extension</Button>
              </>
            )}

          {gigStatus === "COMPLETED" &&
            assignedFreelancer == authenticatedAccountId && (
              <>
                <Button
                  onClick={() => handleStatusChange("FINALIZED")}
                  className='bg-indigo-600 text-white hover:bg-indigo-600/90'
                >
                  Finalize & Release Payment (Client)
                </Button>
                <Button
                  variant='outline'
                  onClick={() => handleStatusChange("IN_PROGRESS")}
                >
                  Request Revision
                </Button>
              </>
            )}

          {gigStatus === "FINALIZED" && (
            <div className='flex items-center gap-2 text-green-600 font-medium'>
              <svg
                className='h-5 w-5'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path d='M5 13l4 4L19 7'></path>
              </svg>
              Gig completed and payment released
            </div>
          )}
        </div>

        {assignedFreelancer == assignedFreelancer && gigStatus == "OPEN" && (
          <Button
            onClick={() => {}}
            className='bg-indigo-600 text-white hover:bg-indigo-600/90'
          >
            Apply For Gig
          </Button>
        )}

        <div className='text-sm text-[#2b0a30]/70'>
          Current Status:{" "}
          <span className='font-semibold text-indigo-600'>{gigStatus}</span>
        </div>
      </CardContent>
    </Card>
  );
}

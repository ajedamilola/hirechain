"use client";

import { useWallet } from "@/app/context/WalletProvider";
import { GigCard } from "@/components/gigs/gig-card";
import { GigDetailsSkeleton } from "@/components/gigs/gig-skeleton";
import { Button } from "@/components/ui/button";
import HTTP from "@/lib/http";
import { useStore } from "@/store/auth.store";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NewGigDialog } from "./newGigDialog";
import { useRouter } from "next/navigation";

const MyGigs = () => {
  const [loading, setLoading] = useState(false);
  const [gigsData, setGigsData] = useState<any[]>([]);

  const router = useRouter();
  const { authenticatedAccountId, profile } = useStore();
  const { profileType } = profile! || {};
  const isHirer = profileType == "hirer";

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const link = isHirer ? `/api/myGigs` : `/api/myGigs/freelancer`;
      const { data, err } = await HTTP.get(link, {
        params: {
          clientId: authenticatedAccountId!,
          freelancerId: authenticatedAccountId!
        }
      });

      if (!err) {
        setGigsData(data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchGigs();
  }, []);

  useEffect(() => {
    if (!profile || !authenticatedAccountId) {
      router.replace("/");
    }
  }, [profile, authenticatedAccountId]);

  if (!profile || !authenticatedAccountId) return <div></div>;

  return (
    <div>
      <div className='flex justify-between'>
        <h2 className='font-bold text-lg'>My Gigs</h2>
        <div>
          <Button
            className='bg-purple-600 hover:bg-purple-700'
            onClick={() => setModalOpen(true)}
          >
            <Plus />
            New Gig
          </Button>
          <NewGigDialog
            isOpen={modalOpen}
            onOpenChange={setModalOpen}
            reload={fetchGigs}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 mt-10 lg:grid-cols-3 md:grid-cols-2 gap-5'>
        {loading ? (
          Array(10)
            .fill(0)
            .map((_, index) => <GigDetailsSkeleton />)
        ) : gigsData.length > 0 ? (
          gigsData.map((gig) => <GigCard key={gig.id} {...gig} />)
        ) : (
          <div className='text-center py-12 text-gray-500'>
            <p>No gigs available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGigs;

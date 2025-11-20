"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GigDetailsProps } from "@/types/gigs.type";
import { GigMessaging } from "./gig-messaging";
import { GigStatusManagement } from "./gig-status-management";
import { GigHeader } from "./gig-header";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/auth.store";
import Link from "next/link";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import HTTP from "@/lib/http";
import { useWallet } from "@/app/context/WalletProvider";
import { toast } from "sonner";

interface GigDetailPageProps {
  details: GigDetailsProps & {
    freelancer: any;
  };
}

export function GigDetailPage({ details }: GigDetailPageProps) {
  const [activeTab, setActiveTab] = useState("details");
  const { profile, authenticatedAccountId } = useStore();
  const router = useRouter();
  const { signAndExecuteTx } = useWallet()

  useEffect(() => {
    if (!profile || !authenticatedAccountId) {
      router.replace("/");
    }
  }, [profile, authenticatedAccountId]);

  if (!profile || !authenticatedAccountId) return <div></div>;

  const isHirer = profile.profileType == "hirer";

  if (!details) {
    return (
      <div className='w-full mx-auto'>
        <Card>
          <CardContent className='pt-6'>
            <p className='text-[#2b0a30]/70 text-center'>
              No gig details available
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className='w-full mx-auto space-y-6'>
      {/* Header */}
      <GigHeader gig={details} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='details'>Details</TabsTrigger>
          <TabsTrigger value='client'>
            {isHirer ? "Freelancer Info" : "Client Info"}
          </TabsTrigger>
          <TabsTrigger value='messaging'>Messaging</TabsTrigger>
        </TabsList>

        <TabsContent value='details' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-indigo-600'>Gig Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm text-[#2b0a30]/70 mb-1'>Description</p>
                <p className='text-[#2b0a30]'>{details.description}</p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-[#2b0a30]/70 mb-1'>Posted Date</p>
                  <p className='font-medium text-[#2b0a30]'>
                    {formatDate(details.createdAt)}
                  </p>
                </div>

                <div>
                  <p className='text-sm text-[#2b0a30]/70 mb-1'>Last Updated</p>
                  <p className='font-medium text-[#2b0a30]'>
                    {formatDate(details.updatedAt)}
                  </p>
                </div>

                <div>
                  <p className='text-sm text-[#2b0a30]/70 mb-1'>
                    Gig Reference ID
                  </p>
                  <p className='font-medium text-[#2b0a30] font-mono text-xs break-all'>
                    {details.gigRefId}
                  </p>
                </div>

                <div>
                  <p className='text-sm text-[#2b0a30]/70 mb-1'>Client ID</p>
                  <p className='font-medium text-[#2b0a30]'>
                    {details.clientId}
                  </p>
                </div>
              </div>

              {details.assignedFreelancerId && (
                <div>
                  <p className='text-sm text-[#2b0a30]/70 mb-1'>
                    Assigned Freelancer
                  </p>
                  <p className='font-medium text-[#2b0a30]'>
                    {details.assignedFreelancerId}
                  </p>
                </div>
              )}

              {details.escrowContractId && (
                <div>
                  <p className='text-sm text-[#2b0a30]/70 mb-1'>
                    Escrow Contract ID
                  </p>
                  <p className='font-medium text-[#2b0a30] font-mono text-xs'>
                    {details.escrowContractId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='client' className='space-y-4'>
          {isHirer ? (
            <Card>
              <CardHeader>
                <CardTitle className='text-indigo-600'>
                  Freelancer Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  {details.assignedFreelancerId ? (
                    <div>
                      <p className='text-sm text-[#2b0a30]/70 mb-1'>
                        Freelancer Account ID
                      </p>
                      <p className='font-medium text-[#2b0a30]'>
                        {details.assignedFreelancerId}
                      </p>
                    </div>
                  ) : (
                    <div className='text-center'>
                      <p className='text-muted-foreground'>
                        No Freelancer Assigned
                      </p>
                      <Link href={"/freelancers"}>
                        <Button>
                          <Search /> Browse
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
                <hr />
                <div>
                  <p className='text-sm text-[#2b0a30]/70 mb-1'>
                    Project Status
                  </p>
                  <p className='font-medium text-[#2b0a30]'>{details.status}</p>
                </div>

                <div>
                  <p className='text-sm text-[#2b0a30]/70 mb-1'>Visibility</p>
                  <p className='font-medium text-[#2b0a30]'>
                    {details.visibility}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className='text-indigo-600'>
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='text-sm text-[#2b0a30]/70 mb-1'>
                    Client Account ID
                  </p>
                  <p className='font-medium text-[#2b0a30]'>
                    {details.clientId}
                  </p>
                </div>

                <div>
                  <p className='text-sm text-[#2b0a30]/70 mb-1'>Gig Type</p>
                  <p className='font-medium text-[#2b0a30]'>{details.type}</p>
                </div>

                <div>
                  <p className='text-sm text-[#2b0a30]/70 mb-1'>Visibility</p>
                  <p className='font-medium text-[#2b0a30]'>
                    {details.visibility}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='messaging' className='space-y-4'>
          <GigMessaging gigRefId={details.gigRefId} />
        </TabsContent>
      </Tabs>

      {/* Status Management */}
      {
        profile.profileType == "freelancer" ? <GigStatusManagement initialStatus={details.status} gigId={details._id} invitationStatus={details.invitationStatus} assignedFreelancer={details.assignedFreelancerId!} />
          :
          (details.status == "IN_PROGRESS" && <div>
            <Button onClick={async () => {
              const lockData = await HTTP.post(`/gigs/${details.gigRefId}/prepare-lock-escrow`, {
                amount: Number(details.budget.split("HBAR")[0]),
                clientId: authenticatedAccountId
              })

              if (!lockData.err) {
                try {
                  await signAndExecuteTx(lockData.data.encodedTransaction)
                  const releaseData = await HTTP.post(`/gigs/${details.gigRefId}/prepare-release-escrow`, {
                    clientId: authenticatedAccountId
                  })

                  if (!releaseData.err) {
                    await signAndExecuteTx(releaseData.data.encodedTransaction)
                    const recordData = await HTTP.post(`/gigs/${details.gigRefId}/record-release-escrow`)

                    if (!recordData.err) {
                      toast.success("Payment made successfully")
                      //redirect to home
                    }
                  }
                } catch (error) {
                  toast.error(lockData.err)
                }
              }
            }}>Make Payment</Button>
          </div>)
      }


    </div>
  );
}

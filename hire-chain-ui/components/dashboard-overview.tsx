"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useStore } from "@/store/auth.store";
import { formatRelative } from "date-fns";

interface StatItem {
  label: string;
  value: string | number;
  color: string;
}

export function DashboardOverview() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { fullUserData, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p className='text-muted-foreground'>Loading dashboard...</p>
      </div>
    );
  }

  if (!fullUserData) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p className='text-muted-foreground'>No user data available</p>
      </div>
    );
  }

  const { stats, completedGigs, profile } = fullUserData;

  const statItems: StatItem[] = [
    {
      label: "Active Gigs",
      value: stats.activeGigsCount ?? 0,
      color: "bg-[#f100c3]/10 text-indigo-600"
    },
    {
      label: "Total Earned",
      value: `${stats.totalEarned ?? 0} HBAR`,
      color: "bg-[#25e5fa]/10 text-[#25e5fa]"
    },
    {
      label: "Reputation Score",
      value: `${stats.averageRating ?? 0}/5`,
      color: "bg-gray-300/10 text-gray-700"
    },
    {
      label: "Completed Gigs",
      value: stats.completedGigsCount ?? 0,
      color: "bg-green-500/10 text-green-600"
    }
  ];

  return (
    <div className='space-y-6'>
      {/* Stats Grid */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 font-[HankenGroteskLight]'>
        {statItems.map((stat) => (
          <div key={stat.label} className='bg-card p-4 rounded-lg border'>
            <p className='text-sm text-[#2b0a30] font-[HankenGroteskLight] font-bold'>
              {stat.label}
            </p>
            <p className='text-2xl mt-1 font-bold text-indigo-600'>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='font-[HankenGroteskLight]'
      >
        <TabsList className='w-full grid grid-cols-3'>
          <TabsTrigger value='overview'>Activity</TabsTrigger>
          <TabsTrigger value='reviews'>Reviews</TabsTrigger>
          <TabsTrigger value='stats'>Stats</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='mt-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-[HankenGroteskLight] text-[#2b0a30]'>
                Completed Gigs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedGigs.length === 0 ? (
                <p className='text-center text-muted-foreground py-8'>
                  No completed gigs yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gig</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className='text-right'>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedGigs.map((gig, idx) => (
                      <TableRow key={gig._id || idx}>
                        <TableCell>{gig.title}</TableCell>
                        <TableCell className='font-[HankenGroteskLight] text-[#2b0a30]'>
                          {gig.budget} HBAR
                        </TableCell>
                        <TableCell className='text-[#2b0a30] text-right'>
                          {gig.createdAt
                            ? formatRelative(
                                new Date(gig.createdAt),
                                new Date()
                              )
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

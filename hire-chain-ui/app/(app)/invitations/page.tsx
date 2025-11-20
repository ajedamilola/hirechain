"use client";
import HTTP from "@/lib/http";
import React, { JSX, useEffect, useState } from "react";
import { useStore } from "@/store/auth.store";
import {
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  Calendar,
  DollarSign,
  User,
  Mail,
  ExternalLink
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PiSpinner } from "react-icons/pi";

interface ClientProfile {
  _id: string;
  userAccountId: string;
  type: string;
  name: string;
  skills: string[];
  portfolioUrl: string;
  email: string;
  profileType: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface Gig {
  _id: string;
  gigRefId: string;
  type: string;
  clientId: string;
  title: string;
  description: string;
  budget: string;
  duration: string;
  visibility: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED";
  escrowContractId: string | null;
  assignedFreelancerId: string | null;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface Invitation {
  _id: string;
  gigRefId: string;
  freelancerId: string;
  message: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  invitedAt: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  gig: Gig;
  clientProfile: ClientProfile;
}

type FilterType = "PENDING" | "ACCEPTED" | "REJECTED" | "ALL";

// Skeleton Loader Component
function InvitationSkeleton() {
  return (
    <div className='space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'
        >
          <div className='p-6'>
            {/* Header Skeleton */}
            <div className='flex items-start justify-between mb-4'>
              <div className='flex-1 space-y-3'>
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-6 w-48' />
                  <Skeleton className='h-5 w-24 rounded' />
                </div>
                <Skeleton className='h-4 w-full' />
              </div>
              <Skeleton className='h-6 w-20 rounded-full' />
            </div>

            {/* Gig Details Skeleton */}
            <div className='bg-gray-50 rounded-lg p-4 mb-4 space-y-3'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className='h-5 w-full' />
                ))}
              </div>
            </div>

            {/* Client Info Skeleton */}
            <div className='border-t border-gray-200 pt-4 mb-4 space-y-3'>
              <Skeleton className='h-4 w-32' />
              <div className='flex flex-wrap gap-4'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-4 w-36' />
                <Skeleton className='h-4 w-20' />
              </div>
              <div className='flex flex-wrap gap-2 mt-3'>
                {[1, 2, 3].map((k) => (
                  <Skeleton key={k} className='h-6 w-16 rounded-md' />
                ))}
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className='flex gap-3 pt-4 border-t border-gray-200'>
              <Skeleton className='h-11 flex-1 rounded-lg' />
              <Skeleton className='h-11 flex-1 rounded-lg' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const Invitation: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [filter, setFilter] = useState<FilterType>("PENDING");
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const { authenticatedAccountId } = useStore();

  const fetchInvitations = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await HTTP.get(
        `/api/invitations/freelancer/${authenticatedAccountId}`
      );
      setInvitations(response.data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId: string): Promise<void> => {
    try {
      setAcceptingId(invitationId);
      await HTTP.post(`/api/invitations/${invitationId}/accept`);
      await fetchInvitations();
    } catch (error) {
      console.error("Error accepting invitation:", error);
      alert("Failed to accept invitation. Please try again.");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (invitationId: string): Promise<void> => {
    try {
      setRejectingId(invitationId);
      await HTTP.post(`/api/invitations/${invitationId}/reject`);
      await fetchInvitations();
    } catch (error) {
      console.error("Error rejecting invitation:", error);
      alert("Failed to reject invitation. Please try again.");
    } finally {
      setRejectingId(null);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const filteredInvitations = invitations.filter((inv) => {
    if (filter === "ALL") return true;
    return inv.status === filter;
  });

  const getStatusBadge = (
    status: "PENDING" | "ACCEPTED" | "REJECTED"
  ): JSX.Element => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
      ACCEPTED: "bg-green-100 text-green-800 border-green-300",
      REJECTED: "bg-red-100 text-red-800 border-red-300"
    };
    const icons = {
      PENDING: <Clock className='w-3 h-3' />,
      ACCEPTED: <CheckCircle className='w-3 h-3' />,
      REJECTED: <XCircle className='w-3 h-3' />
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {icons[status]}
        {status}
      </span>
    );
  };

  const getGigStatusBadge = (
    status: "OPEN" | "IN_PROGRESS" | "COMPLETED"
  ): JSX.Element => {
    const styles = {
      OPEN: "bg-blue-100 text-blue-800",
      IN_PROGRESS: "bg-indigo-100 text-indigo-800",
      COMPLETED: "bg-gray-100 text-gray-800"
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${styles[status]}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className='py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Invitations</h1>
          <p className='text-gray-600'>Manage your private gig invitations</p>
        </div>

        {/* Filter Tabs */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-1 inline-flex gap-1'>
          {(["PENDING", "ACCEPTED", "REJECTED", "ALL"] as FilterType[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filter === status
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {status}
                <span
                  className={`ml-2 text-xs ${
                    filter === status ? "text-indigo-200" : "text-gray-400"
                  }`}
                >
                  (
                  {
                    invitations.filter(
                      (inv) => status === "ALL" || inv.status === status
                    ).length
                  }
                  )
                </span>
              </button>
            )
          )}
        </div>

        {/* Loading State with Skeleton */}
        {loading ? (
          <InvitationSkeleton />
        ) : filteredInvitations.length === 0 ? (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center'>
            <Briefcase className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No {filter.toLowerCase()} invitations
            </h3>
            <p className='text-gray-500'>
              You don't have any {filter.toLowerCase()} invitations at the
              moment.
            </p>
          </div>
        ) : (
          <div className='space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
            {filteredInvitations.map((invitation) => (
              <div
                key={invitation._id}
                className='bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden'
              >
                <div className='p-6'>
                  {/* Header Section */}
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <h2 className='text-xl font-bold text-gray-900'>
                          {invitation.gig.title}
                        </h2>
                        {getGigStatusBadge(invitation.gig.status)}
                      </div>
                      <p className='text-sm text-gray-500 mb-3'>
                        {invitation.message}
                      </p>
                    </div>
                    <div className='ml-4'>
                      {getStatusBadge(invitation.status)}
                    </div>
                  </div>

                  {/* Gig Details */}
                  <div className='bg-gray-50 rounded-lg p-4 mb-4'>
                    <p className='text-gray-700 mb-4'>
                      {invitation.gig.description}
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div className='flex items-center gap-2 text-sm'>
                        <DollarSign className='w-4 h-4 text-indigo-600' />
                        <span className='font-semibold text-gray-900'>
                          {invitation.gig.budget}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm'>
                        <Calendar className='w-4 h-4 text-indigo-600' />
                        <span className='text-gray-700'>
                          {invitation.gig.duration}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm'>
                        <Clock className='w-4 h-4 text-indigo-600' />
                        <span className='text-gray-700'>
                          Invited{" "}
                          {new Date(invitation.invitedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className='border-t border-gray-200 pt-4 mb-4'>
                    <h3 className='text-sm font-semibold text-gray-900 mb-3'>
                      Client Information
                    </h3>
                    <div className='flex flex-wrap items-center gap-4'>
                      <div className='flex items-center gap-2'>
                        <User className='w-4 h-4 text-gray-400' />
                        <span className='text-sm text-gray-700 font-medium'>
                          {invitation.clientProfile.name}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Mail className='w-4 h-4 text-gray-400' />
                        <span className='text-sm text-gray-600'>
                          {invitation.clientProfile.email}
                        </span>
                      </div>
                      {invitation.clientProfile.portfolioUrl && (
                        <a
                          href={invitation.clientProfile.portfolioUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700'
                        >
                          <ExternalLink className='w-4 h-4' />
                          Portfolio
                        </a>
                      )}
                    </div>
                    <div className='mt-3'>
                      <div className='flex flex-wrap gap-2'>
                        {invitation.clientProfile.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className='px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md border border-indigo-200'
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {invitation.status === "PENDING" && (
                    <div className='flex gap-3 pt-4 border-t border-gray-200'>
                      <button
                        onClick={() => handleAccept(invitation._id)}
                        disabled={
                          acceptingId === invitation._id ||
                          rejectingId === invitation._id
                        }
                        className='flex-1 bg-indigo-600 text-white px-2 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                      >
                        {acceptingId === invitation._id ? (
                          <PiSpinner className='w-5 h-5 animate-spin' />
                        ) : (
                          "Accept Invitation"
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(invitation._id)}
                        disabled={
                          acceptingId === invitation._id ||
                          rejectingId === invitation._id
                        }
                        className='flex-1 bg-white text-red-600 px-2 py-3 rounded-lg font-medium border-2 border-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                      >
                        {rejectingId === invitation._id ? (
                          <PiSpinner className='w-5 h-5 animate-spin' />
                        ) : (
                          "Decline"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Invitation;

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface Transaction {
  id: string;
  type: "sent" | "received";
  jobTitle: string;
  amount: number;
  status: "completed" | "pending" | "disputed";
  date: string;
  counterparty: string;
  escrowStatus: "released" | "held" | "refunded";
}

export function TransactionsTab() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "received",
      jobTitle: "React Dashboard Design",
      amount: 500,
      status: "completed",
      date: "2025-10-20",
      counterparty: "Alex Chen",
      escrowStatus: "released"
    },
    {
      id: "2",
      type: "sent",
      jobTitle: "API Integration",
      amount: 750,
      status: "completed",
      date: "2025-10-18",
      counterparty: "Sarah Williams",
      escrowStatus: "released"
    },
    {
      id: "3",
      type: "received",
      jobTitle: "Mobile App UI",
      amount: 1200,
      status: "pending",
      date: "2025-10-15",
      counterparty: "Marcus Johnson",
      escrowStatus: "held"
    },
    {
      id: "4",
      type: "sent",
      jobTitle: "Backend Development",
      amount: 2000,
      status: "completed",
      date: "2025-10-10",
      counterparty: "Emma Davis",
      escrowStatus: "released"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-indigo-600/10 text-indigo-600";
      case "disputed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEscrowColor = (status: string) => {
    switch (status) {
      case "released":
        return "bg-green-100 text-green-800";
      case "held":
        return "bg-indigo-600/10 text-indigo-600";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (selectedTransaction) {
    return (
      <div className='space-y-6'>
        <Button
          variant='outline'
          onClick={() => setSelectedTransaction(null)}
          className='gap-2 text-[#2b0a30] font-[HankenGroteskLight]'
        >
          <ArrowUpRight className='h-4 w-4 rotate-180 text-indigo-600' />
          Back to Transactions
        </Button>

        <Card>
          <CardHeader className='font-[HankenGroteskLight] text-[#2b0a30]'>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6 font-[HankenGroteskLight] text-[#2b0a30]'>
            {/* Transaction Header */}
            <div className='flex items-start justify-between pb-6 border-b border-border'>
              <div className='space-y-2'>
                <h3 className='text-2xl font-bold text-indigo-600'>
                  {selectedTransaction.type === "received" ? "+" : "-"}
                  {selectedTransaction.amount} HBAR
                </h3>
                <p className='text-[#2b0a30]/70'>
                  {selectedTransaction.jobTitle}
                </p>
              </div>
              <Badge className={getStatusColor(selectedTransaction.status)}>
                {selectedTransaction.status.charAt(0).toUpperCase() +
                  selectedTransaction.status.slice(1)}
              </Badge>
            </div>

            {/* Job Details */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 font-[HankenGroteskLight]'>
              <div>
                <p className='text-sm text-[#2b0a30]/70 font-semibold mb-1 font-[HankenGroteskLight]'>
                  Job Title
                </p>
                <p className='font-semibold text-indigo-600'>
                  {selectedTransaction.jobTitle}
                </p>
              </div>
              <div>
                <p className='text-sm text-[#2b0a30]/70 font-semibold mb-1 font-[HankenGroteskLight]'>
                  Counterparty
                </p>
                <p className='font-semibold text-indigo-600'>
                  {selectedTransaction.counterparty}
                </p>
              </div>
              <div>
                <p className='text-sm text-[#2b0a30]/70 font-semibold mb-1 font-[HankenGroteskLight]'>
                  Transaction Date
                </p>
                <p className='font-semibold text-indigo-600'>
                  {selectedTransaction.date}
                </p>
              </div>
              <div>
                <p className='text-sm text-[#2b0a30]/70 font-semibold mb-1 font-[HankenGroteskLight]'>
                  Transaction Type
                </p>
                <p className='font-semibold text-indigo-600 capitalize'>
                  {selectedTransaction.type === "received"
                    ? "Payment Received"
                    : "Payment Sent"}
                </p>
              </div>
            </div>

            {/* Escrow Status */}
            <div className='bg-muted/50 p-4 rounded-lg space-y-4'>
              <h4 className='font-semibold text-foreground font-[HankenGroteskLight]'>
                Escrow Status
              </h4>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-foreground/70 font-[HankenGroteskLight]'>
                    Escrow Status
                  </span>
                  <Badge
                    className={getEscrowColor(selectedTransaction.escrowStatus)}
                  >
                    {selectedTransaction.escrowStatus.charAt(0).toUpperCase() +
                      selectedTransaction.escrowStatus.slice(1)}
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-foreground/70 font-[HankenGroteskLight]'>
                    Amount Held
                  </span>
                  <span className='font-semibold text-indigo-600'>
                    {selectedTransaction.escrowStatus === "held"
                      ? selectedTransaction.amount
                      : "0"}{" "}
                    HBAR
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-foreground/70 font-[HankenGroteskLight]'>
                    Amount Released
                  </span>
                  <span className='font-semibold text-indigo-600'>
                    {selectedTransaction.escrowStatus === "released"
                      ? selectedTransaction.amount
                      : "0"}{" "}
                    HBAR
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className='space-y-4'>
              <h4 className='font-semibold text-indigo-600 font-[HankenGroteskLight]'>
                Transaction Timeline
              </h4>
              <div className='space-y-3'>
                {[
                  {
                    label: "Transaction Initiated",
                    date: selectedTransaction.date
                  },
                  {
                    label: "Escrow Locked",
                    date: new Date(
                      new Date(selectedTransaction.date).getTime() + 86400000
                    )
                      .toISOString()
                      .split("T")[0]
                  },
                  {
                    label:
                      selectedTransaction.escrowStatus === "released"
                        ? "Funds Released"
                        : "Pending Release",
                    date:
                      selectedTransaction.escrowStatus === "released"
                        ? new Date(
                            new Date(selectedTransaction.date).getTime() +
                              172800000
                          )
                            .toISOString()
                            .split("T")[0]
                        : "Pending"
                  }
                ].map((event, idx) => (
                  <div key={idx} className='flex gap-4'>
                    <div className='flex flex-col items-center'>
                      <div className='h-3 w-3 rounded-full bg-[#f100c3]' />
                      {idx < 2 && <div className='h-8 w-0.5 bg-border mt-1' />}
                    </div>
                    <div>
                      <p className='font-medium text-[#2b0a30] font-[HankenGroteskLight]'>
                        {event.label}
                      </p>
                      <p className='text-sm text-[#2b0a30]/70 font-[HankenGroteskLight]'>
                        {event.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-2 pt-4 font-[HankenGroteskLight]'>
              <Button
                variant='outline'
                className='flex-1 bg-transparent text-[#2b0a30]'
              >
                Download Receipt
              </Button>
              <Button
                variant='outline'
                className='flex-1 bg-transparent text-[#2b0a30]'
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='font-[HankenGroteskLight] text-[#2b0a30]'>
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className='font-[HankenGroteskLight] text-indigo-600'>
                <TableHead>Type</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Escrow</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className='cursor-pointer hover:bg-muted/50'
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      {transaction.type === "received" ? (
                        <ArrowDownLeft className='h-4 w-4 text-indigo-600' />
                      ) : (
                        <ArrowUpRight className='h-4 w-4 text-indigo-600' />
                      )}
                      <span className='capitalize'>{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className='font-[HankenGroteskLight]'>
                    {transaction.jobTitle}
                  </TableCell>
                  <TableCell className='font-[HankenGroteskLight]'>
                    {transaction.type === "received" ? "+" : "-"}
                    {transaction.amount} HBAR
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEscrowColor(transaction.escrowStatus)}>
                      {transaction.escrowStatus.charAt(0).toUpperCase() +
                        transaction.escrowStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className='font-[HankenGroteskLight]'>
                    {transaction.date}
                  </TableCell>
                  <TableCell>
                    <ChevronRight className='h-4 w-4 text-foreground/50' />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

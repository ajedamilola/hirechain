"use client"

import { useState } from "react"
import { Star, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface ApplicationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplicationModal({ open, onOpenChange }: ApplicationModalProps) {
  const [proposal, setProposal] = useState("")

  const freelancer = {
    name: "Alex Chen",
    title: "Full Stack Developer",
    rating: 4.9,
    reviewCount: 127,
    isVerified: true,
    credentials: ["On-Chain Verified", "Top Rated", "5+ Years Experience"],
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Application</DialogTitle>
          <DialogDescription>Apply to this gig with your proposal</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Freelancer Info */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">{freelancer.name}</p>
                {freelancer.isVerified && <CheckCircle className="h-4 w-4 text-primary" />}
              </div>
              <p className="text-sm text-foreground/60">{freelancer.title}</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.floor(freelancer.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                  />
                ))}
                <span className="text-xs text-foreground/60">({freelancer.reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">On-Chain Credentials</p>
            <div className="flex flex-wrap gap-2">
              {freelancer.credentials.map((cred) => (
                <Badge key={cred} variant="outline" className="text-xs">
                  {cred}
                </Badge>
              ))}
            </div>
          </div>

          {/* Proposal */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Your Proposal</label>
            <Textarea
              placeholder="Explain why you're a great fit for this gig..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="min-h-24"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setProposal("")
                onOpenChange(false)
              }}
            >
              Send Application
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

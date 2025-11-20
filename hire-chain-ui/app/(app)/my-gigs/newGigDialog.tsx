"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/store/auth.store"
import HTTP from "@/lib/http"
import { toast } from "sonner"
import { useWallet } from "@/app/context/WalletProvider"

type NewGigDialogProps = {
  isOpen: boolean
  reload: () => void,
  onOpenChange: (open: boolean) => void
}

export function NewGigDialog({ isOpen, reload, onOpenChange }: NewGigDialogProps) {
  const { authenticatedAccountId } = useStore()
  const { signAndExecuteTx } = useWallet()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    clientId: authenticatedAccountId,
    title: "",
    description: "",
    budget: "",
    duration: "",
    visibility: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const preparationResponse = await HTTP.post("/api/gigs/prepare-creation", formData)
    if (!preparationResponse.err) {
      try {
        const { gigData, encodedTransaction } = preparationResponse.data
        await signAndExecuteTx(encodedTransaction)
        const finalResponse = await HTTP.post("/api/gigs/record-creation", { gigData })
        if (!finalResponse.err) {
          toast.success("Gig created successfully")
          reload()
          onOpenChange(false)
        }
      } catch (error) {
        console.log(error)
        toast.error("Failed to create gig")
      }
    } else {
      toast.error(preparationResponse.err)
    }
    setLoading(false)
    // reload()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>

      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Gig</DialogTitle>
            <DialogDescription>
              Fill in the details below to post your gig offer.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Build a modern landing page"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what this gig is about..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget">Budget (HBAR)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                placeholder="e.g. 50000"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                placeholder="e.g. 2 Days, 3 Weeks"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                onValueChange={(val: string) => setFormData(prev => ({ ...prev, visibility: val }))}
              >
                <SelectTrigger id="visibility">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>{loading ? "Creating Gig" : "Create Gig"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

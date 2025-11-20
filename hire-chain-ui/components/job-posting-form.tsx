"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Sparkles } from "lucide-react"
import { AIGigSearch } from "./ai-chat-gig-search"

export function JobPostingForm() {
  const [step, setStep] = useState(1)
  const [showAIChat, setShowAIChat] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    skills: [] as string[],
    skillInput: "",
  })

  const handleAddSkill = () => {
    if (formData.skillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.skillInput.trim()],
        skillInput: "",
      })
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    })
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Step Indicator */}
      <div className="flex justify-between items-center">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 4 && <div className={`h-1 w-12 mx-2 ${s < step ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {step === 1 && "Basic Information"}
            {step === 2 && "Budget & Timeline"}
            {step === 3 && "Required Skills"}
            {step === 4 && "Review & Post"}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowAIChat(true)} className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Help
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Job Title</label>
                <Input
                  placeholder="e.g., Build a React Dashboard"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  placeholder="Describe the job in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 min-h-32"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-dev">Web Development</SelectItem>
                    <SelectItem value="mobile">Mobile Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Budget (HBAR)</label>
                <Input
                  type="number"
                  placeholder="e.g., 2500"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Deadline</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Add Skills</label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="e.g., React, TypeScript"
                    value={formData.skillInput}
                    onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  />
                  <Button onClick={handleAddSkill} variant="outline">
                    Add
                  </Button>
                </div>
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-sm text-foreground/70">Title</p>
                  <p className="font-semibold text-foreground">{formData.title}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Budget</p>
                  <p className="font-semibold text-foreground">{formData.budget} HBAR</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Deadline</p>
                  <p className="font-semibold text-foreground">{formData.deadline}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Skills</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button onClick={handleBack} variant="outline" disabled={step === 1}>
              Back
            </Button>
            {step < 4 ? (
              <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Next
              </Button>
            ) : (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Post Job</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {showAIChat && <AIGigSearch mode="post" onClose={() => setShowAIChat(false)} />}
    </div>
  )
}

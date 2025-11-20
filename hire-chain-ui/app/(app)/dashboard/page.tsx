"use client";
import { DashboardOverview } from "@/components/dashboard-overview";
import { AIChatAssistant } from "@/components/ai-chat-assistant";

export default function DashboardPage() {
  return (
    <>
      <DashboardOverview />
      {/* <div className="fixed bottom-8 right-8 z-50">
        <AIChatAssistant />
      </div> */}
    </>
  );
}

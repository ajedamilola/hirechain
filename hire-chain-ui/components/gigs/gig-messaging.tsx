"use client";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { useStore } from "@/store/auth.store";
import HTTP from "@/lib/http";
import { format } from "date-fns";

// API response type
interface GigMessageAPI {
  type: "GIG_MESSAGE";
  gigRefId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

// Internal message type with UI state
interface GigMessageUI extends GigMessageAPI {
  sending?: boolean;
}

export function GigMessaging({ gigRefId }: { gigRefId: string }) {
  const [messages, setMessages] = useState<GigMessageUI[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { authenticatedAccountId, profile } = useStore();

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await HTTP.get(`/api/gigs/${gigRefId}/messages`);
      if (!response.err && Array.isArray(response.data)) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() && !isSending) {
      setIsSending(true);

      const currentMessage = messageInput.trim();
      setMessageInput("");

      try {
        const response = await HTTP.post(`/api/gigs/${gigRefId}/message`, {
          senderId: authenticatedAccountId,
          message: currentMessage
        });

        if (!response.err) {
          // Immediately fetch messages to get the real data
          await fetchMessages();
        } else {
          // Restore message on error
          setMessageInput(currentMessage);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessageInput(currentMessage);
      } finally {
        setIsSending(false);
      }
    }
  };

  useEffect(() => {
    fetchMessages();

    // Set up polling for new messages every 5 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [gigRefId]);

  const isCurrentUser = (senderId: string) => {
    return senderId === authenticatedAccountId;
  };

  const getSenderName = (senderId: string) => {
    return isCurrentUser(senderId) ? "You" : `User ${senderId?.slice(-4)}`;
  };

  const getAvatarUrl = (senderId: string) => {
    if (isCurrentUser(senderId)) {
      return `https://api.dicebear.com/9.x/identicon/svg?seed=${profile?.name}${authenticatedAccountId}`;
    }
    return `https://api.dicebear.com/9.x/identicon/svg?seed=${senderId}`;
  };

  return (
    <Card className='flex flex-col h-[500px] font-[HankenGroteskLight]'>
      <CardHeader className='border-b border-border'>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent className='flex-1 overflow-y-auto py4 space-y-4'>
        {isInitialLoad ? (
          <div className='flex items-center justify-center h-full'>
            <div className='text-center'>
              <Loader2 className='h-8 w-8 animate-spin text-indigo-600 mx-auto mb-2' />
              <p className='text-sm text-gray-500'>Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            <p className='text-sm text-gray-500'>
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isSender = isCurrentUser(msg.senderId);
              return (
                <div
                  key={`${msg.timestamp}-${index}`}
                  className={`flex gap-2 ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isSender && (
                    <Avatar className='h-8 w-8 shrink-0 border border-black'>
                      <AvatarImage src={getAvatarUrl(msg.senderId)} />
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs p-2 rounded-[10px] items-end flex flex-col gap-0 relative ${
                      isSender
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-[#2b0a30]"
                    } ${msg.sending ? "opacity-70" : "opacity-100"}`}
                  >
                    {/* <p className='text-sm font-medium mb-1'>
                      {getSenderName(msg.senderId)}
                    </p> */}
                    <p className='text-sm'>{msg.content}</p>

                    <div className='flex items-center gap-2 justify-end'>
                      <span className='text-[10px] opacity-70'>
                        {format(new Date(msg.timestamp), "hh:mm a")}
                      </span>

                      {msg.sending && (
                        <Loader2 className='h-3 w-3 animate-spin' />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>
      <div className='border-t border-border p-4 flex gap-2'>
        <input
          type='text'
          placeholder='Type a message...'
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isSending}
          className='flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
        />
        <Button
          onClick={handleSendMessage}
          disabled={isSending || !messageInput.trim()}
          className='bg-indigo-600 text-white hover:bg-indigo-500/90 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSending ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Send className='h-4 w-4' />
          )}
        </Button>
      </div>
    </Card>
  );
}

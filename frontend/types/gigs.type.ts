export interface GigProps {
  _id: string; // Unique identifier for the gig
  gigRefId: string; // Reference ID for the gig
  type: string; // Type of the gig (e.g., "GIG_CREATE")
  clientId: string; // ID of the client (e.g., "0.0.335465")
  title: string; // Title of the gig
  description: string; // Description of the gig
  budget: string; // Budget for the gig (e.g., "$7853")
  duration: string; // Duration for the completion of the gig (e.g., "5 weeks")
  visibility: string; // Visibility status (e.g., "PUBLIC")
  status: string; // Current status of the gig (e.g., "OPEN")
  escrowContractId: string | null; // ID of the escrow contract (null if not applicable)
  assignedFreelancerId: string | null; // ID of the assigned freelancer (null if not assigned)
  __v: number; // Version key (usually for versioning in databases)
  createdAt: string; // Timestamp of when the gig was created
  updatedAt: string; // Timestamp of the last update to the gig
}

export interface GigDetailsProps {
  _id: string;
  gigRefId: string;
  clientId: string;
  assignedFreelancerId: string | null;
  title: string;
  description: string;
  budget: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "FINALIZED";
  visibility: "PUBLIC" | "PRIVATE";
  escrowContractId: string | null;
  type: string;
  createdAt: string;
  updatedAt: string;
  invitationStatus: "PENDING" | "ACCEPTED" | "REJECTED" | "NOT_INVITED";
  __v: number;
  duration: string;
}

export interface GigMessage {
  id: number;
  sender: "Freelancer" | "Client";
  text: string;
  time: string;
}

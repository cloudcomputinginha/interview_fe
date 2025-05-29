export interface CreateInterviewPostForm {
  title: string;
  field: string;
  maxParticipants: string;
  date: string;
  time: string;
  type: "technical" | "personality";
  description: string;
  visibility: "public" | "private";
  tags: string;
  thumbnail: File | null;
}

export interface CreateInterviewPostPayload {
  title: string;
  field: string;
  maxParticipants: number;
  date: string;
  time: string;
  type: "technical" | "personality";
  description: string;
  visibility: "public" | "private";
  tags: string[];
  thumbnailUrl?: string;
}

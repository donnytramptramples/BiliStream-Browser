export interface Video {
  id: string;
  bvid: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  uploadedAt: string;
  category: "Recommended" | "Anime" | "Gaming" | "Music" | "Tech" | "Life" | "Fashion" | "Sports" | "All";
  uploader: {
    name: string;
    avatar: string;
    followers: number;
  };
  videoUrl: string;
  description: string;
}

export type VideoCategory = Video["category"];

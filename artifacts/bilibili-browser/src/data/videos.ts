export interface Video {
  id: string;
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

const urls = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
];

export const VIDEOS: Video[] = [
  {
    id: "v1",
    title: "The Ultimate Next.js 14 Course 2024",
    thumbnail: "https://picsum.photos/seed/v1/480/270",
    duration: "2:34:10",
    views: 1540000,
    likes: 45000,
    uploadedAt: "2 days ago",
    category: "Tech",
    uploader: { name: "CodeMaster", avatar: "https://picsum.photos/seed/CodeMaster/40/40", followers: 1200000 },
    videoUrl: urls[0],
    description: "Learn Next.js 14 from scratch in this comprehensive tutorial."
  },
  {
    id: "v2",
    title: "Jujutsu Kaisen Season 2 Epic Moments",
    thumbnail: "https://picsum.photos/seed/v2/480/270",
    duration: "14:20",
    views: 3200000,
    likes: 120000,
    uploadedAt: "1 week ago",
    category: "Anime",
    uploader: { name: "AnimeHype", avatar: "https://picsum.photos/seed/AnimeHype/40/40", followers: 850000 },
    videoUrl: urls[1],
    description: "The best fights and moments from JJK S2."
  },
  {
    id: "v3",
    title: "Elden Ring: Top 10 Bosses Ranked",
    thumbnail: "https://picsum.photos/seed/v3/480/270",
    duration: "24:15",
    views: 890000,
    likes: 32000,
    uploadedAt: "3 weeks ago",
    category: "Gaming",
    uploader: { name: "Tarnished", avatar: "https://picsum.photos/seed/Tarnished/40/40", followers: 450000 },
    videoUrl: urls[2],
    description: "Ranking the hardest and most epic bosses in Elden Ring."
  },
  {
    id: "v4",
    title: "LoFi Hip Hop Radio - Beats to Relax/Study to",
    thumbnail: "https://picsum.photos/seed/v4/480/270",
    duration: "10:00:00",
    views: 45000000,
    likes: 1500000,
    uploadedAt: "1 year ago",
    category: "Music",
    uploader: { name: "ChillVibes", avatar: "https://picsum.photos/seed/ChillVibes/40/40", followers: 5000000 },
    videoUrl: urls[3],
    description: "24/7 lofi hip hop radio."
  },
  {
    id: "v5",
    title: "My Minimal Desk Setup 2024",
    thumbnail: "https://picsum.photos/seed/v5/480/270",
    duration: "12:05",
    views: 450000,
    likes: 21000,
    uploadedAt: "5 days ago",
    category: "Life",
    uploader: { name: "AestheticLife", avatar: "https://picsum.photos/seed/AestheticLife/40/40", followers: 320000 },
    videoUrl: urls[0],
    description: "Tour of my productivity desk setup."
  },
  {
    id: "v6",
    title: "Streetwear Fashion Trends for Fall",
    thumbnail: "https://picsum.photos/seed/v6/480/270",
    duration: "08:45",
    views: 210000,
    likes: 11000,
    uploadedAt: "2 weeks ago",
    category: "Fashion",
    uploader: { name: "StyleDrop", avatar: "https://picsum.photos/seed/StyleDrop/40/40", followers: 180000 },
    videoUrl: urls[1],
    description: "What to wear this fall season."
  },
  {
    id: "v7",
    title: "F1 Highlights: Monaco Grand Prix",
    thumbnail: "https://picsum.photos/seed/v7/480/270",
    duration: "06:30",
    views: 1800000,
    likes: 56000,
    uploadedAt: "1 day ago",
    category: "Sports",
    uploader: { name: "Speedster", avatar: "https://picsum.photos/seed/Speedster/40/40", followers: 920000 },
    videoUrl: urls[2],
    description: "Crazy overtakes in Monaco."
  },
  {
    id: "v8",
    title: "Building a mechanical keyboard from scratch",
    thumbnail: "https://picsum.photos/seed/v8/480/270",
    duration: "18:20",
    views: 670000,
    likes: 28000,
    uploadedAt: "4 days ago",
    category: "Tech",
    uploader: { name: "KeebNerd", avatar: "https://picsum.photos/seed/KeebNerd/40/40", followers: 250000 },
    videoUrl: urls[3],
    description: "Lubing switches, custom keycaps."
  },
  {
    id: "v9",
    title: "Demon Slayer S4 Episode 1 Review",
    thumbnail: "https://picsum.photos/seed/v9/480/270",
    duration: "15:10",
    views: 950000,
    likes: 41000,
    uploadedAt: "12 hours ago",
    category: "Anime",
    uploader: { name: "OtakuReview", avatar: "https://picsum.photos/seed/OtakuReview/40/40", followers: 600000 },
    videoUrl: urls[0],
    description: "My thoughts on the new season premiere."
  },
  {
    id: "v10",
    title: "Valorant World Championship Finals",
    thumbnail: "https://picsum.photos/seed/v10/480/270",
    duration: "1:45:00",
    views: 2500000,
    likes: 85000,
    uploadedAt: "1 month ago",
    category: "Gaming",
    uploader: { name: "ValoEsports", avatar: "https://picsum.photos/seed/ValoEsports/40/40", followers: 1500000 },
    videoUrl: urls[1],
    description: "The grand finals full match."
  },
  {
    id: "v11",
    title: "City Pop Mix 80s Japanese",
    thumbnail: "https://picsum.photos/seed/v11/480/270",
    duration: "1:12:45",
    views: 3100000,
    likes: 105000,
    uploadedAt: "2 years ago",
    category: "Music",
    uploader: { name: "RetroWaves", avatar: "https://picsum.photos/seed/RetroWaves/40/40", followers: 420000 },
    videoUrl: urls[2],
    description: "Classic Japanese city pop mix."
  },
  {
    id: "v12",
    title: "Day in the life of a software engineer in Tokyo",
    thumbnail: "https://picsum.photos/seed/v12/480/270",
    duration: "14:50",
    views: 1200000,
    likes: 48000,
    uploadedAt: "3 weeks ago",
    category: "Life",
    uploader: { name: "TokyoVlogs", avatar: "https://picsum.photos/seed/TokyoVlogs/40/40", followers: 550000 },
    videoUrl: urls[3],
    description: "Commute, work, and ramen."
  },
  {
    id: "v13",
    title: "How to style oversized fits",
    thumbnail: "https://picsum.photos/seed/v13/480/270",
    duration: "10:15",
    views: 340000,
    likes: 16000,
    uploadedAt: "2 months ago",
    category: "Fashion",
    uploader: { name: "FitCheck", avatar: "https://picsum.photos/seed/FitCheck/40/40", followers: 200000 },
    videoUrl: urls[0],
    description: "Proportions and layering."
  },
  {
    id: "v14",
    title: "NBA Highlights: Best Buzzer Beaters",
    thumbnail: "https://picsum.photos/seed/v14/480/270",
    duration: "11:20",
    views: 4200000,
    likes: 130000,
    uploadedAt: "6 months ago",
    category: "Sports",
    uploader: { name: "HoopsHub", avatar: "https://picsum.photos/seed/HoopsHub/40/40", followers: 1100000 },
    videoUrl: urls[1],
    description: "Crazy game winning shots."
  },
  {
    id: "v15",
    title: "React 19 Server Components Explained",
    thumbnail: "https://picsum.photos/seed/v15/480/270",
    duration: "22:10",
    views: 280000,
    likes: 14000,
    uploadedAt: "1 week ago",
    category: "Tech",
    uploader: { name: "FrontendDev", avatar: "https://picsum.photos/seed/FrontendDev/40/40", followers: 310000 },
    videoUrl: urls[2],
    description: "Deep dive into RSCs."
  },
  {
    id: "v16",
    title: "Attack on Titan Animation Breakdown",
    thumbnail: "https://picsum.photos/seed/v16/480/270",
    duration: "16:40",
    views: 850000,
    likes: 38000,
    uploadedAt: "1 month ago",
    category: "Anime",
    uploader: { name: "SakugaFan", avatar: "https://picsum.photos/seed/SakugaFan/40/40", followers: 270000 },
    videoUrl: urls[3],
    description: "How Ufotable animates water and fire."
  },
  {
    id: "v17",
    title: "Speedrunning Minecraft in 12 minutes",
    thumbnail: "https://picsum.photos/seed/v17/480/270",
    duration: "13:05",
    views: 5600000,
    likes: 210000,
    uploadedAt: "3 months ago",
    category: "Gaming",
    uploader: { name: "BlockMaster", avatar: "https://picsum.photos/seed/BlockMaster/40/40", followers: 2300000 },
    videoUrl: urls[0],
    description: "New world record attempt."
  },
  {
    id: "v18",
    title: "Jazz Hop Mix for studying",
    thumbnail: "https://picsum.photos/seed/v18/480/270",
    duration: "2:00:00",
    views: 1400000,
    likes: 62000,
    uploadedAt: "4 months ago",
    category: "Music",
    uploader: { name: "ChillVibes", avatar: "https://picsum.photos/seed/ChillVibes/40/40", followers: 5000000 },
    videoUrl: urls[1],
    description: "Smooth jazz and hip hop beats."
  },
  {
    id: "v19",
    title: "Making authentic Tonkotsu Ramen",
    thumbnail: "https://picsum.photos/seed/v19/480/270",
    duration: "20:30",
    views: 1100000,
    likes: 54000,
    uploadedAt: "5 months ago",
    category: "Life",
    uploader: { name: "ChefNoodle", avatar: "https://picsum.photos/seed/ChefNoodle/40/40", followers: 890000 },
    videoUrl: urls[2],
    description: "12 hour broth recipe."
  },
  {
    id: "v20",
    title: "Genshin Impact S3 Best Moments",
    thumbnail: "https://picsum.photos/seed/v20/480/270",
    duration: "10:50",
    views: 1900000,
    likes: 95000,
    uploadedAt: "2 weeks ago",
    category: "Anime",
    uploader: { name: "AnimeHype", avatar: "https://picsum.photos/seed/AnimeHype/40/40", followers: 850000 },
    videoUrl: urls[3],
    description: "Highlights from the swordsmith village arc."
  }
];
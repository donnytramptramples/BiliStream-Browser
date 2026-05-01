import { useState, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { VideoGrid } from "@/components/VideoGrid";
import { VIDEOS } from "@/data/videos";
import { shuffleArray } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Recommended",
  "Anime",
  "Gaming",
  "Music",
  "Tech",
  "Life",
  "Fashion",
  "Sports"
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [videoPool, setVideoPool] = useState(() => shuffleArray(VIDEOS));

  const filteredVideos = useMemo(() => {
    if (selectedCategory === "All") return videoPool;
    return videoPool.filter((v) => v.category === selectedCategory);
  }, [videoPool, selectedCategory]);

  const handleRefresh = useCallback(() => {
    setVideoPool(shuffleArray([...VIDEOS]));
  }, []);

  const handleSelectCategory = useCallback((cat: string) => {
    setSelectedCategory(cat);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryNav
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      <main className="container mx-auto px-4">
        <VideoGrid videos={filteredVideos} onRefresh={handleRefresh} />
      </main>
    </div>
  );
}

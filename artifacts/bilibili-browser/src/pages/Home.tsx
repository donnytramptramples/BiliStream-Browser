import { useState, useMemo, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { VideoGrid } from "@/components/VideoGrid";
import { useBilibiliVideos } from "@/hooks/useBilibiliVideos";
import { shuffleArray } from "@/lib/utils";
import type { Video } from "@/data/videos";

const CATEGORIES = [
  "All",
  "Recommended",
  "Anime",
  "Gaming",
  "Music",
  "Tech",
  "Life",
  "Fashion",
  "Sports",
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [videoPool, setVideoPool] = useState<Video[]>([]);
  const { videos, isLoading, error } = useBilibiliVideos();

  useEffect(() => {
    if (videos.length > 0) {
      setVideoPool(shuffleArray(videos));
    }
  }, [videos]);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === "All" || selectedCategory === "Recommended") return videoPool;
    return videoPool.filter((v) => v.category === selectedCategory);
  }, [videoPool, selectedCategory]);

  const handleRefresh = useCallback(() => {
    setVideoPool((prev) => shuffleArray([...prev]));
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
        {error ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <p className="text-base font-medium">加载失败，请稍后重试</p>
            <p className="text-sm opacity-70">{error}</p>
          </div>
        ) : (
          <VideoGrid videos={filteredVideos} onRefresh={handleRefresh} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
}

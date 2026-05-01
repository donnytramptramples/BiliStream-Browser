import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { VideoCard } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBilibiliSearch } from "@/hooks/useBilibiliSearch";
import { formatNumber } from "@/lib/utils";

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex gap-3 px-1">
        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        <div className="flex flex-col flex-1 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  useLocation();
  const query = new URLSearchParams(window.location.search).get("q") ?? "";
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [query]);

  const { videos, total, pages, isLoading, error } = useBilibiliSearch(query, page);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-background"
    >
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Search className="w-4 h-4" />
            <span className="text-sm">搜索结果：</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">
            {query}
          </h1>
          {!isLoading && total > 0 && (
            <span className="text-sm text-muted-foreground ml-auto">
              共 {formatNumber(total)} 个结果
            </span>
          )}
        </div>

        {error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <p className="text-base font-medium">搜索失败，请重试</p>
            <p className="text-sm opacity-70">{error}</p>
          </div>
        )}

        {!error && isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!error && !isLoading && videos.length === 0 && query && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <Search className="w-12 h-12 opacity-20" />
            <p className="text-base font-medium">没有找到相关视频</p>
            <p className="text-sm opacity-70">试试其他关键词</p>
          </div>
        )}

        {!error && !isLoading && videos.length > 0 && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${query}-${page}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8"
              >
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </motion.div>
            </AnimatePresence>

            {pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  disabled={page <= 1}
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  第 <span className="font-semibold text-foreground">{page}</span> 页，共 {pages} 页
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  disabled={page >= pages}
                  onClick={() => { setPage((p) => Math.min(pages, p + 1)); window.scrollTo(0, 0); }}
                  data-testid="button-next-page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </motion.div>
  );
}

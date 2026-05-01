import { useEffect, useState, useMemo } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import { ThumbsUp, Share2, Plus, Flag, MoreHorizontal } from "lucide-react";
import { Header } from "@/components/Header";
import { VideoCard } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { VIDEOS } from "@/data/videos";
import { formatNumber, shuffleArray } from "@/lib/utils";
import NotFound from "./not-found";

export default function Watch() {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const video = useMemo(() => VIDEOS.find(v => v.id === id), [id]);
  const relatedVideos = useMemo(() => shuffleArray(VIDEOS.filter(v => v.id !== id)).slice(0, 10), [id]);

  // Reset state on video change
  useEffect(() => {
    setIsLiked(false);
    window.scrollTo(0, 0);
  }, [id]);

  if (!video) return <NotFound />;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
          {/* Left Column - Video & Info */}
          <div className="flex-1 w-full max-w-[1000px] mx-auto lg:max-w-none">
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-sm mb-4">
              <ReactPlayer
                url={video.videoUrl}
                width="100%"
                height="100%"
                controls
                playing
                playsinline
                config={{ file: { forceHLS: true } }}
              />
            </div>
            
            <h1 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
              {video.title}
            </h1>
            
            <div className="flex items-center text-sm text-muted-foreground gap-4 mb-4">
              <span>{formatNumber(video.views)} views</span>
              <span>{video.uploadedAt}</span>
              <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium">{video.category}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border border-border">
                  <AvatarImage src={video.uploader.avatar} />
                  <AvatarFallback>{video.uploader.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-[15px]">{video.uploader.name}</h3>
                  <p className="text-xs text-muted-foreground">{formatNumber(video.uploader.followers)} followers</p>
                </div>
                <Button 
                  variant={isSubscribed ? "secondary" : "default"} 
                  className={`ml-2 rounded-full px-6 transition-colors ${!isSubscribed ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}`}
                  onClick={() => setIsSubscribed(!isSubscribed)}
                >
                  {isSubscribed ? 'Following' : '+ Follow'}
                </Button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                <Button 
                  variant={isLiked ? "default" : "secondary"} 
                  className={`rounded-full gap-2 shrink-0 ${isLiked ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <ThumbsUp className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                  {formatNumber(video.likes + (isLiked ? 1 : 0))}
                </Button>
                <Button variant="secondary" className="rounded-full gap-2 shrink-0">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button variant="secondary" className="rounded-full gap-2 shrink-0">
                  <Plus className="w-4 h-4" />
                  Save
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full shrink-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-xl text-sm whitespace-pre-wrap leading-relaxed border border-border/50">
              {video.description}
            </div>
          </div>

          {/* Right Column - Related Videos */}
          <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0">
            <h3 className="font-bold text-lg mb-4">Up Next</h3>
            <div className="flex flex-col gap-3">
              {relatedVideos.map((v) => (
                <VideoCard key={v.id} video={v} compact />
              ))}
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

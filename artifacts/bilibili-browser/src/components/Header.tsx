import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Upload, Bell, Moon, Sun, Tv, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [location, setLocation] = useLocation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q") ?? "";
    setQuery(q);
  }, [location]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setLocation(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleClear() {
    setQuery("");
    setLocation("/");
  }

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity shrink-0">
          <Tv className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block">bilibili</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
          <div className="relative w-full group">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索视频、番剧、UP主..."
              className="w-full rounded-full bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:bg-background transition-all pl-4 pr-20"
              data-testid="input-search"
            />
            {query && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleClear}
                className="absolute right-9 top-0 h-full hover:bg-transparent text-muted-foreground hover:text-foreground"
                data-testid="button-search-clear"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full rounded-r-full hover:bg-transparent group-focus-within:text-primary transition-colors text-muted-foreground"
              data-testid="button-search"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-theme-toggle"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            className="hidden sm:flex border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors gap-2 rounded-full px-6"
          >
            <Upload className="w-4 h-4" />
            投稿
          </Button>

          <Avatar className="cursor-pointer border-2 border-transparent hover:border-primary transition-colors ml-2 h-9 w-9">
            <AvatarImage src="https://picsum.photos/seed/user/40/40" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </motion.header>
  );
}

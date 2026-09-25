"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Announcement } from "@/types";

export function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    apiClient
      .get("/announcements/public")
      .then((res) => setAnnouncements(res.data.data))
      .catch(() => setAnnouncements([]));
  }, []);

  if (announcements.length === 0) return null;

  const text = announcements.map((a) => `${a.title}: ${a.content}`).join("        •        ");

  return (
    <div className="overflow-hidden border-b border-navy-800 bg-navy-900 text-white">
      <div className="flex items-center gap-3 px-4 py-2 text-sm">
        <Megaphone className="h-4 w-4 shrink-0 text-navy-300" />
        <div className="relative flex-1 overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-[marquee_28s_linear_infinite]">
            <span>{text}</span>
            <span className="px-8" />
            <span>{text}</span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); }
        }
      `}</style>
    </div>
  );
}

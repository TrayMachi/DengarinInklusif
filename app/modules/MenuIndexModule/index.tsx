import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { getCurrentUser, type AuthUser } from "~/utils/auth.client";

interface LoaderData {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  timestamp: string;
}

export const MenuIndexModule = () => {
  const { user: serverUser } = useLoaderData() as LoaderData;
  const [clientUser, setClientUser] = useState<AuthUser | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Fallback to client-side auth if server auth is not available
  useEffect(() => {
    if (!serverUser) {
      getCurrentUser().then(setClientUser);
    }
  }, [serverUser]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const user = serverUser || clientUser;
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Pengguna";

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Jakarta",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-md p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Welcome Message */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {getGreeting()}, {displayName}! 👋
                </h1>
                <p className="text-muted-foreground text-lg">
                  Selamat datang kembali di dashboard Anda
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    📅 {formatDate(currentTime)}
                  </span>
                  <span className="flex items-center gap-1">
                    🕐 {formatTime(currentTime)} WIB
                  </span>
                </div>
              </div>

              {/* Profile Section */}
              {user ? (
                <div className="flex items-center gap-4 bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <div className="relative">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-16 h-16 rounded-full border-2 border-primary/30 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-primary">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {displayName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                      Online
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-muted animate-pulse border-2 border-primary/30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-muted-foreground/20"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted-foreground/20 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-muted-foreground/20 rounded animate-pulse"></div>
                    <div className="h-5 w-16 bg-muted-foreground/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: "📝",
                label: "Materi",
                route: "/menu/materi",
                color: "bg-blue-500",
              },
              {
                icon: "⚙️",
                label: "Pengaturan",
                route: "/menu/pengaturan",
                color: "bg-orange-500",
              },
            ].map((action, index) => (
              <button
                key={index}
                className="group flex flex-col items-center gap-3 p-6 bg-muted/50 hover:bg-primary/10 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                onClick={() => navigate(action.route)}
              >
                <div
                  className={`p-3 ${action.color} text-white rounded-xl group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-2xl">{action.icon}</span>
                </div>
                <span className="text-sm font-medium text-foreground text-center">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-xl p-6 border border-border/50">
            <p className="text-lg italic text-foreground mb-2">
              "Kesuksesan adalah hasil dari persiapan, kerja keras, dan belajar
              dari kegagalan."
            </p>
            <p className="text-sm text-muted-foreground">— Colin Powell</p>
          </div>
        </div>
      </div>
    </main>
  );
};

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
}

// Settings tabs constants
const SETTINGS_TABS = [
  {
    id: "profile",
    label: "Profil",
    icon: "👤",
    description: "Kelola informasi profil Anda",
  },
  {
    id: "account",
    label: "Akun",
    icon: "🔐",
    description: "Pengaturan keamanan dan privasi",
  },
  {
    id: "notifications",
    label: "Notifikasi",
    icon: "🔔",
    description: "Atur preferensi notifikasi",
  },
  {
    id: "accessibility",
    label: "Aksesibilitas",
    icon: "♿",
    description: "Pengaturan untuk kemudahan akses",
  },
  {
    id: "language",
    label: "Bahasa",
    icon: "🌐",
    description: "Pilihan bahasa dan regional",
  },
  {
    id: "about",
    label: "Tentang",
    icon: "ℹ️",
    description: "Informasi aplikasi dan bantuan",
  },
] as const;

export const SettingModule = () => {
  const { user: serverUser } = useLoaderData() as LoaderData;
  const [clientUser, setClientUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<string>("profile");
  const navigate = useNavigate();

  // Fallback to client-side auth if server auth is not available
  useEffect(() => {
    if (!serverUser) {
      getCurrentUser().then(setClientUser);
    }
  }, [serverUser]);

  const user = serverUser || clientUser;
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Pengguna";

  const handleBack = () => {
    navigate("/menu");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-primary/30 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary/30 flex items-center justify-center">
                    <span className="text-3xl font-semibold text-primary">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <span className="text-sm">📷</span>
                </button>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground">
                  {displayName}
                </h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <button className="mt-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                  Ubah Foto Profil
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  defaultValue={displayName}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.email || ""}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan tentang diri Anda..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Keamanan Akun
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">Kata Sandi</h4>
                    <p className="text-sm text-muted-foreground">
                      Terakhir diubah 30 hari yang lalu
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Ubah
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">
                      Autentikasi Dua Faktor
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Tingkatkan keamanan akun Anda
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Aktifkan
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Privasi</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">
                      Profil Publik
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Izinkan orang lain melihat profil Anda
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Notifikasi Push
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Pesan Baru",
                    desc: "Dapatkan notifikasi untuk pesan masuk",
                  },
                  {
                    label: "Pembaruan Sistem",
                    desc: "Informasi tentang pembaruan aplikasi",
                  },
                  {
                    label: "Pengingat",
                    desc: "Pengingat untuk tugas dan jadwal",
                  },
                  {
                    label: "Promosi",
                    desc: "Penawaran khusus dan informasi promosi",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-foreground">
                        {item.label}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={index < 2}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "accessibility":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Kemudahan Akses
              </h3>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">
                    Ukuran Teks
                  </h4>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Kecil</span>
                    <input
                      type="range"
                      min="12"
                      max="20"
                      defaultValue="16"
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">Besar</span>
                  </div>
                </div>

                {[
                  {
                    label: "Kontras Tinggi",
                    desc: "Meningkatkan kontras untuk kemudahan membaca",
                  },
                  {
                    label: "Mode Gelap Otomatis",
                    desc: "Sesuaikan dengan pengaturan sistem",
                  },
                  {
                    label: "Animasi Berkurang",
                    desc: "Kurangi efek animasi untuk kenyamanan",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-foreground">
                        {item.label}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "language":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Bahasa & Regional
              </h3>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">
                    Bahasa Aplikasi
                  </h4>
                  <div className="space-y-2">
                    {[
                      { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
                      { code: "en", name: "English", flag: "🇺🇸" },
                      { code: "jv", name: "Basa Jawa", flag: "🇮🇩" },
                    ].map((lang, index) => (
                      <label
                        key={lang.code}
                        className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50"
                      >
                        <input
                          type="radio"
                          name="language"
                          defaultChecked={index === 0}
                          className="text-primary"
                        />
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-foreground">{lang.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">
                    Zona Waktu
                  </h4>
                  <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                    <option>WIB (UTC+7) - Jakarta, Bandung</option>
                    <option>WITA (UTC+8) - Makassar, Bali</option>
                    <option>WIT (UTC+9) - Jayapura, Ambon</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary/20 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🎧</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Dengar Inklusif
              </h3>
              <p className="text-muted-foreground">Versi 1.0.0</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Bantuan",
                  icon: "❓",
                  desc: "Panduan penggunaan aplikasi",
                },
                {
                  label: "Syarat & Ketentuan",
                  icon: "📋",
                  desc: "Kebijakan penggunaan layanan",
                },
                {
                  label: "Kebijakan Privasi",
                  icon: "🛡️",
                  desc: "Cara kami melindungi data Anda",
                },
                {
                  label: "Hubungi Kami",
                  icon: "📧",
                  desc: "Tim dukungan pelanggan",
                },
                {
                  label: "Berikan Rating",
                  icon: "⭐",
                  desc: "Bantu kami berkembang",
                },
              ].map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">
                      {item.label}
                    </h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <span className="text-muted-foreground">›</span>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Kembali ke menu"
            >
              <span className="text-xl">←</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Pengaturan</h1>
              <p className="text-muted-foreground">
                Kelola preferensi dan pengaturan akun Anda
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="space-y-2">
            {SETTINGS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted/50 text-foreground"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{tab.label}</div>
                  <div
                    className={`text-xs truncate ${
                      activeTab === tab.id
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tab.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-md p-6">
              {renderTabContent()}

              {/* Save Button */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
                <button className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                  Batalkan
                </button>
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

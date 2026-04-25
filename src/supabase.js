// Supabase Client Configuration
// Ganti nilai di bawah ini dengan URL dan anon key dari project Supabase kamu
// Dashboard: https://supabase.com/dashboard → Project Settings → API

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qhjvqruehqskqjwtrpeg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoanZxcnVlaHFza3Fqd3RycGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNTY5OTEsImV4cCI6MjA5MjczMjk5MX0.wqWgNUYuVL65JtipIrT1oNUjpztlGF0QocNy1ugL4Rg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// PETUNJUK SETUP SUPABASE
// ============================================================
//
// 1. Buat project baru di https://supabase.com
//
// 2. Ganti SUPABASE_URL dan SUPABASE_ANON_KEY di atas
//    (Settings → API di dashboard Supabase)
//
// 3. Buat tabel di Supabase SQL Editor:
//
//    -- Tabel chat anonim
//    CREATE TABLE chats (
//      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//      message TEXT NOT NULL,
//      sender_image TEXT DEFAULT '/AnonimUser.png',
//      user_ip TEXT,
//      created_at TIMESTAMPTZ DEFAULT NOW()
//    );
//
//    -- Tabel blacklist IP
//    CREATE TABLE blacklist_ips (
//      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//      ip_address TEXT UNIQUE NOT NULL,
//      created_at TIMESTAMPTZ DEFAULT NOW()
//    );
//
//    -- Tabel rating
//    CREATE TABLE ratings (
//      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//      value FLOAT NOT NULL,
//      created_at TIMESTAMPTZ DEFAULT NOW()
//    );
//
// 4. Aktifkan Realtime untuk tabel 'chats':
//    Dashboard → Table Editor → chats → Enable Realtime
//
// 5. Buat 2 Storage bucket:
//    - Nama: "images"      (untuk upload foto dari user)
//    - Nama: "gallery"     (untuk galeri kelas / GambarAman)
//    Atur keduanya sebagai Public bucket
//
// 6. Storage Policy (jalankan di SQL Editor):
//    -- Allow public read
//    CREATE POLICY "Public read images"
//      ON storage.objects FOR SELECT
//      USING (bucket_id IN ('images', 'gallery'));
//
//    -- Allow public upload to images bucket
//    CREATE POLICY "Public upload images"
//      ON storage.objects FOR INSERT
//      WITH CHECK (bucket_id = 'images');
//
// 7. Row Level Security (RLS) untuk tabel:
//    -- Aktifkan RLS, lalu buat policy:
//    ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
//    CREATE POLICY "Allow all" ON chats FOR ALL USING (true) WITH CHECK (true);
//
//    ALTER TABLE blacklist_ips ENABLE ROW LEVEL SECURITY;
//    CREATE POLICY "Allow read" ON blacklist_ips FOR SELECT USING (true);
//
//    ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
//    CREATE POLICY "Allow insert" ON ratings FOR INSERT WITH CHECK (true);
//
// 8. Google Auth (opsional, untuk foto profil di chat):
//    Dashboard → Authentication → Providers → Google → Enable
//    Masukkan Client ID & Secret dari Google Cloud Console
// ============================================================

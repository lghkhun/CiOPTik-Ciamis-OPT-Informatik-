import { createClient } from '@supabase/supabase-js';

// PENTING: Ganti nilai di bawah ini dengan kredensial dari proyek Supabase Anda.
// Anda bisa mendapatkannya dari dasbor Supabase di bagian Settings > API.
const supabaseUrl = 'https://erefaqfrppbajpmavjtn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZWZhcWZycHBiYWpwbWF2anRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjIyNDYsImV4cCI6MjA3NjQ5ODI0Nn0.L0w9ppE-jtDGLlMTpR4rHOhk3cvUITNQGsAznfLQKMU';

// Pemeriksaan sederhana untuk memastikan kredensial tidak kosong saat runtime.
// FIX: The comparison to a placeholder URL was causing a TypeScript error because the hardcoded URL will never match.
// This part of the validation has been removed as the credentials are provided.
if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = `URL Supabase atau Kunci Anon belum diatur. Harap edit file services/supabaseClient.ts dan masukkan kredensial yang benar.`;
    alert(errorMessage);
    console.error(errorMessage);
    throw new Error('Konfigurasi Supabase tidak lengkap.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
        headers: {
            // Mengatur cache browser dan CDN selama 1 jam (3600 detik).
            // Ini memastikan data tidak terlalu sering diminta dari server,
            // namun tetap segar dalam interval satu jam, sesuai permintaan.
            'Cache-Control': 'max-age=3600',
        },
    },
    realtime: {
        // Konfigurasi ini secara eksplisit mengatur parameter untuk koneksi
        // websocket (realtime). Ini memastikan bahwa fitur-fitur seperti
        // onAuthStateChange dan subscription lainnya berjalan stabil.
        params: {
            eventsPerSecond: 10,
        },
    },
});
// Login "Sign in with Google" — implementasi manual (Authorization Code flow)
// tanpa dependency tambahan seperti Auth.js, mengikuti pendekatan minimal
// yang sama dengan src/lib/session.js.

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

function getCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET belum diset. Lihat .env.example."
    );
  }
  return { clientId, clientSecret };
}

/** URL redirect callback — harus didaftarkan persis sama di Google Cloud Console. */
export function getRedirectUri(origin) {
  return `${origin}/api/auth/google/callback`;
}

/** Bangun URL untuk mengarahkan pengguna ke halaman consent Google. */
export function buildGoogleAuthUrl({ origin, state }) {
  const { clientId } = getCredentials();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(origin),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/** Tukar authorization code dengan access token. */
async function tukarCodeDenganToken({ code, origin }) {
  const { clientId, clientSecret } = getCredentials();
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getRedirectUri(origin),
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) {
    throw new Error("Gagal menukar authorization code dengan token Google.");
  }
  return res.json();
}

/** Ambil profil pengguna (email, nama, dst.) dari access token. */
async function ambilProfilGoogle(accessToken) {
  const res = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error("Gagal mengambil profil pengguna dari Google.");
  }
  return res.json();
}

/**
 * Selesaikan alur OAuth: tukar code lalu ambil profil.
 * Mengembalikan { email, nama } jika berhasil dan email sudah terverifikasi.
 */
export async function selesaikanGoogleLogin({ code, origin }) {
  const { access_token } = await tukarCodeDenganToken({ code, origin });
  const profil = await ambilProfilGoogle(access_token);

  if (!profil.email || !profil.email_verified) {
    throw new Error("Email akun Google tidak terverifikasi.");
  }

  return {
    email: String(profil.email).toLowerCase(),
    nama: profil.name || profil.email,
  };
}

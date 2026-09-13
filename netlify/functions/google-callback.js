const SUPABASE_URL = "https://ohrbwqfatksamldgjimj.supabase.co";
const SUPABASE_KEY = "sb_publishable_NaQ8FBOQLQFc6qhIYRN4vw_zeO5YmDN";

exports.handler = async (event) => {
  const code = event.queryStringParameters && event.queryStringParameters.code;
  if (!code) return { statusCode: 400, body: "Geen code ontvangen van Google." };

  const redirectUri = `https://${event.headers.host}/.netlify/functions/google-callback`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    })
  });
  const tokenData = await tokenRes.json();

  if (!tokenData.refresh_token) {
    return { statusCode: 400, body: "Geen refresh_token ontvangen: " + JSON.stringify(tokenData) };
  }

  const opslaanRes = await fetch(`${SUPABASE_URL}/rest/v1/google_tokens?on_conflict=profiel`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates"
    },
    body: JSON.stringify({ profiel: "huisapp", refresh_token: tokenData.refresh_token, updated_at: new Date().toISOString() })
  });

  if (!opslaanRes.ok) {
    const fout = await opslaanRes.text();
    return { statusCode: 500, body: "Opslaan in database mislukt: " + fout };
  }

  return { statusCode: 302, headers: { Location: "/" } };
};

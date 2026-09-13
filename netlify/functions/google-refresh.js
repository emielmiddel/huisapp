const SUPABASE_URL = "https://ohrbwqfatksamldgjimj.supabase.co";
const SUPABASE_KEY = "sb_publishable_NaQ8FBOQLQFc6qhIYRN4vw_zeO5YmDN";

exports.handler = async () => {
  const ophalenRes = await fetch(`${SUPABASE_URL}/rest/v1/google_tokens?profiel=eq.huisapp&select=refresh_token`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  const rijen = await ophalenRes.json();

  if (!rijen.length) {
    return { statusCode: 200, body: JSON.stringify({ connected: false }) };
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: rijen[0].refresh_token,
      grant_type: "refresh_token"
    })
  });
  const data = await tokenRes.json();

  if (data.error) {
    return { statusCode: 200, body: JSON.stringify({ connected: false, error: data.error }) };
  }
  return { statusCode: 200, body: JSON.stringify({ connected: true, access_token: data.access_token }) };
};

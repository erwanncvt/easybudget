const ADMIN_EMAIL = 'erwannchauvet@gmail.com';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, plan, expire, adminEmail } = req.body;

  if (adminEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Non autorisé' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ plan, plan_expire: expire })
  });

  if (!response.ok) {
    const err = await response.text();
    return res.status(500).json({ error: err });
  }

  return res.status(200).json({ success: true });
};

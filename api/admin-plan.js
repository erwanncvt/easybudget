import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'erwannchauvet@gmail.com';
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // clé service_role (pas anon)
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, plan, expire, adminEmail } = req.body;

  // Vérifier que c'est bien l'admin
  if (adminEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Non autorisé' });
  }

  const { error } = await supabase
    .from('profiles')
    .update({ plan, plan_expire: expire })
    .eq('id', userId);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true });
}

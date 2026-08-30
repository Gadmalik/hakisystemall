import pool from "../db.js";
import webpush from "web-push";

webpush.setVapidDetails(
  'mailto:'+process.env.NO_REPLAY_MAIL,
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

export async function SubscribeUser({subscription, userid}){
    try {
        const result = await pool.query("INSERT INTO push_subscriptions(subscription, userid) VALUES($1, $2) ON CONFLICT ON CONSTRAINT push_subscriptions_subscription_key DO UPDATE SET userid = EXCLUDED.userid", [JSON.stringify(subscription), userid]);
        return {success:true, code:"success", message:"User subscribed successfully"};
    } catch (error) {
        console.log(error);
        return {success:false, code:"error", message:"Une erreur s'est produite !", error: error};
    }
}

export async function SendNotification(data){
    const { rows } = await pool.query(
    'SELECT id, subscription FROM push_subscriptions WHERE userid = $1',
    [data.userid]
  );

  const payload = JSON.stringify({ title:data.title, body:data.body, url:data.url });

  const sendPromises = rows.map(async (row) => {
    // 2. Extraire la colonne subscription (et parser si c'est du TEXT)
    let sub = row.subscription;
    if (typeof sub === 'string') {
      sub = JSON.parse(sub);
    }

    if (!sub || !sub.endpoint) return;

    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      // 3. Supprimer l'abonnement s'il est expiré ou révoqué
      if (err.statusCode === 404 || err.statusCode === 410) {
        await pool.query('DELETE FROM push_subscriptions WHERE id = $1', [row.id]);
      } else {
        console.error('Erreur lors de l\'envoi Web Push :', err);
      }
    }
  });

  await Promise.all(sendPromises);
}

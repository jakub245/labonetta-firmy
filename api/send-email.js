export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const RESEND_API_KEY = 're_Q84rPpcU_Q54brUqN1P6CXjufHM3yi4xd';
  const FROM = 'Labonetta pro firmy <noreply@labonetta.cz>';
  const NOTIFY_TO = 'prosek@labonetta.cz';

  const {
    jmeno, prijmeni, telefon, email, firma,
    adresa, budova, patro, datum, cas,
    osoby, pizzy, dodani, poznamka, opakovani
  } = req.body;

  // Email tobě — notifikace
  const notifikaceHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #096A5F; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Nová poptávka z firmy.labonetta.cz</h1>
      </div>
      <div style="border: 1px solid #e0ddd6; border-top: none; border-radius: 0 0 12px 12px; padding: 24px 32px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr><td style="padding: 8px 0; color: #6b6960; width: 40%;">Jméno</td><td style="padding: 8px 0; font-weight: 500;">${jmeno} ${prijmeni}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b6960;">Firma</td><td style="padding: 8px 0; font-weight: 500;">${firma}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b6960;">Telefon</td><td style="padding: 8px 0;">${telefon}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b6960;">Email</td><td style="padding: 8px 0;">${email}</td></tr>
          <tr><td colspan="2" style="padding: 12px 0 4px; border-top: 1px solid #e0ddd6;"></td></tr>
          <tr><td style="padding: 8px 0; color: #6b6960;">Adresa doručení</td><td style="padding: 8px 0;">${adresa || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b6960;">Budova / patro</td><td style="padding: 8px 0;">${[budova, patro].filter(v => v && v !== '—').join(', ') || '—'}</td></tr>
          <tr><td colspan="2" style="padding: 12px 0 4px; border-top: 1px solid #e0ddd6;"></td></tr>
          <tr><td style="padding: 8px 0; color: #6b6960;">Datum a čas</td><td style="padding: 8px 0; font-weight: 500;">${datum} v ${cas}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b6960;">Počet osob / pizz</td><td style="padding: 8px 0;">${osoby} osob / ${pizzy} pizz</td></tr>
          <tr><td style="padding: 8px 0; color: #6b6960;">Způsob dodání</td><td style="padding: 8px 0;">${dodani}</td></tr>
          <tr><td colspan="2" style="padding: 12px 0 4px; border-top: 1px solid #e0ddd6;"></td></tr>
          <tr><td style="padding: 8px 0; color: #6b6960;">Poznámka</td><td style="padding: 8px 0;">${poznamka || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b6960;">Pravidelné dodávky</td><td style="padding: 8px 0;">${opakovani}</td></tr>
        </table>
      </div>
    </div>
  `;

  // Email zákazníkovi — potvrzení
  const potvrzeniHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #096A5F; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Potvrzení poptávky</h1>
      </div>
      <div style="border: 1px solid #e0ddd6; border-top: none; border-radius: 0 0 12px 12px; padding: 24px 32px;">
        <p style="font-size: 15px; color: #1a1a18;">Dobrý den, <strong>${jmeno}</strong>,</p>
        <p style="font-size: 15px; color: #1a1a18; line-height: 1.6;">děkujeme za Vaši poptávku. Ozveme se Vám co nejdříve s potvrzením a dalšími detaily.</p>

        <div style="background: #E1F5EE; border-radius: 10px; padding: 20px 24px; margin: 24px 0;">
          <p style="margin: 0 0 12px; font-weight: 600; color: #0F6E56;">Shrnutí Vaší poptávky</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 5px 0; color: #6b6960; width: 40%;">Jméno</td><td style="padding: 5px 0; font-weight: 500;">${jmeno} ${prijmeni}</td></tr>
            <tr><td style="padding: 5px 0; color: #6b6960;">Telefon</td><td style="padding: 5px 0;">${telefon}</td></tr>
            <tr><td style="padding: 5px 0; color: #6b6960;">Email</td><td style="padding: 5px 0;">${email}</td></tr>
            <tr><td style="padding: 5px 0; color: #6b6960;">Firma</td><td style="padding: 5px 0; font-weight: 500;">${firma}</td></tr>
            <tr><td style="padding: 5px 0; color: #6b6960;">Adresa</td><td style="padding: 5px 0;">${adresa || '—'}</td></tr>
            ${budova && budova !== '—' ? `<tr><td style="padding: 5px 0; color: #6b6960;">Budova</td><td style="padding: 5px 0;">${budova}</td></tr>` : ''}
            ${patro && patro !== '—' ? `<tr><td style="padding: 5px 0; color: #6b6960;">Patro / místnost</td><td style="padding: 5px 0;">${patro}</td></tr>` : ''}
            <tr><td style="padding: 5px 0; color: #6b6960;">Datum a čas</td><td style="padding: 5px 0; font-weight: 500;">${datum} v ${cas}</td></tr>
            <tr><td style="padding: 5px 0; color: #6b6960;">Počet osob / pizz</td><td style="padding: 5px 0;">${osoby} / ${pizzy}</td></tr>
            <tr><td style="padding: 5px 0; color: #6b6960;">Způsob dodání</td><td style="padding: 5px 0;">${dodani}</td></tr>
            ${poznamka && poznamka !== '—' ? `<tr><td style="padding: 5px 0; color: #6b6960;">Poznámka</td><td style="padding: 5px 0;">${poznamka}</td></tr>` : ''}
            ${opakovani === 'Ano, má zájem' ? `<tr><td style="padding: 5px 0; color: #6b6960;">Pravidelné dodávky</td><td style="padding: 5px 0; color: #0F6E56; font-weight: 500;">Zájem o pravidelné dodávky</td></tr>` : ''}
          </table>
        </div>

        <p style="font-size: 14px; color: #6b6960; line-height: 1.6;">S pozdravem,<br><strong style="color: #1a1a18;">Tým Labonetta</strong><br><a href="https://www.labonetta.cz" style="color: #1D9E75;">www.labonetta.cz</a></p>
      </div>
    </div>
  `;

  try {
    // Odešleme oba emaily paralelně
    await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM,
          to: [NOTIFY_TO],
          subject: `Nová poptávka – ${firma}`,
          html: notifikaceHtml
        })
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM,
          to: [email],
          subject: 'Potvrzení poptávky – Labonetta pro firmy',
          html: potvrzeniHtml
        })
      })
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

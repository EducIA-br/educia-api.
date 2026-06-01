export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'JSON inválido' }); }
  }

  const { nome, email, plano, code } = body || {};
  if (!nome || !email || !plano || !code) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, email, plano, code' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'RESEND_API_KEY não configurada' });

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'EducIA <onboarding@resend.dev>',
        to: email,
        subject: `🎉 Bem-vindo ao EducIA ${plano}! Seu código de acesso está aqui`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8"></head>
          <body style="font-family:'Helvetica Neue',sans-serif;background:#f4f4f4;margin:0;padding:0">
            <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
              <div style="background:#0033A0;padding:32px;text-align:center">
                <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800">Educ<span style="color:#6B9FFF">IA</span></h1>
                <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:14px">Inteligência Artificial na Educação</p>
              </div>
              <div style="padding:40px 32px">
                <h2 style="color:#0D1117;font-size:22px;margin:0 0 8px">Olá, ${nome}! 👋</h2>
                <p style="color:#5A6472;font-size:15px;line-height:1.6">Sua assinatura do plano <strong style="color:#0033A0">${plano}</strong> foi confirmada. Obrigado por fazer parte do EducIA!</p>
                <div style="background:#f0f4ff;border:2px dashed #0033A0;border-radius:12px;padding:24px;text-align:center;margin:28px 0">
                  <p style="color:#5A6472;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:.1em;font-weight:600">Seu código de acesso</p>
                  <p style="color:#0033A0;font-size:28px;font-weight:800;letter-spacing:.2em;margin:0">${code}</p>
                </div>
                <p style="color:#5A6472;font-size:14px;line-height:1.6">Para acessar a área exclusiva:</p>
                <ol style="color:#5A6472;font-size:14px;line-height:2;padding-left:20px">
                  <li>Acesse o site <strong>EducIA</strong></li>
                  <li>Clique em <strong>🔒 Assinantes</strong> no menu</li>
                  <li>Digite o código acima e clique em <strong>Entrar</strong></li>
                </ol>
                <div style="background:#fff8e6;border-left:4px solid #f59e0b;border-radius:4px;padding:14px 16px;margin-top:24px">
                  <p style="color:#92400e;font-size:13px;margin:0">⚠️ Guarde este código em um lugar seguro. Ele é pessoal e intransferível.</p>
                </div>
              </div>
              <div style="background:#f8f9fa;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb">
                <p style="color:#9ca3af;font-size:12px;margin:0">Dúvidas? <a href="mailto:equipe.educia@gmail.com" style="color:#0033A0">equipe.educia@gmail.com</a></p>
                <p style="color:#9ca3af;font-size:12px;margin:4px 0 0">© 2026 EducIA</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const data = await emailRes.json();
    if (!emailRes.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: data.message || 'Erro ao enviar e-mail' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: err.message });
  }
}

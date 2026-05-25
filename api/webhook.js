// Códigos de acesso disponíveis para distribuir
// Quando um código é usado, ele é removido da lista
const CODES_POOL = [
  'EDUCIA-2MTXXXPL',
  'EDUCIA-WT3BGICN',
  'EDUCIA-VPET5YV0',
  'EDUCIA-21AO0OF1',
  'EDUCIA-4JT3J1F9',
  'EDUCIA-9Y21LNIY',
  'EDUCIA-UHLGGESD',
  'EDUCIA-EXV9ONXX',
  'EDUCIA-PBCRNDQ2',
  'EDUCIA-SS4E7G3O',
  'EDUCIA-8ENNRVPL',
  'EDUCIA-0LFNZD9F',
  'EDUCIA-5QZWJSFZ',
  'EDUCIA-K6CNUKK3',
  'EDUCIA-DMOW3NAX',
  'EDUCIA-RXAHYE80',
  'EDUCIA-04IUW83J',
  'EDUCIA-0Y73A9Q5',
  'EDUCIA-R5K63QZR',
  'EDUCIA-MSIHYCO0',
];

// Índice simples para distribuir códigos (em produção use um banco de dados)
let codeIndex = 0;

async function sendAccessEmail(toEmail, toName, planName, accessCode) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'EducIA <equipe.educia@gmail.com>',
      to: toEmail,
      subject: `🎉 Bem-vindo ao EducIA ${planName}! Seu código de acesso está aqui`,
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
              <h2 style="color:#0D1117;font-size:22px;margin:0 0 8px">Olá, ${toName}! 👋</h2>
              <p style="color:#5A6472;font-size:15px;line-height:1.6">Sua assinatura do plano <strong style="color:#0033A0">${planName}</strong> foi confirmada. Obrigado por fazer parte do EducIA!</p>

              <div style="background:#f0f4ff;border:2px dashed #0033A0;border-radius:12px;padding:24px;text-align:center;margin:28px 0">
                <p style="color:#5A6472;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:.1em;font-weight:600">Seu código de acesso</p>
                <p style="color:#0033A0;font-size:28px;font-weight:800;letter-spacing:.2em;margin:0">${accessCode}</p>
              </div>

              <p style="color:#5A6472;font-size:14px;line-height:1.6">Para acessar a área exclusiva:</p>
              <ol style="color:#5A6472;font-size:14px;line-height:2;padding-left:20px">
                <li>Acesse o site <a href="https://educia-br.github.io/educia-api" style="color:#0033A0;font-weight:600">EducIA</a></li>
                <li>Clique em <strong>🔒 Assinantes</strong> no menu</li>
                <li>Digite o código acima e clique em <strong>Entrar</strong></li>
              </ol>

              <div style="background:#fff8e6;border-left:4px solid #f59e0b;border-radius:4px;padding:14px 16px;margin-top:24px">
                <p style="color:#92400e;font-size:13px;margin:0">⚠️ Guarde este código em um lugar seguro. Ele é pessoal e intransferível.</p>
              </div>
            </div>

            <div style="background:#f8f9fa;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb">
              <p style="color:#9ca3af;font-size:12px;margin:0">Dúvidas? Entre em contato: <a href="mailto:equipe.educia@gmail.com" style="color:#0033A0">equipe.educia@gmail.com</a></p>
              <p style="color:#9ca3af;font-size:12px;margin:4px 0 0">© 2026 EducIA — Todos os direitos reservados</p>
            </div>

          </div>
        </body>
        </html>
      `,
    }),
  });

  return res.ok;
}

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

  try {
    // Mercado Pago envia o tipo do evento
    const { type, data } = body || {};

    // Só processa pagamentos aprovados
    if (type !== 'payment') return res.status(200).json({ ok: true });

    // Busca detalhes do pagamento no Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
      headers: { 'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}` }
    });
    const payment = await mpRes.json();

    if (payment.status !== 'approved') return res.status(200).json({ ok: true });

    // Pega dados do comprador
    const email = payment.payer?.email || '';
    const name = payment.payer?.first_name || 'Assinante';
    const planName = payment.additional_info?.items?.[0]?.title || 'Pro';

    // Pega próximo código disponível
    const code = CODES_POOL[codeIndex % CODES_POOL.length];
    codeIndex++;

    // Envia e-mail
    const sent = await sendAccessEmail(email, name, planName, code);

    if (sent) {
      console.log(`Email enviado para ${email} com código ${code}`);
      return res.status(200).json({ ok: true });
    } else {
      return res.status(500).json({ error: 'Falha ao enviar e-mail' });
    }

  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: err.message });
  }
}

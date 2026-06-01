import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'educia2026';    

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'JSON inválido' }); }
    }

    const { password, nome, email, plano, code } = body || {};

    if (password !== ADMIN_PASS) return res.status(401).json({ error: 'Senha incorreta' });
    if (!nome || !email || !plano || !code) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `EducIA <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `🎉 Bem-vindo ao EducIA ${plano}! Seu código de acesso está aqui`,
        html: `
          <!DOCTYPE html>
          <html><head><meta charset="UTF-8"></head>
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
          </body></html>
        `,
      });

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Email error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>EducIA Admin</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',sans-serif;background:#0A0E1A;color:#E8EDF5;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.box{background:#131929;border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:40px;max-width:480px;width:100%}
h2{font-size:20px;font-weight:700;margin-bottom:6px}
.sub{color:rgba(255,255,255,0.45);font-size:14px;margin-bottom:28px}
.field{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.field label{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6B9FFF}
.field input,.field select{padding:11px 14px;border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;font-size:14px;outline:none;background:#0A0E1A;color:#E8EDF5;font-family:inherit;transition:border-color .2s}
.field input:focus,.field select:focus{border-color:#3B6FE0}
.field input::placeholder{color:rgba(255,255,255,0.3)}
.field select option{background:#131929}
.btn{width:100%;padding:13px;background:#0033A0;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s;margin-top:4px}
.btn:hover{background:#3B6FE0}
.btn:disabled{opacity:0.5;cursor:not-allowed}
.result{margin-top:14px;padding:12px 16px;border-radius:10px;font-size:14px;font-weight:600;text-align:center;display:none}
.ok{background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.3);color:#4ade80}
.err{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#f87171}
.divider{height:1px;background:rgba(255,255,255,0.08);margin:24px 0}
.codes{display:flex;flex-direction:column;gap:6px;max-height:180px;overflow-y:auto}
.code-row{background:#0A0E1A;border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:9px 12px;font-size:12px;font-family:monospace;letter-spacing:.08em;display:flex;justify-content:space-between;align-items:center}
.code-row.used{opacity:.35;text-decoration:line-through}
.tag{font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px}
.tag.av{background:rgba(74,222,128,0.15);color:#4ade80}
.tag.us{background:rgba(239,68,68,0.15);color:#f87171}
#mainPanel{display:none}
</style>
</head>
<body>
<div class="box">
  <div id="loginPanel">
    <div style="font-size:40px;margin-bottom:16px">🔐</div>
    <h2>Área Admin — EducIA</h2>
    <p class="sub">Digite a senha para acessar o painel.</p>
    <div class="field"><input type="password" id="pass" placeholder="Senha de acesso" onkeydown="if(event.key==='Enter')login()"></div>
    <button class="btn" onclick="login()">Entrar</button>
    <div class="result err" id="loginErr">❌ Senha incorreta.</div>
  </div>
  <div id="mainPanel">
    <div style="font-size:36px;margin-bottom:12px">🛠️</div>
    <h2>Painel Admin — EducIA</h2>
    <p class="sub">Envie o código de acesso para um novo assinante.</p>
    <div class="field"><label>Nome</label><input type="text" id="nome" placeholder="Nome completo"></div>
    <div class="field"><label>E-mail</label><input type="email" id="email" placeholder="email@exemplo.com"></div>
    <div class="field"><label>Plano</label>
      <select id="plano">
        <option value="Pro">Pro — R$29/mês</option>
        <option value="Premium">Premium — R$69/mês</option>
      </select>
    </div>
    <button class="btn" id="sendBtn" onclick="enviar()">📨 Enviar código de acesso</button>
    <div class="result" id="res"></div>
    <div class="divider"></div>
    <div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6B9FFF;margin-bottom:10px">Códigos disponíveis: <span id="avCount">0</span></div>
    <div class="codes" id="codes"></div>
  </div>
</div>
<script>
const ALL=['EDUCIA-2MTXXXPL','EDUCIA-WT3BGICN','EDUCIA-VPET5YV0','EDUCIA-21AO0OF1','EDUCIA-4JT3J1F9','EDUCIA-9Y21LNIY','EDUCIA-UHLGGESD','EDUCIA-EXV9ONXX','EDUCIA-PBCRNDQ2','EDUCIA-SS4E7G3O','EDUCIA-8ENNRVPL','EDUCIA-0LFNZD9F','EDUCIA-5QZWJSFZ','EDUCIA-K6CNUKK3','EDUCIA-DMOW3NAX','EDUCIA-RXAHYE80','EDUCIA-04IUW83J','EDUCIA-0Y73A9Q5','EDUCIA-R5K63QZR','EDUCIA-MSIHYCO0'];
let adminPass='';
function getUsed(){try{return JSON.parse(localStorage.getItem('usedCodes')||'[]')}catch{return[]}}
function markUsed(c){const u=getUsed();u.push(c);localStorage.setItem('usedCodes',JSON.stringify(u))}
function getNext(){const u=getUsed();return ALL.find(c=>!u.includes(c))||null}
function renderCodes(){
  const u=getUsed();
  document.getElementById('avCount').textContent=ALL.filter(c=>!u.includes(c)).length;
  document.getElementById('codes').innerHTML=ALL.map(c=>'<div class="code-row '+(u.includes(c)?'used':'')+'"><span>'+c+'</span><span class="tag '+(u.includes(c)?'us':'av')+'">'+(u.includes(c)?'Usado':'Disponível')+'</span></div>').join('');
}
function login(){
  const p=document.getElementById('pass').value;
  fetch(window.location.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:p,nome:'_',email:'_@_',plano:'Pro',code:'_'})})
  .then(r=>{
    if(r.status===401){document.getElementById('loginErr').style.display='block';return;}
    adminPass=p;
    document.getElementById('loginPanel').style.display='none';
    document.getElementById('mainPanel').style.display='block';
    renderCodes();
  }).catch(()=>document.getElementById('loginErr').style.display='block');
}
async function enviar(){
  const nome=document.getElementById('nome').value.trim();
  const email=document.getElementById('email').value.trim();
  const plano=document.getElementById('plano').value;
  const res=document.getElementById('res');
  const btn=document.getElementById('sendBtn');
  if(!nome||!email){res.style.display='block';res.className='result err';res.textContent='❌ Preencha nome e e-mail.';return;}
  const code=getNext();
  if(!code){res.style.display='block';res.className='result err';res.textContent='❌ Sem códigos disponíveis!';return;}
  btn.disabled=true;btn.textContent='⏳ Enviando...';res.style.display='none';
  try{
    const r=await fetch(window.location.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:adminPass,nome,email,plano,code})});
    const d=await r.json();
    if(r.ok&&d.ok){markUsed(code);renderCodes();res.style.display='block';res.className='result ok';res.textContent='✅ Código '+code+' enviado para '+email+'!';document.getElementById('nome').value='';document.getElementById('email').value='';}
    else throw new Error(d.error||'Erro');
  }catch(e){res.style.display='block';res.className='result err';res.textContent='❌ '+e.message;}
  btn.disabled=false;btn.textContent='📨 Enviar código de acesso';
}
</script>
</body>
</html>`);
  }
}

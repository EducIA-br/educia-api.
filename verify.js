// Códigos de acesso válidos
// Para adicionar novos clientes, cole o código deles aqui
const VALID_CODES = new Set([
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
]);

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

  const { code } = body || {};
  if (!code) return res.status(400).json({ valid: false });

  const valid = VALID_CODES.has(code.trim().toUpperCase());
  return res.status(200).json({ valid });
}

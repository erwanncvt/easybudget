const TWELVEDATA_KEY = 'bad86fea29b24eff8430957b861127ad';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'Missing ticker' });

  try {
    // Prix en temps réel
    const quoteUrl = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(ticker)}&apikey=${TWELVEDATA_KEY}`;
    const quoteRes = await fetch(quoteUrl);
    const quote = await quoteRes.json();

    if (quote.status === 'error') {
      return res.status(404).json({ error: quote.message });
    }

    // Historique intraday pour la sparkline
    const tsUrl = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(ticker)}&interval=5min&outputsize=24&apikey=${TWELVEDATA_KEY}`;
    const tsRes = await fetch(tsUrl);
    const ts = await tsRes.json();

    const closes = ts.values ? ts.values.map(v => parseFloat(v.close)).reverse() : [];

    return res.status(200).json({
      symbol: quote.symbol,
      name: quote.name,
      price: parseFloat(quote.close),
      previousClose: parseFloat(quote.previous_close),
      change: parseFloat(quote.change),
      changePct: parseFloat(quote.percent_change),
      currency: quote.currency,
      closes
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

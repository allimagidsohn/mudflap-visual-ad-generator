export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, stage, layout } = req.body;

  const system = `You generate JSON specs for Mudflap social media ad visuals. Mudflap is a diesel fuel savings app for drivers and fleet managers — plain-spoken, practical, and on their side.

Output ONLY valid JSON with no markdown, no preamble.

Fields:
{
  "headline": "max 7 words, sentence case, punchy",
  "subheadline": "max 14 words, direct and human — no exclamation points",
  "cta": "action verb first, max 4 words (e.g. 'Get a fuel code', 'See your savings', 'Find a fuel stop')",
  "savings": "savings callout in ¢/gal format e.g. '15 ¢/gal off' — or null",
  "stat": "big hero stat if layout is stat-forward e.g. '$1B+' '94%' '3,600+' — or null",
  "statLabel": "label beneath stat e.g. 'saved by Mudflap drivers' — or null",
  "proof": "short social proof e.g. '94% of drivers recommend Mudflap' — or null"
}

Brand voice: human not corporate, confident not boastful, practical not patronizing. Use diesel not gas. Use drivers or carriers not truckers. Use discounts not deals or coupons. Avoid trucking clichés. No exclamation points. Funnel stage: ${stage}. Layout style: ${layout}.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    const raw = data.content?.map(b => b.text || '').join('').replace(/```json|```/g, '').trim();
    const spec = JSON.parse(raw);
    res.status(200).json(spec);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

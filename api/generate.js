export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, cta, stage, layout, stat, assets, bgPrompt } = req.body;

  const system = `You generate JSON specs for Mudflap social media ad visuals. Mudflap is a diesel fuel savings app for drivers and fleet managers — plain-spoken, practical, and on their side.

Output ONLY valid JSON with no markdown, no preamble, no code fences.

Fields:
{
  "headline": "max 7 words, sentence case, punchy — based on what the user wants to communicate",
  "subheadline": "max 16 words, direct and human — expands on the headline, no exclamation points",
  "cta": "the CTA text provided by the user, or a strong action-verb version if none given",
  "savings": "savings callout in ¢/gal or $/gal format e.g. 'Up to $1/gal off' — or null if not relevant",
  "stat": "the key stat to feature prominently e.g. '$1B+' '94%' '3,600+' — use the one provided or derive from message, or null",
  "statLabel": "label beneath stat e.g. 'saved by Mudflap drivers' '3,600+ fuel stops' — or null",
  "proof": "short social proof line e.g. '94% of drivers recommend Mudflap' — or null",
  "bgDescription": "2-sentence visual description of the background scene for this ad — incorporate the user's bg prompt if provided, otherwise choose something fitting (open highway, fuel stop, fleet on I-80, etc.)",
  "colorScheme": "one of: navy-green, blue-white, dark-gradient, green-accent",
  "badgeText": "short green badge text e.g. '20¢/gal off' or 'No fees' or null"
}

Brand rules:
- Human not corporate. Confident not boastful. Practical not patronizing.
- Use 'diesel' not 'gas'. Use 'drivers' or 'carriers' not 'truckers'.
- Use 'discounts' not 'deals' or 'coupons'. Avoid trucking clichés.
- No exclamation points. Sentence case for headlines.
- Funnel stage: ${stage || 'Awareness'}. Layout style: ${layout || 'Bold'}.`;

  const userPrompt = `What to communicate: ${message}
${cta && cta !== 'No CTA' ? `CTA: ${cta}` : 'No CTA button'}
${stat ? `Key stat to feature: ${stat}` : ''}
${assets && assets.length ? `Brand assets to include: ${assets.join(', ')}` : ''}
${bgPrompt ? `Background/visual direction: ${bgPrompt}` : ''}`;

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
        max_tokens: 800,
        system,
        messages: [{ role: 'user', content: userPrompt }],
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

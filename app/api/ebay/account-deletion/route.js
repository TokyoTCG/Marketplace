import crypto from 'crypto';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const challengeCode = searchParams.get('challenge_code');

  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;
  const endpoint = 'https://www.tokyotcg.nl/api/ebay/account-deletion';

  const hash = crypto.createHash('sha256')
    .update(challengeCode + verificationToken + endpoint)
    .digest('hex');

  return Response.json({ challengeResponse: hash });
}

export async function POST(request) {
  const body = await request.json();

  if (body.metadata?.topic === 'MARKETPLACE_ACCOUNT_DELETION') {
    const deletedUserId = body.data?.userId;
    console.log(`Account deletion notice for eBay user: ${deletedUserId}`);
  }

  return new Response(null, { status: 200 });
}

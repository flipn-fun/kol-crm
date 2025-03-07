import { generateUrl } from "@/utils";

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  const address = params.address;

  if (address) {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/report/data`;
      console.log("url:", url, address);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "cache-control": "no-cache, no-store, must-revalidate",
          pragma: "no-cache",
          expires: "0",
        },
        cache: "no-store",
        body: JSON.stringify({
          list: [
            {
              t: 1,
              v: address,
            },
          ],
        }),
      });
      const data = await res.json();
      console.log("report data:", data);
    } catch (error) {
      console.error("report data error:", error);
    }
  }

  const redirectUrl = generateUrl(`${process.env.NEXT_PUBLIC_REFERRAL_URL}`, {
    referral: address,
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectUrl,
    },
  });
}

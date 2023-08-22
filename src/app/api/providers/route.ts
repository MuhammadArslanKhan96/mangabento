import { NextResponse } from "next/server";
import { getProviders, insertDB, supabase, uploadFile } from "@/modules/";
import { headers } from "next/headers";

type ResponseData = {
    message: string;
};
/**
 * @swagger
 * /api/providers:
 *   get:
 *     description: Uploads providers from api to supabase
 *     tags:
 *          - Providers
 *     responses:
 *       200:
 *         description: { status: "sent" }
 *       400:
 *         description: Error
 *       401:
 *         description: Unauthorized
 */
export async function GET() {
    const providers = await getProviders();
      const headersList = headers();
  const token = headersList.get("Authorization");

  if(!token) {
    return new Response('Unauthorized', {
        status: 401
    })
  }

  const jwt = token?.split("Bearer ")[1];

  const {error} = await supabase.auth.getUser(jwt);

  if(error !== null) {
    return new Response('Invalid Token', {
        status: 400
    })
  }

    if (providers.length > 1) {
        const insertMultiple: { name: any; slug: any; base_url: any }[] = [];
        providers.forEach(async (item: any) => {
            insertMultiple.push({
                name: item.name,
                slug: item.slug,
                base_url: item.baseURL,
            });
        });
        insertDB({ table: "providers", data: insertMultiple });
    } else {
        insertDB({ table: "providers", data: providers });
    }

    return NextResponse.json({ status: "sent" });
}

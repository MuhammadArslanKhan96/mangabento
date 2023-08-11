import { NextResponse } from "next/server";
import { getProviders, insertDB, uploadFile } from "@/modules/";

type ResponseData = {
    message: string;
};
/**
 * @swagger
 * /api/providers:
 *   get:
 *     description: Uploads providers from api to supabase
 *     responses:
 *       200:
 *         description: { status: "sent" }
 */
export async function GET() {
    const providers = await getProviders();

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

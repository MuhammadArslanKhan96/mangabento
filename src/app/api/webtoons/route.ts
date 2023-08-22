import { NextResponse } from "next/server";
import { getProviders, insertDB, uploadFile, searchDB, getAllWebtoons, supabase } from "@/modules/";
import { headers } from "next/headers";

type ResponseData = {
    message: string;
};
/**
 * @swagger
 * /api/webtoons:
 *   get:
 *     description: Uploads books of all providers from api to supabase
 *     tags:
 *          - Webtoons
 *     responses:
 *       200:
 *         description: { status: "sent" }
 *       400:
 *         description: Error
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags:
 *          - Webtoons
 *     description: Uploads file to supabase storage just testing
 *     responses:
 *       200:
 *         description: { status: "sent", publicImageURL: "<imageURL>" }
 *       400:
 *         description: Error
 *       401:
 *         description: Unauthorized
 */
export async function GET() {
    const headersList = headers();
    const token = headersList.get("Authorization");

    if (!token) {
        return new Response("Unauthorized", {
            status: 401,
        });
    }

    const jwt = token?.split("Bearer ")[1];

    const { error } = await supabase.auth.getUser(jwt);

    if (error !== null) {
        return new Response("Invalid Token", {
            status: 400,
        });
    }
    const providers = await searchDB("providers");
    providers?.forEach(async (item: any) => {
        const list = await getAllWebtoons({ name: item.slug });
        list.forEach(async (item: any) => {
            //  const publicImgUrl = await uploadFile('webtoon_cover', item.slug, item.coverURL);
            insertDB({
                table: "webtoon_books",
                data: {
                    provider: item.provider,
                    genre: item.genre,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    synopsis: item.synopsis,
                    title: item.title,
                    cover: item.coverURL,
                    slug: item.slug,
                },
            });
        });
    });

    return NextResponse.json({ status: "sent" });
}

export async function POST(request: Request) {
    const coverURL = "https://cdn.shopify.com/s/files/1/0533/2089/files/JPEG-and-WebP.png";

    const publicImgUrl = await uploadFile("webtoon_cover", "test_name", coverURL);

    const headersList = headers();
    const token = headersList.get("Authorization");

    if (!token) {
        return new Response("Unauthorized", {
            status: 401,
        });
    }

    const jwt = token?.split("Bearer ")[1];

    const { error } = await supabase.auth.getUser(jwt);

    if (error !== null) {
        return new Response("Invalid Token", {
            status: 400,
        });
    }

    return NextResponse.json({ status: "sent", publicImgUrl });
}

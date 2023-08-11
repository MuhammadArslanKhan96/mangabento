import { NextResponse } from "next/server";
import { getProviders, insertDB, uploadFile, searchDB, getAllWebtoons } from "@/modules/";

type ResponseData = {
    message: string;
};
/**
 * @swagger
 * /api/webtoons:
 *   get:
 *     description: Uploads books of all providers from api to supabase
 *     responses:
 *       200:
 *         description: { status: "sent" }
 *   post:
 *     description: Uploads file to supabase storage just testing
 *     responses:
 *       200:
 *         description: { status: "sent", publicImageURL: "<imageURL>" }
 */
export async function GET() {
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
    return NextResponse.json({ status: "sent", publicImgUrl });
}

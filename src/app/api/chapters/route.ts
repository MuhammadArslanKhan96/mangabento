import { NextResponse } from "next/server";
import { insertDB, uploadFile, searchDB, getAllChapters, supabase } from "@/modules";
import throttledQueue from "throttled-queue";
import { headers } from "next/headers";

const throttle = throttledQueue(20, 60000, true); // at most 20 requests per minute.

/**
 * @swagger
 * /api/chapters:
 *   get:
 *     description: Uploads chapters of all provider's books from api to supabase
 *     tags:
 *          - Chapters
 *     responses:
 *       200:
 *         description: { status: "sent" }
 *       400:
 *         description: Error
 *       401:
 *         description: Unauthorized
 *     
 *   post:
 *     tags:
 *          - Chapters
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
    providers?.forEach(async (provider: any) => {
        const webtoons = await searchDB("webtoon_books");
        webtoons?.forEach(async (webtoon: any) => {
            var itemsProcessed = 0;
            const chapters = await throttle(() => getAllChapters({ name: webtoon.provider, webtoon: webtoon.slug }));
            chapters.forEach(async (item: any) => {
                itemsProcessed++;
                insertDB({
                    table: "webtoon_chapters",
                    data: {
                        provider_webtoons: item.provider_webtoon,
                        provider: webtoon.provider,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                        content: item.contentURL,
                        title: item.shortTitle,
                        fullTitle: item.fullTitle,
                        chapter: item.chapterNum,
                        source: item.sourceURL,
                        chapterNav: item.chapterNav,
                        slug: item.slug,
                    },
                });

                if (itemsProcessed === chapters.length) {
                    console.log(`Finished with ${webtoon.title}`);
                }
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

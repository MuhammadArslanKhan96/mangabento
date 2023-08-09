import { NextResponse } from "next/server";
import { insertDB, uploadFile, searchDB, getAllChapters } from "@/modules";
import throttledQueue from "throttled-queue";

const throttle = throttledQueue(20, 60000, true); // at most 20 requests per minute.

export async function GET() {
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

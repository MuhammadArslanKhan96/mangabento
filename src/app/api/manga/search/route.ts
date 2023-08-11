import { searchDB, searchDBPaginationWithKeyword } from "@/modules";
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/manga/search:
 *   get:
 *     parameters:
 *      - in: query
 *        name: from
 *        schema:
 *          type: integer
 *        description: List of manga from
 *      - in: query
 *        name: to
 *        schema:
 *          type: integer
 *        description: List of manga to
 *      - in: query
 *        name: keywords
 *        schema:
 *          type: integer
 *        description: Keywords to search
 *     description: Returns the list of available manga with specified keywords paginated if from and to not provided return 11 only
 *     responses:
 *       200:
 *         description: List of manga with specified keywords with provider and chapters
 */
export async function GET(req: { url: string }) {
    const { searchParams } = new URL(req.url);
    const from = Number(searchParams.get("from"));
    const to = Number(searchParams.get("to"));
    const keyword = searchParams.get("keywords");
    const providers = await searchDB("providers");
    const webtoons = await searchDBPaginationWithKeyword("webtoon_books", [from || 0, to || 10], keyword as string);
    const chapters = await searchDB("webtoon_chapters");
    let newwebtoons = webtoons?.map((i) => ({
        ...i,
        provider: providers?.filter((item) => item.slug === i.provider)[0],
        chapters: chapters?.filter((item) => item.provider_webtoons.split("_")[1] === i.slug),
    }));
    return NextResponse.json(newwebtoons);
}

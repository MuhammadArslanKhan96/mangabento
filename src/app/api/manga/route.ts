import { searchDB, searchDBPagination } from "@/modules";
import { NextResponse, NextRequest } from "next/server";
/**
 * @swagger
 * /api/manga:
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
 *     description: Returns the list of available manga paginated if from and to not provided return 11 only
 *     responses:
 *       200:
 *         description: List of manga with provider and chapters
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const from = Number(searchParams.get("from"));
    const to = Number(searchParams.get("to"));
    const providers = await searchDB("providers");
    const webtoons = await searchDBPagination("webtoon_books", [from || 0, to || 10]);
    const chapters = await searchDB("webtoon_chapters");
    let newwebtoons = webtoons?.map((i) => ({
        ...i,
        provider: providers?.filter((item) => item.slug === i.provider)[0],
        chapters: chapters?.filter((item) => item.provider_webtoons.split("_")[1] === i.slug),
    }));
    return NextResponse.json(newwebtoons);
}

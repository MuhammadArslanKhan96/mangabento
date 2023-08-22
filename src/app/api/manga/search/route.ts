import { searchDB, searchDBPaginationWithKeyword, supabase } from "@/modules";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
/**
 * @swagger
 * /api/manga/search:
 *   get:
 *     tags:
 *          - Manga
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
 *       400:
 *         description: Error
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: NextRequest) {
    
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

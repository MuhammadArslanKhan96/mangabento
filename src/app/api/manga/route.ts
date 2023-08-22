import { searchDB, searchDBPagination, supabase } from "@/modules";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
/**
 * @swagger
 * /api/manga:
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
 *     description: Returns the list of available manga paginated if from and to not provided return 11 only
 *     responses:
 *       200:
 *         description: List of manga with provider and chapters
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

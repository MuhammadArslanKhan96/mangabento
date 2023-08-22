import { searchDB, searchDBById, supabase } from "@/modules";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/manga/{id}/chapter/{chapterid}:
 *   get:
 *     tags:
 *          - Manga
 *     parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Manga Id
 *      - in: query
 *        name: chapterid
 *        schema:
 *          type: integer
 *        required: true
 *        description: Chapter Id
 *     description: Returns a specified manga's chapter
 *     responses:
 *       200:
 *         description: A specified manga's chapter
 *       400:
 *         description: Error
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: any, { params: { id, chapterid } }: { params: { id: string; chapterid: string } }) {
    
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
    const webtoon = await searchDBById("webtoon_books", Number(id));
    const chapters = await searchDB("webtoon_chapters");
    const chapter = chapters?.filter(
        (item) => item.provider_webtoons.split("_")[1] === webtoon?.slug && item.id === Number(chapterid)
    )[0];
    return NextResponse.json(chapter);
}

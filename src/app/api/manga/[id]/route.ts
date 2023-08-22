import { searchDB, searchDBById, supabase } from "@/modules";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
/**
 * @swagger
 * /api/manga/{id}:
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
 *     description: Returns a specified manga
 *     responses:
 *       200:
 *         description: Manga with provider and chapters
 *       400:
 *         description: Error
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
    
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
    const webtoon = await searchDBById("webtoon_books", Number(id));
    const chapters = await searchDB("webtoon_chapters");
    let newwebtoons = {
        ...webtoon,
        provider: providers?.filter((item) => item.slug === webtoon?.provider)[0],
        chapters: chapters?.filter((item) => item.provider_webtoons.split("_")[1] === webtoon?.slug),
    };
    return NextResponse.json(newwebtoons);
}

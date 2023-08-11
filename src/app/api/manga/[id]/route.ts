import { searchDB, searchDBById } from "@/modules";
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/manga/{id}:
 *   get:
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
 */
export async function GET(req: any, { params: { id } }: { params: { id: string } }) {
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

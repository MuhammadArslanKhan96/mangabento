import { NextResponse } from 'next/server';
import { getProviders, insertDB, uploadFile, searchDB, getAllWebtoons } from '@/modules/'

type ResponseData = {
    message: string;
};

export async function GET() {
    const providers = await searchDB('providers');
    providers?.forEach(async (item: any) => {
        const list = await getAllWebtoons({ name: item.slug });
        list.forEach(async (item: any) => {
            const publicImgUrl = await uploadFile('webtoons', item.slug, item.coverURL);
            insertDB({
                table: 'books',
                data: {
                    provider: item.provider,
                    genre: item.genre,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    synopsis: item.synopsis,
                    title: item.title,
                    cover: publicImgUrl,
                    slug: item.slug,
                }
            })
        });
    })

    return NextResponse.json({ status: 'sent' });
}

export async function POST(request: Request) {

}
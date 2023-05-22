interface FetchParams {
    endpoint: string;
    method?: string;
    parameters?: any;
}

interface Search {
    q: string;
    limit?: number;
}

interface Providers {
    name: string;
}

interface WebtoonChapters {
    name: string;
    webtoon: string;
}

interface InsertDB {
    table: string;
    data: any;
}

export type { FetchParams, Search, Providers, WebtoonChapters, InsertDB }
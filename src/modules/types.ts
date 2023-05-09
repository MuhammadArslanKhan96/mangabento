interface FetchParams {
    endpoint: string;
    method?: string;
}

interface Search {
    q: string;
    limit?: number;
}

export type { FetchParams, Search }
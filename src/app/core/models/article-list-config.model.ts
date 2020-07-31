export interface ArticleListConfig {
    type: string;
    filters: {
        tag?: string,
        title?: string,
        author?: string,
        liked?: string,
        readLater?: string,
        archived?: string,
        limit?: number,
        offset?: number
    };
}

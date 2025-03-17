export declare const paginate: (model: string, customFilter?: any, page?: number, limit?: number) => Promise<{
    pagination: {
        totalPages: number;
        totalItems: any;
        page: number;
        limit: number;
    };
    data: any;
}>;

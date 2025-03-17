import { PrismaClient } from '@prisma/client';
declare const prisma: PrismaClient<{
    log: {
        level: "query";
        emit: "event";
    }[];
}, "query", import("@prisma/client/runtime/library").DefaultArgs>;
export default prisma;

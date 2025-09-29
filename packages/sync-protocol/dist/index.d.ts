import { z } from 'zod';
export declare const EntityBase: z.ZodObject<{
    id: z.ZodString;
    updatedAt: z.ZodString;
    rev: z.ZodNumber;
    updatedBy: z.ZodEnum<["cloud", "local"]>;
    checksum: z.ZodString;
    deletedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    rev: number;
    updatedAt: string;
    updatedBy: "cloud" | "local";
    checksum: string;
    deletedAt?: string | null | undefined;
}, {
    id: string;
    rev: number;
    updatedAt: string;
    updatedBy: "cloud" | "local";
    checksum: string;
    deletedAt?: string | null | undefined;
}>;
export type TEntityBase = z.infer<typeof EntityBase>;
export declare const Product: z.ZodObject<{
    id: z.ZodString;
    updatedAt: z.ZodString;
    rev: z.ZodNumber;
    updatedBy: z.ZodEnum<["cloud", "local"]>;
    checksum: z.ZodString;
    deletedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
} & {
    name: z.ZodString;
    price: z.ZodNumber;
    enabled: z.ZodBoolean;
    description: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    rev: number;
    updatedAt: string;
    updatedBy: "cloud" | "local";
    checksum: string;
    name: string;
    price: number;
    enabled: boolean;
    deletedAt?: string | null | undefined;
    description?: string | undefined;
    categoryId?: string | undefined;
}, {
    id: string;
    rev: number;
    updatedAt: string;
    updatedBy: "cloud" | "local";
    checksum: string;
    name: string;
    price: number;
    enabled: boolean;
    deletedAt?: string | null | undefined;
    description?: string | undefined;
    categoryId?: string | undefined;
}>;
export type TProduct = z.infer<typeof Product>;
export declare const Category: z.ZodObject<{
    id: z.ZodString;
    updatedAt: z.ZodString;
    rev: z.ZodNumber;
    updatedBy: z.ZodEnum<["cloud", "local"]>;
    checksum: z.ZodString;
    deletedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
} & {
    name: z.ZodString;
    slug: z.ZodString;
    enabled: z.ZodBoolean;
    description: z.ZodOptional<z.ZodString>;
    parentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    rev: number;
    updatedAt: string;
    updatedBy: "cloud" | "local";
    checksum: string;
    name: string;
    enabled: boolean;
    slug: string;
    deletedAt?: string | null | undefined;
    description?: string | undefined;
    parentId?: string | undefined;
}, {
    id: string;
    rev: number;
    updatedAt: string;
    updatedBy: "cloud" | "local";
    checksum: string;
    name: string;
    enabled: boolean;
    slug: string;
    deletedAt?: string | null | undefined;
    description?: string | undefined;
    parentId?: string | undefined;
}>;
export type TCategory = z.infer<typeof Category>;
declare const ChangeSchema: z.ZodObject<{
    entity: z.ZodEnum<["product", "category"]>;
    op: z.ZodEnum<["upsert", "delete"]>;
    data: z.ZodUnion<[z.ZodObject<{
        id: z.ZodString;
        updatedAt: z.ZodString;
        rev: z.ZodNumber;
        updatedBy: z.ZodEnum<["cloud", "local"]>;
        checksum: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    } & {
        name: z.ZodString;
        price: z.ZodNumber;
        enabled: z.ZodBoolean;
        description: z.ZodOptional<z.ZodString>;
        categoryId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        rev: number;
        updatedAt: string;
        updatedBy: "cloud" | "local";
        checksum: string;
        name: string;
        price: number;
        enabled: boolean;
        deletedAt?: string | null | undefined;
        description?: string | undefined;
        categoryId?: string | undefined;
    }, {
        id: string;
        rev: number;
        updatedAt: string;
        updatedBy: "cloud" | "local";
        checksum: string;
        name: string;
        price: number;
        enabled: boolean;
        deletedAt?: string | null | undefined;
        description?: string | undefined;
        categoryId?: string | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        updatedAt: z.ZodString;
        rev: z.ZodNumber;
        updatedBy: z.ZodEnum<["cloud", "local"]>;
        checksum: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    } & {
        name: z.ZodString;
        slug: z.ZodString;
        enabled: z.ZodBoolean;
        description: z.ZodOptional<z.ZodString>;
        parentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        rev: number;
        updatedAt: string;
        updatedBy: "cloud" | "local";
        checksum: string;
        name: string;
        enabled: boolean;
        slug: string;
        deletedAt?: string | null | undefined;
        description?: string | undefined;
        parentId?: string | undefined;
    }, {
        id: string;
        rev: number;
        updatedAt: string;
        updatedBy: "cloud" | "local";
        checksum: string;
        name: string;
        enabled: boolean;
        slug: string;
        deletedAt?: string | null | undefined;
        description?: string | undefined;
        parentId?: string | undefined;
    }>]>;
}, "strip", z.ZodTypeAny, {
    entity: "product" | "category";
    op: "upsert" | "delete";
    data: {
        id: string;
        rev: number;
        updatedAt: string;
        updatedBy: "cloud" | "local";
        checksum: string;
        name: string;
        price: number;
        enabled: boolean;
        deletedAt?: string | null | undefined;
        description?: string | undefined;
        categoryId?: string | undefined;
    } | {
        id: string;
        rev: number;
        updatedAt: string;
        updatedBy: "cloud" | "local";
        checksum: string;
        name: string;
        enabled: boolean;
        slug: string;
        deletedAt?: string | null | undefined;
        description?: string | undefined;
        parentId?: string | undefined;
    };
}, {
    entity: "product" | "category";
    op: "upsert" | "delete";
    data: {
        id: string;
        rev: number;
        updatedAt: string;
        updatedBy: "cloud" | "local";
        checksum: string;
        name: string;
        price: number;
        enabled: boolean;
        deletedAt?: string | null | undefined;
        description?: string | undefined;
        categoryId?: string | undefined;
    } | {
        id: string;
        rev: number;
        updatedAt: string;
        updatedBy: "cloud" | "local";
        checksum: string;
        name: string;
        enabled: boolean;
        slug: string;
        deletedAt?: string | null | undefined;
        description?: string | undefined;
        parentId?: string | undefined;
    };
}>;
export type TChange = z.infer<typeof ChangeSchema>;
declare const ChangeBatchSchema: z.ZodObject<{
    clientRev: z.ZodNumber;
    changes: z.ZodArray<z.ZodObject<{
        entity: z.ZodEnum<["product", "category"]>;
        op: z.ZodEnum<["upsert", "delete"]>;
        data: z.ZodUnion<[z.ZodObject<{
            id: z.ZodString;
            updatedAt: z.ZodString;
            rev: z.ZodNumber;
            updatedBy: z.ZodEnum<["cloud", "local"]>;
            checksum: z.ZodString;
            deletedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        } & {
            name: z.ZodString;
            price: z.ZodNumber;
            enabled: z.ZodBoolean;
            description: z.ZodOptional<z.ZodString>;
            categoryId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            price: number;
            enabled: boolean;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            categoryId?: string | undefined;
        }, {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            price: number;
            enabled: boolean;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            categoryId?: string | undefined;
        }>, z.ZodObject<{
            id: z.ZodString;
            updatedAt: z.ZodString;
            rev: z.ZodNumber;
            updatedBy: z.ZodEnum<["cloud", "local"]>;
            checksum: z.ZodString;
            deletedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        } & {
            name: z.ZodString;
            slug: z.ZodString;
            enabled: z.ZodBoolean;
            description: z.ZodOptional<z.ZodString>;
            parentId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            enabled: boolean;
            slug: string;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            parentId?: string | undefined;
        }, {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            enabled: boolean;
            slug: string;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            parentId?: string | undefined;
        }>]>;
    }, "strip", z.ZodTypeAny, {
        entity: "product" | "category";
        op: "upsert" | "delete";
        data: {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            price: number;
            enabled: boolean;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            categoryId?: string | undefined;
        } | {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            enabled: boolean;
            slug: string;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            parentId?: string | undefined;
        };
    }, {
        entity: "product" | "category";
        op: "upsert" | "delete";
        data: {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            price: number;
            enabled: boolean;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            categoryId?: string | undefined;
        } | {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            enabled: boolean;
            slug: string;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            parentId?: string | undefined;
        };
    }>, "many">;
    clientId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    clientRev: number;
    changes: {
        entity: "product" | "category";
        op: "upsert" | "delete";
        data: {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            price: number;
            enabled: boolean;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            categoryId?: string | undefined;
        } | {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            enabled: boolean;
            slug: string;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            parentId?: string | undefined;
        };
    }[];
    clientId?: string | undefined;
}, {
    clientRev: number;
    changes: {
        entity: "product" | "category";
        op: "upsert" | "delete";
        data: {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            price: number;
            enabled: boolean;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            categoryId?: string | undefined;
        } | {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            enabled: boolean;
            slug: string;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            parentId?: string | undefined;
        };
    }[];
    clientId?: string | undefined;
}>;
export type TChangeBatch = z.infer<typeof ChangeBatchSchema>;
declare const SyncPullResponseSchema: z.ZodObject<{
    sinceRev: z.ZodNumber;
    latestRev: z.ZodNumber;
    changes: z.ZodArray<z.ZodObject<{
        entity: z.ZodEnum<["product", "category"]>;
        op: z.ZodEnum<["upsert", "delete"]>;
        data: z.ZodUnion<[z.ZodObject<{
            id: z.ZodString;
            updatedAt: z.ZodString;
            rev: z.ZodNumber;
            updatedBy: z.ZodEnum<["cloud", "local"]>;
            checksum: z.ZodString;
            deletedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        } & {
            name: z.ZodString;
            price: z.ZodNumber;
            enabled: z.ZodBoolean;
            description: z.ZodOptional<z.ZodString>;
            categoryId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            price: number;
            enabled: boolean;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            categoryId?: string | undefined;
        }, {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            price: number;
            enabled: boolean;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            categoryId?: string | undefined;
        }>, z.ZodObject<{
            id: z.ZodString;
            updatedAt: z.ZodString;
            rev: z.ZodNumber;
            updatedBy: z.ZodEnum<["cloud", "local"]>;
            checksum: z.ZodString;
            deletedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        } & {
            name: z.ZodString;
            slug: z.ZodString;
            enabled: z.ZodBoolean;
            description: z.ZodOptional<z.ZodString>;
            parentId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            enabled: boolean;
            slug: string;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            parentId?: string | undefined;
        }, {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            enabled: boolean;
            slug: string;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            parentId?: string | undefined;
        }>]>;
    }, "strip", z.ZodTypeAny, {
        entity: "product" | "category";
        op: "upsert" | "delete";
        data: {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            price: number;
            enabled: boolean;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            categoryId?: string | undefined;
        } | {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            enabled: boolean;
            slug: string;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            parentId?: string | undefined;
        };
    }, {
        entity: "product" | "category";
        op: "upsert" | "delete";
        data: {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            price: number;
            enabled: boolean;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            categoryId?: string | undefined;
        } | {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            enabled: boolean;
            slug: string;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            parentId?: string | undefined;
        };
    }>, "many">;
    hasMore: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    changes: {
        entity: "product" | "category";
        op: "upsert" | "delete";
        data: {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            price: number;
            enabled: boolean;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            categoryId?: string | undefined;
        } | {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            enabled: boolean;
            slug: string;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            parentId?: string | undefined;
        };
    }[];
    sinceRev: number;
    latestRev: number;
    hasMore: boolean;
}, {
    changes: {
        entity: "product" | "category";
        op: "upsert" | "delete";
        data: {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            price: number;
            enabled: boolean;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            categoryId?: string | undefined;
        } | {
            id: string;
            rev: number;
            updatedAt: string;
            updatedBy: "cloud" | "local";
            checksum: string;
            name: string;
            enabled: boolean;
            slug: string;
            deletedAt?: string | null | undefined;
            description?: string | undefined;
            parentId?: string | undefined;
        };
    }[];
    sinceRev: number;
    latestRev: number;
    hasMore?: boolean | undefined;
}>;
export type TSyncPullResponse = z.infer<typeof SyncPullResponseSchema>;
declare const SyncPushResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    conflicts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        entity: z.ZodString;
        id: z.ZodString;
        currentRev: z.ZodNumber;
        incomingRev: z.ZodNumber;
        decided: z.ZodEnum<["current", "incoming"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        entity: string;
        currentRev: number;
        incomingRev: number;
        decided: "current" | "incoming";
    }, {
        id: string;
        entity: string;
        currentRev: number;
        incomingRev: number;
        decided: "current" | "incoming";
    }>, "many">>;
    appliedCount: z.ZodNumber;
    latestRev: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    latestRev: number;
    success: boolean;
    appliedCount: number;
    conflicts?: {
        id: string;
        entity: string;
        currentRev: number;
        incomingRev: number;
        decided: "current" | "incoming";
    }[] | undefined;
}, {
    latestRev: number;
    success: boolean;
    appliedCount: number;
    conflicts?: {
        id: string;
        entity: string;
        currentRev: number;
        incomingRev: number;
        decided: "current" | "incoming";
    }[] | undefined;
}>;
export type TSyncPushResponse = z.infer<typeof SyncPushResponseSchema>;
export declare const RevisionLog: z.ZodObject<{
    id: z.ZodString;
    entity: z.ZodString;
    entityId: z.ZodString;
    cloudRev: z.ZodNumber;
    localRev: z.ZodNumber;
    decided: z.ZodEnum<["cloud", "local"]>;
    cloudData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    localData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    at: string;
    entity: string;
    decided: "cloud" | "local";
    entityId: string;
    cloudRev: number;
    localRev: number;
    cloudData?: Record<string, any> | undefined;
    localData?: Record<string, any> | undefined;
}, {
    id: string;
    at: string;
    entity: string;
    decided: "cloud" | "local";
    entityId: string;
    cloudRev: number;
    localRev: number;
    cloudData?: Record<string, any> | undefined;
    localData?: Record<string, any> | undefined;
}>;
export type TRevisionLog = z.infer<typeof RevisionLog>;
export declare const RealtimeEvent: z.ZodObject<{
    type: z.ZodString;
    entity: z.ZodString;
    entityId: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    entity: string;
    entityId: string;
    timestamp: string;
    data?: Record<string, any> | undefined;
}, {
    type: string;
    entity: string;
    entityId: string;
    timestamp: string;
    data?: Record<string, any> | undefined;
}>;
export type TRealtimeEvent = z.infer<typeof RealtimeEvent>;
export * from './hash';
export * from './http';
export * from './conflict';
export { ChangeBatchSchema as ChangeBatch };
export { ChangeSchema as Change };
export { SyncPullResponseSchema as SyncPullResponse };
export { SyncPushResponseSchema as SyncPushResponse };
export type { TSyncPushResponse as SyncPushResponseType };
export type { TSyncPullResponse as SyncPullResponseType };
export type { TChangeBatch as ChangeBatchType };
export type { TChange as ChangeType };

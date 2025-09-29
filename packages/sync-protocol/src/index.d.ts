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
        decided: "current" | "incoming";
        currentRev: number;
        incomingRev: number;
    }, {
        id: string;
        entity: string;
        decided: "current" | "incoming";
        currentRev: number;
        incomingRev: number;
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
        decided: "current" | "incoming";
        currentRev: number;
        incomingRev: number;
    }[] | undefined;
}, {
    latestRev: number;
    success: boolean;
    appliedCount: number;
    conflicts?: {
        id: string;
        entity: string;
        decided: "current" | "incoming";
        currentRev: number;
        incomingRev: number;
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
    entity: string;
    entityId: string;
    cloudRev: number;
    localRev: number;
    decided: "cloud" | "local";
    at: string;
    cloudData?: Record<string, any> | undefined;
    localData?: Record<string, any> | undefined;
}, {
    id: string;
    entity: string;
    entityId: string;
    cloudRev: number;
    localRev: number;
    decided: "cloud" | "local";
    at: string;
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
    entity: string;
    entityId: string;
    type: string;
    timestamp: string;
    data?: Record<string, any> | undefined;
}, {
    entity: string;
    entityId: string;
    type: string;
    timestamp: string;
    data?: Record<string, any> | undefined;
}>;
export type TRealtimeEvent = z.infer<typeof RealtimeEvent>;
export * from './hash';
export * from './http';
export * from './conflict';
export type { TSyncPushResponse as SyncPushResponse };
export type { TSyncPullResponse as SyncPullResponse };
export type { TChangeBatch as ChangeBatch };
export type { TChange as Change };

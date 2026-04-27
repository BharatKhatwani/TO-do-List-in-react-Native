import type { Document } from 'mongoose';
export interface ITodo extends Document {
    text: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=index.d.ts.map
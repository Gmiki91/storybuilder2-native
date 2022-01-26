import { Level } from "./LanguageLevels";

export type Story = {
    _id:string;
    title: string;
    description: string;
    language: string;
    level: Level;
    authorId: string;
    rating: number;
    updatedAt: Date;
    openEnded: boolean;
    pageIds: string[];
    pendingPageIds: string[]
}
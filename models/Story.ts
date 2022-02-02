import { Level } from "./LanguageLevels";
type Rate ='Terrible'|'Bad'|'Mixed'|'Good'|'Excellent';
export type Story = {
    _id:string;
    title: string;
    description: string;
    language: string;
    level: Level;
    authorId: string;
    authorName: string;
    rating: {
        positive:number,
        total:number,
        average:Rate
    }
    updatedAt: Date;
    openEnded: boolean;
    pageIds: string[];
    pendingPageIds: string[]
}
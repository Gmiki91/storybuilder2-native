import { Level,LanguageModel } from "./LanguageData";
type Rate ='Terrible'|'Bad'|'Mixed'|'Good'|'Excellent';
export type Story = {
    _id:string;
    title: string;
    description: string;
    language: LanguageModel;
    level: Level;
    authorId: string;
    authorName: string;
    rating: {
        positive:number,
        total:number,
        average:Rate
    }
    updatedAt: number;
    open: boolean;
    pageIds: string[];
    pendingPageIds: string[];
    word1: string;
    word2: string;
    word3: string;
}
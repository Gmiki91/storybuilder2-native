import { Level } from "./LanguageLevels";

export type Page = {
    _id:string
    text: string,
    language: string,
    level:Level,
    authorId: string,
    authorName: string,
    ratings: [{ userId: string, rate: number }]
}
import { Language } from "./LanguageData"

export type Rate = {
    userId: string, rate: number 
}
export type Page = {
    _id:string
    text: string,
    language: Language,
    authorId: string,
    authorName: string,
    ratings: [Rate]
}
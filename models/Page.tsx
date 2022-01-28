export type Page = {
    _id:string
    text: string,
    language: string,
    level: string,
    authorId: string,
    ratings: [{ userId: string, rate: number }]
}
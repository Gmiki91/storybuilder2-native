export type Rate = {
    userId: string, rate: number 
}
export type Page = {
    _id:string
    text: string,
    language: string,
    authorId: string,
    authorName: string,
    ratings: [Rate]
}
export type Rate = {
    userId: string, rate: number 
}
export type Page = {
    _id:string
    text: string,
    authorId: string,
    authorName: string,
    language:string,
    ratings: [Rate]
}
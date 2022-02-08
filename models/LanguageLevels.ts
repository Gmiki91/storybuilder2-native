export type LevelText = 'Beginner'|'Lower-intermediate'| 'Intermediate'|'Upper-intermediate'|'Advanced'|'Native';
export type LevelCode = 'A' | 'A+'|'B' | 'B+'| 'C' | 'N';
export type Level ={
    text:LevelText, code:LevelCode
}
export const levels:{text:LevelText,code:LevelCode}[]=[
    {text:'Beginner', code:'A'},
    { text:'Lower-intermediate', code:'A+'},
    { text:'Intermediate', code:'B'},
    { text:'Upper-intermediate', code:'B+'},
    { text:'Advanced', code:'C'},
    { text:'Native', code:'N'},
]

export const getLevelText = (code:LevelCode)=>{
   const level= levels
    .find(level=>level.code===code)
    return level?.text;
}

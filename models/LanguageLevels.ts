export type LevelText = 'Beginner'| 'Intermediate'|'Advanced';
export type LevelCode = 'A' | 'B' | 'C' ;
export type Level ={
    text:LevelText, code:LevelCode
}
export const levels:{text:LevelText,code:LevelCode}[]=[
    {text:'Beginner', code:'A'},
    { text:'Intermediate', code:'B'},
    { text:'Advanced', code:'C'},
]

export const getLevelText = (code:LevelCode)=>{
   const level= levels
    .find(level=>level.code===code)
    return level?.text;
}

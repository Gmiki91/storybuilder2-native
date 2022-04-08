export type Language = 'English' | 'French' | 'Spanish' | 'German' | 'Italian' | 'Chinese' | 'Japanese' | 'Arabic' | 'Turkish' | 'Russian' | 'Portuguese' |
    'Malay' | 'Korean' | 'Hindi' | 'Vietnamese' | 'Dutch' | 'Greek' | 'Irish' | 'Polish' | 'Romanian' | 'Czech' | 'Hungarian' | 'Welsh' | 'Ukrainian' | 'Hebrew' |
    'Danish' | 'Swedish' | 'Norwegian' | 'Finnish' | 'Bulgarian' | 'Croatian' | 'Esperanto' | 'Estonian' | 'Lithuanian' | 'Latvian' | 'Kazakh' | 'Macedonian' |
    'Serbian' | 'Slovak' | 'Slovene';
export const languages = [
    'English' , 'French' , 'Spanish' , 'German' , 'Italian' , 'Chinese' , 'Japanese' , 'Arabic' , 'Turkish' , 'Russian' , 'Portuguese' ,
    'Malay' , 'Korean' , 'Hindi' , 'Vietnamese' , 'Dutch' , 'Greek' , 'Irish' , 'Polish' , 'Romanian' , 'Czech' , 'Hungarian' , 'Welsh' , 'Ukrainian' , 'Hebrew' ,
    'Danish' , 'Swedish' , 'Norwegian' , 'Finnish' , 'Bulgarian' , 'Croatian' , 'Esperanto' , 'Estonian' , 'Lithuanian' , 'Latvian' , 'Kazakh' , 'Macedonian' ,
    'Serbian' , 'Slovak' , 'Slovene'
]
export type LevelText = 'Beginner' | 'Intermediate' | 'Advanced';
export type LevelCode = 'A' | 'B' | 'C';
export type Level = {
    text: LevelText, code: LevelCode
}
export const levels: { text: LevelText, code: LevelCode }[] = [
    { text: 'Beginner', code: 'A' },
    { text: 'Intermediate', code: 'B' },
    { text: 'Advanced', code: 'C' },
]
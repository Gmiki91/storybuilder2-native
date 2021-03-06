export type Language = 'Arabic' | 'Bulgarian' | 'Chinese' | 'Croatian' | 'Czech' | 'Danish' | 'Dutch' | 'English' |
    'Esperanto' | 'Estonian' | 'Finnish' | 'French' | 'German' | 'Greek' | 'Hebrew' | 'Hindi' | 'Hungarian' | 'Irish' |
    'Italian' | 'Japanese' | 'Kazakh' | 'Korean' | 'Ladino' | 'Latvian' | 'Lithuanian' | 'Macedonian' | 'Malay' | 'Norwegian' | 'Persian' |
    'Polish' | 'Portuguese' | 'Romanian' | 'Russian' | 'Serbian' | 'Slovak' | 'Slovene' | 'Spanish' | 'Swedish' |
    'Thai' | 'Turkish' | 'Ukrainian' | 'Vietnamese' | 'Yiddish';
export type LanguageModel = {
    text: Language,
    code: string
}
export const languages: LanguageModel[] = [
    { text: 'English', code: '🇬🇧'},
    { text: 'Arabic', code: '🇦🇪'},
    { text: 'Bulgarian', code: '🇧🇬'},
    { text: 'Chinese', code: '🇨🇳'},
    { text: 'Croatian', code: '🇭🇷' },
    { text: 'Czech', code: '🇨🇿'},
    { text: 'Danish', code: '🇩🇰' },
    { text: 'Dutch', code: '🇳🇱'},
    // {text:'Esperanto',code:'' },
    { text: 'Estonian', code: '🇪🇪'},
    { text: 'Finnish', code: '🇫🇮'},
    { text: 'French', code: '🇫🇷'},
    { text: 'German', code: '🇩🇪'},
    { text: 'Greek', code: '🇬🇷' },
    { text: 'Hebrew', code: '🇮🇱' },
    { text: 'Hindi', code: '🇮🇳'},
    { text: 'Hungarian', code: '🇭🇺' },
    { text: 'Irish', code: '🇮🇪' },
    { text: 'Italian', code: '🇮🇹' },
    { text: 'Japanese', code: '🇯🇵' },
    { text: 'Kazakh', code: '🇰🇿' },
    { text: 'Korean', code: '🇰🇷' },
    { text: 'Ladino', code: ''},
    { text: 'Latvian', code: '🇱🇻' },
    { text: 'Lithuanian', code: '🇱🇹' },
    { text: 'Macedonian', code: '🇲🇰' },
    { text: 'Malay', code: '🇲🇾' },
    { text: 'Norwegian', code: '🇳🇴' },
    { text: 'Persian', code: '🇮🇷' },
    { text: 'Polish', code: '🇵🇱' },
    { text: 'Portuguese', code: '🇵🇹' },
    { text: 'Romanian', code: '🇷🇴' },
    { text: 'Russian', code: '🇷🇺'},
    { text: 'Serbian', code: '🇷🇸'},
    { text: 'Slovak', code: '🇸🇰'},
    { text: 'Slovene', code: '🇸🇮'},
    { text: 'Spanish', code: '🇪🇸'},
    { text: 'Swedish', code: '🇸🇪'},
    { text: 'Thai', code: '🇹🇭'},
    { text: 'Turkish', code: '🇹🇷' },
    { text: 'Ukrainian', code: '🇺🇦' },
    { text: 'Vietnamese', code: '🇻🇳' },
    { text: 'Yiddish', code: '' }
];

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
import { StoryCard } from "./StoryCard";
import { Story } from "../models/Story";
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

type Props = {
    stories: Story[];
    favoriteIds: string[];
    removeFromFavorites:(storyId:string)=>void;
    addToFavorites:(storyId:string)=>void;
}

export const StoryList: React.FC<Props> = ({ stories, favoriteIds, addToFavorites, removeFromFavorites }) => {
    const navigation = useNavigation();
    return <>
        {stories.map(story =>
            <StoryCard
                favorite={favoriteIds.includes(story._id)}
                addToFavorites={()=>addToFavorites(story._id)}
                removeFromFavorites={()=>removeFromFavorites(story._id)}
                story={story}
                key={story._id}
                onClick={() => navigation.dispatch( CommonActions.navigate({name:'StoryScreen', params:{storyId:story._id}}))}
            />
        )}
    </>
}
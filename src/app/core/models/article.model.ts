import { Profile } from './profile.model';
export interface Article {
    slug: string;
    title: string;
    description: string;
    imageUrl: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string;
    liked: boolean;
    likeCount: number;
    author: Profile;
}

import { Profile } from './profile.model';

export interface Comment {
    id: string;
    body: string;
    dateCreated: string;
    author: Profile;
}

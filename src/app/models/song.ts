import { Album } from "./album";
import { Author } from "./author";

export interface Song {
    id: number;
    author: Author;
    album: Album;
    song_name_mm: string;
    song_name_en: string;
    view_count: number;
    file : string;
    is_new: number;
    is_popular: number;
}
import { EditorNode } from '.';


export interface EditorParser {
    serialize(tree: EditorNode): string;
    parse(hmtl?: string): EditorNode;
}

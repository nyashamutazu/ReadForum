import { EditorType } from '../models';

export class EditorNode {
    constructor(public type: EditorType = EditorType.NONE, public value?: any) {}

    public children: Array<EditorNode | string> = [];
}

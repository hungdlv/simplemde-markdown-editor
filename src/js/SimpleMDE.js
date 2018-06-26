import { isReadonly } from './utils/editor';

export default class SimpleMDE {
    constructor(options) {
        this.options = options;
        this.codemirror = null;
        this.el = null;
        this.textarea = null;
        this.previewer = null;
        this.sidePreviewer = null;
        this.toolbar = null;
        this.statusbar = null;
    }

    isReadonly() {
        return isReadonly(this);
    }

    value(val) {
        if (val === undefined) {
            return this.codemirror.getValue();
        }

        this.codemirror.getDoc().setValue(val);

        return this;
    }
}

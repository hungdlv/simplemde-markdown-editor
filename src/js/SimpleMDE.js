import { isReadonly } from './utils/editor';

export default class SimpleMDE {
    constructor(options) {
        this.options = options;
        this.codemirror = null;
        this.element = null;
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

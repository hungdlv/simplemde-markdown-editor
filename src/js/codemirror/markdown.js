import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple';

CodeMirror.defineSimpleMode('markdown', {
    start: [
        {
            regex: /([*,_]{2})((?!\s)[^*,_]+[^\s])\1/,
            token: ['delimiter', 'strong', 'delimiter']
        },
        {
            regex: /([*,_]{1})((?!\s)[^*,_]+[^\s])\1/,
            token: ['delimiter', 'italic', 'delimiter']
        },
        {
            regex: /```([a-z]*)/,
            sol: true,
            token: 'prism',
            mode: {
                spec: {
                    token: (stream, state) => {
                        console.log(stream, state);
                        return 'prism';
                    }
                },
                end: /```/
            }
        }
    ]
});

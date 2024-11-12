import { trim } from 'lodash';

const formatVodContent = (content) => {
    return trim(content)
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll(/<\/?[^>]+>/g, '');
};

function formatStrByReg(pattern, str) {
    let matcher = pattern.exec(str);
    if (matcher !== null) {
        if (matcher.length >= 1) {
            if (matcher.length >= 1) return matcher[1];
        }
    }
    return '';
}

export { formatVodContent, formatStrByReg };

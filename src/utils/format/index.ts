const formatVodContent = (content) => {
    return content
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll(/<\/?[^>]+>/g, '');
};

export { formatVodContent };

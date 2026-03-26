const formatVodContent = (content: string) => {
    return content
        .trim()
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll(/<\/?[^>]+>/g, '');
};

export { formatVodContent };

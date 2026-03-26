interface MessageConstant {
    INFO: string;
    SUCCESS: string;
    ERROR: string;
}

export const CATEGORY_MESSAGE: MessageConstant = {
    INFO: '正在获取分类列表',
    SUCCESS: '获取分类列表成功',
    ERROR: '获取分类列表失败'
};

export const DETAIL_MESSAGE: MessageConstant = {
    INFO: '正在获取详情',
    SUCCESS: '获取详情成功',
    ERROR: '获取详情失败'
};

export const HOME_MESSAGE: MessageConstant = {
    INFO: '正在获取首页分类列表',
    SUCCESS: '获取首页分类列表成功',
    ERROR: '获取首页分类列表失败'
};

export const HOME_VOD_MESSAGE: MessageConstant = {
    INFO: '正在获取最近更新',
    SUCCESS: '获取最近更新成功',
    ERROR: '获取最近更新失败'
};

export const PLAY_MESSAGE: MessageConstant = {
    INFO: '正在获取播放地址',
    SUCCESS: '获取播放地址成功',
    ERROR: '获取播放地址失败'
};

export const SEARCH_MESSAGE: MessageConstant = {
    INFO: '正在搜索',
    SUCCESS: '搜索成功',
    ERROR: '搜索失败'
};

import { config } from '@/config';
import { HomeData, HomeVodData } from '@/types';

// 过滤首页分类数据
export const filterHomeData = (data: HomeData[]) => {
    const newList = data.filter((item) => !config.bannedKeywords.some((keyword) => item.type_name.includes(keyword)));
    return newList;
};

// 过滤最近更新数据
export const filterHomeVodData = (data: HomeVodData[]) => {
    const newList = data.filter((item) => !config.bannedKeywords.some((keyword) => item.type_name.includes(keyword)));
    return newList;
};

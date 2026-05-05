import Icon from '@ant-design/icons';
import { GetProps } from 'antd';

type CustomIconComponentProps = GetProps<typeof Icon>;

const SearchSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M480 128c192 0 352 160 352 352S672 832 480 832 128 672 128 480 288 128 480 128m0-64C249.6 64 64 249.6 64 480S249.6 896 480 896 896 710.4 896 480 710.4 64 480 64z"></path>
        <path d="M928 928m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"></path>
        <path d="M770.56 725.248l180.992 180.992-45.248 45.312-181.056-181.056z"></path>
    </svg>
);

const SearchIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={SearchSvg} {...props} />;

export default SearchIcon;

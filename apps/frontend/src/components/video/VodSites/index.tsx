import { Select } from 'antd';
import type { SelectProps } from 'antd';

import styles from './index.module.scss';

interface VodSitesProps {
    options: SelectProps['options'];
    value: string;
    onChange: (value: string) => void;
}

const VodSites: React.FC<VodSitesProps> = (props) => {
    const { options, value, onChange } = props;

    return (
        <div className={styles['vod-header-sites']}>
            {options && options.length > 0 && (
                <Select
                    styles={{
                        popup: {
                            root: {
                                minWidth: 130
                            }
                        }
                    }}
                    options={options}
                    defaultActiveFirstOption
                    variant="borderless"
                    value={value}
                    onChange={onChange}
                />
            )}
        </div>
    );
};

export default VodSites;

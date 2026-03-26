import { Modal } from 'antd';
import { Typography } from 'antd';
import { useState } from 'react';
import store from 'store2';

const { Paragraph } = Typography;

const Disclaimer: React.FC = () => {
    const [open, setOpen] = useState(() => !store.get('vod_next_disclaimer_agree'));

    return (
        <Modal
            title="🚨 免责声明"
            open={open}
            centered
            closeIcon={false}
            mask
            onOk={() => {
                setOpen(false);
                store.set('vod_next_disclaimer_agree', true);
            }}
            onCancel={() => {
                window.open('about:blank', '_self');
            }}
        >
            <Paragraph>1. 本项目是一个开源的视频播放器，仅供个人合法地学习和研究使用，严禁将其用于任何商业、违法或不当用途，否则由此产生的一切后果由用户自行承担。</Paragraph>
            <Paragraph>2.本项目不内置任何视频源，也不针对任何特定内容提供源，用户应自行判断视频源的合法性并承担相应责任，开发者对用户获取的的任何内容不承担任何责任。</Paragraph>
            <Paragraph>
                3. 用户在使用本项目时，必须完全遵守所在地区的法律法规，严禁将本项目服务用于任何非法用途，如传播违禁信息、侵犯他人知识版权、破坏网络安全等，否则由此产生的一切后果由用户自行承担。
            </Paragraph>
            <Paragraph>4. 用户使用本项目所产生的任何风险或损失(包括但不限于:系统故障、隐私泄露等)，开发者概不负责。用户应明确认知上述风险并自行防范。</Paragraph>
            <Paragraph>5.未尽事宜，均依照用户所在地区相关法律法规的规定执行。如本声明与当地法律法规存在冲突，应以法律法规为准。</Paragraph>
            <Paragraph>6.用户使用本项目即视为已阅读并同意本声明全部内容。开发者保留随时修订本声明的权利。本声明的最终解释权归本项目开发者所有。</Paragraph>
        </Modal>
    );
};

export default Disclaimer;

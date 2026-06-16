import { Image } from 'antd';
import React from 'react';

import { useStyles } from './styles';

import type { TmdbCastMember } from '@/types/tmdb';
import { getProfileUrl } from '@/utils/tmdb';

interface CastSectionProps {
    cast: TmdbCastMember[];
}

const CastSection: React.FC<CastSectionProps> = ({ cast }) => {
    const { styles } = useStyles();

    if (cast.length === 0) return null;

    return (
        <div className={styles.section}>
            <div className={styles.title}>演员</div>
            <div className={styles.scroll}>
                {cast.slice(0, 20).map((member) => (
                    <div key={member.id} className={styles.card}>
                        <Image
                            className={styles.avatar}
                            src={getProfileUrl(member.profilePath)}
                            alt={member.name}
                            preview={false}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAAAAXNSR0IArs4c6QAAAONJREFUaAXt2rENwjAQBdD/FYyAWIAJ2IMZYKDMEpSIEVgCJmAGJqDMAJQ0J0WUOHa+yLd8imT5n2NHdgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8CdL27aP1vpLKeVVSrmXUuZ93/fD932/55wzT4QQQgg9+vd+BQAAAAAAAAD4L8uyfOr7vi+Xy+V2u31LKZ+llOdcnHPOOeepJ0IIIYQe/fsVAAAAAAAAAMBfGYYh7vt+zDk/xhifY4znOefjnHMCAAAAAAAAAAD4P875KKUcpZRzKeUopZxLKQcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8wQuPLBzH4sGhOQAAAABJRU5ErkJggg=="
                        />
                        <div className={styles.name}>{member.name}</div>
                        <div className={styles.character}>{member.character}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CastSection;

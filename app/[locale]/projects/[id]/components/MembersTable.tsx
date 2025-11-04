'use client';

import {
    Avatar,
    Badge,
    Body1,
    Caption1,
    Spinner,
    Text,
    makeStyles,
    shorthands,
    tokens
} from '@fluentui/react-components';
import {
    PersonCircle20Regular
} from '@fluentui/react-icons';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import type { UserProjectResponse } from 'types/project.type';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('12px'),
    },
    memberItem: {
        ...shorthands.padding('16px'),
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('12px'),
        ...shorthands.transition('all', '0.2s', 'ease'),
        ':hover': {
            backgroundColor: tokens.colorNeutralBackground3,
            boxShadow: tokens.shadow4,
        },
    },
    memberInfo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('4px'),
    },
    memberName: {
        fontWeight: 600,
        fontSize: tokens.fontSizeBase300,
    },
    memberMeta: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
    },
    noContent: {
        color: tokens.colorNeutralForeground3,
        fontStyle: 'italic',
        textAlign: 'center',
        ...shorthands.padding('24px'),
    },
    placeholder: {
        ...shorthands.padding('48px', '32px'),
        textAlign: 'center',
        color: tokens.colorNeutralForeground3,
        backgroundColor: tokens.colorNeutralBackground3,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke2),
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.padding('32px'),
        ...shorthands.gap('12px'),
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        ...shorthands.borderBottom('2px', 'solid', tokens.colorNeutralStroke2),
    },
    headerContent: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('8px'),
    },
    headerIcon: {
        color: tokens.colorBrandForeground2,
        opacity: 0.8,
    },
    headerTitle: {
        fontSize: tokens.fontSizeBase400,
        fontWeight: 700,
        color: tokens.colorNeutralForeground1,
    },
});

interface MembersTableProps {
    members: UserProjectResponse[];
    isLoading?: boolean;
    onAddMember?: () => void;
    showAddButton?: boolean;
    formatDateTime?: (dateString: string | null) => string;
}

export function MembersTable({
    members,
    isLoading = false,
    onAddMember,
    showAddButton = true,
    formatDateTime,
}: MembersTableProps) {
    const styles = useStyles();
    const t = useTranslations('ProjectDetail');

    const defaultFormatDateTime = (dateString: string | null) => {
        if (!dateString) return t('noDate');
        try {
            return format(new Date(dateString), 'PPpp');
        } catch {
            return t('invalidDate');
        }
    };

    const formatDate = formatDateTime || defaultFormatDateTime;

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <Spinner size="small" />
                <Caption1>{t('loading')}</Caption1>
            </div>
        );
    }

    if (!members || members.length === 0) {
        return (
            <Body1 className={styles.noContent}>{t('noMembers')}</Body1>
        );
    }

    return (
        <div className={styles.container}>
            {members.map((member) => (
                <div key={member.user_id} className={styles.memberItem}>
                    <Avatar
                        icon={<PersonCircle20Regular />}
                        size={40}
                        aria-label={member.user?.name || 'Member'}
                    />
                    <div className={styles.memberInfo}>
                        <Text className={styles.memberName}>
                            {member.user?.name ||
                                member.user?.email ||
                                t('unknownUser')}
                        </Text>
                        <Caption1 className={styles.memberMeta}>
                            {t('joined')}: {formatDate(member.joined_at)}
                        </Caption1>
                    </div>
                    <Badge appearance="outline" size="small">
                        {member.role}
                    </Badge>
                </div>
            ))}
        </div>
    );
}

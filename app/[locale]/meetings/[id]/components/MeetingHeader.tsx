'use client';

import {
    Badge,
    Body1,
    Button,
    Caption1,
    Menu,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    Popover,
    PopoverSurface,
    PopoverTrigger,
    Text,
    makeStyles,
    shorthands,
    tokens,
} from '@fluentui/react-components';
import { useState } from 'react';
import {
    Archive20Regular,
    ArrowLeft20Regular,
    CalendarClock20Regular,
    Delete20Regular,
    Document20Regular,
    Edit20Regular,
    Info20Regular,
    Link20Regular,
    MoreVertical20Regular,
    People20Regular,
} from '@fluentui/react-icons';
import { useRouter } from 'next/navigation';
import type { MeetingWithProjects } from 'types/meeting.type';
import { formatDateTime } from './meetingDetailUtils';
import { useTranslations } from 'next-intl';

const useStyles = makeStyles({
    header: {
        marginBottom: '16px',
        ...shorthands.padding('16px'),
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
        boxShadow: tokens.shadow4,
    },
    titleRow: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        ...shorthands.gap('12px'),
        marginBottom: '0px',
        flexWrap: 'wrap',
    },
    titleSection: {
        display: 'flex',
        flexDirection: 'row',
        ...shorthands.gap('12px'),
        flex: 1,
        minWidth: '0',
        alignItems: 'center',
    },
    title: {
        fontSize: '22px',
        fontWeight: 700,
        color: tokens.colorNeutralForeground1,
        whiteSpace: 'nowrap',
    },
    badgesRow: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('8px'),
        flexWrap: 'wrap',
    },
    actionsRow: {
        display: 'flex',
        ...shorthands.gap('8px'),
        alignItems: 'center',
    },
    description: {
        lineHeight: '1.8',
        color: tokens.colorNeutralForeground1,
        fontSize: tokens.fontSizeBase300,
    },
    metaRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        ...shorthands.gap('16px'),
        ...shorthands.padding('16px'),
    },
    metaItem: {
        display: 'flex',
        alignItems: 'flex-start',
        ...shorthands.gap('12px'),
    },
    metaIcon: {
        color: tokens.colorBrandForeground2,
        marginTop: '2px',
        opacity: 0.8,
        flexShrink: 0,
    },
    metaContent: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('4px'),
    },
    metaLabel: {
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase200,
        fontWeight: 600,
    },
    metaValue: {
        fontWeight: 600,
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
    },
    infoButton: {
        minWidth: '40px',
    },
    metaPopoverSurface: {
        ...shorthands.padding('12px'),
        backgroundColor: tokens.colorNeutralBackground1,
        minWidth: '320px',
    },
});

interface MeetingHeaderProps {
    meeting: MeetingWithProjects;
    onEdit: () => void;
    onArchiveToggle: () => void;
    onDelete: () => void;
    isArchiving: boolean;
    isUnarchiving: boolean;
    isDeleting: boolean;
    tMeetings: (key: string) => string;
}

const getStatusBadge = (status: string, tMeetings: (key: string) => string) => {
    switch (status) {
        case 'active':
            return (
                <Badge appearance="filled" color="success" size="large">
                    {tMeetings('status.active')}
                </Badge>
            );
        case 'completed':
            return (
                <Badge appearance="filled" color="informative" size="large">
                    {tMeetings('status.completed')}
                </Badge>
            );
        case 'cancelled':
            return (
                <Badge appearance="filled" color="danger" size="large">
                    {tMeetings('status.cancelled')}
                </Badge>
            );
        case 'archived':
            return (
                <Badge appearance="outline" color="warning" size="large">
                    {tMeetings('status.archived')}
                </Badge>
            );
        default:
            return (
                <Badge appearance="outline" size="large">
                    {status}
                </Badge>
            );
    }
};

export function MeetingHeader({
    meeting,
    onEdit,
    onArchiveToggle,
    onDelete,
    isArchiving,
    isUnarchiving,
    isDeleting,
    tMeetings,
}: MeetingHeaderProps) {
    const styles = useStyles();
    const router = useRouter();
    const t = useTranslations('MeetingDetail');
    const [openMetadata, setOpenMetadata] = useState(false);

    return (
        <>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <div className={styles.titleSection}>
                        <Button
                            appearance="subtle"
                            icon={<ArrowLeft20Regular />}
                            onClick={() => router.push('/meetings')}
                            style={{ minWidth: '40px' }}
                        />
                        <Text className={styles.title}>
                            {meeting.title || tMeetings('untitledMeeting')}
                        </Text>
                        <div className={styles.badgesRow}>
                            {getStatusBadge(meeting.status, tMeetings)}
                            {meeting.is_personal && (
                                <Badge appearance="outline" size="large" color="brand">
                                    {tMeetings('badges.personal')}
                                </Badge>
                            )}
                            {meeting.url && (
                                <Badge
                                    appearance="outline"
                                    size="large"
                                    color="brand"
                                    icon={<Link20Regular />}
                                >
                                    {t('hasMeetingUrl')}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className={styles.actionsRow}>
                        <Popover open={openMetadata} onOpenChange={(e, data) => setOpenMetadata(data.open)}>
                            <PopoverTrigger disableButtonEnhancement>
                                <Button
                                    appearance="secondary"
                                    icon={<Info20Regular />}
                                    className={styles.infoButton}
                                    title={t('meetingDetails') || 'Meeting Details'}
                                />
                            </PopoverTrigger>
                            <PopoverSurface className={styles.metaPopoverSurface}>
                                <div className={styles.metaRow}>
                                    {meeting.start_time && (
                                        <div className={styles.metaItem}>
                                            <CalendarClock20Regular className={styles.metaIcon} />
                                            <div className={styles.metaContent}>
                                                <Caption1 className={styles.metaLabel}>
                                                    {t('startTime')}:
                                                </Caption1>
                                                <Body1 className={styles.metaValue}>
                                                    {formatDateTime(meeting.start_time, t)}
                                                </Body1>
                                            </div>
                                        </div>
                                    )}
                                    <div className={styles.metaItem}>
                                        <People20Regular className={styles.metaIcon} />
                                        <div className={styles.metaContent}>
                                            <Caption1 className={styles.metaLabel}>{t('projects')}:</Caption1>
                                            <Body1 className={styles.metaValue}>
                                                {t('projectsCount', {
                                                    count: meeting.projects?.length || 0,
                                                })}
                                            </Body1>
                                        </div>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <Document20Regular className={styles.metaIcon} />
                                        <div className={styles.metaContent}>
                                            <Caption1 className={styles.metaLabel}>
                                                {t('createdAt')}:
                                            </Caption1>
                                            <Body1 className={styles.metaValue}>
                                                {formatDateTime(meeting.created_at, t)}
                                            </Body1>
                                        </div>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <Document20Regular className={styles.metaIcon} />
                                        <div className={styles.metaContent}>
                                            <Caption1 className={styles.metaLabel}>
                                                {t('updatedAt')}:
                                            </Caption1>
                                            <Body1 className={styles.metaValue}>
                                                {formatDateTime(meeting.updated_at || null, t)}
                                            </Body1>
                                        </div>
                                    </div>
                                </div>
                            </PopoverSurface>
                        </Popover>
                        <Button
                            appearance="secondary"
                            icon={<Edit20Regular />}
                            onClick={onEdit}
                        >
                            {t('edit')}
                        </Button>
                        <Button
                            appearance="secondary"
                            icon={<Archive20Regular />}
                            onClick={onArchiveToggle}
                            disabled={isArchiving || isUnarchiving}
                        >
                            {meeting.status === 'archived' ? tMeetings('actions.unarchive') : tMeetings('actions.archive')}
                        </Button>
                        <Menu>
                            <MenuTrigger disableButtonEnhancement>
                                <Button appearance="subtle" icon={<MoreVertical20Regular />} />
                            </MenuTrigger>
                            <MenuPopover>
                                <MenuList>
                                    <MenuItem
                                        icon={<Delete20Regular />}
                                        onClick={onDelete}
                                        disabled={isDeleting}
                                    >
                                        {t('delete')}
                                    </MenuItem>
                                </MenuList>
                            </MenuPopover>
                        </Menu>
                    </div>
                </div>
            </div>
        </>
    );
}

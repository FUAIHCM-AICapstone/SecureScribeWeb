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
  tokens,
} from '@/lib/components';
import { PersonCircle20Regular } from '@/lib/icons';
import { formatDateTime as formatDateTimeUtil } from '@/lib/dateFormatter';
import { useTranslations } from 'next-intl';
import type { UserProjectResponse } from 'types/project.type';
import { MemberActionsMenu } from './MemberActionsMenu';

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
  formatDateTime?: (dateString: string | null) => string;
  currentUserRole?: string | null;
  projectId?: string;
  onMemberRemoved?: () => void;
  onMemberRoleChanged?: () => void;
}

export function MembersTable({
  members,
  isLoading = false,
  formatDateTime,
  currentUserRole,
  projectId,
  onMemberRemoved,
  onMemberRoleChanged,
}: MembersTableProps) {
  const styles = useStyles();
  const t = useTranslations('ProjectDetail');
  const tProjects = useTranslations('Projects');

  const defaultFormatDateTime = (dateString: string | null) => {
    if (!dateString) return t('noDate');
    try {
      return formatDateTimeUtil(dateString);
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
    return <Body1 className={styles.noContent}>{t('noMembers')}</Body1>;
  }

  const getRoleLabel = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'owner':
        return tProjects('roleOwner');
      case 'admin':
        return tProjects('roleAdmin');
      case 'member':
        return tProjects('roleMember');
      default:
        return role;
    }
  };

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
              {member.user?.name || member.user?.email || t('unknownUser')}
            </Text>
            <Caption1 className={styles.memberMeta}>
              {t('joined')}: {formatDate(member.joined_at)}
            </Caption1>
          </div>
          <Badge appearance="outline" size="small">
            {getRoleLabel(member.role)}
          </Badge>
          {projectId && (
            <MemberActionsMenu
              member={member}
              projectId={projectId}
              currentUserRole={currentUserRole}
              onMemberRemoved={onMemberRemoved}
              onMemberRoleChanged={onMemberRoleChanged}
            />
          )}
        </div>
      ))}
    </div>
  );
}

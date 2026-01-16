import {
  Body1,
  Dropdown,
  makeStyles,
  Option,
  OptionOnSelectData,
  SelectionEvents,
  Title1,
  tokens,
  Caption1,
} from '@fluentui/react-components';
import { DashboardPeriod, DashboardScope } from 'types/statistic.type';
import React from 'react';
import { useTranslations } from 'next-intl';
import {
  CalendarLtr24Regular,
  GridDots24Regular,
} from '@/lib/icons';

const useStyles = makeStyles({
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
    padding: '28px 32px',
    borderRadius: tokens.borderRadiusXLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow8,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    position: 'relative',
    overflow: 'hidden',
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    backgroundColor: tokens.colorBrandBackground,
  },
  welcomeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 1,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  welcomeTitle: {
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightBold,
    lineHeight: tokens.lineHeightHero900,
  },
  liveBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground1,
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
  },
  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorPaletteGreenForeground1,
  },
  welcomeSubtitle: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    maxWidth: '500px',
  },
  controls: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    zIndex: 1,
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  filterLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightMedium,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  filterIcon: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground4,
  },
  dropdown: {
    minWidth: '150px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusLarge,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
});

interface DashboardHeaderProps {
  scope: DashboardScope;
  period: DashboardPeriod;
  onScopeChange: (e: SelectionEvents, data: OptionOnSelectData) => void;
  onPeriodChange: (e: SelectionEvents, data: OptionOnSelectData) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  scope,
  period,
  onScopeChange,
  onPeriodChange,
}) => {
  const styles = useStyles();
  const t = useTranslations('Dashboard');

  const getScopeLabel = (scopeValue: DashboardScope) => {
    switch (scopeValue) {
      case DashboardScope.PERSONAL:
        return t('scopePersonal');
      case DashboardScope.PROJECT:
        return t('scopeProject');
      case DashboardScope.HYBRID:
        return t('scopeHybrid');
      default:
        return t('scopeHybrid');
    }
  };

  const getPeriodLabel = (periodValue: DashboardPeriod) => {
    switch (periodValue) {
      case DashboardPeriod.SEVEN_DAYS:
        return t('period7Days');
      case DashboardPeriod.THIRTY_DAYS:
        return t('period30Days');
      case DashboardPeriod.NINETY_DAYS:
        return t('period90Days');
      case DashboardPeriod.ALL_TIME:
        return t('periodAllTime');
      default:
        return t('period7Days');
    }
  };

  return (
    <div
      className={styles.headerContainer}
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div className={styles.headerAccent} />
      
      <div className={styles.welcomeSection}>
        <div className={styles.titleRow}>
          <Title1 className={styles.welcomeTitle}>{t('title')}</Title1>
          <div className={styles.liveBadge}>
            <div className={styles.liveDot} />
            {t('liveData')}
          </div>
        </div>
        <Body1 className={styles.welcomeSubtitle}>
          {t('description')}
        </Body1>
      </div>

      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <Caption1 className={styles.filterLabel}>
            <GridDots24Regular className={styles.filterIcon} />
            {t('scopeLabel')}
          </Caption1>
          <Dropdown
            placeholder={t('scopePlaceholder')}
            value={getScopeLabel(scope)}
            selectedOptions={[scope]}
            onOptionSelect={onScopeChange}
            className={styles.dropdown}
          >
            <Option value={DashboardScope.PERSONAL}>{t('scopePersonal')}</Option>
            <Option value={DashboardScope.PROJECT}>{t('scopeProject')}</Option>
            <Option value={DashboardScope.HYBRID}>{t('scopeHybrid')}</Option>
          </Dropdown>
        </div>
        <div className={styles.filterGroup}>
          <Caption1 className={styles.filterLabel}>
            <CalendarLtr24Regular className={styles.filterIcon} />
            {t('periodLabel')}
          </Caption1>
          <Dropdown
            placeholder={t('periodPlaceholder')}
            value={getPeriodLabel(period)}
            selectedOptions={[period]}
            onOptionSelect={onPeriodChange}
            className={styles.dropdown}
          >
            <Option value={DashboardPeriod.SEVEN_DAYS}>{t('period7Days')}</Option>
            <Option value={DashboardPeriod.THIRTY_DAYS}>{t('period30Days')}</Option>
            <Option value={DashboardPeriod.NINETY_DAYS}>{t('period90Days')}</Option>
            <Option value={DashboardPeriod.ALL_TIME}>{t('periodAllTime')}</Option>
          </Dropdown>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

import { makeStyles, tokens } from '@/lib/components';

export const useHeaderStyles = makeStyles({
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'var(--colorNeutralBackground1)',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    minWidth: 'fit-content',
    flexShrink: 0,
  },
  brandText: {
    '@media (max-width: 640px)': {
      display: 'none',
    },
  },
  grow: { flex: 1, minWidth: 0 },
  right: { display: 'flex', alignItems: 'center', gap: '8px' },
});

export const useSearchStyles = makeStyles({
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '400px',
    maxWidth: '800px',
    width: '60%',
    '@media (max-width: 1280px)': {
      minWidth: '300px',
      maxWidth: '500px',
      width: '50%',
    },
    '@media (max-width: 768px)': {
      minWidth: '250px',
      maxWidth: '400px',
      width: '100%',
    },
    '@media (max-width: 480px)': {
      minWidth: '200px',
      maxWidth: '300px',
      width: '100%',
    },
  },
  searchContainer: {
    position: 'relative',
    width: '100%',
    minHeight: '32px',
    '& .fui-SearchBox': {
      width: '100%',
      '& .fui-Input': {
        width: '100%',
      },
    },
  },
});

export const useActionButtonStyles = makeStyles({
  buttonText: {
    whiteSpace: 'nowrap',
    '@media (max-width: 1280px)': {
      display: 'none',
    },
  },
  actionButton: {
    justifyContent: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 'max-content',
  },
  scheduleButton: {
    justifyContent: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 'max-content',
  },
});

export const useBreadcrumbStyles = makeStyles({
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--colorNeutralForeground2)',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    '@media (max-width: 1280px)': {
      display: 'none',
    },
  },
});

export const useNotificationStyles = makeStyles({
  drawerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  drawerItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '10px 12px',
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: 'var(--colorNeutralBackground1)',
    cursor: 'pointer',
    transition: 'background .15s ease',
    ':hover': {
      backgroundColor: 'var(--colorNeutralBackground1Hover)',
    },
  },
  drawerItemHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    fontWeight: 600,
  },
  drawerItemSub: {
    color: 'var(--colorNeutralForeground3)',
  },
});

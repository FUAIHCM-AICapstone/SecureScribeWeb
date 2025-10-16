'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Avatar,
  Button,
  Field,
  Input,
  Textarea,
  Spinner,
  Card,
  CardHeader,
  CardPreview,
  makeStyles,
  tokens,
  Tooltip,
  shorthands,
} from '@fluentui/react-components';
import {
  Camera24Regular,
  CheckmarkCircle24Regular,
  ContactCard24Regular,
} from '@fluentui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe, updateMe } from '@/services/api/user';
import { uploadFile } from '@/services/api/file';
import type { User, UserUpdate } from 'types/user.type';
import { queryKeys } from '@/lib/queryClient';
import { showToast } from '@/hooks/useShowToast';
import { formatDate } from '@/lib/utils/dateFormatter';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('20px'),
    marginBottom: '32px',
    ...shorthands.padding('24px'),
    background:
      'linear-gradient(135deg, rgba(17, 94, 163, 0.03) 0%, rgba(91, 155, 213, 0.05) 100%)',
    ...shorthands.borderRadius('16px'),
    ...shorthands.border('1px', 'solid', 'rgba(17, 94, 163, 0.15)'),
    boxShadow: '0 2px 8px rgba(17, 94, 163, 0.08)',
    '@media (max-width: 768px)': {
      ...shorthands.padding('16px'),
    },
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('16px'),
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  iconBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    ...shorthands.borderRadius('12px'),
    background: 'linear-gradient(135deg, #115ea3 0%, #5b9bd5 100%)',
    boxShadow: '0 4px 12px rgba(17, 94, 163, 0.25)',
    color: '#ffffff',
  },
  title: {
    fontSize: tokens.fontSizeHero900,
    fontWeight: 700,
    color: '#115ea3',
  },
  subtitle: {
    color: tokens.colorNeutralForeground2,
    marginTop: '6px',
  },
  wrap: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '360px 1fr',
      alignItems: 'start',
    },
  },
  card: {
    backgroundColor: 'var(--colorNeutralBackground1)',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    boxShadow: tokens.shadow8,
    transitionProperty: 'box-shadow, transform',
    transitionDuration: '150ms',
  },
  avatarWrap: {
    position: 'relative',
    width: '160px',
    height: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: '100%',
    height: '100%',
    borderRadius: '9999px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: 'var(--colorNeutralBackground2)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarCamera: {
    position: 'absolute',
    right: '0px',
    bottom: '0px',
    transform: 'translate(20%, 20%)',
    borderRadius: '9999px',
    border: `2px solid ${tokens.colorNeutralBackground1}`,
    boxShadow: tokens.shadow16,
    zIndex: 10,
    minWidth: '40px',
    minHeight: '40px',
  },
  form: { display: 'grid', gap: '12px', maxWidth: '800px' },
  row: {
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: '1fr',
    '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr' },
  },
  actions: { display: 'flex', gap: '8px' },
  readOnlyRow: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    gap: '8px',
    alignItems: 'center',
    '@media (max-width: 640px)': { gridTemplateColumns: '1fr' },
  },
  readOnlyKey: { color: 'var(--colorNeutralForeground3)', fontSize: '12px' },
  readOnlyValue: { color: 'var(--colorNeutralForeground1)' },
  helper: { color: 'var(--colorNeutralForeground3)', fontSize: '12px' },
  liveRegion: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clip: 'rect(1px, 1px, 1px, 1px)',
  },
});

export default function ProfileEditor() {
  const styles = useStyles();
  const t = useTranslations('Profile');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const liveRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const { data: me, isLoading } = useQuery<User>({
    queryKey: queryKeys.user,
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState<UserUpdate>({});
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<{
    name?: string;
    position?: string;
    bio?: string;
  }>({});

  const displayAvatar = useMemo(
    () => previewUrl || form.avatar_url || me?.avatar_url,
    [previewUrl, form.avatar_url, me?.avatar_url],
  );

  useEffect(() => {
    if (me) {
      setForm({
        name: me.name,
        bio: me.bio,
        position: me.position,
        avatar_url: me.avatar_url,
      });
    }
  }, [me]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const isDirty = useMemo(() => {
    if (!me) return false;
    return (
      (form.name || '') !== (me.name || '') ||
      (form.position || '') !== (me.position || '') ||
      (form.bio || '') !== (me.bio || '') ||
      (form.avatar_url || '') !== (me.avatar_url || '')
    );
  }, [form, me]);

  const validate = (f: UserUpdate) => {
    const next: { name?: string; position?: string; bio?: string } = {};
    const name = (f.name || '').trim();
    if (name && name.length < 2) next.name = t('nameTooShort');
    if (name.length > 100) next.name = t('nameTooLong');
    const position = (f.position || '').trim();
    if (position.length > 100) next.position = t('positionTooLong');
    const bio = (f.bio || '').trim();
    if (bio.length > 500) next.bio = t('bioTooLong');
    setErrors(next);
    return next;
  };

  const updateMutation = useMutation({
    mutationFn: async (updates: UserUpdate) => updateMe(updates),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.user, updated);
      showToast('success', t('updated'));
      if (liveRef.current) {
        liveRef.current.textContent = t('savedAnnouncement');
        setTimeout(() => {
          if (liveRef.current) liveRef.current.textContent = '';
        }, 1500);
      }
    },
    onError: () => showToast('error', t('updateFailed')),
  });

  const onPickAvatar = () => fileRef.current?.click();

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('error', t('invalidImageType'));
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('error', t('imageTooLarge'));
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      const resp = await uploadFile({ file });
      console.log('Upload response:', resp);

      const newUrl = resp.storage_url;
      if (!newUrl) {
        console.error('No storage_url in response:', resp);
        throw new Error('no_storage_url');
      }

      // Update form state (will be saved when user clicks "Save changes")
      setForm((f) => ({ ...f, avatar_url: newUrl }));
      showToast('success', t('avatarUploaded'));
    } catch (error) {
      console.error('Avatar upload failed:', error);
      showToast('error', t('avatarUploadFailed'));
      // Clean up preview on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(undefined);
      }
    }
  };

  const onSave = () => {
    const invalids = validate(form);
    const hasError = Object.keys(invalids).length > 0;
    if (hasError || !isDirty) return;
    updateMutation.mutate(form);
    setIsEditMode(false);
  };

  const onCancel = () => {
    setForm({
      name: me?.name,
      bio: me?.bio,
      position: me?.position,
      avatar_url: me?.avatar_url,
    });
    setErrors({});
    setIsEditMode(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(undefined);
    }
  };

  if (isLoading || !me) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Spinner /> {t('loading')}
      </div>
    );
  }

  return (
    <>
      <div className={styles.header} aria-label={t('profile')}>
        <div className={styles.topRow}>
          <div className={styles.titleContainer}>
            <div className={styles.iconBadge}>
              <ContactCard24Regular />
            </div>
            <div>
              <h1 className={styles.title}>{t('profile')}</h1>
              <p className={styles.subtitle}>{t('profileSubtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.wrap}>
        <Card className={styles.card}>
          <CardHeader
            header={<b>{t('avatar')}</b>}
            description={t('avatarSubtitle')}
          />
          <CardPreview>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                alignItems: 'center',
                padding: 24,
                paddingTop: 32,
              }}
            >
              <div className={styles.avatarWrap}>
                <div className={styles.avatarCircle}>
                  <Avatar
                    name={me.name || me.email}
                    image={displayAvatar ? { src: displayAvatar } : undefined}
                    size={160 as any}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                {isEditMode && (
                  <Tooltip content={t('changeAvatar')} relationship="label">
                    <Button
                      appearance="primary"
                      icon={<Camera24Regular />}
                      className={styles.avatarCamera}
                      onClick={onPickAvatar}
                    />
                  </Tooltip>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={onChangeFile}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: 18 }}>
                  {me.name || t('noName')}
                </div>
                <div
                  style={{
                    color: 'var(--colorNeutralForeground3)',
                    fontSize: 14,
                  }}
                >
                  {me.position || t('noPosition')}
                </div>
              </div>
            </div>
          </CardPreview>
        </Card>

        <Card className={styles.card}>
          <CardHeader
            header={<b>{t('accountInfo')}</b>}
            description={t('accountInfoSubtitle')}
            action={
              !isEditMode ? (
                <Button
                  appearance="primary"
                  onClick={() => setIsEditMode(true)}
                >
                  {t('edit')}
                </Button>
              ) : null
            }
          />
          <div className={styles.form} style={{ padding: 16 }}>
            {isEditMode ? (
              <>
                <div className={styles.row}>
                  <Field
                    label={t('name')}
                    validationMessage={errors.name}
                    validationState={errors.name ? 'error' : 'none'}
                  >
                    <Input
                      value={form.name || ''}
                      onChange={(e) => {
                        const v = e.target.value;
                        const next = { ...form, name: v };
                        setForm(next);
                        validate(next);
                      }}
                      placeholder={t('namePlaceholder')}
                    />
                  </Field>
                  <Field
                    label={t('position')}
                    validationMessage={errors.position}
                    validationState={errors.position ? 'error' : 'none'}
                  >
                    <Input
                      value={form.position || ''}
                      onChange={(e) => {
                        const v = e.target.value;
                        const next = { ...form, position: v };
                        setForm(next);
                        validate(next);
                      }}
                      placeholder={t('positionPlaceholder')}
                    />
                  </Field>
                </div>

                <Field
                  label={t('bio')}
                  validationMessage={errors.bio}
                  validationState={errors.bio ? 'error' : 'none'}
                >
                  <Textarea
                    resize="vertical"
                    value={form.bio || ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      const next = { ...form, bio: v };
                      setForm(next);
                      validate(next);
                    }}
                    placeholder={t('bioPlaceholder')}
                  />
                  <div className={styles.helper}>{t('bioHelper')}</div>
                </Field>
              </>
            ) : (
              <>
                <div className={styles.readOnlyRow}>
                  <div className={styles.readOnlyKey}>{t('name')}</div>
                  <div className={styles.readOnlyValue}>{me.name || '-'}</div>
                </div>
                <div className={styles.readOnlyRow}>
                  <div className={styles.readOnlyKey}>{t('position')}</div>
                  <div className={styles.readOnlyValue}>
                    {me.position || '-'}
                  </div>
                </div>
                <div className={styles.readOnlyRow}>
                  <div className={styles.readOnlyKey}>{t('bio')}</div>
                  <div className={styles.readOnlyValue}>{me.bio || '-'}</div>
                </div>
              </>
            )}

            <div className={styles.readOnlyRow} aria-label={t('readOnly')}>
              <div className={styles.readOnlyKey}>{t('email')}</div>
              <div className={styles.readOnlyValue}>{me.email}</div>
            </div>
            <div className={styles.readOnlyRow}>
              <div className={styles.readOnlyKey}>{t('createdAt')}</div>
              <div className={styles.readOnlyValue}>
                {me.created_at ? formatDate(new Date(me.created_at)) : '-'}
              </div>
            </div>
            <div className={styles.readOnlyRow}>
              <div className={styles.readOnlyKey}>{t('updatedAt')}</div>
              <div className={styles.readOnlyValue}>
                {me.updated_at ? formatDate(new Date(me.updated_at)) : '-'}
              </div>
            </div>

            {isEditMode && (
              <div className={styles.actions}>
                <Button
                  appearance="primary"
                  icon={<CheckmarkCircle24Regular />}
                  onClick={onSave}
                  disabled={
                    updateMutation.isPending ||
                    !isDirty ||
                    Object.keys(errors).length > 0
                  }
                >
                  {updateMutation.isPending ? t('saving') : t('save')}
                </Button>
                <Button appearance="secondary" onClick={onCancel}>
                  {t('cancel')}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div ref={liveRef} aria-live="polite" className={styles.liveRegion} />
    </>
  );
}

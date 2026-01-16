'use client';

import { showToast } from '@/hooks/useShowToast';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
  makeStyles,
  tokens,
  Text,
} from '@/lib/components';
import {
  Copy20Regular,
  Checkmark20Regular,
  Link20Regular,
} from '@/lib/icons';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import type { MeetingResponse } from 'types/meeting.type';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
  },
  linkContainer: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'flex-end',
  },
  input: {
    flexGrow: 1,
  },
  infoText: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
});

interface MeetingShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting: MeetingResponse;
  onShareSuccess?: () => void;
}

export default function MeetingShareModal({
  open,
  onOpenChange,
  meeting,
  onShareSuccess,
}: MeetingShareModalProps) {
  const styles = useStyles();
  const t = useTranslations('MeetingShare');
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Generate meeting detail link
  const meetingLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/meetings/${meeting.id}`
      : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      showToast('success', t('linkCopied'), { duration: 2000 });

      // Call callback to notify parent
      if (onShareSuccess) {
        onShareSuccess();
      }

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      showToast('error', t('copyError'));
    }
  };

  const handleCopyMeetingUrl = async () => {
    if (!meeting.url) return;

    try {
      await navigator.clipboard.writeText(meeting.url);
      setCopiedUrl(true);
      showToast('success', t('urlCopied'), { duration: 2000 });

      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      showToast('error', t('copyError'));
    }
  };

  const handleClose = () => {
    setCopied(false);
    setCopiedUrl(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface>
        <DialogTitle>{t('title')}</DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            {/* Meeting Title */}
            <div>
              <Text weight="semibold">
                {meeting.title || t('untitledMeeting')}
              </Text>
              {meeting.description && (
                <Text className={styles.infoText} block>
                  {meeting.description}
                </Text>
              )}
            </div>

            {/* Meeting Detail Link */}
            <div>
              <Field label={t('meetingDetailLink')}>
                <div className={styles.linkContainer}>
                  <Input
                    value={meetingLink}
                    readOnly
                    className={styles.input}
                    contentBefore={<Link20Regular />}
                  />
                  <Button
                    appearance="secondary"
                    icon={copied ? <Checkmark20Regular /> : <Copy20Regular />}
                    onClick={handleCopyLink}
                  >
                    {copied ? t('copied') : t('copy')}
                  </Button>
                </div>
              </Field>
              <Text className={styles.infoText}>{t('shareDescription')}</Text>
            </div>

            {/* Meeting URL (if exists) */}
            {meeting.url && (
              <div>
                <Field label={t('meetingUrl')}>
                  <div className={styles.linkContainer}>
                    <Input
                      value={meeting.url}
                      readOnly
                      className={styles.input}
                      contentBefore={<Link20Regular />}
                    />
                    <Button
                      appearance="secondary"
                      icon={
                        copiedUrl ? <Checkmark20Regular /> : <Copy20Regular />
                      }
                      onClick={handleCopyMeetingUrl}
                    >
                      {copiedUrl ? t('copied') : t('copy')}
                    </Button>
                  </div>
                </Field>
                <Text className={styles.infoText}>{t('urlDescription')}</Text>
              </div>
            )}
          </DialogContent>
        </DialogBody>

        <DialogActions className={styles.actions}>
          <Button appearance="primary" onClick={handleClose}>
            {t('done')}
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}

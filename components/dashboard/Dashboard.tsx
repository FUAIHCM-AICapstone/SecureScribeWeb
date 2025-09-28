"use client";

import React from "react";
import {
  Body1,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Caption1,
  Title1,
  Title3,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import type { ButtonProps } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    width: "100%",
  },
  intro: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  introDescription: {
    color: tokens.colorNeutralForeground3,
    maxWidth: "720px",
  },
  grid: {
    display: "grid",
    gap: "24px",
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    "@media (min-width: 48rem)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
    "@media (min-width: 80rem)": {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    },
  },
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  cardHeader: {
    padding: "24px 24px 0",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    flexGrow: 1,
    padding: "0 24px 24px",
    color: tokens.colorNeutralForeground2,
  },
  placeholder: {
    height: "140px",
    borderRadius: tokens.borderRadiusMedium,
    border: `1px dashed ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground6,
  },
  footer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    padding: "0 24px 24px",
  },
});

interface DashboardAction {
  label: string;
  appearance?: ButtonProps["appearance"];
}

interface DashboardCard {
  id: string;
  title: string;
  updatedAt: string;
  description: string;
  primaryAction: DashboardAction;
  secondaryAction: DashboardAction;
}

const cards: DashboardCard[] = [
  {
    id: "my-tasks",
    title: "My Tasks",
    updatedAt: "5:40 AM",
    description:
      "Manage personal work, monitor status, and meet deadlines. Create a new task or quickly update progress.",
    primaryAction: { label: "Check Task", appearance: "primary" },
    secondaryAction: { label: "New Task", appearance: "secondary" },
  },
  {
    id: "team-project",
    title: "Team Project",
    updatedAt: "5:40 AM",
    description:
      "Review the projects you participate in. See members, progress, related documents, or launch new initiatives.",
    primaryAction: { label: "Update Project", appearance: "primary" },
    secondaryAction: { label: "New Project", appearance: "secondary" },
  },
  {
    id: "my-meetings",
    title: "My Meetings",
    updatedAt: "5:40 AM",
    description:
      "Check upcoming meetings, access notes, transcripts, and supporting materials without leaving the dashboard.",
    primaryAction: { label: "Check Meetings", appearance: "primary" },
    secondaryAction: { label: "New Meeting", appearance: "secondary" },
  },
  {
    id: "recent-transcripts",
    title: "Recent Transcripts",
    updatedAt: "5:40 AM",
    description:
      "Quickly open the latest transcripts with audio references and full-content search to keep context handy.",
    primaryAction: { label: "Check Scripts", appearance: "primary" },
    secondaryAction: { label: "Upload Audio", appearance: "secondary" },
  },
  {
    id: "recent-notes",
    title: "Recent Notes",
    updatedAt: "5:40 AM",
    description:
      "Review recently edited or shared notes, see who updated them, and jump back into collaborative work.",
    primaryAction: { label: "Check Notes", appearance: "primary" },
    secondaryAction: { label: "New Note", appearance: "secondary" },
  },
  {
    id: "quick-actions",
    title: "Quick Actions",
    updatedAt: "5:40 AM",
    description:
      "Launch frequent actions instantly: create meetings, upload files, and assign tasks without switching tabs.",
    primaryAction: { label: "Check Actions", appearance: "primary" },
    secondaryAction: { label: "Create Action", appearance: "secondary" },
  },
];

const Dashboard: React.FC = () => {
  const styles = useStyles();

  return (
    <section className={styles.root}>
      <div className={styles.intro}>
        <Title1 className="font-semibold">Dashboard</Title1>
        <Body1 className={styles.introDescription}>
          Stay on top of personal tasks, team initiatives, and shared knowledge without leaving this workspace.
        </Body1>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <Card key={card.id} appearance="subtle" className={styles.card}>
            <CardHeader
              className={styles.cardHeader}
              header={<Title3 as="h3">{card.title}</Title3>}
              description={<Caption1>Last updated at {card.updatedAt}</Caption1>}
            />

            <div className={styles.cardBody}>
              <Body1>{card.description}</Body1>
              <div className={styles.placeholder} aria-hidden />
            </div>

            <CardFooter className={styles.footer}>
              <Button appearance={card.primaryAction.appearance} size="small">
                {card.primaryAction.label}
              </Button>
              <Button appearance={card.secondaryAction.appearance} size="small">
                {card.secondaryAction.label}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;

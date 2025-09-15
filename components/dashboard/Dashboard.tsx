'use client';

import React from 'react';
import { Card, CardHeader, CardFooter, Body1, Title3 } from '@fluentui/react-components';

interface DashboardSection {
    id: string;
    title: string;
    subtitle?: string;
}

const sections: DashboardSection[] = [
    { id: 'my-meetings', title: 'My Meetings', subtitle: 'DB_MyMeetings' },
    { id: 'recent-notes', title: 'Recent Notes', subtitle: 'DB_RecentNotes' },
    { id: 'recent-transcripts', title: 'Recent Transcripts', subtitle: 'DB_RecentTranscripts' },
    { id: 'my-tasks', title: 'My Tasks', subtitle: 'DB_MyTasksSummary' },
    { id: 'notifications', title: 'Notifications', subtitle: 'DB_NotificationsEntry' },
    { id: 'quick-actions', title: 'Quick Actions', subtitle: 'DB_QuickActions' },
];

const DashboardSection: React.FC<{ section: DashboardSection }> = ({ section }) => {
    return (
        <Card className="h-full">
            <CardHeader
                header={<Title3>{section.title}</Title3>}
                description={section.subtitle && <Body1 className="text-gray-600">{section.subtitle}</Body1>}
            />
            <div className="p-4 flex-1">
                {/* Placeholder content - will be filled later */}
                <div className="bg-gray-100 rounded-lg p-4 h-32 flex items-center justify-center">
                    <Body1 className="text-gray-500">Content for {section.title}</Body1>
                </div>
            </div>
            <CardFooter>
                <Body1 className="text-sm text-gray-500">Section: {section.id}</Body1>
            </CardFooter>
        </Card>
    );
};

const Dashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Dashboard Header */}
                <div className="mb-8">
                    <Title3 className="text-center">Dashboard</Title3>
                    <Body1 className="text-center text-gray-600 mt-2">
                        SecureScribe Dashboard with Fluent UI React v9
                    </Body1>
                </div>

                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sections.map((section) => (
                        <div key={section.id} className="w-full">
                            <DashboardSection section={section} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

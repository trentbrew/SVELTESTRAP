import type { ComponentType, SvelteComponent } from 'svelte';
import DashboardIcon from '@tabler/icons-svelte/icons/dashboard';
import UsersIcon from '@tabler/icons-svelte/icons/users';
import VideoIcon from '@tabler/icons-svelte/icons/video';
import TvIcon from '@tabler/icons-svelte/icons/device-tv';
import ChartBarIcon from '@tabler/icons-svelte/icons/chart-bar';
import ReportIcon from '@tabler/icons-svelte/icons/report';
import DatabaseIcon from '@tabler/icons-svelte/icons/database';
import MovieIcon from '@tabler/icons-svelte/icons/movie';
import AdIcon from '@tabler/icons-svelte/icons/ad';
import CampaignIcon from '@tabler/icons-svelte/icons/bolt';
import SettingsIcon from '@tabler/icons-svelte/icons/settings';
import HelpIcon from '@tabler/icons-svelte/icons/help';
import MessageIcon from '@tabler/icons-svelte/icons/message';
import FileDescriptionIcon from '@tabler/icons-svelte/icons/file-description';

export type NavItem = {
	title: string;
	url: string;
	icon?: ComponentType<SvelteComponent>;
	isActive?: boolean;
	description?: string;
	items?: Array<{
		title: string;
		url: string;
	}>;
};

export type UserData = {
	name: string;
	email: string;
	avatar: string;
};

export type Workspace = {
	id: string;
	name: string;
	logo: string;
	url: string;
	isActive?: boolean;
};

export const sidebarData = {
	user: {
		name: 'Nan Kohler',
		email: 'nan@gristandtoll.com',
		avatar: '/avatars/default-avatar.jpg'
	} as UserData,
	workspaces: [
		{
			id: 'grist-and-toll',
			name: 'Grist & Toll',
			logo: 'https://turtle-commerce.pockethost.io/api/files/oqyn1qmsatdm53w/phwvuxr87m2x8m2/group_5_DZDQTT6EPX.png?token=',
			url: '/workspace/dashboard',
			isActive: true
		},
		{
			id: 'docket-tv',
			name: 'Docket.tv',
			logo: 'https://turtle-commerce.pockethost.io/api/files/oqyn1qmsatdm53w/phwvuxr87m2x8m2/group_5_DZDQTT6EPX.png?token=',
			url: '/workspace/dashboard',
			isActive: false
		},
		{
			id: 'community-media',
			name: 'Community Media',
			logo: 'https://turtle-commerce.pockethost.io/api/files/oqyn1qmsatdm53w/phwvuxr87m2x8m2/group_5_DZDQTT6EPX.png?token=',
			url: '/workspace/dashboard',
			isActive: false
		}
	] as Workspace[],
	navMain: [
		{
			title: 'Dashboard',
			url: '/workspace/dashboard',
			icon: DashboardIcon,
			description: 'Customizable dashboard showing the most relevant data'
		},
		{
			title: 'Members',
			url: '/workspace/members',
			icon: UsersIcon,
			description: 'Manage organization members, admins, producers, and sponsors'
		},
		{
			title: 'Producers',
			url: '/workspace/producers',
			icon: VideoIcon,
			description: 'Manage producers and their assigned timeslots'
		},
		{
			title: 'Channels',
			url: '/workspace/channels',
			icon: TvIcon,
			description: 'Manage cablecast channels and their programming'
		}
	] as NavItem[],
	navContent: [
		{
			title: 'Media',
			url: '/workspace/media',
			icon: VideoIcon,
			description: 'Manage raw video files and assets'
		},
		{
			title: 'Shows',
			url: '/workspace/shows',
			icon: MovieIcon,
			description: 'View and manage scheduled shows and programming'
		},
		{
			title: 'Bumpers',
			url: '/workspace/bumpers',
			icon: AdIcon,
			description: 'Manage bumpers that play between shows'
		},
		{
			title: 'Campaigns',
			url: '/workspace/campaigns',
			icon: CampaignIcon,
			description: 'Manage ad campaigns and sponsorships'
		}
	] as NavItem[],
	navAnalytics: [
		{
			title: 'Analytics',
			url: '/workspace/analytics',
			icon: ChartBarIcon,
			description: 'View viewership, engagement, and revenue metrics'
		},
		{
			title: 'Reports',
			url: '/workspace/reports',
			icon: ReportIcon,
			description: 'Access generated reports and analytics'
		},
		{
			title: 'Backups',
			url: '/workspace/backups',
			icon: DatabaseIcon,
			description: 'Manage workspace data backups'
		}
	] as NavItem[],
	navSecondary: [
		{
			title: 'Settings',
			url: '/workspace/settings',
			icon: SettingsIcon,
			description: 'Account and workspace settings'
		},
		{
			title: 'Documentation',
			url: '/docs',
			icon: FileDescriptionIcon,
			description: 'API documentation and help resources'
		},
		{
			title: 'Feedback',
			url: '/feedback',
			icon: MessageIcon,
			description: 'Share your thoughts about Docket.tv'
		}
	] as NavItem[]
} as const;

import { browser } from '$app/environment';
import { DEFAULT_WORKSPACE } from '$lib/routes';
import type { ComponentType, SvelteComponent } from 'svelte';

interface PinnedItem {
	title: string;
	url: string;
	icon?: ComponentType<SvelteComponent> | string;
	type: 'main' | 'documents' | 'secondary';
}

// Icon mapping for serialization
const iconMap: Record<string, ComponentType<SvelteComponent>> = {};

export function registerIcon(name: string, icon: ComponentType<SvelteComponent>) {
	iconMap[name] = icon;
}

export function getIcon(name: string): ComponentType<SvelteComponent> | undefined {
	return iconMap[name];
}

class PinnedItemsStore {
	private items = $state<PinnedItem[]>([]);

	constructor() {
		if (browser) {
			this.loadFromStorage();
		}
	}

	get pinnedItems() {
		return this.items.map((item) => ({
			...item,
			icon: typeof item.icon === 'string' ? getIcon(item.icon) : item.icon
		}));
	}

	isPinned(url: string): boolean {
		return this.items.some((item) => item.url === url);
	}

	pin(item: PinnedItem) {
		if (!this.isPinned(item.url)) {
			// Convert icon component to string name for storage
			const itemToStore = {
				...item,
				icon: typeof item.icon === 'string' ? item.icon : this.getIconName(item.icon)
			};
			this.items.push(itemToStore);
			this.saveToStorage();
		}
	}

	unpin(url: string) {
		this.items = this.items.filter((item) => item.url !== url);
		this.saveToStorage();
	}

	toggle(item: PinnedItem) {
		if (this.isPinned(item.url)) {
			this.unpin(item.url);
		} else {
			this.pin(item);
		}
	}

	private getIconName(icon?: ComponentType<SvelteComponent> | string): string | undefined {
		if (!icon || typeof icon === 'string') return icon;

		// Find the icon name by comparing with registered icons
		for (const [name, registeredIcon] of Object.entries(iconMap)) {
			if (registeredIcon === icon) {
				return name;
			}
		}
		return undefined;
	}

	private saveToStorage() {
		if (browser) {
			localStorage.setItem('pinned-sidebar-items', JSON.stringify(this.items));
		}
	}

	private loadFromStorage() {
		if (browser) {
			const stored = localStorage.getItem('pinned-sidebar-items');
			if (stored) {
				try {
					const parsed = JSON.parse(stored) as PinnedItem[];
					// Migrate legacy /workspace/* URLs to /{workspace}/*
					const currentSlug = (location.pathname.split('/')[1] || DEFAULT_WORKSPACE).trim();
					this.items = parsed.map((it) => {
						if (it.url?.startsWith('/workspace/')) {
							return { ...it, url: it.url.replace('/workspace/', `/${currentSlug}/`) };
						}
						return it;
					});
				} catch (e) {
					console.warn('Failed to parse pinned items from localStorage');
				}
			}
		}
	}
}

export const pinnedItemsStore = new PinnedItemsStore();

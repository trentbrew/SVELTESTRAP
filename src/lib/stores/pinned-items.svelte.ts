import { browser } from '$app/environment';

interface PinnedItem {
	title: string;
	url: string;
	icon: any;
	type: 'main' | 'documents' | 'secondary';
}

class PinnedItemsStore {
	private items = $state<PinnedItem[]>([]);

	constructor() {
		if (browser) {
			this.loadFromStorage();
		}
	}

	get pinnedItems() {
		return this.items;
	}

	isPinned(url: string): boolean {
		return this.items.some((item) => item.url === url);
	}

	pin(item: PinnedItem) {
		if (!this.isPinned(item.url)) {
			this.items.push(item);
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
					this.items = JSON.parse(stored);
				} catch (e) {
					console.warn('Failed to parse pinned items from localStorage');
				}
			}
		}
	}
}

export const pinnedItemsStore = new PinnedItemsStore();

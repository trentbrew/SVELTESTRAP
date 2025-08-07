<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';

	let state = $state({
		count: 0
	});

	function increment() {
		state.count++;
	}

	function decrement() {
		state.count--;
	}
</script>

<div class="flex h-screen w-full items-center justify-center">
	<div class="flex flex-col items-center gap-2">
		<h1>Count: {state.count}</h1>
		<div class="flex gap-2">
			<Button onclick={decrement} variant="destructive">-</Button>
			<Button onclick={increment}>+</Button>
		</div>
	</div>
</div>

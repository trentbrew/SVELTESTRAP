<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import ChevronLeftIcon from '@tabler/icons-svelte/icons/chevron-left';
  import { DEFAULT_WORKSPACE } from '$lib/routes';

  function goBack() {
    if (history.length > 1) {
      history.back();
    } else {
      window.location.href = `/${DEFAULT_WORKSPACE}/dashboard`;
    }
  }
</script>

<header
  class="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 rounded-t-xl border-b bg-background/80 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
>
  <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
    <Sidebar.Trigger class="-ml-1" />
    <Button variant="ghost" size="sm" onclick={goBack} class="flex items-center gap-1">
      <ChevronLeftIcon class="size-4" />
      <span class="hidden sm:inline">Back</span>
    </Button>
    <div class="ml-2 text-sm text-muted-foreground">Documentation</div>
  </div>
</header>


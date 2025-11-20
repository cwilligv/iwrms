<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchRepairs } from '@/services/repairsService';

// List of statuses to display as Kanban columns
const statuses = [
  'Waiting for Processing',
  'Processed',
  'In Work',
  'Waiting for Parts',
  'Waiting for Client',
];

const events = ref([]);

// Fetch and map repair data
onMounted(async () => {
  try {
    const repairs = await fetchRepairs();
    events.value = repairs.map(r => ({
      id: r.id,
      details: r,
      time: { start: r.dateScheduled, end: r.dateScheduled }
    }));
  } catch (e) {
    console.error('Failed to load repairs:', e);
  }
});

// Group events by status from job card. 
const groupedEvents = computed(() => {
  const map = {};
  statuses.forEach(status => {
    map[status] = events.value.filter(ev => ev.details.status === status);
  });
  return map;
});
</script>

<template>
  <div class="kanban-board d-flex overflow-auto">
    <div
      v-for="status in statuses"
      :key="status"
      class="kanban-column p-2"
      style="min-width: 250px;"
    >
      <h5 class="mb-3">{{ status }}</h5>
      <div v-if="groupedEvents[status].length">
        <div
          v-for="event in groupedEvents[status]"
          :key="event.id"
          class="card mb-2"
        >
          <div class="card-body p-2">
            <h6 class="card-title mb-1">
              {{ event.details.fName }} {{ event.details.lName }}
            </h6>
            <p class="card-text mb-1">{{ event.time.start }}</p>
            <p class="card-text small">
              Technician: {{ event.details.technician }}
            </p>
            <p class="card-text small">
              Instrument: {{ event.details.item || 'N/A' }}
            </p>
          </div>
        </div>
      </div>
      <p v-else class="text-muted">No items</p>
    </div>
  </div>
</template>

<style scoped>
.kanban-board {
  gap: 1rem;
}
.kanban-column {
  background: #f8f9fa;
  border-radius: 4px;
}
</style>

<!--Component for enabling ticket printing from the job card. Connects to Qualendar.vue-->
<template>
    <div ref="printArea" class="print-ticket">
        <h2><strong>Job Ticket</strong></h2>
        <p><strong><em>Customer: </em></strong> {{ job.customer?.name || '—' }}</p>
        <p><strong><em>Brand: </em></strong> {{ job.manufacturer || '—' }}</p>
        <p><strong><em>Instrument: </em></strong> {{ job.item?.name || '—' }}</p>
        <p><strong><em>Serial: </em></strong> {{ job.serial || '—' }}</p>
        <p><strong><em>Ed ID: </em></strong> {{ job.edID || '—' }}</p>
        <p><strong><em>Service: </em></strong> {{ job.service?.type || '—' }}</p>
        <p><strong><em>Notes: </em></strong> {{ job.notes || 'None' }}</p>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'; 

const props = defineProps({ job: Object });
const printArea = ref(null); 

function formatDate(date) {
    return new Date(date).toLocaleString();
}
</script>

<style scoped>
.print-ticket {
  width: 80mm; 
  padding: 1em;
  font-family: monospace;
}
</style>

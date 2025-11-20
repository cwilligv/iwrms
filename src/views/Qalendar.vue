<template>
  <div class="Qalendar-section">
    <div class="Qalendar-calendar" style="margin-top: 1rem;">
      <h3>Calendar</h3>

      <!-- Always-visible “Add Event” form -->
      <div class="mb-4 p-3 border rounded bg-light">
        <div class="row g-2 align-items-end">
          <div class="col-md-4">
            <label class="form-label">Contact Name</label>
            <input
              v-model="newEvent.title"
              type="text"
              class="form-control"
              placeholder="Contact Name"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Date</label>
            <input
              v-model="newEvent.date"
              type="date"
              class="form-control"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Instrument</label>
            <input
              v-model="newEvent.user"
              type="text"
              class="form-control"
              placeholder="Start typing..."
            />
          </div>
          <div class="col-md-2 d-grid">
            <button @click="createEvent" class="btn btn-success">
              Add Repair Job
            </button>
          </div>
        </div>
      </div>
      <!-- Calendar with modal trigger -->
      <QalendarCalendar
        :key="calendarKey"
        :events="events"
        :config="config"
        style="height: 600px; width: 100%;"
        @date-was-clicked="openModal"
        @datetime-was-clicked="openModal"
        @interval-was-clicked="openModal"
        @edit-event="handleEditEvent"
        @delete-event="handleDeleteEvent"
      />
      <!-- Debug: List of all events  -->
      <div class="mt-4">
        <h5>All Events</h5>
        <ul>
          <li v-for="ev in events" :key="ev.id">
            {{ ev.id }} – <strong>{{ ev.title }}</strong> on {{ ev.time.start }}
            <span v-if="ev.details">
              <em>Status: {{ ev.details.status }}</em>,
              <em>Technician: {{ ev.details.technician }}</em>
            </span>
          </li>
        </ul>
      </div>
      <!-- Job Card Modal with Tabs -->
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal-window">
          <header>
            <h5>Job Card — {{ modalDate }}</h5>
            <button @click="closeModal">&times;</button>
          </header>
          <!-- Tabs -->
          <ul class="nav nav-tabs">
            <li class="nav-item" v-for="tab in tabs" :key="tab.key">
              <a
                href="#"
                class="nav-link"
                :class="{ active: activeTab === tab.key }"
                @click.prevent="activeTab = tab.key"
              >
                {{ tab.label }}
              </a>
            </li>
          </ul>
          <section class="p-3">
            <!-- Job Card Tab -->
            <div v-if="activeTab === 'job'">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Search for existing user:</label>
                  <v-select
                    v-model="modalData.customer" :filterable="false" :options="customerOptions" label="label" @search="fetchCustomers" placeholder="Type a name…" class="form-control"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Company Name:</label> 
                  <input v-model="modalData.cName" type="text" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">First Name:</label> 
                  <input v-model="modalData.fName" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Last Name:</label> 
                  <input v-model="modalData.lName" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Phone Number:</label> 
                  <input v-model="modalData.phone" type="tel" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email:</label> 
                  <input v-model="modalData.email" type="email" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Scheduled Date:</label>
                  <input v-model="modalData.dateScheduled" type="date" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Required By:</label>
                  <input v-model="modalData.dateRequired" type="date" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Technician:</label>
                  <input v-model="modalData.technician" type="text" class="form-control" placeholder="Technician Name" />
                </div>
                <div class="col-md-6 d-flex align-items-center mt-5">
                  <label class="switch me-2">
                    <input type="checkbox" v-model="modalData.itemHere">
                    <span class="slider round"></span>
                  </label>
                  <span class="form-label mb-0">Item is Here</span>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Service Type: </label>
                  <select v-model="modalData.service" class="form-select">
                    <option>Service</option>
                    <option>Repair</option>
                    <option>Something</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Internal Note:</label><!--ONLY SHOW INTERNALLY-->
                  <input v-model="modalData.internalNote" type="text" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">External Note:</label><!--SHOW EXTERNALLY TO CLIENT-->
                  <input v-model="modalData.externalNote" type="text" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Status</label>
                  <select v-model="modalData.status" class="form-select">
                    <option>Waiting for Processing</option>
                    <option>Processed</option>
                    <option>In Work</option>
                    <option>Waiting for Parts</option>
                    <option>Waiting for Client</option>
                    <option>Instrument Ready</option>
                    <option>Collected</option>
                    <option>Cancel Job</option>
                  </select>
                </div>
              </div>
            </div>
            <!-- Quote Tab -->
              <div v-if="activeTab === 'quote'">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="mb-0">Quote Options</h6>
                  <button type="button" class="btn btn-sm btn-link" @click="showQuoteOptions = !showQuoteOptions">{{ showQuoteOptions ? 'Hide Quote Options' : 'Manage Quote Options' }}</button>
                </div>
                  <!-- Quote Options Management UI -->
                  <div v-if="showQuoteOptions" class="border p-4 rounded bg-light mb-4" style="font-size: 0.95rem;">
                    <div v-for="(qGroup, qIndex) in modalData.quoteOptions" :key="qIndex" class="mb-3 border p-2 rounded">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <input v-model="qGroup.label" type="text" class="form-control form-control-sm me-3" placeholder="Quote Option Title" style="max-width: 300px;"/>
                        <button class="btn btn-sm btn-outline-danger" @click="removeQuoteOption(qIndex)" :disabled="modalData.quoteOptions.length <= 1">Remove</button>
                      </div>
                      <!-- Lines in this quote option -->
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th>Service / Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Notes</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(line, lineIndex) in qGroup.lines" :key="lineIndex">
                            <td><v-select v-model="line.service" :options="productOptions" label="name" class="form-control" searchBy="name" :filterable="true" placeholder="Select a product/service" /></td>
                            <td><input v-model.number="line.qty" type="number" class="form-control" /></td>
                            <td><input v-model.number="line.price" type="number" step="0.01" class="form-control" /></td>
                            <td><input v-model.number="line.discount" type="number" step="0.01" class="form-control" /></td>
                            <td><input v-model.number="line.stock" type="number" class="form-control" /></td>
                            <td><textarea v-model="line.notes" type="text" class="form-control" /></td>
                            <td>
                              <button class="btn btn-sm btn-outline-danger" @click="removeQuoteLineFromOption(qIndex, lineIndex)" :disabled="qGroup.lines.length <= 1">×</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <button class="btn btn-sm btn-outline-primary" @click="addQuoteLineToOption(qIndex)">Add Line</button>
                    </div>
                    <div class="mt-3 d-flex justify-content-between">
                      <button class="btn btn-sm btn-outline-primary" @click="addQuoteOption">Add Quote Option</button>
                      <button class="btn btn-sm btn-outline-warning" @click="clearAllQuoteOptions">Use Flat Quote Instead</button>
                    </div>
                  </div>
                <!-- Display Quotes -->
                <!-- SIMPLE QUOTE MODE: Show when no quoteOptions -->
                <div v-if="modalData.quoteOptions.length === 0">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Service / Product</th>
                        <th>Qty</th>
                        <th>Discount %</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(q, i) in modalData.quote" :key="i">
                        <td>
                          <v-select v-model="q.service" :options="productOptions" label="name" class="form-control" searchBy="name" :filterable="true" placeholder="Select a product/service"/>
                        </td>
                        <td>
                          <input v-model.number="q.qty" type="number" class="form-control" />
                        </td>
                        <td>
                          <input v-model.number="q.discount" type="number" step="0.01" class="form-control"/>
                        </td>
                        <td>
                          <input v-model.number="q.price" type="number"step="0.01" class="form-control"/>
                        </td>
                        <td>{{ (q.qty * q.price * (1 - ((q.discount || 0) / 100))).toFixed(2) }}</td>
                        <td>
                          <textarea v-model="q.notes" type="text" class="form-control" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="text-end mt-3">
                    <p>
                      <strong>Subtotal:</strong>
                      {{ calculateQuoteTotalsSimple(modalData.quote).subtotal.toFixed(2) }}
                    </p>
                    <p>
                      <strong>Total Discount:</strong>
                      {{ calculateQuoteTotalsSimple(modalData.quote).totalDiscount.toFixed(2) }}
                    </p>
                    <p>
                      <strong>GST:</strong>
                      {{ calculateQuoteTotalsSimple(modalData.quote).tax.toFixed(2) }}
                    </p>
                    <p class="fw-bold">
                      <strong>Grand Total:</strong>
                      {{ calculateQuoteTotalsSimple(modalData.quote).grandTotal.toFixed(2) }}
                    </p>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline-primary" @click="addQuoteLine">Add Line</button>
                  <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="removeQuoteLine" :disabled="modalData.quote.length <= 1"> Remove</button>
                </div>
                <!-- QUOTE OPTIONS MODE: Show when quoteOptions exist -->
                <div v-else>
                  <div v-for="(qGroup, qIndex) in modalData.quoteOptions" :key="qIndex" class="mb-4 border rounded p-3">
                    <h6>{{ qGroup.label }}</h6>
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Service / Product</th>
                          <th>Qty</th>
                          <th>Discount</th>
                          <th>Price</th>
                          <th>Total</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(q, i) in qGroup.lines" :key="i">
                          <td>
                            <v-select v-model="q.service" :options="productOptions" label="name" class="form-control" searchBy="name" :filterable="true" placeholder="Select a product/service"/>
                          </td>
                          <td>
                            <input v-model.number="q.qty" type="number" class="form-control" />
                          </td>
                          <td>
                            <input v-model.number="q.discount" type="number" step="0.01" class="form-control"/>
                          </td>
                          <td>
                            <input v-model.number="q.price" type="number" step="0.01" class="form-control"/>
                          </td>
                          <td>{{ (q.qty * q.price * (1 - ((q.discount || 0) / 100))).toFixed(2) }}</td>
                          <td>
                            <textarea v-model="q.notes" type="text" class="form-control" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="text-end mt-3">
                      <p>
                        <strong>Subtotal:</strong> {{ calculateQuoteTotals(qGroup).subtotal.toFixed(2) }}
                      </p>
                      <p>
                        <strong>Total Discount:</strong> {{ calculateQuoteTotals(qGroup).totalDiscount.toFixed(2) }}
                      </p>
                      <p><strong>GST:</strong> {{ calculateQuoteTotals(qGroup).tax.toFixed(2) }}</p>
                      <p class="fw-bold">
                        <strong>Grand Total:</strong> {{ calculateQuoteTotals(qGroup).grandTotal.toFixed(2) }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mb-4">
                  <button type="button" class="btn btn-sm btn-primary ms-2">Send for Approval</button>
                  <button type="button" class="btn btn-sm btn-primary ms-2">Send to POS</button>
                </div>
                <div class="mt-4">
                  <h6>Payment Status</h6>
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>Payment Method</th>
                        <th>Payment Date</th>
                        <th>Identifier</th>
                        <th>Payment Amount</th>
                      </tr>
                    </thead>
                  </table>
                  <button type="button" class="btn btn-sm btn-primary ms-2">Synchronise Payments</button>
                </div>
              </div>
            <!-- Item Tab -->
            <div v-if="activeTab === 'item'">
              <div class="d-flex gap-4">
                <!--Input fields above-->
                <div class="flex: 1; max-width: 400px">
                  <label class="form-label">Brand</label><!--NEEDS TO BE PRINTED ON JOB SHEET!-->
                  <input v-model="modalData.manufacturer" type="text" class="form-control" required/>
                </div>
                <div class="mb-3">
                  <label class="form-label">Instrument</label><!--NEEDS TO BE PRINTED ON JOB SHEET!-->
                  <input v-model="modalData.instrument" type="text" class="form-control" required/>
                </div>
                <div class="mb-3">
                  <label class="form-label">Serial Number</label><!--NEEDS TO BE PRINTED ON JOB SHEET!-->
                  <input v-model="modalData.serial" type="text" class="form-control" required/>
                </div>
                <div class="mb-3">
                  <label class="form-label">EQ Number (Optional)</label>
                  <input v-model="modalData.edID" type="text" class="form-control" />
                </div>
              </div>
                <button type="button" class="btn btn-sm btn-primary ms-2">Save</button><!--DATA FOR NEWLY CREATED INSTRUMENTS TO GO SAVE TO DATABASE!-->
                <!--Fetched output below-->
                <div style="flex: 2;">
                  <!--TODO: FETCHED DATA TO GO HERE IF INSTRUMENT EXISTS IN DATABASE-->
                  <div class="p-3 border rounded bg-light">
                    <h6>Instrument Details</h6>
                    <p><strong>Manufacturer:</strong></p>
                    <p><strong>Instrument Details:</strong></p>
                    <p><strong>Service History:</strong></p>
                    <ul>
                      <li>SOME PLACEHOLDER!</li>
                    </ul>
                  </div>
                </div>
            </div>
            <!--Linked Jobs Tab--> <!--NEEDS TO PULL AND PUSH INFORMATION ON LINKED JOBS!!!-->
            <div v-if="activeTab === 'linked'">
              <!-- 1. Picker to choose linked jobs -->
              <div class="mb-4">
                <v-select
                  v-model="modalData.linkedJobs"
                  :options="customerRepairs"
                  placeholder="Select jobs to link"
                  multiple
                  clearable
                  :reduce="opt => opt.value"
                  label="label"
                />

              </div>

              <!-- 2. Column headers -->
              <div class="d-flex fw-bold mb-2">
                <div class="me-5">Job No</div>
                <div class="me-5">Service Date</div>
                <div class="me-5">Technician</div>
                <div class="me-5">Status</div>
              </div>

              <!-- 3. One row per linked job -->
              <div
                class="d-flex align-items-center mb-1"
                v-for="jobId in modalData.linkedJobs"
                :key="jobId"
              >
                <div class="me-5">{{ jobId }}</div>
                <div class="me-5">{{ findRepair(jobId).dateScheduled }}</div>
                <div class="me-5">{{ findRepair(jobId).technician }}</div>
                <div class="me-5">{{ findRepair(jobId).status }}</div>

              </div>
            </div>

            <!-- Messaging Tab -->
            <div v-if="activeTab === 'messaging'">
              <h6 class="mb-3">Send SMS to Customer</h6>
              <textarea
                v-model="modalData.message"
                rows="4"
                class="form-control"
                placeholder="Type your message..."
              ></textarea>
              <div class="text-end mt-2">
                <button type="button" class="btn btn-primary btn-sm" @click="sendMessage">
                  Send SMS
                </button>
              </div>
              <hr class="my-3" />
              <h6 class="mb-2">Incoming Messages</h6>
              <ul class="list-group">
                <li
                  v-for="(msg, index) in incomingMessages"
                  :key="index"
                  class="list-group-item"
                >
                  <strong>{{ msg.from }}</strong> <br />
                  {{ msg.body }} <br />
                  <small class="text-muted">{{ new Date(msg.timestamp).toLocaleString() }}</small>
                </li>
              </ul>
            </div>
          </section>
          <!-- Modal Footer -->
          <div class="d-flex justify-content-end border-top pt-3">
            <button type="button" class="btn btn-secondary me-2" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveAll">Save All</button>
            <Ticket :job="selectedJob" ref="ticketRef" style="position: absolute; left: -9999px; top: -9999px; width: 1px; height: 1px; overflow: hidden;" />
            <button type="button" class="btn btn-sm btn-primary ms-2" @click="printTicket">Print Job Ticket</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, watch, nextTick } from "vue";
import axios from 'axios';
import vSelect from 'vue-select';
import "vue-select/dist/vue-select.css";
import { Qalendar as QalendarCalendar } from "qalendar";
import "qalendar/dist/style.css";
import { fetchRepairs, createRepair, deleteRepair, updateRepair } from "@/services/repairsService";
import lightspeedApi from '@/services/lightspeed';
import { computed } from "vue";
import Ticket from './components/Ticket.vue'

export default {
  name: "Qalendar",
  components: {
    QalendarCalendar,
    vSelect,
    Ticket
  },

  setup() {
    const events = ref([]);
    const calendarKey  = ref(0)
    const config = ref({ defaultMode: "week", locale: "en-US", week: { startsOn: "monday", scrollToHour: 9, hourRange: {start: 9, end: 17}} });
    const tabs = [
      { key: 'job', label: 'Job Card' },
      { key: 'quote', label: 'Quote' },
      { key: 'item', label: 'Item' },
      { key: 'linked', label: 'Linked Jobs' },
      { key: 'messaging', label: 'Messaging' }
    ];
    const activeTab = ref('job');
    const newEvent = ref({ title: "", date: "", user: "" });
    const nextId = ref(1);
    const incomingMessages = ref([]);

    const showModal = ref(false);
    const modalDate = ref("");
    // Centralized default modal data object
    const defaultModalData = {
      customer: null,
      id: null,
      group_id: null,
      linkedJobs: [],
      nameSearch: '',
      fName: '', lName: '', cName: '', phone: '', email: '',
      dateScheduled: '', dateRequired: '',
      technician: '', item: '', serial: '', instrument: '', manufacturer: '',
      service: '', internalNote: '', itemHere: false, edID: '',
      externalNote: '', status: 'Waiting for Processing',
      quote: [{ service: null, qty: 1, price: 0, discount: 0, notes: '' }],
      quoteOptions: [],
      selectedQuoteIndex: 0,
      message: ''
    };

    // Use defaultModalData for initialization
    const modalData = ref({ ...defaultModalData });

    const showQuoteOptions = ref(false);

    const customerOptions = ref([]);
    const allCustomers = ref([]);
    const productOptions = ref([]);
    const smsStatus = ref('');
    const allRepairs = ref([]);
    const customerRepairs = computed(() => {
      return allRepairs.value
      .filter(r => r.id !== modalData.value.id)
      .map(r => ({
        label: `#${r.id} – ${r.fName} ${r.lName} ${r.cName} (${r.dateScheduled})`,
        value: r.id
      }))
    });

    function getStatusColor(status) {
      switch (status) {
      case "Waiting for Processing": return "gray";
      case "Processed":              return "blue";
      case "In Work":                return "orange";
      case "Waiting for Parts":      return "purple";
      case "Waiting for Client":     return "yellow";
      case "Instrument Ready":       return "#ADD8E6";
      case "Collected":              return "green";
      case "Cancel Job":             return "red";
      default:                       return "blue";
      }
    }

    function findRepair(id) {
      return allRepairs.value.find(r => r.id === id) || {};
    }

    onMounted(async () => {
      try {
      const repairs = await fetchRepairs();
      allRepairs.value = repairs;

      const FIRST_HOUR = 9;
      const LAST_HOUR = 17;
      const SLOT_LENGTH = 1;
      const buckets = repairs.reduce((acc, r) => {
        const day = r.dateScheduled.split('T')[0];
        acc[day] = acc[day] || [];
        acc[day].push(r);
        return acc;
      }, {});

      const allEvents = [];
      for (const day of Object.keys(buckets)) {
        buckets[day].forEach((r, idx) => {
        const slotStartHour = FIRST_HOUR + idx;
        const slotEndHour   = slotStartHour + SLOT_LENGTH;

        if (slotStartHour >= LAST_HOUR) {
          console.warn(`No more slots for ${day}`, r);
          return;
        }

        const hhString = String(slotStartHour).padStart(2, "0");
        const start    = `${day} ${hhString}:00`;
        const end      = `${day} ${String(slotStartHour + SLOT_LENGTH).padStart(2,"0")}:00`;

        const color = getStatusColor(r.status);
        allEvents.push({
          id: r.id,
          title: `${r.manufacturer} ${r.instrument}`,
          time: { start, end },
          color,
          details: { ...r },
          isEditable: true,
        });
        });
      }

      events.value = allEvents;

      const maxId = repairs.reduce((max, r) => Math.max(max, r.id), 0);
      nextId.value = maxId + 1;
      } catch (e) {
      console.error('Failed to load repairs:', e);
      }

      try {
      const productRes = await axios.get('/wp-json/iwrms/v1/products', {
        params: { page_size: 100 }
      });
      const d = productRes.data;
      let list = [];
      if (Array.isArray(d.data)) {
        list = d.data;
      } else if (Array.isArray(d.Products)) {
        list = d.Products;
      } else if (Array.isArray(d.products)) {
        list = d.products;
      }
      productOptions.value = list;
      } catch (err) {
      console.error('Failed to load product options:', err);
      }
    });

    function createEvent() {
      if (!newEvent.value.title || !newEvent.value.date) return;
      events.value.push(createEventObject(newEvent.value));
      resetNewEvent();
    }

    let serviceSummary = '';

    if (modalData.value.quoteOptions.length > 0) {
      const firstOption = modalData.value.quoteOptions[0];
      const firstLine = firstOption?.lines?.[0];
      serviceSummary = firstLine?.service?.name || '';
    } else if (modalData.value.quote.length > 0) {
      const firstQuoteLine = modalData.value.quote[0];
      serviceSummary = firstQuoteLine?.service?.name || '';
    }

    function openModal(payload) {
      const details = payload?.details || {};
      modalDate.value = payload?.start || payload?.date || "";

      // Use defaultModalData as base, then override with details
      modalData.value = {
      ...defaultModalData,
      ...details,
      dateScheduled: details.dateScheduled || modalDate.value
      };

      // Fix quote/service objects if needed
      if (Array.isArray(modalData.value.quote)) {
      modalData.value.quote = modalData.value.quote.map(line => {
        const svc = typeof line.service === 'object'
        ? line.service
        : productOptions.value.find(p => p.id === line.service || p.name === line.service);
        return {
        ...line,
        service: svc || null
        };
      });
      }

      activeTab.value = "job";
      showModal.value = true;
    }

    function closeModal() {
      showModal.value = false;
    }

    async function saveAll() {
      // Use defaultModalData keys to build payload
      const payload = {};
      Object.keys(defaultModalData).forEach(key => {
      payload[key] = modalData.value[key];
      });

      // Special handling for itemHere (convert to 1/0)
      payload.itemHere = modalData.value.itemHere ? 1 : 0;

      try {
      if (modalData.value.id) {
        // UPDATE event
        const updated = await updateRepair(modalData.value.id, payload);
        const updatedId = Number(updated.id);

        events.value = events.value.map(e =>
        e.id === updatedId
          ? {
            id:        updatedId,
            title:     `${updated.fName} ${updated.lName}`,
            time:      { start: updated.dateScheduled, end: updated.dateScheduled },
            color:     'blue',
            details:   { ...updated },
            isEditable: true
          }
          : e
        );
      } else {
        // CREATE
        const created = await createRepair(payload);

        events.value = [
        ...events.value,
        {
          id:        created.id,
          title:     `${created.fName} ${created.lName}`,
          time:      { start: created.dateScheduled, end: created.dateScheduled },
          color:     'blue',
          details:   { ...created },
          isEditable: true
        }
        ];
      }
      calendarKey.value++;
      closeModal();
      } catch (err) {
      console.error('Error saving repair:', err);
      }
    }

    function addQuoteLine() {
      modalData.value.quote.push({ service: null, qty: 1, price: 0 });
    }

    function removeQuoteLine() {
      if (modalData.value.quote.length > 1) {
      modalData.value.quote.pop();
      }
    }

    function addQuoteOption() {
      modalData.value.quoteOptions.push({
      label: `Option ${modalData.value.quoteOptions.length + 1}`,
      lines: [{ service: null, qty: 1, price: 0, discount: 0, notes: '' }]
      });
    }

    watch(
      () => modalData.value.quoteOptions.map(opt => opt.lines.map(l => l.service)),
      (newValues) => {
      newValues.forEach((services, optIdx) => {
        services.forEach((service, lineIdx) => {
        if (service && service.price_including_tax != null) {
          modalData.value.quoteOptions[optIdx].lines[lineIdx].price = Number(service.price_including_tax)
        }
        })
      })
      },
      { deep: true }
    )

    function removeQuoteOption(index) {
      if (modalData.value.quoteOptions.length > 1) {
      modalData.value.quoteOptions.splice(index, 1)
      modalData.value.quoteOptions.forEach((opt, i) => {
        opt.label = `Option ${i + 1}`
      })
      if (modalData.value.selectedQuoteIndex >= modalData.value.quoteOptions.length) {
        modalData.value.selectedQuoteIndex = modalData.value.quoteOptions.length - 1
      }
      }
    }

    function addQuoteLineToOption(optionIndex) {
      modalData.value.quoteOptions[optionIndex].lines.push({
      service: null,
      qty: 1,
      price: 0,
      discount: 0,
      notes: ''
      });
    }

    function removeQuoteLineFromOption(optionIndex, lineIndex) {
      const lines = modalData.value.quoteOptions[optionIndex].lines;
      if (lines.length > 1) {
      lines.splice(lineIndex, 1);
      }
    }

    function applyQuoteOption(index) {
      const selected = modalData.value.quoteOptions[index];
      modalData.value.quote.push({
      label: selected.label,
      lines: selected.lines.map(line => ({ ...line }))
      });
      showQuoteOptions.value = false;
    }

    function clearAllQuoteOptions() {
      modalData.value.quoteOptions = [];
      showQuoteOptions.value = false;
    }

    function createEventObject(data, date = data.date) {
      return {
      id: nextId.value++,
      title: data.title.trim(),
      time: { start: date, end: date },
      color: "blue",
      details: { ...data },
      isEditable: true
      };
    }

    function resetNewEvent() {
      newEvent.value = { title: "", date: "", user: "" };
    }

    async function fetchCustomers(search) {
      if (!search || search.length < 2) {
      customerOptions.value = [];
      return;
      }
      if (!allCustomers.value.length) {
      try {
        const res = await axios.get('/wp-json/iwrms/v1/customers');
        allCustomers.value = res.data.data || [];
      } catch (err) {
        console.error('Failed to load customers:', err);
        return;
      }
      }
      const term = search.toLowerCase();
      const matches = allCustomers.value.filter(c =>
      (c.first_name   || '').toLowerCase().includes(term) ||
      (c.last_name    || '').toLowerCase().includes(term) ||
      (c.email        || '').toLowerCase().includes(term) ||
      (c.phone        || '').toLowerCase().includes(term) ||
      (c.company_name || '').toLowerCase().includes(term)
      );
      customerOptions.value = matches.map(c => ({
      label: `${c.first_name} ${c.last_name} ${c.company_name}`,
      value: c
      }));
    }

    watch(
      () => modalData.value.customer,
      picked => {
      if (picked && picked.value) {
        modalData.value.fName      = picked.value.first_name;
        modalData.value.lName      = picked.value.last_name;
        modalData.value.cName      = picked.value.company_name;
        modalData.value.phone      = picked.value.phone;
        modalData.value.email      = picked.value.email;
        modalData.value.nameSearch = picked.label;
      } else {
        modalData.value.fName = '';
        modalData.value.lName = '';
        modalData.value.cName = '';
      }
      }
    );

    watch(
      () => modalData.value.quote.map(q => q.service),
      (newValues) => {
      newValues.forEach((service, index) => {
        if (service && service.price_including_tax != null) {
        modalData.value.quote[index].price = Number(service.price_including_tax);
        }
      });
      },
      { deep: true }
    );

    watch(
      () => modalData.value.phone,
      async (newPhone) => {
      if (!newPhone) return;
      const msgs = await fetchMessages();
      incomingMessages.value = msgs.filter(msg => msg.from === newPhone);
      },
      { immediate: true }
    );

    const taxRate = 0.10;

    function calculateQuoteTotals(option) {
      if (!option || !Array.isArray(option.lines)) {
      return { subtotal: 0, totalDiscount: 0, tax: 0, grandTotal: 0 };
      }

      const subtotal = option.lines.reduce((acc, q) => acc + (q.qty || 0) * (q.price || 0), 0);

      const totalDiscount = option.lines.reduce((acc, q) => {
      const lineTotal = (q.qty || 0) * (q.price || 0);
      const discountPercent = parseFloat(q.discount) || 0;
      return acc + (lineTotal * discountPercent / 100);
      }, 0);

      const netTotal = subtotal - totalDiscount; 
      const tax = (netTotal * taxRate) / (1 + taxRate); 

      const grandTotal = netTotal; 

      return { subtotal, totalDiscount, tax, grandTotal };
    }

    function calculateQuoteTotalsSimple(lines) {
      if (!lines || !Array.isArray(lines)) {
      return { subtotal: 0, totalDiscount: 0, tax: 0, grandTotal: 0 };
      }

      const subtotal = lines.reduce((acc, q) => acc + (q.qty || 0) * (q.price || 0), 0);

      const totalDiscount = lines.reduce((acc, q) => {
      const lineTotal = (q.qty || 0) * (q.price || 0);
      const discountPercent = parseFloat(q.discount) || 0;
      return acc + (lineTotal * discountPercent / 100);
      }, 0);

      const netTotal = subtotal - totalDiscount;
      const tax = (netTotal * taxRate) / (1 + taxRate);

      const grandTotal = netTotal;

      return { subtotal, totalDiscount, tax, grandTotal };
    }

    async function sendMessage() {
      if (!modalData.value.phone || !modalData.value.message) {
      smsStatus.value = 'Phone number or message missing.';
      console.warn('Missing phone/message', modalData.value);
      return;
      }

      try {
      const response = await fetch('https://e39b4da0a3c6.ngrok-free.app/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        to: modalData.value.phone,
        body: modalData.value.message,
        }),
      });

      const result = await response.json();
      smsStatus.value = result.success
        ? 'SMS sent successfully!'
        : 'Failed to send SMS: ' + result.error;
      } catch (err) {
      console.error("SMS error:", err);
      smsStatus.value = 'Error: ' + err.message;
      }
    }

    async function fetchMessages() {
      try {
      const response = await fetch('http://localhost:3000/api/messages');
      const result = await response.json();
      return result;
      } catch (err) {
      console.error('Error getting messages:', err);
      return[];
      }
    }

    function handleEditEvent(payload) {
      let ev = (payload !== null && typeof payload === 'object')
      ? null
      : events.value.find(e => e.id == payload);

      if (!ev) {
      ev = payload.eventData ?? payload.event ?? null;
      }

      if (typeof payload.closeEventDialog === 'function') {
      payload.closeEventDialog();
      }

      modalDate.value = ev.time.start;
      activeTab.value = 'job';
      const d = ev.details || {};
      // Use defaultModalData as base, then override with event details
      modalData.value = {
      ...defaultModalData,
      ...d,
      id: ev.id,
      dateScheduled: d.dateScheduled || modalDate.value
      };

      // Fix quote/service objects if needed
      if (Array.isArray(modalData.value.quote)) {
      modalData.value.quote = modalData.value.quote.map(line => {
        const svc = typeof line.service === 'object'
        ? line.service
        : productOptions.value.find(p => p.id === line.service || p.name === line.service);
        return {
        ...line,
        service: svc || null
        };
      });
      }

      showModal.value = true;
    }

    async function handleDeleteEvent(payload) {
      let id = (payload !== null && typeof payload === 'object')
        ? (payload.eventData?.id ?? payload.event?.id)
        : payload;

      if (typeof payload.closeEventDialog === 'function') {
        payload.closeEventDialog();
      }

      try {
        await deleteRepair(id);
        events.value = events.value.filter(e => e.id != id);
      } catch (err) {
        console.error('Error deleting repair:', err);
      }
    }

    const ticketRef = ref(null);

    const selectedJob = computed(() => {
      if (!modalData.value) return null;

      return {
        //id: modalData.value.id || 'N/A', 
        customer: { name: `${modalData.value.fName} ${modalData.value.lName}`.trim() || '—' },
        item: { name: modalData.value.instrument || '—' },
        service: { type: modalData.value.service || '—' }, 
        technician: { name: modalData.value.technician || '—' },
        date: modalData.value.dateScheduled || new Date().toISOString(),
        notes: modalData.value.externalNote || 'None',
        manufacturer: modalData.value.manufacturer || '—',
        serial:       modalData.value.serial       || '—',
        edID:         modalData.value.edID         || '—',
      };
    });

    //Function for printing tickets
    const printTicket = () => {
        console.log('printTicket called.');
        console.log('ticketRef.value (component instance):', ticketRef.value);
        console.dir(ticketRef.value);

        const actualPrintAreaElement = ticketRef.value?.vnode?.el || ticketRef.value?.$el;

        console.log('actualPrintAreaElement:', actualPrintAreaElement);

        if (actualPrintAreaElement) {
            nextTick(() => { 
                const printableContent = actualPrintAreaElement.innerHTML;
                console.log("Printable content to write (inside nextTick):", printableContent); 

                const printWindow = window.open('', '_blank');
                if (printWindow) {
                    printWindow.document.write('<!DOCTYPE html>'); 
                    printWindow.document.write('<html><head><title>Job Ticket</title>');
                    printWindow.document.write('<style>');
                    //Styling included in function to set specific printing styles.
                    printWindow.document.write(` 
                      html, body {
                        margin: 0;
                        padding: 0;
                        width: 100%; 
                        min-height: 100vh; 
                        box-sizing: border-box; 
                      }

                      @media print {
                        body * {
                          visibility: hidden;
                        }

                        .print-ticket {
                          visibility: visible !important; 
                          position: static !important; 
                          width: 80mm !important; 
                          max-width: 100% !important; 
                          margin: 0 auto !important; 
                          padding: 1em !important; 
                          font-family: monospace; 
                          box-sizing: border-box; 
                          page-break-after: always; 
                        }

                        .print-ticket * {
                          visibility: visible !important;
                        }
                      }
                    `);
                    printWindow.document.write('</style>');
                    printWindow.document.write('</head><body>');
                    printWindow.document.write(`<div class="print-ticket">${printableContent}</div>`); 
                    printWindow.document.write('</body></html>');

                    setTimeout(() => {
                        printWindow.document.close();
                        printWindow.focus(); 
                        printWindow.print();
                        // printWindow.close(); //COMMENTED OUT UNTIL TESTING COMPLETED! 
                    }, 100); 
                } else {
                    console.error('Could not open print window. Ensure pop-up blockers are not enabled.');
                    alert('Could not open print window. Ensure pop-up blockers are not enabled.');
                }
            }); 
        } else {
            console.error('Print area element not found.');
            alert('Could not open print window. Ensure pop-up blockers are not enabled.');
        }
    };

    return {
      events, config, newEvent, createEvent,
      tabs, activeTab, showModal, modalDate, modalData,
      openModal, closeModal, saveAll, addQuoteLine,
      removeQuoteLine, sendMessage,
      customerOptions, productOptions, 
      fetchCustomers,showQuoteOptions, 
      addQuoteOption, removeQuoteOption, addQuoteLineToOption,
      removeQuoteLineFromOption, applyQuoteOption, handleEditEvent, handleDeleteEvent,
      calculateQuoteTotals, calculateQuoteTotalsSimple, clearAllQuoteOptions,
      incomingMessages, smsStatus, ticketRef, selectedJob, printTicket, customerRepairs, allRepairs, findRepair
    };
  }
};
</script>

<style scoped>
.Qalendar-calendar { max-width: 90%; margin: 0 auto; }
.modal-backdrop { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
.modal-window { background:#fff; padding:1rem; border-radius:8px; width: 900px; max-width:95%; max-height:90vh; overflow-y:auto; }
.modal-window header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; }
.modal-window header button { background:none; border:none; font-size:1.5rem; cursor:pointer; line-height:1; }
.nav-tabs .nav-link { cursor:pointer; }
.switch {position: relative; display: inline-block; width: 60px; height: 34px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; }
.slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; -webkit-transition: .4s; transition: .4s; }
input:checked + .slider { background-color: #2196F3; }
input:focus + .slider { box-shadow: 0 0 1px #2196F3; }
input:checked + .slider:before { -webkit-transform: translateX(26px); -ms-transform: translateX(26px); transform: translateX(26px); }
.slider.round { border-radius: 34px; }
.slider.round:before { border-radius: 50%; }
.switch-label-text {margin-left: 10px; vertical-align: middle;font-weight: 500; color: #1d3557;}
.v-select {width: 100% !important; min-width: 0;}
.v-select .vs__dropdown-toggle {min-width: 0; padding-left: 0.25rem; padding-right: 0.25rem;}
.table td, .table th {padding: 0.3rem;}
.quote-option-box {width: 100%; flex: 1 1 auto;}
.border.p-4.rounded.bg-light {width: 100% !important; display: flex; flex-direction: column; gap: 1rem;}
.border.p-3.rounded {width: 100%;}
.btn-outline-danger.ms-2 {margin-left: 0.5rem !important;}
button.btn-primary:not(.ms-2) {width: auto; align-self: flex-start;}
@media screen and (max-width: 991px) {
  .Qalendar-calendar {max-width: 100%; padding: 0 1rem;}
  .modal-window {width: 100%; max-width: 95%; max-height: 90vh; padding: 1rem;}
  .border.p-4.rounded.bg-light, .border.p-3.rounded {flex-direction: column !important; width: 100% !important;}
  .btn-outline-danger.ms-2 {margin-left: 0 !important; margin-top: 0.5rem;}
  button.btn-primary:not(.ms-2) {width: 100%;}
  .switch-label-text {display: inline-block; margin-top: 0.5rem;}
  .modal-window header {flex-direction: column; align-items: flex-start; gap: 0.5rem;}
  .nav-pills {flex-direction: column !important; align-items: stretch; flex-wrap: wrap; overflow-x: auto; -webkit-overflow-scrolling: touch;}
  .nav-pills .nav-link {width: 100%; text-align: left; border-radius: 0 !important; border-bottom: 1px solid #ddd;}
  .nav-pills .nav-link:last-child {border-bottom: none;}
  .tab-content {margin-top: 1rem;}
  .nav-pills .moving-tab {display: none !important;}
}
</style>

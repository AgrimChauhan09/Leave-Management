<script setup>
import { onMounted, reactive, ref } from "vue";
import { api } from "../lib/api.js";
import { useAuthStore } from "../stores/auth.js";

const auth = useAuthStore();

const form = reactive({
  leaveType: "Sick",
  startDate: "",
  endDate: "",
  reason: ""
});

const submitting = ref(false);
const error = ref("");
const success = ref("");

const myRequests = ref([]);
const loading = ref(false);

async function loadMine() {
  loading.value = true;
  error.value = "";
  try {
    const { data } = await api.get("/api/leaves/mine");
    myRequests.value = data;
  } catch (e) {
    error.value = e?.response?.data?.error || "Failed to load requests";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  submitting.value = true;
  error.value = "";
  success.value = "";
  try {
    await api.post("/api/leaves", form);
    success.value = "Leave request submitted.";
    form.reason = "";
    await loadMine();
  } catch (e) {
    error.value = e?.response?.data?.error || "Failed to submit request";
  } finally {
    submitting.value = false;
  }
}

function fmt(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
}

onMounted(loadMine);
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold">Employee Dashboard</h1>
      <p class="text-sm text-slate-700">Signed in as {{ auth.user?.email }}</p>
    </div>

    <div v-if="error" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {{ error }}
    </div>
    <div v-if="success" class="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
      {{ success }}
    </div>

    <section class="rounded-lg border bg-white p-4">
      <h2 class="text-lg font-semibold">Apply for Leave</h2>

      <form class="mt-3 grid gap-3 sm:grid-cols-2" @submit.prevent="submit">
        <div class="sm:col-span-1">
          <label class="block text-sm font-medium">Leave type</label>
          <select v-model="form.leaveType" class="mt-1 w-full rounded-md">
            <option>Sick</option>
            <option>Casual</option>
            <option>Annual</option>
            <option>Other</option>
          </select>
        </div>
        <div class="sm:col-span-1">
          <label class="block text-sm font-medium">Start date</label>
          <input v-model="form.startDate" type="date" class="mt-1 w-full rounded-md" required />
        </div>
        <div class="sm:col-span-1">
          <label class="block text-sm font-medium">End date</label>
          <input v-model="form.endDate" type="date" class="mt-1 w-full rounded-md" required />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium">Reason</label>
          <textarea v-model="form.reason" class="mt-1 w-full rounded-md" rows="3" required />
        </div>

        <div class="sm:col-span-2">
          <button
            type="submit"
            class="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            :disabled="submitting"
          >
            {{ submitting ? "Submitting..." : "Submit request" }}
          </button>
        </div>
      </form>
    </section>

    <section class="rounded-lg border bg-white p-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">My Requests</h2>
        <button class="text-sm font-medium text-slate-900 underline" @click="loadMine" :disabled="loading">
          Refresh
        </button>
      </div>

      <div v-if="loading" class="mt-3 text-sm text-slate-700">Loading...</div>
      <div v-else-if="myRequests.length === 0" class="mt-3 text-sm text-slate-700">No requests yet.</div>

      <div v-else class="mt-3 overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="text-slate-600">
            <tr>
              <th class="py-2 pr-3">Type</th>
              <th class="py-2 pr-3">Start</th>
              <th class="py-2 pr-3">End</th>
              <th class="py-2 pr-3">Status</th>
              <th class="py-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in myRequests" :key="r._id" class="border-t">
              <td class="py-2 pr-3">{{ r.leaveType }}</td>
              <td class="py-2 pr-3">{{ fmt(r.startDate) }}</td>
              <td class="py-2 pr-3">{{ fmt(r.endDate) }}</td>
              <td class="py-2 pr-3">
                <span
                  class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                  :class="
                    r.status === 'Approved'
                      ? 'bg-green-100 text-green-800'
                      : r.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                  "
                >
                  {{ r.status }}
                </span>
              </td>
              <td class="py-2">{{ r.reason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>


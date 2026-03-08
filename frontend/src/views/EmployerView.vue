<script setup>
import { onMounted, ref } from "vue";
import { api } from "../lib/api.js";
import { useAuthStore } from "../stores/auth.js";

const auth = useAuthStore();

const requests = ref([]);
const loading = ref(false);
const error = ref("");
const busyId = ref("");

async function loadAll() {
  loading.value = true;
  error.value = "";
  try {
    const { data } = await api.get("/api/leaves");
    requests.value = data;
  } catch (e) {
    error.value = e?.response?.data?.error || "Failed to load requests";
  } finally {
    loading.value = false;
  }
}

async function setStatus(id, status) {
  busyId.value = id;
  error.value = "";
  try {
    const { data } = await api.patch(`/api/leaves/${id}/status`, { status });
    const idx = requests.value.findIndex((r) => r._id === id);
    if (idx >= 0) requests.value[idx] = data;
  } catch (e) {
    error.value = e?.response?.data?.error || "Failed to update status";
  } finally {
    busyId.value = "";
  }
}

function fmt(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
}

onMounted(loadAll);
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold">Employer Dashboard</h1>
      <p class="text-sm text-slate-700">Signed in as {{ auth.user?.email }}</p>
    </div>

    <div v-if="error" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {{ error }}
    </div>

    <section class="rounded-lg border bg-white p-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">All Leave Requests</h2>
        <button class="text-sm font-medium text-slate-900 underline" @click="loadAll" :disabled="loading">
          Refresh
        </button>
      </div>

      <div v-if="loading" class="mt-3 text-sm text-slate-700">Loading...</div>
      <div v-else-if="requests.length === 0" class="mt-3 text-sm text-slate-700">No requests.</div>

      <div v-else class="mt-3 overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="text-slate-600">
            <tr>
              <th class="py-2 pr-3">Employee</th>
              <th class="py-2 pr-3">Type</th>
              <th class="py-2 pr-3">Start</th>
              <th class="py-2 pr-3">End</th>
              <th class="py-2 pr-3">Status</th>
              <th class="py-2 pr-3">Reason</th>
              <th class="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in requests" :key="r._id" class="border-t align-top">
              <td class="py-2 pr-3">
                <div class="font-medium">{{ r.employeeId?.name || "Unknown" }}</div>
                <div class="text-xs text-slate-600">{{ r.employeeId?.email }}</div>
              </td>
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
              <td class="py-2 pr-3 max-w-xs whitespace-pre-wrap">{{ r.reason }}</td>
              <td class="py-2">
                <div class="flex gap-2">
                  <button
                    class="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
                    :disabled="busyId === r._id"
                    @click="setStatus(r._id, 'Approved')"
                  >
                    Approve
                  </button>
                  <button
                    class="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
                    :disabled="busyId === r._id"
                    @click="setStatus(r._id, 'Rejected')"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>


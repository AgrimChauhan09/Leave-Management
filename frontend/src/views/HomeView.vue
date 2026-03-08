<script setup>
import { computed } from "vue";
import { useAuthStore } from "../stores/auth.js";

const auth = useAuthStore();
const dashboardLink = computed(() => {
  if (auth.user?.role === "employee") return { name: "employee" };
  if (auth.user?.role === "employer") return { name: "employer" };
  return { name: "login" };
});
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold">Leave Requests</h1>
    <p class="text-slate-700">
      Employees can apply for leave and track status. Employers can approve or reject requests.
    </p>

    <div class="rounded-lg border bg-white p-4">
      <p v-if="!auth.isAuthenticated" class="text-sm text-slate-700">
        Use <span class="font-medium">Sign up</span> to create an employee or employer account.
      </p>
      <p v-else class="text-sm text-slate-700">
        Signed in as <span class="font-medium">{{ auth.user?.email }}</span> ({{ auth.user?.role }}).
      </p>

      <div class="mt-3">
        <router-link class="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" :to="dashboardLink">
          Go to dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>


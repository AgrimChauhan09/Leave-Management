<script setup>
import { reactive, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

const auth = useAuthStore();
const router = useRouter();

const form = reactive({
  name: "",
  email: "",
  password: "",
  role: "employee"
});

watchEffect(() => {
  if (auth.isAuthenticated) {
    router.replace({ name: auth.user?.role === "employer" ? "employer" : "employee" });
  }
});

async function onSubmit() {
  const ok = await auth.signup(form);
  if (ok) router.push({ name: auth.user?.role === "employer" ? "employer" : "employee" });
}
</script>

<template>
  <div class="mx-auto max-w-md space-y-4">
    <h1 class="text-2xl font-semibold">Sign up</h1>

    <div v-if="auth.error" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {{ auth.error }}
    </div>

    <form class="space-y-3 rounded-lg border bg-white p-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium">Name</label>
        <input v-model="form.name" type="text" class="mt-1 w-full rounded-md" required />
      </div>
      <div>
        <label class="block text-sm font-medium">Email</label>
        <input v-model="form.email" type="email" class="mt-1 w-full rounded-md" required />
      </div>
      <div>
        <label class="block text-sm font-medium">Password (min 6)</label>
        <input v-model="form.password" type="password" class="mt-1 w-full rounded-md" minlength="6" required />
      </div>
      <div>
        <label class="block text-sm font-medium">Role</label>
        <select v-model="form.role" class="mt-1 w-full rounded-md">
          <option value="employee">Employee</option>
          <option value="employer">Employer</option>
        </select>
      </div>

      <button
        type="submit"
        class="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        :disabled="auth.loading"
      >
        {{ auth.loading ? "Creating..." : "Create account" }}
      </button>
    </form>
  </div>
</template>


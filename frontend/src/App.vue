<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth.js";

const auth = useAuthStore();
const router = useRouter();
useRoute();

const roleHome = computed(() => {
  if (auth.user?.role === "employee") return { name: "employee" };
  if (auth.user?.role === "employer") return { name: "employer" };
  return { name: "home" };
});

function logout() {
  auth.clearSession();
  router.push({ name: "login" });
}
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b bg-white">
      <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <router-link class="font-semibold" :to="{ name: 'home' }">Leave Management</router-link>

        <nav class="flex items-center gap-3 text-sm">
          <router-link v-if="auth.isAuthenticated" class="text-slate-700 hover:text-slate-900" :to="roleHome">
            Dashboard
          </router-link>
          <router-link v-if="!auth.isAuthenticated" class="text-slate-700 hover:text-slate-900" :to="{ name: 'login' }">
            Login
          </router-link>
          <router-link v-if="!auth.isAuthenticated" class="text-slate-700 hover:text-slate-900" :to="{ name: 'signup' }">
            Sign up
          </router-link>
          <button
            v-if="auth.isAuthenticated"
            class="rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800"
            @click="logout"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-4 py-8">
      <router-view />
    </main>
  </div>
</template>


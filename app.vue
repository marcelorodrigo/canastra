<template>
  <div>
    <NuxtPwaManifest/>
    <NuxtLoadingIndicator/>
    <v-app>
      <v-app-bar app :elevation="4" color="#ffcc66">
        <img src="/logo.svg" width="60" height="60" alt="Pontos da Canastra" title="Pontos da Canastra"
             @click="toggleTheme"/>
        <v-app-bar-title class="text-no-wrap d-sm-flex">Pontos da Canastra</v-app-bar-title>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </v-app-bar>
      <v-main>
        <v-container fluid class="d-flex flex-column">
          <Matches v-show="!showStartMatch"/>
          <AddTeams v-show="showStartMatch"/>
          <AddMatchButton v-show="!showStartMatch"/>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import {useCanastraStore} from '@/stores/canastra'
import {useTheme} from "vuetify";

export default {
  setup() {
    return {
      store: useCanastraStore(),
      theme: useTheme(),
    }
  },
  computed: {
    showStartMatch(): boolean {
      return this.store.teams === 0
    }
  },
  methods: {
    toggleTheme() {
      this.theme.dark = !this.theme.dark
    }
  }
}
</script>
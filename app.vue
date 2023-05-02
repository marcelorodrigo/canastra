<template>
  <div>
    <SeoKit />
    <OgImageScreenshot />
    <OgImageStatic />
    <v-app>
      <v-app-bar app>
        <img src="/logo.svg" width="48" height="48" alt="Pontos da Canastra" title="Pontos da Canastra" />
        <v-app-bar-title shrink-on-scroll class="pl-2 text-no-wrap d-none d-sm-flex">Pontos da Canastra</v-app-bar-title>
        <v-spacer />
      </v-app-bar>
      <v-main>
        <v-container fluid class="d-flex flex-column">
          <Results />
          <Matches />
          <AddMatchButton />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
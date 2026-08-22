import { test, expect } from '@playwright/test';

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('div#app header h1')).toHaveText('Marcador de Canastra');
})

test('user can start a game and add a round', async ({ page }) => {
  await page.goto('/');

  // Step 1: choose 2 teams
  await page.getByText('2 Equipes').click();
  // Confirm the team-selection transition completed
  await expect(page.getByRole('heading', { name: 'Nomes das Equipes' })).toBeVisible();
  // Step 2: names are pre-filled; proceed
  await page.getByRole('button', { name: 'Próximo' }).click();
  // Step 3: winning points; proceed
  await page.getByRole('button', { name: 'Próximo' }).click();
  // Step 4: obrigação; start the game
  await page.getByRole('button', { name: 'Iniciar Jogo' }).click();

  // Open the score sheet from the FAB menu
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.getByRole('button', { name: 'Adicionar Pontos' }).click();

  // Fill the two score inputs and submit
  const inputs = page.locator('input[type="number"]');
  await inputs.nth(0).fill('100');
  await inputs.nth(1).fill('200');
  await page.getByRole('button', { name: 'Adicionar Pontos' }).click();

  // Round history should reflect the added round
  await expect(page.getByText('1 rodada')).toBeVisible();
});

test('overlay exposes dialog semantics and closes on Escape with focus restored', async ({ page }) => {
  await page.goto('/');

  // Start a game so the FAB is available
  await page.getByText('2 Equipes').click();
  await expect(page.getByRole('heading', { name: 'Nomes das Equipes' })).toBeVisible();
  await page.getByRole('button', { name: 'Próximo' }).click();
  await page.getByRole('button', { name: 'Próximo' }).click();
  await page.getByRole('button', { name: 'Iniciar Jogo' }).click();

  const fab = page.locator('button[aria-controls]');
  await fab.focus();
  await page.keyboard.press('Enter');

  const deleteAll = page.getByRole('button', { name: 'Apagar Tudo' });
  await expect(deleteAll).toBeVisible();
  await deleteAll.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(dialog).toContainFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(deleteAll).toBeFocused();
});


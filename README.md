# Canastra Score Tracker

A Progressive Web App (PWA) for tracking scores in Canastra card games. Built with Vue 3, TypeScript, and Tailwind CSS, this app helps players keep track of points across multiple rounds with an intuitive, mobile-friendly interface.

## 🎯 Funcionalidades

### Configuração de jogo
- **Assistente de configuração em 4 passos**: escolha do número de equipes, nomes, pontos de vitória e pontos de obrigação, com transições animadas e validação por etapa
- **Suporte a 2 ou 3 equipes** com nomes personalizáveis
- **Pontos de vitória configuráveis** (presets de 100/1500/2500/3000, padrão 3000)
- **Limite de obrigação configurável** (presets dinâmicos derivados da meta de vitória, padrão 1500)

### Pontuação e histórico
- **Registro de pontos por rodada** via bottom sheet, com indicadores de pontos positivos/negativos e total da rodada
- **Histórico de rodadas** em ordem da mais recente para a mais antiga, com contagem total
- **Remoção de rodada** por swipe-to-delete ou botão, sempre com confirmação

### Visualização e status
- **Detecção automática de vencedor** (👑) quando um único líder atinge a meta de pontos
- **Indicador de obrigação**: badge "Obrigação" exibido quando a equipe está entre o limite de obrigação e a vitória
- **Indicador de líder** ("Liderando") e **detecção de empate** no topo
- **Barras de progresso** e contadores animados mostrando a porcentagem da meta por equipe

### Gerenciamento de jogo
- **Revanche**: zera o placar mantendo as mesmas equipes e configurações
- **Apagar tudo**: reseta o jogo e retorna à tela inicial
- **Persistência local**: o estado do jogo é salvo automaticamente no dispositivo

### Técnico
- **Progressive Web App**: instalável e utilizável offline
- **Design responsivo e mobile-first**: menu flutuante (FAB), gestos de swipe e bottom sheet
- **Acessibilidade**: overlays acessíveis, atributos ARIA e bloqueio de rolagem da página ao fundo
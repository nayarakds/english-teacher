# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é

App pessoal da Nayara para praticar inglês (nível intermediário): lições diárias de 3 a 5 minutos, focadas em **construir frases** e gramática, no celular. Conversa em pt-BR; o conteúdo das lições mistura inglês (frases) e pt-BR (explicações).

Decisões de produto já tomadas (não reabrir sem pedir):
- Sem IA e sem backend: lições prontas escritas à mão, sem login, progresso só em `localStorage`.
- Sem nota, pontuação ou sequência de dias. Nada de cobrança.
- Correção **na hora**: cada exercício tem "Conferir", que mostra acerto/erro, a resposta certa e uma linha de explicação (mudou de ideia: antes era só no final, a etapa de revisão foi removida).
- Um ponto de gramática por lição (tempos verbais, preposições/phrasal verbs, conectores e frases longas), dentro de temas de interesse dela: cinema, música, arte, design, marketing.
- Visual: moderno e jovem, **não infantil**. Fundo creme manteiga (#FFFDE8), sem animações ou decorações soltas atrás da tela; painéis grandes de cor sólida com mascotes de formas simples com carinha (inspiração: referências do Dribbble com ilustrações planas), tipografia grande (Bricolage Grotesque + DM Sans), cards planos com borda fina, botões em pílula azul-marinho (#262B3D), marca-texto amarelo na estrutura gramatical. **Sem sombras** em botões e cards. Evitar emojis na interface. A resposta selecionada nos exercícios é **amarela**, nunca vermelha nem na cor do tema, porque vermelho passa a ideia de erro (verde e salmão ficam só para o retorno de acerto e erro). A cor de destaque da lição vem do tema e pinta progresso, marca-texto, etiquetas e o painel.
- Conteúdo: 30 lições prontas (tempos verbais 1 a 12, preposições e phrasal verbs 13 a 21, conectores e frases longas 22 a 30), escritas no formato compacto de `lessons.js`. Antes de editar ou criar lições, ler o cabeçalho desse arquivo.

## Comandos

Site estático, sem build, sem dependências, sem testes.

- Abrir: dar duplo clique em `index.html` (funciona via `file://`, só o service worker e a instalação como app exigem http).
- Servir localmente (para testar PWA/offline): `python -m http.server 8000` dentro da pasta, depois abrir `http://localhost:8000`.
- Checar sintaxe JS: `node --check app.js && node --check lessons.js`.

## Arquitetura

- `lessons.js` define `window.LESSONS` (array). É um `.js` e não `.json` de propósito, para o app abrir via `file://` sem `fetch`. Adicionar lição = adicionar um objeto ao array, sem mexer em código.
- `app.js` é uma IIFE sem framework. Cada lição segue a sequência fixa `STEPS = mold, build, swap, own, end`, e cada etapa é uma função em `views` que chama `render(html)` (reescreve `#app` inteiro e religa os handlers). Estado da sessão (`step`, `exIndex`, `swapIndex`) vive em variáveis do módulo; só `saved.done` e `saved.sentences` vão para `localStorage` (chave `english-teacher:v1`).
- Schema de uma lição (ver `lessons.js` para o exemplo completo): `mold` (frase-modelo com partes `{t, h}` onde `h` destaca a estrutura; `explain` = quando usar, `formula` = como montar, `note` opcional = ponto que mais confunde), `exercises` (tipos `order` com `blocks`/`extra`/`answer`, e `choice` com `options`/`answer` como índice), `swap` (a mesma estrutura em vários temas, cada item com `color`), `own` (frase livre com `models` e `checklist`).
- Os exercícios `order` comparam a frase montada com `answer` por string exata (espaços normalizados). Se uma frase tiver mais de uma ordem válida, o app marcaria como erro: escreva exercícios com uma única ordem correta.
- **Sem voz por enquanto.** A Nayara estuda no trabalho e no transporte, então a fase 1 é só leitura e compreensão de gramática (sem áudio, sem microfone). Speaking e listening ficam para uma fase 2, a ser desenhada depois.
- Cada tema (Cinema, Música, Arte, Design, Marketing) tem cor, cor de painel e mascote definidos em `THEMES` no `app.js` (blob de pontas, sol, mão, quadrado, cápsula). A lição só precisa de `theme`. Os mascotes são SVGs inline gerados por `mascotSVG(kind, mood, body)`, com humores `happy`, `oops` e `calm`.
- PWA: `manifest.webmanifest` + `sw.js` (cache de rede-primeiro). **Ao mudar qualquer arquivo, aumente `CACHE` em `sw.js`**, senão o celular pode continuar servindo a versão antiga.
- Estilo: tokens de cor em `:root` de `style.css`. Fontes Bricolage Grotesque e DM Sans vêm do Google Fonts (com fallback de sistema, então offline continua usável).

## Convenções de conteúdo

- **Tom: analogias e humor leve.** Toda explicação de lição traz uma analogia (campo `mold.analogy`, ex: present perfect como currículo, passado simples como agenda). Todo exercício traz `why` (mostrado no acerto E no erro, num bloco "Por quê": mostra a regra funcionando na frase do exercício, quem é o sujeito, por que pede has/have, onde cada peça entra, com uma imagem ou analogia) e `right` (comentário divertido ligado ao tema, só no acerto). Os títulos "Isso aí!" e "Quase." são sorteados em `app.js`, não repetir nos dados.
- Textos para a Nayara em pt-BR, sem travessão (—), usando vírgula ou ponto.
- Nunca inventar regra gramatical: explicações curtas e verificáveis.
- Para testar layout, usar largura real de celular (390px). O Edge headless impõe largura mínima e engana ao fingir 390px; renderizar dentro de um `<iframe style="width:390px">` resolve.

## Leituras (reading.js)
Seção "Leituras" na home, separada das lições. Cada leitura é um resumo curto de filme, música ou obra, com 3 etapas: Leia (toque na frase para ver a tradução, sem destacar as palavras), Complete (digitar a palavra em cada espaço; "Preciso de ajuda" mostra o banco com palavras que não servem) e Traduza (3 frases, ela escreve e compara com um modelo, sem correção automática).
Formato: `R(id, tema, título, sobre, [lições], [S(frase, tradução)], [extras], [frases p/ traduzir])`. Espaços: `[palavra|dica|outra/outra]` (dica aparece só no erro; a terceira parte lista respostas alternativas válidas). Ids de leitura começam em 101. Resumos são texto original, sem trechos de letra de música; conferir fatos antes de incluir. Progresso em `saved.read`.

### Leituras: glossário, erros e revisão
- Formato do espaço: `[palavra|dica|outra/outra|idDaLição]`. O 4º campo liga o espaço à lição que ensina aquilo (alimenta o painel de erros). `"¶ "` abre parágrafo. O 9º argumento de `R(...)` é o glossário `{palavra: tradução}` (palavras sublinhadas na etapa 1, também usadas no checklist da etapa 3).
- Digitação aceita contrações (`I've watched`), alternativas listadas e erro de uma letra em palavras de 7+ letras (marca como certo e pede para conferir a grafia). Distratores (`extras`) nunca contam como quase certo.
- Erros: `saved.miss[idLição]` e `saved.missEx["idLição:nºExercício"]`. Errar em exercício ou espaço de leitura soma; acertar na Revisão subtrai. A home mostra as 5 lições com mais erros e o botão "Revisar agora" (até 8 exercícios das 3 piores lições, os errados primeiro). Sem placar de acertos, só pontos em aberto.

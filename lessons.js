// Lições do app, em formato compacto. Para criar uma lição nova, copie uma chamada T(...) abaixo.
//
// T(id, tema, gramática, título, M(...), [exercícios], [5 frases de troca], W(...))
//   tema: "Cinema" | "Música" | "Arte" (define cor e mascote da lição)
//   M(frase, tradução, quando usar, analogia, [fórmula], nota?)   frase com [colchetes] destaca a estrutura
//   O(tradução, "bloco|bloco|bloco", "extra|extra", por quê, comentário no acerto)
//       os blocos estão NA ORDEM CERTA; o app embaralha. A resposta é a junção dos blocos.
//       Escreva exercícios com uma única ordem válida.
//   C(frase com ___, [opções], índiceCerto, por quê, comentário no acerto)
//   Troca: 3 pares [frase, tradução], sempre na ordem Cinema, Música, Arte.
//   W(pedido, placeholder, [modelos], [checklist])
//
// Voz (speaking/listening) fica para uma fase 2: não há etapa de áudio por enquanto.
(function () {
  var THEMES = ["Cinema", "Música", "Arte"];

  function parse(s) {
    var out = [], re = /\[([^\]]+)\]/g, last = 0, m;
    while ((m = re.exec(s))) {
      if (m.index > last) out.push({ t: s.slice(last, m.index) });
      out.push({ t: m[1], h: true });
      last = m.index + m[0].length;
    }
    if (last < s.length) out.push({ t: s.slice(last) });
    return out;
  }
  function M(sentence, pt, explain, analogy, formula, note) {
    return { sentence: parse(sentence), pt: pt, explain: explain, analogy: analogy, formula: formula, note: note };
  }
  function O(pt, blocks, extra, why, right) {
    var b = blocks.split("|");
    return { type: "order", pt: pt, answer: b.join(" "), blocks: b, extra: extra ? extra.split("|") : [], why: why, right: right };
  }
  function C(prompt, options, answer, why, right) {
    return { type: "choice", prompt: prompt, options: options, answer: answer, why: why, right: right };
  }
  function S(pairs) {
    return {
      intro: "Mesma estrutura, outro assunto. Toque nos temas e veja como só as peças mudam.",
      items: pairs.map(function (p, i) { return { label: THEMES[i], sentence: parse(p[0]), pt: p[1] }; })
    };
  }
  function W(prompt, placeholder, models, checklist) {
    return { prompt: prompt, placeholder: placeholder, models: models, checklist: checklist };
  }
  function T(id, theme, grammar, title, mold, exercises, swap, own) {
    return { id: id, theme: theme, grammar: grammar, title: title, mold: mold, exercises: exercises, swap: S(swap), own: own };
  }

  window.THEME_ORDER = THEMES;
  // Grupos da home, na ordem de estudo. Cada lição aparece em um grupo (ids de T(...)).
  window.LESSON_GROUPS = [
    { name: "Present perfect", ids: [1, 2, 3, 4, 11] },
    { name: "Passado", ids: [12, 5, 6, 10] },
    { name: "Futuro", ids: [7, 8, 9] },
    { name: "Preposições", ids: [13, 14, 15, 20] },
    { name: "Phrasal verbs", ids: [16, 17, 18, 19, 21] },
    { name: "Conectores", ids: [22, 23, 24, 28, 29] },
    { name: "Frases mais longas", ids: [25, 26, 27, 30] }
  ];
  window.LESSONS = [

    // ---------------------------------------------------------------- TEMPOS VERBAIS
    T(1, "Cinema", "Present perfect", "Filmes que você já viu",
      M("I [have watched] this movie three times.",
        "Eu já assisti a esse filme três vezes.",
        "Use quando você fala de algo que já aconteceu na sua vida, mas o momento exato não importa. O foco é a experiência. Se você citar quando foi (yesterday, in 2019), troque pelo passado simples: I watched it yesterday.",
        "Pensa assim: o present perfect é o seu currículo de filmes. Ele lista o que você já viu na vida, sem data. O passado simples é a agenda: tem dia e hora, tipo ontem ou 2019.",
        ["I, you, we, they + have + particípio", "he, she, it + has + particípio"],
        "Particípio é a forma do verbo que vem depois de have ou has. Nos verbos regulares ele é igual ao passado (watched). Nos irregulares muda: see vira seen, go vira gone, be vira been."),
      [
        O("Ela já viu todos os filmes do Tarantino.", "She|has seen|every|Tarantino|movie.", "have seen",
          "Aqui o sujeito é she, e she pede has, nunca have. Depois vem o particípio de see, que é seen. Montando: She + has + seen. O have seen sobrava: é o figurante que não entrou no filme.",
          "Ela é fã de carteirinha do Tarantino."),
        O("Você já assistiu a um filme no cinema sozinho?", "Have|you|ever|watched|a movie|in a theater|alone?", "Did",
          "É pergunta, então o have sobe pro começo, antes do sujeito: Have + you + ever + watched. O Did fica de fora porque é do passado simples, e aqui a ideia é experiência de vida.",
          "Essa pergunta ficou com cara de entrevista de cinema."),
        C("She ___ never watched a horror movie.", ["have", "has", "is"], 1,
          "O sujeito é she, então o auxiliar é has. She, he e it são os convidados VIP que só entram com has. Montando: She + has + never + watched. O never fica entre o has e o particípio.",
          "She e has andam juntos, tipo pipoca e cinema."),
        C("___ you ever seen a Studio Ghibli film?", ["Did", "Has", "Have"], 2,
          "O sujeito é you, então o auxiliar é have (has é só do trio he, she, it). Como é pergunta, ele vem primeiro: Have + you + ever + seen. O Did é do passado simples e não combina com seen.",
          "O you nunca anda sem o have."),
        C("They have ___ the trailer three times.", ["watch", "watched", "watching"], 1,
          "O sujeito é they, então have está certo. Depois de have, o verbo precisa vir no particípio: watch (cru) e watching (gerúndio) não servem, watched serve. Montando: They + have + watched.",
          "Depois do have, o verbo precisa vestir a fantasia de particípio.")
      ],
      [
        ["I [have watched] this movie three times.", "Eu já assisti a esse filme três vezes."],
        ["I [have listened] to this album ten times.", "Eu já ouvi esse álbum dez vezes."],
        ["I [have visited] this museum twice.", "Eu já visitei esse museu duas vezes."]
      ],
      W("Agora é com você. Escreva uma frase dizendo um filme ou série que você já viu e quantas vezes.", "I have watched ...",
        ["I have watched Barbie twice.", "I have seen every Wes Anderson movie.", "I have never watched a horror movie alone."],
        ["Tem have ou has?", "O verbo está no particípio?", "Tem a ideia de quantas vezes ou de experiência?"])
    ),

    T(2, "Música", "Passado simples vs present perfect", "Quando foi? Então é passado",
      M("I [saw] this band live in 2019.",
        "Eu vi essa banda ao vivo em 2019.",
        "Quando você diz quando algo aconteceu (in 2019, last night, two years ago), use o passado simples. Sem marcar o momento, use o present perfect.",
        "Pensa assim: o passado simples é a foto com a data impressa no canto. O present perfect é o álbum de fotos sem data, onde o que importa é que você tem essas memórias.",
        ["Passado simples: sujeito + verbo no passado (saw, listened)", "Marcadores de tempo fechado: yesterday, last week, in 2019, two days ago"],
        "Verbos regulares ganham -ed (listened). Os irregulares mudam de forma: see vira saw, go vira went, buy vira bought."),
      [
        O("Eu ouvi esse álbum ontem.", "I|listened to|this album|yesterday.", "have listened to",
          "Tem yesterday, ou seja, uma data fechada. Com data, o verbo vai pro passado simples: I + listened. O have listened ficou de fora porque é do present perfect.",
          "Ontem teve trilha sonora."),
        O("Eles foram a um show na semana passada.", "They|went to|a concert|last week.", "have gone to",
          "Last week é um tempo terminado, então passado simples. Go é irregular: o passado é went, nunca goed.",
          "Went é daqueles irregulares que a gente só decora mesmo."),
        C("She ___ her favorite song two days ago.", ["wrote", "has written", "writes"], 0,
          "Two days ago marca um momento fechado, então passado simples. Write é irregular: o passado é wrote.",
          "O ago entregou: tempo fechado pede passado."),
        C("Did you ___ the new album last night?", ["hear", "heard", "hearing"], 0,
          "Depois de did, o verbo volta pra forma base: Did + you + hear. O did já carrega o passado, então o verbo não precisa carregar de novo.",
          "O did já faz o trabalho do passado."),
        C("We ___ that song at the party last Saturday.", ["have played", "played", "play"], 1,
          "Last Saturday é um momento fechado, então passado simples: played. Have played pediria um tempo que ainda não acabou ou sem data.",
          "Last Saturday é data, passado simples resolve.")
      ],
      [
        ["I [watched] this movie in 2019.", "Eu assisti a esse filme em 2019."],
        ["I [saw] this band live in 2019.", "Eu vi essa banda ao vivo em 2019."],
        ["I [visited] this museum in 2019.", "Eu visitei esse museu em 2019."]
      ],
      W("Escreva uma frase sobre algo que você fez no ano passado, dizendo quando.", "Last year I ...",
        ["Last year I went to a concert in São Paulo.", "I watched that series two months ago.", "I visited a street art exhibition in 2023."],
        ["O verbo está no passado simples?", "Tem uma indicação de quando (last year, ago, in 2023)?", "Se o verbo é irregular, usou a forma certa (went, saw, bought)?"])
    ),

    T(3, "Arte", "Present perfect com for e since", "Desde quando você curte?",
      M("I [have loved] this painter [for] ten years.",
        "Eu amo esse pintor há dez anos.",
        "Quando algo começou no passado e continua até agora, use present perfect com for (quanto tempo dura) ou since (a partir de quando).",
        "Pensa assim: for é o cronômetro, mostra a duração. Since é o botão de play, mostra o dia em que tudo começou.",
        ["for + período: for five years, for two weeks", "since + ponto no tempo: since 2015, since Monday, since I was a kid"],
        "Em português usamos o presente (eu amo há dez anos). Em inglês o presente simples não funciona aqui: I love this painter for ten years está errado. Use have + particípio."),
      [
        O("Ela trabalha como ilustradora desde 2018.", "She|has worked|as an illustrator|since|2018.", "for",
          "O sujeito é she, então has. 2018 é um ponto de partida, então since. Montando: She + has worked + since + 2018. For ficou de fora porque ele pede uma duração, tipo five years.",
          "Since 2018 é o botão de play dela."),
        O("Nós conhecemos esse artista há três anos.", "We|have known|this artist|for|three years.", "since",
          "Three years é uma duração, então for. Know é irregular: o particípio é known. Montando: We + have known + for + three years.",
          "Three years é cronômetro, o for entra na hora."),
        C("I have been a fan of this gallery ___ 2019.", ["for", "since", "from"], 1,
          "2019 é um ponto de partida, e since pede um ponto de partida. For pediria uma duração, como five years.",
          "2019 é o dia do play, since."),
        C("They have studied sculpture ___ six months.", ["since", "for", "ago"], 1,
          "Six months é uma duração, então for. Since pediria um ponto no calendário, como January.",
          "Six months é cronômetro, for."),
        C("He ___ this painting since he was a child.", ["loves", "has loved", "is loving"], 1,
          "Since marca o início de algo que continua até agora, e isso pede present perfect: He + has loved. O presente simples (loves) não funciona com since em inglês.",
          "Has loved: o amor começou lá atrás e segue vivo.")
      ],
      [
        ["I [have followed] this director [for] six years.", "Eu sigo esse diretor há seis anos."],
        ["I [have listened] to this band [since] 2018.", "Eu ouço essa banda desde 2018."],
        ["I [have loved] this painter [for] ten years.", "Eu amo esse pintor há dez anos."]
      ],
      W("Escreva há quanto tempo você faz ou gosta de algo.", "I have ... for/since ...",
        ["I have liked horror movies since I was a kid.", "I have worked in this area for three years.", "I have followed this artist since 2020."],
        ["Tem have ou has?", "Usou for com uma duração ou since com um ponto de partida?", "O verbo está no particípio?"])
    ),

    T(4, "Música", "Present perfect com already, yet e just", "Já fiz? Ainda não?",
      M("I [have already heard] the new album.",
        "Eu já ouvi o álbum novo.",
        "Três palavrinhas dão o clima do present perfect: already (já, em frases afirmativas), yet (ainda não ou já, em negativas e perguntas) e just (acabou de).",
        "Pensa assim: é a sua fila de músicas. Already é a faixa que já tocou, yet é a que ainda não chegou, e just é a que acabou de terminar.",
        ["already: afirmativas (I have already heard it)", "yet: negativas e perguntas, no fim (I haven't heard it yet / Have you heard it yet?)", "just: acabou de (I have just heard it)"],
        "No inglês americano, o passado simples também aparece com already e yet. Aqui seguimos com o present perfect, que funciona em qualquer lugar."),
      [
        O("Eu ainda não ouvi o álbum novo.", "I|haven't|heard|the new album|yet.", "already",
          "É uma frase negativa, então o yet vai pro fim. Haven't é have + not. Hear é irregular: o particípio é heard. Montando: I + haven't + heard + the new album + yet. O already é do lado afirmativo.",
          "Yet no fim: a faixa que ainda não tocou."),
        O("Você já ouviu a música nova?", "Have|you|heard|the new song|yet?", "already",
          "É pergunta, então o have vem primeiro, e o yet fecha a frase. Hear é irregular: o particípio é heard. Montando: Have + you + heard + the new song + yet?",
          "Pergunta de quem quer trocar ideia sobre o lançamento."),
        C("I haven't listened to the album ___.", ["already", "yet", "just"], 1,
          "Frase negativa pede yet no final. Already e just ficam nas afirmativas.",
          "Negativa e yet: o casal clássico."),
        C("Look! The band has ___ posted a new single. It dropped a second ago!", ["just", "yet", "ever"], 0,
          "Just quer dizer acabou de, e é isso que a frase conta: aconteceu agora mesmo.",
          "Just: quentinho, acabou de sair do forno."),
        C("I have ___ listened to this album twice, so I know every song.", ["already", "yet", "ago"], 0,
          "Frase afirmativa e o fato já está pronto: already. O yet ficaria numa negativa ou pergunta.",
          "Already: faixa que já tocou.")
      ],
      [
        ["I [have already watched] this series.", "Eu já assisti a essa série."],
        ["I [have already heard] the new album.", "Eu já ouvi o álbum novo."],
        ["I [have already visited] this museum.", "Eu já visitei esse museu."]
      ],
      W("Escreva algo que você já fez hoje e algo que ainda não fez.", "I have already ..., but I haven't ... yet.",
        ["I have already had coffee, but I haven't answered my messages yet.", "I have already seen the trailer, but I haven't watched the movie yet.", "I have just arrived, and I haven't started yet."],
        ["Usou already numa frase afirmativa?", "Usou haven't ou hasn't com yet no fim?", "O verbo está no particípio?"])
    ),

    T(5, "Arte", "Past continuous", "O que estava rolando?",
      M("I [was painting] a mural when you called.",
        "Eu estava pintando um mural quando você ligou.",
        "O past continuous descreve uma ação que estava em andamento num momento do passado, geralmente como pano de fundo de outra coisa que aconteceu.",
        "Pensa assim: é o fundo de um quadro. O passado simples é o que aparece em primeiro plano. Aqui, you called é o detalhe que chamou atenção, e was painting é o fundo que já estava lá.",
        ["I, he, she, it + was + verbo com -ing", "you, we, they + were + verbo com -ing"],
        "Verbos que terminam em -e perdem o e (write vira writing). Verbos curtos terminados em vogal + consoante dobram a consoante (run vira running)."),
      [
        O("Ela estava pintando um retrato.", "She|was painting|a portrait.", "were painting|painted",
          "O sujeito é she, então was. Montando: She + was + painting + a portrait. Were é do you, we e they.",
          "She estava pintando, a cena já rolava."),
        O("Nós estávamos esperando a inauguração.", "We|were waiting|for|the opening.", "was waiting",
          "O sujeito é we, então were. Montando: We + were + waiting. Lembre que wait pede for: waiting for the opening.",
          "We were: o grupo todo esperando junto."),
        C("They ___ a sculpture when the lights went out.", ["were making", "was making", "are making"], 0,
          "O sujeito é they, então were, e a ação estava em andamento: were making. When the lights went out é o corte da cena.",
          "Were making: a escultura rolando e a luz caindo no meio."),
        C("I ___ on a sketch at midnight.", ["was working", "were working", "working"], 0,
          "O sujeito é I, então was. Were é de you, we e they. Montando: I + was + working.",
          "I was, nunca I were."),
        C("What ___ you doing when I called?", ["was", "were", "did"], 1,
          "O sujeito é you, então were: What + were + you + doing. O did é do passado simples e não combina com doing.",
          "Were you: o you sempre pede were.")
      ],
      [
        ["I [was watching] a movie when you called.", "Eu estava assistindo a um filme quando você ligou."],
        ["I [was listening] to music when you called.", "Eu estava ouvindo música quando você ligou."],
        ["I [was painting] a mural when you called.", "Eu estava pintando um mural quando você ligou."]
      ],
      W("Escreva o que você estava fazendo quando algo inesperado aconteceu.", "I was ... when ...",
        ["I was watching a series when the internet went down.", "She was singing on stage when the mic stopped working.", "I was walking to work when it started to rain."],
        ["Usou was ou were?", "O verbo principal termina em -ing?", "Tem uma segunda ação no passado simples (when ...)?"])
    ),

    T(6, "Cinema", "Past continuous vs passado simples", "Plot twist no passado",
      M("While I [was watching] the movie, my phone [rang].",
        "Enquanto eu assistia ao filme, meu celular tocou.",
        "Use a ação longa no past continuous e a interrupção curta no passado simples. While liga a ação longa. When costuma ligar a ação curta.",
        "Pensa assim: a ação longa é a trilha sonora que está tocando. A curta é o efeito sonoro que corta no meio. Os dois convivem, mas só um deles interrompe.",
        ["Ação longa: was / were + -ing", "Interrupção: passado simples (rang, called, arrived)", "while liga a ação longa, when liga a curta"],
        "Quando as duas ações são longas e acontecem ao mesmo tempo, use past continuous nas duas: While I was cooking, she was reading."),
      [
        O("Enquanto ela cozinhava, o celular dela tocou.", "While|she|was cooking,|her phone|rang.", "cooked",
          "Cozinhar é a ação longa, então past continuous: she + was cooking. Tocar é a interrupção curta, então passado simples: rang. While abre a ação longa.",
          "Ação longa na panela, interrupção no celular."),
        O("O filme acabou enquanto eu dormia.", "The movie|ended|while|I|was sleeping.", "slept",
          "Dormir é a ação longa (was sleeping) e acabar é o ponto curto (ended). While liga a ação longa.",
          "Dormiu no melhor momento, clássico."),
        C("I was eating popcorn when the lights ___.", ["went out", "were going out", "go out"], 0,
          "Apagar é a interrupção curta, então passado simples: went out. O go out ficaria no presente e não combina com was eating.",
          "Went out: cortina baixando."),
        C("She was reading the script when I ___ in.", ["walked", "walk", "walks"], 0,
          "Entrar é o evento curto que interrompe a leitura, então passado simples: walked.",
          "Walked: entrada de personagem no meio da cena."),
        C("While we ___ the finale, the power went out.", ["was watching", "were watching", "watching"], 1,
          "O sujeito é we, então were. A ação longa de assistir fica no past continuous: were watching.",
          "Were watching: o episódio final em andamento.")
      ],
      [
        ["While I [was watching] the movie, my phone [rang].", "Enquanto eu assistia ao filme, meu celular tocou."],
        ["While I [was listening] to the album, my phone [rang].", "Enquanto eu ouvia o álbum, meu celular tocou."],
        ["While I [was painting], my phone [rang].", "Enquanto eu pintava, meu celular tocou."]
      ],
      W("Escreva algo que te interrompeu enquanto você fazia outra coisa.", "While I was ..., ...",
        ["While I was working, my laptop turned off.", "I was cooking when my sister called.", "While we were watching the show, the lights went out."],
        ["A ação longa está no past continuous?", "A interrupção está no passado simples?", "Usou while ou when para ligar as duas?"])
    ),

    T(7, "Música", "Futuro com will", "Decisão na hora",
      M("I think this song [will become] a hit.",
        "Acho que essa música vai virar um hit.",
        "Use will para previsões (o que você acha que vai acontecer) e para decisões tomadas na hora de falar.",
        "Pensa assim: will é a bola de cristal e também o 'ok, deixa comigo!' que sai no calor do momento. Planos já combinados ficam com outro tempo, que vem na próxima lição.",
        ["sujeito + will + verbo na forma base (sem to)", "Negativa: will not, forma curta won't", "Pergunta: Will + sujeito + verbo?"],
        "O will é igual para todo mundo: he will, she will, they will. Nada de wills nem de will to."),
      [
        O("Ela vai amar essa playlist.", "She|will|love|this playlist.", "loves|to",
          "Previsão sobre o futuro: will + verbo base. O will não muda com she, e o verbo não ganha s nem to. Montando: She + will + love.",
          "Bola de cristal ligada."),
        O("Eu não vou perder o show.", "I|won't|miss|the concert.", "will",
          "Won't é will not. Depois dele vem o verbo base: I + won't + miss. Sem to, sem s.",
          "Won't: promessa feita com a mão no coração."),
        C("Don't worry, I ___ you the lyrics.", ["will send", "will to send", "sends"], 0,
          "Decisão na hora: will + verbo base. Will to e sends não funcionam: depois de will não entra to, e o verbo não leva s.",
          "Will send: ofereceu e já resolveu."),
        C("I think this band ___ be famous.", ["will", "wills", "to"], 0,
          "Will é igual pra todo mundo. Wills não existe. Montando: I think + this band + will + be.",
          "Will não precisa de s, é independente."),
        C("Wait, the volume is too loud. I ___ turn it down.", ["will", "do", "am"], 0,
          "Decisão tomada na hora, então will + verbo base: I will turn it down.",
          "Decisão relâmpago: will.")
      ],
      [
        ["I think this movie [will win] an award.", "Acho que esse filme vai ganhar um prêmio."],
        ["I think this song [will become] a hit.", "Acho que essa música vai virar um hit."],
        ["I think this painting [will sell] fast.", "Acho que esse quadro vai vender rápido."]
      ],
      W("Escreva uma previsão sobre algo da sua semana ou do seu trabalho.", "I think ... will ...",
        ["I think the meeting will be short.", "I think this series will get a second season.", "I think my friends will love the idea."],
        ["Usou will antes do verbo?", "O verbo está na forma base (sem to, sem s)?", "É uma previsão ou decisão na hora?"])
    ),

    T(8, "Arte", "Futuro com going to", "O plano já tá na cabeça",
      M("I [am going to paint] a mural this weekend.",
        "Eu vou pintar um mural neste fim de semana.",
        "Use going to para planos e intenções que você já decidiu antes de falar, ou quando há sinais de que algo vai acontecer.",
        "Pensa assim: will é o improviso, going to é a reserva já feita. Quem diz am going to paint já comprou a tinta.",
        ["I + am going to + verbo base", "he, she, it + is going to + verbo base", "you, we, they + are going to + verbo base"],
        "Na fala, going to costuma virar gonna. Na escrita e em contextos mais sérios, prefira going to."),
      [
        O("Ela vai visitar o museu amanhã.", "She|is going to|visit|the museum|tomorrow.", "are going to",
          "O sujeito é she, então is going to. Depois vem o verbo base: visit. Are é de you, we e they.",
          "Is going to: roteiro já fechado."),
        O("Nós vamos montar uma exposição.", "We|are going to|set up|an exhibition.", "is going to",
          "O sujeito é we, então are going to. Montando: We + are going to + set up.",
          "Are going to: o grupo inteiro já se organizou."),
        C("Look at those clouds! It ___ rain.", ["is going to", "will to", "going to"], 0,
          "Há um sinal claro (as nuvens), então going to. O sujeito é it, então is. Will to não existe e going to sozinho fica sem o is.",
          "As nuvens avisaram, e você também."),
        C("I have already bought the canvas. I ___ paint tonight.", ["am going to", "going to", "is going to"], 0,
          "O sujeito é I, então am. Já tem o plano (já comprou a tela), então going to: I am going to paint.",
          "Plano com tela comprada: am going to."),
        C("They ___ open a new gallery next year.", ["is going to", "are going to", "am going to"], 1,
          "O sujeito é they, então are going to.",
          "They are: o plural pede are.")
      ],
      [
        ["I [am going to watch] a horror movie tonight.", "Eu vou assistir a um filme de terror hoje à noite."],
        ["I [am going to see] my favorite band tonight.", "Eu vou ver minha banda favorita hoje à noite."],
        ["I [am going to paint] a mural this weekend.", "Eu vou pintar um mural neste fim de semana."]
      ],
      W("Escreva um plano seu para o fim de semana.", "I am going to ...",
        ["I am going to visit an art fair on Saturday.", "We are going to watch a movie tonight.", "I am going to organize my portfolio."],
        ["Usou am, is ou are antes de going to?", "Depois de going to vem o verbo na forma base?", "É um plano que você já decidiu?"])
    ),

    T(9, "Cinema", "Present continuous para o futuro", "Já tá marcado",
      M("I [am watching] the premiere on Friday.",
        "Eu vou assistir à estreia na sexta.",
        "Use o present continuous (am, is, are + -ing) junto com um dia ou horário para falar de compromissos combinados com alguém, tipo agenda.",
        "Pensa assim: o present continuous é o convite do calendário. Se tem dia, hora e outra pessoa envolvida, já está confirmado.",
        ["am, is, are + verbo com -ing", "+ um momento futuro: tomorrow, on Friday, at 8 pm"],
        "Sem a indicação de tempo, a frase fica no presente: I am watching the premiere quer dizer que está acontecendo agora."),
      [
        O("Nós vamos assistir ao filme às 20h.", "We|are watching|the movie|at 8 pm.", "is watching",
          "Compromisso marcado, com horário: present continuous. O sujeito é we, então are. Montando: We + are watching + at 8 pm.",
          "Horário marcado: present continuous na agenda."),
        O("Ela vai encontrar o elenco amanhã.", "She|is meeting|the cast|tomorrow.", "are meeting",
          "O sujeito é she, então is. Tomorrow dá o momento futuro. Montando: She + is meeting + tomorrow.",
          "Is meeting: encontro confirmado."),
        C("I ___ a film festival on Tuesday.", ["am attending", "attending", "attended"], 0,
          "Compromisso futuro com dia marcado: am + attending. Attended é passado, e attending sozinho fica sem o am.",
          "Tem dia marcado? Present continuous."),
        C("They ___ the new trailer tomorrow morning.", ["is releasing", "are releasing", "releases"], 1,
          "O sujeito é they, então are releasing. Tomorrow morning dá o momento do compromisso.",
          "Are releasing: o plural pede are."),
        C("What time ___ you leaving tonight?", ["is", "are", "do"], 1,
          "O sujeito é you, então are: What time + are + you + leaving. Do não combina com o -ing.",
          "Are you leaving: pergunta de agenda.")
      ],
      [
        ["I [am watching] the premiere on Friday.", "Eu vou assistir à estreia na sexta."],
        ["I [am seeing] my favorite band on Friday.", "Eu vou ver minha banda favorita na sexta."],
        ["I [am visiting] the exhibition on Friday.", "Eu vou visitar a exposição na sexta."]
      ],
      W("Escreva um compromisso que você já tem marcado.", "I am ... on ...",
        ["I am having lunch with a friend on Saturday.", "We are watching a documentary on Monday.", "I am seeing a movie tomorrow night."],
        ["Usou am, is ou are + verbo com -ing?", "Tem um dia ou horário no futuro?", "É algo que já está combinado?"])
    ),

    T(10, "Música", "Past perfect", "O que já tinha acontecido antes",
      M("The concert [had started] when I arrived.",
        "O show já tinha começado quando eu cheguei.",
        "O past perfect (had + particípio) mostra uma ação que já tinha acontecido antes de outro momento no passado.",
        "Pensa assim: é o flashback de um videoclipe, a cena que mostra o que aconteceu antes da cena principal.",
        ["had + particípio (igual para todos os sujeitos)", "Costuma vir junto de uma segunda ação no passado simples"],
        "Had é igual para I, you, he, she, we e they. Nada de has nem have: só had."),
      [
        O("A banda já tinha tocado a minha música favorita.", "The band|had|already|played|my favorite song.", "has",
          "A banda tocou antes de outro momento do passado, então past perfect: had + played. O has é do present perfect e não cabe aqui.",
          "Had played: ela tocou antes de você chegar."),
        O("Nós já tínhamos chegado quando ela começou a cantar.", "We|had arrived|when|she|started singing.", "have arrived",
          "Chegar aconteceu antes de começar a cantar, então had arrived vai na primeira ação, e started (passado simples) vai na segunda.",
          "Had arrived: o flashback, started: a cena principal."),
        C("When I got to the venue, the band ___ left.", ["had", "has", "was"], 0,
          "A banda saiu antes de eu chegar, então past perfect: had left. Has é do present perfect.",
          "Had left: eles saíram antes da sua chegada."),
        C("She ___ never heard that song before the concert.", ["had", "has", "was"], 0,
          "O momento de referência é o show, no passado. Antes dele, ela nunca tinha ouvido a música: had + never + heard.",
          "Had never heard: primeira vez, no flashback."),
        C("They had already ___ all the tickets.", ["sell", "sold", "selling"], 1,
          "Depois de had vem o particípio. Sell é irregular: o particípio é sold.",
          "Sold: esgotou antes de você chegar.")
      ],
      [
        ["The movie [had started] when I arrived.", "O filme já tinha começado quando eu cheguei."],
        ["The concert [had started] when I arrived.", "O show já tinha começado quando eu cheguei."],
        ["The exhibition [had opened] when I arrived.", "A exposição já tinha aberto quando eu cheguei."]
      ],
      W("Escreva o que já tinha acontecido quando você chegou em algum lugar.", "When I arrived, ... had ...",
        ["When I arrived, the movie had already started.", "The store had closed when we got there.", "When I woke up, she had already left."],
        ["Usou had + particípio para a ação mais antiga?", "A outra ação está no passado simples?", "A ordem dos eventos faz sentido?"])
    ),

    T(11, "Cinema", "Present perfect continuous", "Há horas nisso",
      M("I [have been watching] this series all day.",
        "Eu estou assistindo essa série o dia todo.",
        "Use have been + -ing para uma ação que começou no passado, continua até agora e em que o foco é a duração ou o processo.",
        "Pensa assim: o present perfect simples mostra o resultado final. O continuous é a câmera mostrando o processo ainda rolando.",
        ["I, you, we, they + have been + -ing", "he, she, it + has been + -ing", "Combina com for e since: for two hours, since morning"],
        "Verbos de estado (know, like, love) não costumam usar o continuous. Dizemos I have known her for years, não I have been knowing."),
      [
        O("Eles estão filmando desde as 6h.", "They|have been|filming|since|6 am.", "for",
          "O sujeito é they, então have been, e o verbo ganha -ing: filming. 6 am é um ponto de partida, então since.",
          "Filmando desde cedo: set de filmagem raiz."),
        O("Ela está editando esse filme há três meses.", "She|has been|editing|this film|for|three months.", "since",
          "O sujeito é she, então has been + editing. Three months é uma duração, então for.",
          "Três meses de edição: paciência de montador."),
        C("I ___ waiting for the trailer for hours.", ["have been", "has been", "am being"], 0,
          "O sujeito é I, então have been + waiting. Has é de he, she, it, e am being não dá a ideia de ação contínua até agora.",
          "Have been waiting: a espera que não acaba."),
        C("He ___ been directing since 2020.", ["have", "has", "is"], 1,
          "O sujeito é he, então has been. Since 2020 marca o início.",
          "Has been: he, she, it, sempre has."),
        C("We have been ___ this scene all morning.", ["shoot", "shooting", "shot"], 1,
          "Depois de have been, o verbo vai pro -ing: shooting.",
          "Shooting: gravando cena sem parar.")
      ],
      [
        ["I [have been watching] this series all day.", "Eu estou assistindo essa série o dia todo."],
        ["I [have been listening] to this album all day.", "Eu estou ouvindo esse álbum o dia todo."],
        ["I [have been painting] this mural all day.", "Eu estou pintando esse mural o dia todo."]
      ],
      W("Escreva algo que você está fazendo há um tempo.", "I have been ... for/since ...",
        ["I have been studying English for two months.", "She has been working on this project since January.", "We have been planning this trip for weeks."],
        ["Usou have been ou has been?", "O verbo termina em -ing?", "Marcou o tempo com for ou since?"])
    ),

    T(12, "Música", "Used to", "Antigamente eu...",
      M("I [used to listen] to rock all the time.",
        "Eu costumava ouvir rock o tempo todo.",
        "Used to fala de hábitos e situações do passado que não acontecem mais.",
        "Pensa assim: é a playlist antiga, a trilha de uma fase da vida que já ficou pra trás.",
        ["used to + verbo base", "Negativa: didn't use to + verbo base", "Pergunta: Did + sujeito + use to + verbo base?"],
        "Na negativa e na pergunta, o did já carrega o passado, então o used volta pra use: I didn't use to like jazz."),
      [
        O("Ela costumava cantar num coral.", "She|used to|sing|in a choir.", "uses to",
          "Used to é fixo pra todos os sujeitos: She + used to + sing. Depois dele, o verbo fica na forma base.",
          "Used to: capítulo antigo da história dela."),
        O("Eu não costumava gostar de jazz.", "I|didn't|use to|like|jazz.", "used to",
          "Na negativa, o didn't leva o passado, então o used volta pra use: I + didn't + use to + like.",
          "Didn't use to: o used se aposentou aqui."),
        C("We ___ go to concerts every month.", ["used to", "use to", "were used"], 0,
          "Hábito no passado: used to + verbo base. Use to sozinho (sem did) não funciona numa afirmativa.",
          "Used to: um hábito que ficou no passado."),
        C("Did you ___ play the piano?", ["use to", "used to", "using to"], 0,
          "Na pergunta com did, o used volta pra use: Did + you + use to + play.",
          "Did leva o passado, use fica fresquinho."),
        C("He ___ like pop, but now he loves it.", ["didn't use to", "didn't used to", "doesn't use to"], 0,
          "A negativa do passado usa didn't use to. Doesn't é do presente, e used depois de didn't é um erro comum.",
          "Didn't use to: gosto que mudou.")
      ],
      [
        ["I [used to watch] cartoons every morning.", "Eu costumava assistir a desenhos toda manhã."],
        ["I [used to listen] to rock all the time.", "Eu costumava ouvir rock o tempo todo."],
        ["I [used to draw] on every notebook.", "Eu costumava desenhar em todo caderno."]
      ],
      W("Escreva algo que você costumava fazer e não faz mais.", "I used to ...",
        ["I used to read comics every weekend.", "We used to play video games after school.", "I used to hate coffee."],
        ["Usou used to + verbo base?", "É algo que não acontece mais?", "Se for negativa, usou didn't use to?"])
    ),

    // ---------------------------------------------------------------- PREPOSIÇÕES E PHRASAL VERBS
    T(13, "Arte", "Preposições de tempo: in, on, at", "In, on, at: o relógio",
      M("The exhibition opens [in] June, [on] the 5th, [at] 9 am.",
        "A exposição abre em junho, no dia 5, às 9h.",
        "Use at para horários exatos, on para dias e datas e in para períodos mais longos (meses, anos, estações, partes do dia).",
        "Pensa assim: é uma lupa. At é o zoom máximo (a hora exata). On é o dia no calendário. In é a visão geral (mês, ano).",
        ["at: at 9 am, at noon, at night", "on: on Monday, on May 5th, on my birthday", "in: in June, in 2026, in the morning, in summer"],
        "Atenção: in the morning e in the afternoon, mas at night. E on the weekend (inglês americano) ou at the weekend (britânico)."),
      [
        O("A galeria abre às nove da manhã.", "The gallery|opens|at|nine|in the morning.", "on",
          "Nove é um horário exato, então at. A parte do dia pede in: in the morning. O on é para dias.",
          "At nove, in the morning: lupa no horário e visão geral no período."),
        O("A exposição acaba na segunda-feira.", "The exhibition|ends|on|Monday.", "in",
          "Monday é um dia da semana, então on. In é para períodos mais longos, como June ou 2026.",
          "On Monday: dia no calendário."),
        C("My class starts ___ 7 pm.", ["at", "on", "in"], 0,
          "7 pm é um horário exato, e horário exato pede at.",
          "At: zoom no relógio."),
        C("The festival is ___ July.", ["at", "on", "in"], 2,
          "July é um mês, e meses pedem in. At seria para horas, on para dias.",
          "In: o mês inteiro entra."),
        C("We have a meeting ___ Tuesday.", ["in", "on", "at"], 1,
          "Tuesday é um dia da semana, então on.",
          "On Tuesday: dia marcado no calendário.")
      ],
      [
        ["The movie starts [at] 8 pm.", "O filme começa às 20h."],
        ["The concert is [on] Saturday.", "O show é no sábado."],
        ["The exhibition opens [in] June, [on] the 5th, [at] 9 am.", "A exposição abre em junho, no dia 5, às 9h."]
      ],
      W("Escreva quando algo vai acontecer, usando in, on ou at.", "The ... is at/on/in ...",
        ["The meeting is at 3 pm on Thursday.", "My birthday is in October.", "I wake up at 7 on weekdays."],
        ["Usou at para a hora exata?", "Usou on para o dia?", "Usou in para mês, ano ou parte do dia?"])
    ),

    T(14, "Música", "Preposições de lugar: in, on, at", "Onde fica?",
      M("The club is [in] São Paulo, [on] Augusta Street, [at] number 100.",
        "A casa de shows fica em São Paulo, na Rua Augusta, no número 100.",
        "Use in para espaços fechados e áreas grandes (cidades, países, salas), on para superfícies e ruas e at para pontos específicos (endereço, evento, lugar como destino).",
        "Pensa assim: in é estar dentro da caixa. On é estar em cima da mesa. At é o pino marcado no mapa.",
        ["in: in a room, in Brazil, in the city", "on: on the wall, on the sofa, on this street", "at: at the studio, at the door, at the concert"],
        "At school, at home, at the studio: usamos at quando o importante é a função do lugar."),
      [
        O("Meu violão está em cima do sofá.", "My guitar|is|on|the sofa.", "in",
          "O sofá é uma superfície e o violão está em cima dele, então on. In seria dentro de algo, tipo in the case.",
          "On the sofa: em cima do sofá, bem à vista."),
        O("Ela está no estúdio.", "She|is|at|the studio.", "on",
          "O estúdio é o ponto de trabalho dela, e a ideia é a função do lugar, então at the studio. On não funciona com studio.",
          "At the studio: onde a música acontece."),
        C("The poster is ___ the wall.", ["in", "on", "at"], 1,
          "A parede é uma superfície, e o cartaz está nela: on the wall.",
          "On the wall: pregado na superfície."),
        C("We live ___ Brazil.", ["in", "on", "at"], 0,
          "Países pedem in: in Brazil. É uma área grande e a gente está dentro dela.",
          "In Brazil: dentro do mapa."),
        C("I will wait for you ___ the entrance.", ["in", "on", "at"], 2,
          "A entrada é um ponto específico de encontro: at the entrance.",
          "At: o pino no mapa.")
      ],
      [
        ["The premiere is [at] the cinema.", "A estreia é no cinema."],
        ["The club is [in] São Paulo, [on] Augusta Street, [at] number 100.", "A casa de shows fica em São Paulo, na Rua Augusta, no número 100."],
        ["The painting is [on] the wall.", "O quadro está na parede."]
      ],
      W("Escreva onde você está agora ou onde algo fica.", "My ... is in/on/at ...",
        ["My phone is on the table.", "I am at work.", "The café is in the building next door."],
        ["Usou in para dentro ou área grande?", "Usou on para superfície ou rua?", "Usou at para um ponto específico?"])
    ),

    T(15, "Cinema", "Verbos e adjetivos com preposição", "Quem anda com quem",
      M("I am [good at] guessing endings and [interested in] documentaries.",
        "Tenho facilidade para adivinhar finais e interesse em documentários.",
        "Alguns adjetivos e verbos sempre andam com uma preposição específica. Não dá pra traduzir do português: é preciso aprender cada dupla.",
        "Pensa assim: são duplas fixas, tipo pipoca e cinema. Good at, interested in, depend on. Separar a dupla soa estranho.",
        ["good at, bad at, interested in, afraid of", "depend on, belong to, believe in", "depois da preposição, o verbo vai pro -ing: good at writing"],
        "Depois de preposição, use -ing: I am interested in learning, não interested in learn."),
      [
        O("Ela é muito boa em adivinhar o final.", "She|is|really good|at|guessing the ending.", "in",
          "A dupla é good at, e depois da preposição o verbo vai pro -ing: guessing. In não combina com good.",
          "Good at: a dupla perfeita."),
        O("Nós estamos interessados nesse diretor.", "We|are|interested|in|this director.", "on",
          "A dupla é interested in. On não serve aqui.",
          "Interested in: dupla clássica."),
        C("I am afraid ___ watching horror movies alone.", ["of", "at", "for"], 0,
          "A dupla é afraid of, e depois de of o verbo vai pro -ing: watching.",
          "Afraid of: quem tem medo, tem of."),
        C("The success of a movie depends ___ the story.", ["of", "on", "in"], 1,
          "A dupla é depend on. Of e in não combinam com depend.",
          "Depends on: o filme apoiado na história."),
        C("He is good at ___ scripts.", ["write", "writing", "wrote"], 1,
          "Depois de uma preposição (at), o verbo vai pro -ing: writing.",
          "Writing: depois da preposição, sempre -ing.")
      ],
      [
        ["I am [good at] guessing endings and [interested in] documentaries.", "Tenho facilidade para adivinhar finais e interesse em documentários."],
        ["I am [interested in] jazz.", "Eu tenho interesse em jazz."],
        ["I am [good at] drawing.", "Eu tenho facilidade para desenhar."]
      ],
      W("Escreva em que você tem facilidade e no que tem interesse.", "I am good at ... / I am interested in ...",
        ["I am good at organizing events.", "I am interested in learning more about music.", "I am afraid of making mistakes, but I keep trying."],
        ["Usou a preposição certa depois do adjetivo?", "O verbo depois da preposição está no -ing?", "A frase soa natural?"])
    ),

    T(16, "Cinema", "Phrasal verbs separáveis", "Phrasal verbs que abrem espaço",
      M("Can you [turn off] the lights?",
        "Você pode apagar as luzes?",
        "Os phrasal verbs separáveis aceitam o objeto no meio ou depois da partícula: turn off the lights ou turn the lights off. Quando o objeto é um pronome (it, them), ele precisa ficar no meio.",
        "Pensa assim: a partícula é a bagagem do verbo. Com um objeto grande, ele cabe dos dois lados. Mas o pronome (it, them) é pequeno e sempre entra no meio.",
        ["verbo + partícula + objeto: turn off the lights", "verbo + objeto + partícula: turn the lights off", "verbo + it ou them + partícula: turn it off (nunca turn off it)"]),
      [
        O("Por favor, desligue isso.", "Please|turn|it|off.", "on",
          "O objeto é um pronome (it), então ele precisa ficar no meio: turn it off. O on ficou de fora porque significa ligar.",
          "Turn it off: o pronome no meio, como manda o figurino."),
        O("Ele pegou os ingressos.", "He|picked|the tickets|up.", "on",
          "Pick up é separável, então o objeto (the tickets) pode ficar no meio: picked the tickets up.",
          "Picked the tickets up: o objeto entrou no meio do verbo."),
        C("Can you turn ___ the subtitles?", ["on", "in", "at"], 0,
          "Turn on significa ligar, e é isso que a frase pede.",
          "Turn on: ligou as legendas."),
        C("Please turn it ___.", ["off", "of", "out"], 0,
          "Turn off é desligar. Of e out não formam o phrasal verb certo aqui.",
          "Turn it off: chega de barulho."),
        C("They had to call ___ the premiere.", ["off", "for", "at"], 0,
          "Call off significa cancelar. Montando: call off the premiere.",
          "Call off: estreia cancelada, que pena.")
      ],
      [
        ["Can you [turn off] the lights?", "Você pode apagar as luzes?"],
        ["Can you [turn up] the music?", "Você pode aumentar a música?"],
        ["Can you [put up] the poster?", "Você pode colocar o cartaz?"]
      ],
      W("Escreva um pedido usando um phrasal verb separável.", "Can you ...?",
        ["Can you turn it down a bit?", "Please write the address down.", "I need to pick the files up."],
        ["Usou o phrasal verb completo?", "Se usou it ou them, ficou no meio?", "O pedido ficou educado (can you, please)?"])
    ),

    T(17, "Música", "Phrasal verbs inseparáveis", "Dupla inseparável",
      M("I [ran into] my favorite singer yesterday.",
        "Eu esbarrei com meu cantor favorito ontem.",
        "Alguns phrasal verbs não aceitam nada no meio: o objeto sempre vem depois da partícula, mesmo se for pronome.",
        "Pensa assim: são casais que não deixam ninguém sentar entre eles. Look after her, nunca look her after.",
        ["verbo + partícula + objeto: look after the band", "com pronome também: look after them", "exemplos: run into, look after, get on with"],
        "Se tiver dúvida, o dicionário mostra se o phrasal verb é separável ou não."),
      [
        O("Ela cuida do cachorro da banda.", "She|looks|after|the band's dog.", "it",
          "Look after é inseparável: o objeto vem depois da partícula. Montando: She + looks + after + the band's dog. O it não entra no meio.",
          "Looks after: cuidadora oficial."),
        O("Nós esbarramos com o baterista no café.", "We|ran into|the drummer|at the café.", "ran",
          "Run into é inseparável e significa encontrar por acaso. Montando: We + ran into + the drummer.",
          "Ran into: encontro sem combinar."),
        C("I need to look ___ my little brother tonight.", ["after", "up", "off"], 0,
          "Look after significa cuidar de alguém: look after my little brother.",
          "Look after: babá por uma noite."),
        C("Did you ___ the singer at the festival?", ["run into", "run", "ran into"], 0,
          "Depois de did, o verbo volta pra forma base: Did + you + run into.",
          "Run into: o encontro inesperado."),
        C("I really like her. I get ___ with her very well.", ["on", "off", "up"], 0,
          "Get on with alguém significa se dar bem com alguém.",
          "Get on: química boa com a pessoa.")
      ],
      [
        ["I [ran into] an old friend at the movies.", "Eu esbarrei com um velho amigo no cinema."],
        ["I [ran into] my favorite singer yesterday.", "Eu esbarrei com meu cantor favorito ontem."],
        ["I [ran into] a famous painter at the gallery.", "Eu esbarrei com um pintor famoso na galeria."]
      ],
      W("Escreva sobre alguém que você encontrou sem querer ou de quem você cuida.", "I ran into ... / I look after ...",
        ["I ran into an old friend at the mall.", "I look after my sister's cat on weekends.", "I get on well with my team."],
        ["Usou o phrasal verb completo?", "O objeto veio depois da partícula?", "A frase faz sentido no passado ou no presente?"])
    ),

    T(18, "Arte", "Phrasal verbs de criar e montar", "Bolando e montando",
      M("We need to [come up with] a bold concept.",
        "Precisamos bolar um conceito ousado.",
        "Esses phrasal verbs aparecem sempre que a gente cria ou organiza alguma coisa. Eles são a versão informal de verbos mais formais: come up with é criar, set up é montar, carry out é executar.",
        "Pensa assim: é o apelido do verbo. Na conversa ninguém diz 'conceive an idea', todo mundo diz 'come up with'.",
        ["come up with = bolar, criar", "set up = montar, configurar", "carry out = executar, realizar", "check out = dar uma olhada"]),
      [
        O("Vamos montar a exposição hoje.", "Let's|set up|the exhibition|today.", "set",
          "Set up significa montar ou configurar, e o objeto vem depois: set up the exhibition.",
          "Set up: exposição de pé."),
        O("O ateliê vai realizar a oficina.", "The studio|will|carry out|the workshop.", "carried out",
          "Depois de will, o verbo fica na forma base: will carry out. Carry out significa executar ou realizar.",
          "Carry out: tira do papel."),
        C("Can you ___ this painting? It's amazing.", ["check out", "check up", "check off"], 0,
          "Check out significa dar uma olhada, e é o que a frase quer. Check off é riscar de uma lista.",
          "Check out: olha só essa pintura."),
        C("We have to ___ a new title by Friday.", ["come up with", "come in", "come off"], 0,
          "Come up with significa criar ou bolar uma ideia.",
          "Come up with: a ideia saiu do nada."),
        C("The artist will ___ a color test next week.", ["carry out", "carry on", "carry up"], 0,
          "Carry out significa executar ou realizar, perfeito para um teste.",
          "Carry out: o teste vai rodar.")
      ],
      [
        ["We need to [come up with] a better ending.", "Precisamos bolar um final melhor."],
        ["We need to [come up with] a catchy chorus.", "Precisamos bolar um refrão grudento."],
        ["We need to [come up with] a bold concept.", "Precisamos bolar um conceito ousado."]
      ],
      W("Escreva algo que você precisa criar, montar ou executar.", "I need to ...",
        ["We need to set up the stage.", "I will carry out the experiment this week.", "I came up with an idea in the shower."],
        ["Usou o phrasal verb completo?", "O verbo está no tempo certo?", "A frase faz sentido no contexto?"])
    ),

    T(19, "Música", "Phrasal verbs de comunicação", "Falando de comunicação",
      M("I will [find out] when the concert starts.",
        "Eu vou descobrir quando o show começa.",
        "Os phrasal verbs de comunicação aparecem em mensagens e conversas: find out, point out, bring up, get back to, follow up.",
        "Pensa assim: são as ferramentas do chat. Follow up é o lembrete gentil, get back to é a resposta que você promete.",
        ["find out = descobrir", "point out = apontar, destacar", "bring up = trazer um assunto", "get back to = retornar para alguém", "follow up = dar seguimento"]),
      [
        O("Vou trazer esse assunto no jantar.", "I|will|bring|it|up|at dinner.", "on",
          "Bring up é separável, e com pronome o it fica no meio: bring it up.",
          "Bring it up: o assunto na mesa."),
        O("Ela vai retornar pra você amanhã.", "She|will|get back to|you|tomorrow.", "gets",
          "Depois de will, o verbo fica na forma base. Get back to significa retornar pra alguém.",
          "Get back to: promessa de resposta."),
        C("I'll ___ the setlist and send you the details.", ["find out", "find on", "found out"], 0,
          "Find out significa descobrir. Depois de I'll (I will), o verbo fica na forma base.",
          "Find out: investigação concluída."),
        C("Can I ___ one thing about the lyrics?", ["point out", "point on", "pointing out"], 0,
          "Point out significa apontar ou destacar. Depois de can, o verbo fica na forma base.",
          "Point out: um detalhe que merece atenção."),
        C("I'm texting to ___ on my last message.", ["follow up", "follow out", "follow in"], 0,
          "Follow up on significa dar seguimento a algo, e é muito comum em mensagens e e-mails.",
          "Follow up: o lembrete educado.")
      ],
      [
        ["I will [find out] when the movie starts.", "Eu vou descobrir quando o filme começa."],
        ["I will [find out] when the concert starts.", "Eu vou descobrir quando o show começa."],
        ["I will [find out] when the gallery opens.", "Eu vou descobrir quando a galeria abre."]
      ],
      W("Escreva uma frase de mensagem usando um phrasal verb de comunicação.", "I will ...",
        ["I will follow up with you next week.", "I will find out and let you know.", "I would like to point out one detail."],
        ["Usou o phrasal verb completo?", "Se usou it, ficou no meio?", "O tom ficou natural?"])
    ),

    T(20, "Arte", "Verbo + preposição", "Verbo + preposição",
      M("I am [looking for] a new gallery.",
        "Estou procurando uma galeria nova.",
        "Em inglês, alguns verbos pedem preposição onde o português não pede: wait for, listen to, look for, ask for.",
        "Pensa assim: a preposição é o encaixe do verbo. Sem ela, a peça não fecha.",
        ["wait for + algo ou alguém", "listen to + algo ou alguém", "look for = procurar", "ask for = pedir algo"],
        "Em português dizemos 'esperar o ônibus' e 'ouvir música', sem preposição. Em inglês: wait for the bus, listen to music."),
      [
        O("Eu estou esperando o curador.", "I|am|waiting|for|the curator.", "to",
          "A dupla é wait for. O to não serve com wait.",
          "Waiting for: a espera que pede for."),
        O("Ela ouve podcasts de arte.", "She|listens|to|art podcasts.", "for",
          "A dupla é listen to. Com she, o verbo ganha s: listens.",
          "Listens to: de ouvido atento."),
        C("Please wait ___ me at the entrance.", ["for", "to", "at"], 0,
          "A dupla é wait for: wait for me.",
          "Wait for: o ônibus e o amigo pedem for."),
        C("I always listen ___ music while I paint.", ["to", "for", "at"], 0,
          "A dupla é listen to: listen to music.",
          "Listen to: o som pede to."),
        C("I am looking ___ my keys. I can't find them.", ["for", "at", "to"], 0,
          "Look for significa procurar, e é o que a frase quer (não achei as chaves).",
          "Look for: a caçada pelas chaves.")
      ],
      [
        ["I am [waiting for] the next episode.", "Estou esperando o próximo episódio."],
        ["I am [listening to] a new album.", "Estou ouvindo um álbum novo."],
        ["I am [looking for] a new gallery.", "Estou procurando uma galeria nova."]
      ],
      W("Escreva sobre algo que você está esperando, procurando ou ouvindo.", "I am waiting for / looking for / listening to ...",
        ["I am waiting for the bus.", "I am listening to a podcast.", "I am looking for a new apartment."],
        ["Usou a preposição certa depois do verbo?", "O verbo está no -ing?", "A frase faz sentido sem a preposição? Se sim, confira de novo."])
    ),

    T(21, "Cinema", "Phrasal verbs de hábitos", "Mudando hábitos",
      M("I want to [take up] filmmaking.",
        "Quero começar a fazer cinema.",
        "Alguns phrasal verbs falam de começar, parar e reduzir hábitos: take up (começar um hobby), give up (desistir), cut down on (reduzir), keep up (manter o ritmo).",
        "Pensa assim: é o controle remoto da rotina. Take up é o play, give up é o stop, cut down on é diminuir o volume.",
        ["take up = começar (um hobby)", "give up = desistir, abandonar", "cut down on = reduzir", "keep up = manter o ritmo"]),
      [
        O("Ele desistiu de assistir a séries longas.", "He|gave up|watching|long series.", "gives up",
          "Give up é irregular no passado: gave up. Depois de give up, o verbo vai pro -ing: watching.",
          "Gave up: saiu da maratona."),
        O("Eu quero reduzir o tempo de tela.", "I|want|to|cut down on|screen time.", "give up",
          "Cut down on significa reduzir. Depois de want to, o verbo fica na forma base.",
          "Cut down on: baixando o volume dos hábitos."),
        C("She wants to ___ photography this year.", ["take up", "take on", "take out"], 0,
          "Take up significa começar um hobby, como fotografia.",
          "Take up: play no hobby novo."),
        C("Don't ___! Your film project is great.", ["give up", "give in", "give out"], 0,
          "Give up significa desistir, e a frase quer incentivar a continuar.",
          "Don't give up: torcida organizada."),
        C("I need to cut ___ on popcorn at the movies.", ["down", "up", "off"], 0,
          "Cut down on significa reduzir.",
          "Cut down on: menos pipoca, sem culpa.")
      ],
      [
        ["I want to [take up] filmmaking.", "Quero começar a fazer cinema."],
        ["I want to [take up] the guitar.", "Quero começar a tocar violão."],
        ["I want to [take up] watercolor.", "Quero começar a pintar aquarela."]
      ],
      W("Escreva um hábito que você quer começar, parar ou reduzir.", "I want to take up / cut down on / give up ...",
        ["I want to take up painting.", "I want to cut down on sweets.", "I don't want to give up my English routine."],
        ["Usou o phrasal verb completo?", "Depois de give up ou cut down on, usou -ing ou um substantivo?", "A frase mostra um hábito?"])
    ),

    // ---------------------------------------------------------------- CONECTORES E FRASES LONGAS
    T(22, "Música", "Because e so", "Por quê? Por isso",
      M("I love this song [because] it makes me dance.",
        "Eu amo essa música porque ela me faz dançar.",
        "Because explica a causa (por quê). So mostra a consequência (então).",
        "Pensa assim: because olha pra trás, é a pista que explica. So olha pra frente, é o resultado.",
        ["because + causa: I stayed home because it rained", "so + consequência: It rained, so I stayed home", "because of + substantivo: because of the rain"],
        "Because abre uma frase completa (com sujeito e verbo). Antes de um substantivo, use because of."),
      [
        O("Eu fui ao show porque amo essa banda.", "I|went to|the concert|because|I love|this band.", "so",
          "A causa vem depois de because: eu amo essa banda. Montando: I went to the concert + because + I love this band.",
          "Because: a razão do ingresso comprado."),
        O("Os ingressos esgotaram, então ficamos em casa.", "The tickets|sold out,|so|we|stayed home.", "because",
          "A consequência vem depois de so: ficamos em casa. O so liga o fato ao resultado.",
          "So: do esgotado ao sofá."),
        C("We left early ___ the music was too loud.", ["because", "so", "because of"], 0,
          "A música estava alta é a causa, e é uma frase completa (the music was too loud), então because.",
          "Because: a causa com sujeito e verbo."),
        C("The music was too loud, ___ we left early.", ["because", "so", "because of"], 1,
          "Sair cedo é a consequência de a música estar alta, então so.",
          "So: o resultado da música alta."),
        C("We left early ___ the loud music.", ["because", "so", "because of"], 2,
          "Depois da palavra vem um substantivo (the loud music), não uma frase completa, então because of.",
          "Because of: antes de substantivo.")
      ],
      [
        ["I love this movie [because] it makes me laugh.", "Eu amo esse filme porque ele me faz rir."],
        ["I love this song [because] it makes me dance.", "Eu amo essa música porque ela me faz dançar."],
        ["I love this painting [because] it makes me think.", "Eu amo esse quadro porque ele me faz pensar."]
      ],
      W("Escreva algo que você gosta e por quê.", "I like ... because ...",
        ["I like this series because the characters are funny.", "It was raining, so I stayed home.", "I am late because of the traffic."],
        ["Usou because com uma frase completa?", "Usou so para mostrar a consequência?", "Se vem um substantivo, usou because of?"])
    ),

    T(23, "Arte", "But e however", "Mas, porém, no entanto",
      M("The painting is beautiful, [but] it is expensive.",
        "O quadro é lindo, mas é caro.",
        "But e however mostram contraste. But é o mais comum e vem no meio da frase. However é mais formal e abre uma frase nova, seguido de vírgula.",
        "Pensa assim: but é o freio de mão leve, no meio da frase. However é a placa de 'atenção, mudança de rumo' que abre uma frase nova.",
        ["frase 1, but frase 2", "Frase 1. However, frase 2."],
        "However normalmente começa uma frase nova e leva vírgula depois: It is old. However, it is still popular."),
      [
        O("Eu gosto de arte moderna, mas prefiro a clássica.", "I like|modern art,|but|I prefer|classical art.", "however",
          "Duas ideias em contraste na mesma frase, ligadas por but: I like modern art, but I prefer classical art.",
          "But: o contraste leve, no meio."),
        O("O museu é pequeno. No entanto, é incrível.", "The museum is small.|However,|it is amazing.", "But,",
          "However abre a segunda frase, e depois dele vem vírgula: However, it is amazing.",
          "However: a placa de mudança de rumo."),
        C("The tickets are cheap, ___ the line is long.", ["but", "however", "because"], 0,
          "As duas ideias estão na mesma frase, separadas por vírgula, então but.",
          "But: ingresso barato, fila longa."),
        C("The artist is famous. ___, few people know this work.", ["However", "Because", "So"], 0,
          "Abre uma frase nova com contraste, então However seguido de vírgula.",
          "However: abre frase nova com contraste."),
        C("I wanted to buy the print, ___ it sold out.", ["but", "so", "because"], 0,
          "Eu queria comprar, mas esgotou: duas ideias em contraste, então but.",
          "But: o desejo e a realidade.")
      ],
      [
        ["The movie is long, [but] it is great.", "O filme é longo, mas é ótimo."],
        ["The song is old, [but] it is great.", "A música é antiga, mas é ótima."],
        ["The painting is beautiful, [but] it is expensive.", "O quadro é lindo, mas é caro."]
      ],
      W("Escreva uma frase com contraste: algo bom e algo ruim sobre a mesma coisa.", "It is ..., but ...",
        ["The course is hard, but I am learning a lot.", "The film is slow. However, the ending is great.", "My job is busy, but I like it."],
        ["Tem duas ideias em contraste?", "Usou but no meio ou However no começo da frase?", "Depois de However tem vírgula?"])
    ),

    T(24, "Cinema", "Conectores de sequência", "Em que ordem?",
      M("[First], write the script. [Then], film the scenes. [Finally], edit the movie.",
        "Primeiro, escreva o roteiro. Depois, filme as cenas. Por fim, edite o filme.",
        "Os conectores de sequência organizam o passo a passo: first, then, after that, finally. Eles ajudam o leitor a seguir o raciocínio.",
        "Pensa assim: são as claquetes de uma gravação. Cena 1, cena 2, corta. Sem elas, ninguém sabe a ordem.",
        ["First, ... (começo)", "Then, Next, After that, ... (meio)", "Finally, Lastly, ... (fim)"],
        "Esses conectores abrem a frase e levam vírgula depois."),
      [
        O("Primeiro, escreva o roteiro.", "First,|write|the script.", "Finally,",
          "First abre a sequência e leva vírgula: First, write the script.",
          "First: a claquete número 1."),
        O("Depois disso, filmamos a cena final.", "After that,|we|film|the final scene.", "Finally,",
          "After that liga um passo ao anterior e leva vírgula: After that, we film the final scene.",
          "After that: o passo do meio."),
        C("Step 1 of 3: ___, I write a short script.", ["First", "Finally", "Although"], 0,
          "Step 1 of 3 mostra que é o primeiro passo, então First. Finally ficaria para o último.",
          "First: começo de tudo."),
        C("We are almost done. ___, edit the film.", ["Finally", "First", "Because"], 0,
          "Estamos quase no fim, então Finally marca o último passo.",
          "Finally: a claquete final."),
        C("I write the script. ___, I film the scenes.", ["Then", "Because", "Although"], 0,
          "Then liga o passo seguinte: I write the script. Then, I film the scenes.",
          "Then: o próximo passo.")
      ],
      [
        ["[First], write the script. [Then], film the scenes. [Finally], edit the movie.", "Primeiro, escreva o roteiro. Depois, filme as cenas. Por fim, edite o filme."],
        ["[First], write the lyrics.", "Primeiro, escreva a letra."],
        ["[First], prepare the canvas.", "Primeiro, prepare a tela."]
      ],
      W("Escreva 3 passos de algo que você sabe fazer usando first, then e finally.", "First, ... Then, ... Finally, ...",
        ["First, I make coffee. Then, I check my messages. Finally, I plan my day.", "First, choose a topic. Then, write an outline. Finally, edit the text.", "First, open the app. Then, pick a lesson. Finally, enjoy it."],
        ["Usou first, then e finally?", "Colocou vírgula depois de cada conector?", "Os passos estão na ordem certa?"])
    ),

    T(25, "Arte", "Orações relativas: who, which, that", "Quem, qual, que",
      M("The painter [who] made this mural is amazing.",
        "O pintor que fez esse mural é incrível.",
        "Who liga pessoas, which liga coisas e that serve para os dois. Eles juntam duas informações numa frase só.",
        "Pensa assim: são a cola de frase. Em vez de duas frases curtas, uma frase mais longa que ainda faz sentido.",
        ["pessoa: who (ou that)", "coisa: which (ou that)", "The film that went viral = o filme que viralizou"],
        "Em inglês não repetimos o sujeito depois do who: the woman who works here, não the woman who she works here."),
      [
        O("A galeria que abriu ontem é brasileira.", "The gallery|that|opened|yesterday|is Brazilian.", "who",
          "Gallery é uma coisa (um lugar), então that. Who é para pessoas. Montando: The gallery + that + opened + yesterday + is Brazilian.",
          "That: a cola entre a galeria e a novidade."),
        O("Eu conheço a pessoa que pintou esse quadro.", "I know|the person|who|painted|this picture.", "which",
          "Person é gente, então who. Which é para coisas. Montando: the person + who + painted + this picture.",
          "Who: apresentando a pessoa."),
        C("The movie ___ I saw yesterday was funny.", ["who", "which", "whose"], 1,
          "Movie é uma coisa, então which. Who é para pessoas.",
          "Which: ligando o filme à informação."),
        C("The woman ___ painted this mural is my teacher.", ["who", "which", "what"], 0,
          "Woman é uma pessoa, então who.",
          "Who: ela, a pintora."),
        C("This is the app ___ helps me study.", ["who", "that", "what"], 1,
          "App é uma coisa, então that ou which. Entre as opções, that serve.",
          "That: o app que ajuda.")
      ],
      [
        ["The actor [who] won the award is my favorite.", "O ator que ganhou o prêmio é meu favorito."],
        ["The singer [who] won the award is my favorite.", "O cantor que ganhou o prêmio é meu favorito."],
        ["The painter [who] made this mural is amazing.", "O pintor que fez esse mural é incrível."]
      ],
      W("Escreva uma frase com who, which ou that sobre algo que você gosta.", "I like ... who/which/that ...",
        ["I like movies that make me think.", "The friend who introduced me to this band lives abroad.", "I love apps which are simple to use."],
        ["Usou who para pessoas?", "Usou which ou that para coisas?", "Não repetiu o sujeito depois do conector?"])
    ),

    T(26, "Cinema", "First conditional", "Se acontecer, então...",
      M("If it [rains], we [will watch] a movie.",
        "Se chover, vamos assistir a um filme.",
        "O first conditional fala de situações reais e possíveis no futuro. If + presente simples, will + verbo base.",
        "Pensa assim: é a bifurcação do roteiro. Se acontecer isso (if), a cena seguinte vai ser aquela (will).",
        ["If + presente simples, will + verbo base", "Pode inverter: We will watch a movie if it rains (sem vírgula)"],
        "Depois de if, não usamos will: If it rains, não if it will rain."),
      [
        O("Se você chegar cedo, vamos pegar bons lugares.", "If|you arrive|early,|we|will get|good seats.", "arrived",
          "Depois de if vem o presente simples (you arrive), e na outra parte vem will + verbo base (will get).",
          "If + presente, will + verbo: a bifurcação do roteiro."),
        O("Se o filme for bom, eu recomendo.", "If|the movie|is|good,|I|will recommend|it.", "will be",
          "Depois de if, o verbo fica no presente (is), nunca will be. A consequência leva will: will recommend.",
          "Is good, will recommend: o par certinho."),
        C("If I ___ the tickets, I will tell you.", ["find", "will find", "found"], 0,
          "Depois de if, o verbo fica no presente simples: find. Nada de will aqui.",
          "Find: depois do if, presente."),
        C("She ___ happy if the film wins.", ["will be", "is being", "would to"], 0,
          "A consequência do first conditional usa will + verbo base: will be.",
          "Will be: a consequência prevista."),
        C("If it ___ tomorrow, we will go to the cinema.", ["rains", "will rain", "rained"], 0,
          "Depois de if, presente simples: rains. Will rain fica na outra parte da frase.",
          "Rains: o presente que vale no if.")
      ],
      [
        ["If it [rains], we [will watch] a movie.", "Se chover, vamos assistir a um filme."],
        ["If it [rains], we [will listen] to music.", "Se chover, vamos ouvir música."],
        ["If it [rains], we [will visit] a museum.", "Se chover, vamos visitar um museu."]
      ],
      W("Escreva o que você vai fazer se algo acontecer.", "If ..., I will ...",
        ["If I finish early, I will watch a series.", "If it rains, I will take an umbrella.", "If you call me, I will answer."],
        ["Depois de if, usou o presente simples?", "Na outra parte, usou will + verbo base?", "A situação é real e possível?"])
    ),

    T(27, "Música", "Second conditional", "E se fosse diferente?",
      M("If I [had] more time, I [would learn] the guitar.",
        "Se eu tivesse mais tempo, aprenderia violão.",
        "O second conditional fala de situações imaginárias ou improváveis. If + passado simples, would + verbo base.",
        "Pensa assim: é o 'e se...' do universo paralelo, uma cena que existe só na imaginação.",
        ["If + passado simples, would + verbo base", "Com be, use were para todo mundo: If I were you...", "would vira 'd na fala: I'd learn"],
        "O passado depois do if não fala de passado: é só um jeito de dizer que a situação é imaginária."),
      [
        O("Se eu fosse você, eu iria ao show.", "If|I were you,|I|would go|to the concert.", "I was",
          "No second conditional, o verbo be vira were para todo mundo: If I were you. A consequência leva would + verbo base: would go.",
          "I were you: o universo paralelo aceita."),
        O("Se ela tivesse tempo, ela cantaria mais.", "If|she had|time,|she|would sing|more.", "will sing",
          "Depois de if vem o passado simples (she had), e na consequência vem would + verbo base (would sing).",
          "Had time, would sing: universo paralelo."),
        C("If I ___ rich, I would buy a studio.", ["were", "will be", "am"], 0,
          "No second conditional, usamos were para todos os sujeitos: If I were rich.",
          "Were: o imaginário mora aqui."),
        C("She ___ the piano if she had a teacher.", ["would learn", "will learn", "learned"], 0,
          "A consequência do second conditional leva would + verbo base: would learn.",
          "Would learn: a consequência imaginária."),
        C("If we ___ tickets, we would go.", ["have", "had", "will have"], 1,
          "Depois de if, o passado simples marca a situação imaginária: had.",
          "Had: o passado que fala de imaginação.")
      ],
      [
        ["If I [had] more time, I [would watch] more movies.", "Se eu tivesse mais tempo, assistiria a mais filmes."],
        ["If I [had] more time, I [would learn] the guitar.", "Se eu tivesse mais tempo, aprenderia violão."],
        ["If I [had] more time, I [would paint] every day.", "Se eu tivesse mais tempo, pintaria todo dia."]
      ],
      W("Escreva o que você faria se pudesse, uma situação imaginária.", "If I ..., I would ...",
        ["If I had more money, I would travel more.", "If I could fly, I would visit Japan.", "If I were a director, I would make a comedy."],
        ["Depois de if, usou o passado simples?", "Na outra parte, usou would + verbo base?", "Se usou be, foi were?"])
    ),

    T(28, "Arte", "Finalidade: to, in order to, so that", "Pra quê?",
      M("I visit museums [to] get inspired.",
        "Eu visito museus para me inspirar.",
        "Para dizer a finalidade de uma ação, use to + verbo, in order to (mais formal) ou so that + frase completa.",
        "Pensa assim: o to é o atalho do 'pra quê?'. O so that é a versão com sujeito e verbo, quando o objetivo tem o seu próprio sujeito.",
        ["to + verbo base: I use it to save time", "in order to + verbo base: mais formal", "so that + sujeito + verbo: I explain it so that everyone understands"],
        "Não use for + verbo na forma base: I use it for save time está errado. Diga to save."),
      [
        O("Eu uso esse programa para editar fotos.", "I use|this program|to|edit|photos.", "for",
          "A finalidade vem com to + verbo base: to edit. For + verbo base não funciona.",
          "To edit: o pra quê."),
        O("Ela fez um esboço para que todos entendessem.", "She|made|a sketch|so that|everyone|understood.", "to",
          "O objetivo tem o próprio sujeito (everyone), então so that + sujeito + verbo.",
          "So that: o objetivo com sujeito próprio."),
        C("He studies music ___ get a better job.", ["to", "for", "so"], 0,
          "A finalidade com o mesmo sujeito usa to + verbo base: to get.",
          "To get: o pra quê direto."),
        C("I wrote the brief clearly ___ everyone could understand it.", ["so that", "to", "for"], 0,
          "O objetivo tem sujeito próprio (everyone) e verbo conjugado (could understand), então so that.",
          "So that: o objetivo com sujeito."),
        C("We use this app ___ organize our files.", ["for", "to", "so"], 1,
          "A finalidade usa to + verbo base: to organize. For organize não funciona.",
          "To organize: pra quê? Pra organizar.")
      ],
      [
        ["I watch movies [to] practice English.", "Eu assisto a filmes para praticar inglês."],
        ["I listen to songs [to] practice English.", "Eu ouço músicas para praticar inglês."],
        ["I visit museums [to] get inspired.", "Eu visito museus para me inspirar."]
      ],
      W("Escreva algo que você faz e pra quê.", "I ... to ...",
        ["I take notes to remember ideas.", "I use this app to study English.", "I wake up early so that I can enjoy the morning."],
        ["Usou to + verbo base para a finalidade?", "Se o objetivo tem sujeito próprio, usou so that?", "Evitou for + verbo base?"])
    ),

    T(29, "Cinema", "Although, even though e despite", "Mesmo assim",
      M("[Although] it was long, I loved the movie.",
        "Embora fosse longo, eu amei o filme.",
        "Although e even though (embora, mesmo que) mostram contraste dentro da mesma frase. Despite e in spite of vêm antes de um substantivo ou de um verbo com -ing.",
        "Pensa assim: although é a frase teimosa, o 'mesmo assim, eu vou'. Despite é a versão curta, sem verbo conjugado.",
        ["Although ou Even though + sujeito + verbo, ...", "Despite ou In spite of + substantivo ou -ing", "Não use although e but na mesma frase"],
        "Em português às vezes dizemos 'embora... mas'. Em inglês, escolha só um: although OU but."),
      [
        O("Embora o ingresso fosse caro, ela comprou.", "Although|the ticket|was expensive,|she|bought it.", "But",
          "Although abre uma frase completa (the ticket was expensive), e a segunda parte vem sem but: she bought it.",
          "Although: teimosia com gramática."),
        O("Apesar da chuva, o evento foi ótimo.", "Despite|the rain,|the event|was great.", "Although",
          "Despite vem antes de um substantivo (the rain), não de uma frase completa.",
          "Despite: a versão curta e sem verbo."),
        C("___ he was tired, he finished the painting.", ["Although", "Despite", "Because"], 0,
          "Depois da palavra vem uma frase completa (he was tired), então although.",
          "Although: cansado, mas terminou."),
        C("___ the noise, we enjoyed the show.", ["Although", "Despite", "Even though"], 1,
          "Depois da palavra vem um substantivo (the noise), então despite. Although e even though pedem uma frase completa.",
          "Despite the noise: o barulho não ganhou."),
        C("She went to the gallery ___ it was closed.", ["even though", "despite", "so"], 0,
          "Depois da palavra vem uma frase completa (it was closed), e a ideia é contrastar: even though.",
          "Even though: foi, mesmo assim.")
      ],
      [
        ["[Although] it was long, I loved the movie.", "Embora fosse longo, eu amei o filme."],
        ["[Although] it was loud, I loved the concert.", "Embora estivesse alto, eu amei o show."],
        ["[Although] it was raining, we went to the exhibition.", "Embora estivesse chovendo, fomos à exposição."]
      ],
      W("Escreva algo que você fez mesmo com um obstáculo.", "Although ..., I ...",
        ["Although I was tired, I went to class.", "Despite the traffic, I arrived on time.", "Even though it was late, we kept working."],
        ["Depois de although ou even though tem uma frase completa?", "Depois de despite tem um substantivo ou -ing?", "Evitou usar although e but juntos?"])
    ),

    T(30, "Arte", "Orações de tempo: when, as soon as, after, until", "Quando, antes, depois",
      M("I will call you [as soon as] I leave the gallery.",
        "Eu te ligo assim que sair da galeria.",
        "Em frases sobre o futuro com when, as soon as, before, after e until, o verbo depois do conector fica no presente simples, não no futuro.",
        "Pensa assim: o conector é o gatilho. O que vem depois dele é o 'quando isso acontecer', e quem manda no futuro é a frase principal.",
        ["Frase principal com will + conector + presente simples", "I will call you when I arrive", "until = até: Wait here until I come back"],
        "Errado: when I will arrive. Certo: when I arrive."),
      [
        O("Eu te ligo quando chegar à galeria.", "I will|call you|when|I arrive|at the gallery.", "will arrive",
          "Depois de when, o verbo fica no presente simples (arrive), não no futuro. O futuro fica na frase principal (I will call you).",
          "When + presente: o gatilho certinho."),
        O("Vamos abrir a exposição depois que o museu aprovar.", "We will|open|the exhibition|after|the museum|approves.", "will approve",
          "Depois de after, o verbo fica no presente (approves). Com the museum, o verbo ganha s.",
          "After + presente: o museu aprova, a exposição abre."),
        C("I will send the sketch as soon as I ___.", ["finish", "will finish", "finished"], 0,
          "Depois de as soon as, o verbo fica no presente: finish.",
          "Finish: o gatilho no presente."),
        C("Please wait here ___ I come back.", ["until", "since", "for"], 0,
          "Until significa até, e é o que a frase quer: espere aqui até eu voltar.",
          "Until: esperando até a volta."),
        C("We will celebrate ___ the exhibition ends.", ["after", "ago", "during"], 0,
          "After liga o momento da comemoração ao fim da exposição. O verbo depois dele fica no presente (ends).",
          "After: festa depois do fim da exposição.")
      ],
      [
        ["I will call you [after] the movie ends.", "Eu te ligo depois que o filme acabar."],
        ["I will call you [when] the concert ends.", "Eu te ligo quando o show acabar."],
        ["I will call you [as soon as] I leave the gallery.", "Eu te ligo assim que sair da galeria."]
      ],
      W("Escreva o que você vai fazer assim que algo acontecer.", "I will ... as soon as / when / after ...",
        ["I will rest as soon as I finish this task.", "I will call you when I get home.", "I will watch the movie after I finish my work."],
        ["Usou will na frase principal?", "Depois do conector, usou o presente simples?", "O conector (when, as soon as, after) faz sentido?"])
    )
  ];
})();

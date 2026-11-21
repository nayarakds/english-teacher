// Leituras do app: um resumo de um filme, música ou obra, com as palavras das lições.
//
// R(id, tema, título, "sobre o quê", [ids das lições], [frases], [palavras extras], [frases para traduzir], {glossário})
//   frase: S("texto em inglês com [palavra|dica|outra/outra|lição] nos espaços", "tradução")
//     palavra: a resposta certa
//     dica: aparece só se a pessoa errar o espaço
//     outra/outra: respostas que também valem (pode ficar vazio: [but|dica||23])
//     lição: id da lição que ensina isso (usado para o painel de erros e a revisão)
//     "¶ " no começo da frase abre um novo parágrafo
//   extras: palavras que parecem certas mas não são (aparecem só no "Preciso de ajuda")
//   traduzir: posições (a partir de 0) das frases que ela traduz na etapa 3
//   glossário: { palavra: "tradução" }, palavras difíceis que ela pode tocar na etapa 1
//
// Os resumos são texto original, sem trechos de letras de música. Confira os fatos antes de incluir.
(function () {
  function parse(s) {
    var out = [], re = /\[([^\]]+)\]/g, last = 0, m;
    while ((m = re.exec(s))) {
      if (m.index > last) out.push({ t: s.slice(last, m.index) });
      var f = m[1].split("|");
      out.push({ t: f[0], gap: true, hint: f[1] || "", alts: f[2] ? f[2].split("/") : [], lesson: f[3] ? Number(f[3]) : 0 });
      last = m.index + m[0].length;
    }
    if (last < s.length) out.push({ t: s.slice(last) });
    return out;
  }
  function S(en, pt) {
    var br = en.indexOf("¶ ") === 0;
    return { parts: parse(br ? en.slice(2) : en), pt: pt, br: br };
  }
  function R(id, theme, title, about, uses, sentences, extras, tr, gloss) {
    return { id: id, read: true, theme: theme, title: title, grammar: about, uses: uses, sentences: sentences, extras: extras, tr: tr, gloss: gloss || {} };
  }

  window.READINGS = [
    // ------------------------------------------------------------ CINEMA
    R(101, "Cinema", "Bohemian Rhapsody", "Resumo do filme", [24, 23, 22, 1, 26, 28], [
      S("Bohemian Rhapsody is a movie about the band Queen and its singer, Freddie Mercury.",
        "Bohemian Rhapsody é um filme sobre a banda Queen e seu vocalista, Freddie Mercury."),
      S("[First|Primeiro passo da sequência.||24], we see the band start in London, playing small shows.",
        "Primeiro, vemos a banda começar em Londres, tocando em shows pequenos."),
      S("[Then|Segundo passo da sequência.|Next/After that|24], their songs become famous all over the world.",
        "Depois, as músicas deles ficam famosas no mundo todo."),
      S("[Finally|Último passo da sequência.|Lastly/In the end|24], the movie ends with the Live Aid concert in 1985.",
        "Por fim, o filme termina com o show do Live Aid, em 1985."),
      S("The story has some sad moments, [but|But liga duas ideias que se contrariam: triste, mas incrível.||23] the music is amazing.",
        "A história tem alguns momentos tristes, mas a música é incrível."),
      S("I [have watched|Experiência de vida, sem dizer quando: present perfect.||1] it three times [because|Because explica o motivo.||22] the final concert gives me goosebumps.",
        "Eu já assisti três vezes porque o show final me arrepia."),
      S("¶ Rami Malek plays Freddie Mercury, and he won the Oscar for Best Actor in 2019.",
        "Rami Malek interpreta Freddie Mercury e ganhou o Oscar de Melhor Ator em 2019."),
      S("If you like rock, you [will love|Condicional 1: if + presente, will + verbo.||26] it.",
        "Se você gosta de rock, vai amar."),
      S("I recommend it [so that|So that mostra a finalidade, com um novo sujeito (you).||28] you can hear the songs on a big screen.",
        "Eu recomendo para você poder ouvir as músicas em uma tela grande.")
    ], ["so", "until", "has watched", "since", "in order to", "would love"], [0, 4, 5],
    { singer: "vocalista", goosebumps: "arrepios", amazing: "incrível", actor: "ator", recommend: "recomendar", screen: "tela", famous: "famoso" }),

    R(104, "Cinema", "Titanic", "Resumo do filme", [6, 25, 29, 26, 30], [
      S("Titanic is a movie from 1997, directed by James Cameron.",
        "Titanic é um filme de 1997, dirigido por James Cameron."),
      S("The story is about Jack and Rose, [who|Who se usa para pessoas.||25] meet on the ship.",
        "A história é sobre Jack e Rose, que se conhecem no navio."),
      S("The ship [was crossing|Past continuous: ação em andamento no passado.||6] the Atlantic [when|When apresenta o momento que interrompe a ação.||6] it hit an iceberg.",
        "O navio estava atravessando o Atlântico quando bateu em um iceberg."),
      S("[Although|Although liga duas ideias que se contrariam: longo, mas amei.|Though/Even though|29] the movie is very long, I loved every minute.",
        "Embora o filme seja muito longo, eu amei cada minuto."),
      S("If I [watch|Condicional 1: if + presente.||26] it again, I [will cry|Condicional 1: will + verbo, para o resultado provável.||26] for sure.",
        "Se eu assistir de novo, vou chorar com certeza."),
      S("¶ The real ship sank in 1912 on its first trip.",
        "O navio de verdade afundou em 1912, na primeira viagem."),
      S("The movie won 11 Oscars, [which|Which se refere a coisas, não a pessoas.||25] is a record it shares with two other films.",
        "O filme ganhou 11 Oscars, o que é um recorde que ele divide com outros dois filmes."),
      S("I always cry [when|When apresenta o momento em que algo acontece.||30] the ship starts to sink.",
        "Eu sempre choro quando o navio começa a afundar.")
    ], ["were crossing", "while", "would cry", "has crossed", "whom"], [2, 3, 4],
    { iceberg: "iceberg", sank: "afundou", sink: "afundar", crossing: "atravessando", record: "recorde", shares: "divide", cry: "chorar", directed: "dirigido", trip: "viagem" }),

    R(105, "Cinema", "Toy Story", "Resumo do filme", [30, 28, 3, 4, 2], [
      S("Toy Story, from 1995, was the first feature film made entirely with computer animation.",
        "Toy Story, de 1995, foi o primeiro longa-metragem feito inteiramente com animação por computador."),
      S("The toys come alive [as soon as|As soon as: logo que, imediatamente depois.||30] Andy leaves the room.",
        "Os brinquedos ganham vida assim que o Andy sai do quarto."),
      S("Woody and Buzz argue [until|Until marca até quando algo dura.||30] they get lost and need each other.",
        "Woody e Buzz brigam até se perderem e precisarem um do outro."),
      S("Many people watch it [to|To mostra a finalidade, seguido do verbo.||28] remember their childhood.",
        "Muita gente assiste para relembrar a infância."),
      S("I [have already seen|Already no present perfect: já aconteceu.||4] it twice, but I want to watch it again.",
        "Eu já vi duas vezes, mas quero assistir de novo."),
      S("I [have loved|Present perfect: sentimento que começou e continua.||3] it [since|Since marca o ponto de partida.||3] I was a kid.",
        "Eu amo esse filme desde criança."),
      S("¶ There are four main movies in the series, and the last one [came out|Passado simples: o ano está dito.||2] in 2019.",
        "Há quatro filmes principais na série, e o último saiu em 2019."),
      S("If you have not seen it [yet|Yet no fim de uma frase negativa: ainda não.||4], you can watch it this weekend.",
        "Se você ainda não viu, pode assistir neste fim de semana."),
      S("[Before|Before: antes de.||30] watching it, remember to get some popcorn.",
        "Antes de assistir, lembre de pegar pipoca.")
    ], ["still", "for", "as long as", "so that", "After", "has come out"], [1, 3, 5],
    { toys: "brinquedos", alive: "vivos", argue: "brigar", lost: "perdidos", childhood: "infância", twice: "duas vezes", entirely: "inteiramente", series: "série", popcorn: "pipoca" }),

    R(106, "Cinema", "Parasite", "Resumo do filme", [25, 29, 27, 28, 1, 30], [
      S("Parasite is a South Korean film directed by Bong Joon-ho.",
        "Parasita é um filme sul-coreano dirigido por Bong Joon-ho."),
      S("The film won four Oscars in 2020, including Best Picture.",
        "O filme ganhou quatro Oscars em 2020, incluindo Melhor Filme."),
      S("The story is about a poor family [who|Who se usa para pessoas.||25] enter the life of a rich family.",
        "A história é sobre uma família pobre que entra na vida de uma família rica."),
      S("[Despite|Despite é seguido de substantivo ou -ing, sem sujeito.|In spite of|29] being a thriller, it is also very funny.",
        "Apesar de ser um thriller, também é muito engraçado."),
      S("If I [could|Condicional 2: if + passado.||27] choose one movie to show a friend, I [would choose|Condicional 2: would + verbo, para o resultado imaginário.||27] this one.",
        "Se eu pudesse escolher um filme para mostrar a um amigo, escolheria esse."),
      S("I watched it twice [in order to|In order to mostra a finalidade, seguido do verbo.||28] catch all the details.",
        "Eu assisti duas vezes para pegar todos os detalhes."),
      S("¶ It was the first film not in English to win Best Picture at the Oscars.",
        "Foi o primeiro filme que não é em inglês a ganhar Melhor Filme no Oscar."),
      S("Many people [have recommended|Present perfect: muita gente já recomendou, sem dizer quando.||1] it to me.",
        "Muita gente já me recomendou esse filme."),
      S("I will watch it again [as soon as|As soon as: logo que, imediatamente depois.||30] I have free time.",
        "Vou assistir de novo assim que tiver tempo livre.")
    ], ["although", "will choose", "so that", "had", "recommended", "until"], [2, 3, 4],
    { thriller: "filme de suspense", poor: "pobre", rich: "rico", directed: "dirigido", details: "detalhes", catch: "perceber", choose: "escolher", funny: "engraçado", including: "incluindo" }),

    // ------------------------------------------------------------ MÚSICA
    R(102, "Música", "Imagine", "Resumo da música", [22, 23, 27, 3, 6], [
      S("Imagine is a song by John Lennon, released in 1971.",
        "Imagine é uma música de John Lennon, lançada em 1971."),
      S("In the lyrics, he asks us to imagine a world without wars or borders.",
        "Na letra, ele nos pede para imaginar um mundo sem guerras nem fronteiras."),
      S("The melody is simple, [but|But liga a melodia simples à mensagem forte.||23] the message is powerful.",
        "A melodia é simples, mas a mensagem é poderosa."),
      S("The idea is simple: if everyone [lived|Condicional 2: if + passado simples, would + verbo.||27] in peace, the world [would be|Condicional 2: would + verbo, para o resultado imaginário.||27] a better place.",
        "A ideia é simples: se todo mundo vivesse em paz, o mundo seria um lugar melhor."),
      S("I [have known|Algo que começou no passado e continua: present perfect.||3] this song [since|Since marca o ponto de partida: desde que eu era criança.||3] I was a kid.",
        "Eu conheço essa música desde criança."),
      S("¶ John Lennon was a member of The Beatles before he started a solo career.",
        "John Lennon foi integrante dos Beatles antes de começar a carreira solo."),
      S("Many singers [have sung|Present perfect: muitos já cantaram, sem dizer quando.||1] it at big events around the world.",
        "Muitos cantores já cantaram essa música em grandes eventos pelo mundo."),
      S("[While|While: enquanto, duas coisas ao mesmo tempo.||6] some people listen to it to relax, others think about its message.",
        "Enquanto algumas pessoas ouvem para relaxar, outras pensam na mensagem.")
    ], ["will be", "for", "live", "so", "sang", "Because"], [2, 3, 4],
    { borders: "fronteiras", wars: "guerras", lyrics: "letra", message: "mensagem", powerful: "poderosa", peace: "paz", released: "lançada", melody: "melodia", member: "integrante", solo: "solo", relax: "relaxar" }),

    R(107, "Música", "Thriller", "Resumo do álbum", [2, 12, 3, 26, 30], [
      S("Thriller is an album by Michael Jackson, released in 1982.",
        "Thriller é um álbum de Michael Jackson, lançado em 1982."),
      S("It is one of the best-selling albums of all time.",
        "É um dos álbuns mais vendidos de todos os tempos."),
      S("In 1983, the video for the title song [became|Passado simples: o ano está dito.||2] famous for its zombie dance.",
        "Em 1983, o clipe da música-título ficou famoso pela dança dos zumbis."),
      S("People [have copied|Present perfect: algo que começou e continua.||3] that dance at parties for decades.",
        "As pessoas copiam essa dança em festas há décadas."),
      S("In the 80s, people [used to|Used to: hábito no passado que não existe mais.||12] dance to it in clubs.",
        "Nos anos 80, as pessoas dançavam essa música em baladas."),
      S("I [have listened|Present perfect: algo que começou e continua.||3] to it [for|For marca quanto tempo: mais de dez anos.||3] more than ten years.",
        "Eu escuto essa música há mais de dez anos."),
      S("¶ The title song ends with a spoken part by the actor Vincent Price.",
        "A música-título termina com uma parte falada pelo ator Vincent Price."),
      S("[If|Condicional 1: if + presente.||26] you go to a Halloween party, you [will hear|Condicional 1: will + verbo.||26] it for sure.",
        "Se você for a uma festa de Halloween, vai ouvir essa música com certeza."),
      S("I always want to dance [when|When apresenta o momento em que algo acontece.||30] it starts to play.",
        "Eu sempre quero dançar quando ela começa a tocar.")
    ], ["has become", "copied", "since", "use to", "would hear", "while"], [2, 3, 5],
    { album: "álbum", released: "lançado", zombie: "zumbi", decades: "décadas", clubs: "baladas", spoken: "falada", actor: "ator", "best-selling": "mais vendidos" }),

    R(108, "Música", "Garota de Ipanema", "Resumo da música", [25, 22, 1, 23, 30, 2], [
      S("Garota de Ipanema, or The Girl from Ipanema, is a bossa nova song from 1962.",
        "Garota de Ipanema, ou The Girl from Ipanema, é uma canção de bossa nova de 1962."),
      S("It was written by Tom Jobim and Vinicius de Moraes in Rio de Janeiro.",
        "Foi escrita por Tom Jobim e Vinicius de Moraes, no Rio de Janeiro."),
      S("They were inspired by a young woman [who|Who se usa para pessoas.||25] walked past a bar on her way to the beach.",
        "Eles se inspiraram em uma jovem que passava por um bar a caminho da praia."),
      S("The song became a hit in many countries, [so|So mostra a consequência: virou hit, por isso muitos artistas gravaram.||22] many artists recorded it.",
        "A música virou sucesso em muitos países, por isso muitos artistas a gravaram."),
      S("Many artists [have recorded|Present perfect: muitos já gravaram, sem dizer quando.||1] it, from Frank Sinatra to Brazilian singers.",
        "Muitos artistas já gravaram a música, de Frank Sinatra a cantores brasileiros."),
      S("The melody is calm. [However|However liga duas ideias que se contrariam, depois de um ponto.|But|23], the lyrics talk about a sad love.",
        "A melodia é calma. No entanto, a letra fala de um amor triste."),
      S("[As soon as|As soon as: logo que, imediatamente depois.||30] I hear the first notes, I want to go to the beach.",
        "Assim que ouço as primeiras notas, quero ir para a praia."),
      S("¶ Antônio Carlos Jobim is one of the most important names in Brazilian music.",
        "Antônio Carlos Jobim é um dos nomes mais importantes da música brasileira."),
      S("Bossa nova [started|Passado simples: época definida, o fim dos anos 1950.||2] in the late 1950s, in Rio.",
        "A bossa nova começou no fim dos anos 1950, no Rio."),
      S("[Because|Because explica o motivo.||22] it is calm and elegant, many people listen to it to relax.",
        "Por ser calma e elegante, muita gente ouve para relaxar.")
    ], ["although", "recorded", "until", "since", "has started", "therefore"], [2, 3, 6],
    { bossa: "bossa", inspired: "inspiradas", beach: "praia", lyrics: "letra", sad: "triste", calm: "calma", recorded: "gravaram", notes: "notas", hit: "sucesso", late: "final de", elegant: "elegante" }),

    R(109, "Música", "Rock in Rio", "Resumo do festival", [13, 3, 26, 28, 22, 30], [
      S("Rock in Rio is a music festival that started in Rio de Janeiro in 1985.",
        "O Rock in Rio é um festival de música que começou no Rio de Janeiro, em 1985."),
      S("The first edition started [on|On se usa com dia específico.||13] January 11th, 1985.",
        "A primeira edição começou em 11 de janeiro de 1985."),
      S("[Since|Since marca o ponto de partida: desde 1985.||3] 1985, the festival [has happened|Present perfect com since: começou e continua.||3] many times, in Brazil and in other countries.",
        "Desde 1985, o festival aconteceu muitas vezes, no Brasil e em outros países."),
      S("If I [go|Condicional 1: if + presente.||26] next year, I [will buy|Condicional 1: will + verbo, para o resultado provável.||26] tickets for the first day.",
        "Se eu for no ano que vem, vou comprar ingressos para o primeiro dia."),
      S("I want to see a concert there [in order to|In order to mostra a finalidade, seguido do verbo.||28] feel that energy.",
        "Quero ver um show lá para sentir essa energia."),
      S("¶ In 1985, Queen was one of the bands that played at the festival.",
        "Em 1985, o Queen foi uma das bandas que tocaram no festival."),
      S("Many fans buy tickets months before, [because|Because explica o motivo.||22] the best bands play there.",
        "Muitos fãs compram ingresso com meses de antecedência, porque as melhores bandas tocam lá."),
      S("I will go to the festival [when|When apresenta o momento em que algo vai acontecer.||30] I save enough money.",
        "Vou ao festival quando juntar dinheiro suficiente.")
    ], ["in", "for", "goes", "so that", "happened", "so"], [1, 3, 4],
    { edition: "edição", tickets: "ingressos", energy: "energia", bands: "bandas", fans: "fãs", save: "juntar", enough: "suficiente", festival: "festival" }),

    // ------------------------------------------------------------ ARTE
    R(103, "Arte", "Frida Kahlo", "Resumo sobre a artista", [25, 22, 28, 3, 23, 26], [
      S("Frida Kahlo was a Mexican painter [who|Who se usa para pessoas.||25] became famous for her self-portraits.",
        "Frida Kahlo foi uma pintora mexicana que ficou famosa pelos autorretratos."),
      S("She painted herself many times [because|Because explica o motivo.||22] she spent months in bed after a bus accident.",
        "Ela se pintou muitas vezes porque passou meses na cama depois de um acidente de ônibus."),
      S("She lived in the Blue House in Mexico City, [which|Which se usa para coisas e lugares.||25] is now a museum.",
        "Ela morou na Casa Azul, na Cidade do México, que hoje é um museu."),
      S("People travel from all over the world [in order to|In order to mostra a finalidade, seguido do verbo.||28] see her paintings there.",
        "Pessoas viajam do mundo todo para ver as pinturas dela lá."),
      S("I [have been|Present perfect: have + been.||3] a fan of her work [for|For marca quanto tempo: muitos anos.||3] many years.",
        "Eu sou fã do trabalho dela há muitos anos."),
      S("¶ Her paintings show pain, [but|But liga duas ideias que se contrariam.||23] they also show strong colors and Mexican culture.",
        "As pinturas dela mostram dor, mas também mostram cores fortes e a cultura mexicana."),
      S("She was married to the painter Diego Rivera.",
        "Ela foi casada com o pintor Diego Rivera."),
      S("If I [visit|Condicional 1: if + presente.||26] Mexico City, I [will go|Condicional 1: will + verbo.||26] to the Blue House first.",
        "Se eu visitar a Cidade do México, vou primeiro à Casa Azul.")
    ], ["so that", "since", "whom", "has been", "so", "would go"], [0, 1, 4],
    { "self-portraits": "autorretratos", accident: "acidente", bed: "cama", pain: "dor", strong: "fortes", married: "casada", spent: "passou", bus: "ônibus" }),

    R(110, "Arte", "Mona Lisa", "Resumo sobre a obra", [25, 29, 28, 3, 2, 30], [
      S("The Mona Lisa is a portrait painted by Leonardo da Vinci more than 500 years ago.",
        "A Mona Lisa é um retrato pintado por Leonardo da Vinci há mais de 500 anos."),
      S("Leonardo, [who|Who se usa para pessoas.||25] was also an inventor, painted it in the early 1500s.",
        "Leonardo, que também foi inventor, a pintou no início dos anos 1500."),
      S("The painting is in the Louvre Museum in Paris, [which|Which se usa para coisas e lugares.||25] receives millions of visitors every year.",
        "A pintura está no Museu do Louvre, em Paris, que recebe milhões de visitantes por ano."),
      S("[Although|Although liga duas ideias que se contrariam: pequena, mas multidão enorme.|Though/Even though|29] the painting is small, the crowd around it is huge.",
        "Embora a pintura seja pequena, a multidão ao redor é enorme."),
      S("People wait in line [in order to|In order to mostra a finalidade, seguido do verbo.||28] see it for a few seconds.",
        "As pessoas esperam na fila para vê-la por alguns segundos."),
      S("I [have wanted|Present perfect: desejo que começou e continua.||3] to see it [since|Since marca o ponto de partida: desde a adolescência.||3] I was a teenager.",
        "Eu quero ver essa obra desde a adolescência."),
      S("¶ Experts believe the woman was Lisa Gherardini, [who|Who se usa para pessoas.||25] lived in Florence.",
        "Especialistas acreditam que a mulher era Lisa Gherardini, que morava em Florença."),
      S("In 1911, someone [took|Passado simples: o ano está dito.||2] it from the Louvre, and it came back two years later.",
        "Em 1911, alguém levou a obra do Louvre, e ela voltou dois anos depois."),
      S("[After|After: depois de algo que aconteceu antes.||30] the theft, the painting became even more famous.",
        "Depois do roubo, a pintura ficou ainda mais famosa.")
    ], ["so that", "has wanted", "for", "despite", "whom", "has taken", "Before"], [2, 3, 4],
    { portrait: "retrato", inventor: "inventor", crowd: "multidão", visitors: "visitantes", theft: "roubo", line: "fila", teenager: "adolescente", experts: "especialistas", believe: "acreditam" }),

    R(111, "Arte", "A Noite Estrelada", "Resumo sobre a obra", [5, 10, 22, 23, 12, 2, 28], [
      S("The Starry Night is a painting by Vincent van Gogh, from 1889.",
        "A Noite Estrelada é uma pintura de Vincent van Gogh, de 1889."),
      S("He painted it while he [was staying|Past continuous: ação em andamento no passado.||5] in a hospital in the south of France.",
        "Ele a pintou enquanto estava internado em um hospital no sul da França."),
      S("By then, he [had painted|Past perfect: já tinha pintado antes daquele momento.||10] other famous works, like Sunflowers.",
        "Até então, ele já tinha pintado outras obras famosas, como Os Girassóis."),
      S("The sky looks like it is moving [because|Because explica o motivo.||22] the brushstrokes are thick and curved.",
        "O céu parece estar se mexendo porque as pinceladas são grossas e curvas."),
      S("The painting is not very big, [but|But liga duas ideias que se contrariam.||23] it feels full of energy.",
        "A pintura não é muito grande, mas parece cheia de energia."),
      S("I [have only seen|Present perfect: já vi, sem dizer quando.||1] it in pictures.",
        "Eu só vi essa obra em fotos."),
      S("¶ Van Gogh [used to|Used to: hábito no passado.||12] paint outside, but he painted this sky from his window and from memory.",
        "Van Gogh costumava pintar ao ar livre, mas pintou esse céu da janela e de memória."),
      S("He [sold|Passado simples: ação concluída no passado.||2] very few paintings while he was alive.",
        "Ele vendeu pouquíssimas pinturas enquanto estava vivo."),
      S("Today, people visit the museum in New York [to|To mostra a finalidade, seguido do verbo.|in order to|28] see it.",
        "Hoje, as pessoas visitam o museu em Nova York para vê-la.")
    ], ["stayed", "painted", "so", "has only seen", "use to", "has sold"], [1, 2, 4],
    { hospital: "hospital", brushstrokes: "pinceladas", thick: "grossas", curved: "curvas", energy: "energia", works: "obras", sunflowers: "girassóis", sky: "céu", memory: "memória", outside: "ao ar livre", alive: "vivo" }),

    R(112, "Arte", "Banksy", "Resumo sobre o artista", [25, 6, 30, 1, 29], [
      S("Banksy is a street artist from the UK [who|Who se usa para pessoas.||25] became famous for paintings on city walls.",
        "Banksy é um artista de rua do Reino Unido que ficou famoso por pinturas em muros de cidades."),
      S("In 2018, one of the paintings was sold at an auction in London.",
        "Em 2018, uma das obras foi vendida em um leilão em Londres."),
      S("Everyone [was looking|Past continuous: ação em andamento no passado.||6] at it [when|When apresenta o momento que interrompe a ação.||6] the frame started to shred the canvas.",
        "Todo mundo estava olhando para a obra quando a moldura começou a picotar a tela."),
      S("[After|After: depois de algo que aconteceu antes.||30] the surprise, the painting became even more famous.",
        "Depois da surpresa, a obra ficou ainda mais famosa."),
      S("I [have never seen|Never no present perfect: nunca aconteceu até hoje.||1] the artist's work in person, but I would like to.",
        "Eu nunca vi o trabalho do artista pessoalmente, mas gostaria."),
      S("¶ The art usually has a political message and a bit of humor.",
        "A arte costuma ter uma mensagem política e um pouco de humor."),
      S("Many cities [have tried|Present perfect: sem data, o foco é o resultado.||1] to protect the artworks that appear on their walls.",
        "Muitas cidades já tentaram proteger as obras que aparecem em seus muros."),
      S("[While|While: enquanto, contrasta duas opiniões.|Although/Whereas|29] some people see it as vandalism, others see it as art.",
        "Enquanto algumas pessoas veem como vandalismo, outras veem como arte.")
    ], ["were looking", "if", "has never seen", "before", "tried", "has tried"], [2, 3, 4],
    { street: "de rua", auction: "leilão", frame: "moldura", canvas: "tela", shred: "picotar", surprise: "surpresa", vandalism: "vandalismo", walls: "muros", protect: "proteger", political: "político" })
  ];
})();

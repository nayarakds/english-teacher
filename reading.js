// Leituras do app: um resumo curto de um filme, música ou artista, com as palavras das lições.
//
// R(id, tema, título, "sobre o quê", [ids das lições que ela usa], [frases], [palavras extras], [frases para traduzir])
//   frase: S("texto em inglês com [palavra|dica|outra/outra] nos espaços para completar", "tradução")
//     dica: aparece só se a pessoa errar o espaço.
//     outra/outra: respostas que também valem (opcional), separadas por /
//   extras: palavras que parecem certas mas não são (aparecem só no "Preciso de ajuda")
//   traduzir: posições (a partir de 0) das frases que ela traduz na etapa 3
//
// Os resumos são texto original, sem trechos de letras de música.
(function () {
  function parse(s) {
    var out = [], re = /\[([^\]|]+)(?:\|([^\]|]*))?(?:\|([^\]]+))?\]/g, last = 0, m;
    while ((m = re.exec(s))) {
      if (m.index > last) out.push({ t: s.slice(last, m.index) });
      out.push({ t: m[1], gap: true, hint: m[2] || "", alts: m[3] ? m[3].split("/") : [] });
      last = m.index + m[0].length;
    }
    if (last < s.length) out.push({ t: s.slice(last) });
    return out;
  }
  function S(en, pt) { return { parts: parse(en), pt: pt }; }
  function R(id, theme, title, about, uses, sentences, extras, tr) {
    return { id: id, read: true, theme: theme, title: title, grammar: about, uses: uses, sentences: sentences, extras: extras, tr: tr };
  }

  window.READINGS = [
    // ------------------------------------------------------------ CINEMA
    R(101, "Cinema", "Bohemian Rhapsody", "Resumo do filme", [24, 23, 22, 1], [
      S("Bohemian Rhapsody is a movie about the band Queen and its singer, Freddie Mercury.",
        "Bohemian Rhapsody é um filme sobre a banda Queen e seu vocalista, Freddie Mercury."),
      S("[First|Primeiro passo da sequência.], we see the band start in London, playing small shows.",
        "Primeiro, vemos a banda começar em Londres, tocando em shows pequenos."),
      S("[Then|Segundo passo da sequência.|Next/After that], their songs become famous all over the world.",
        "Depois, as músicas deles ficam famosas no mundo todo."),
      S("[Finally|Último passo da sequência.|Lastly/In the end], the movie ends with the Live Aid concert in 1985.",
        "Por fim, o filme termina com o show do Live Aid, em 1985."),
      S("The story has some sad moments, [but|But liga duas ideias que se contrariam: triste, mas incrível.] the music is amazing.",
        "A história tem alguns momentos tristes, mas a música é incrível."),
      S("I [have watched|Experiência de vida, sem dizer quando: present perfect.] it three times [because|Because explica o motivo.] the final concert gives me goosebumps.",
        "Eu já assisti três vezes porque o show final me arrepia.")
    ], ["so", "until", "has watched", "since"], [0, 4, 5]),

    R(104, "Cinema", "Titanic", "Resumo do filme", [6, 25, 29, 26], [
      S("Titanic is a movie from 1997, directed by James Cameron.",
        "Titanic é um filme de 1997, dirigido por James Cameron."),
      S("The story is about Jack and Rose, [who|Who se usa para pessoas.] meet on the ship.",
        "A história é sobre Jack e Rose, que se conhecem no navio."),
      S("The ship [was crossing|Past continuous: ação em andamento no passado.] the Atlantic [when|When apresenta o momento que interrompe a ação.] it hit an iceberg.",
        "O navio estava atravessando o Atlântico quando bateu em um iceberg."),
      S("[Although|Although liga duas ideias que se contrariam: longo, mas amei.|Though/Even though] the movie is very long, I loved every minute.",
        "Embora o filme seja muito longo, eu amei cada minuto."),
      S("If I [watch|Condicional 1: if + presente.] it again, I [will cry|Condicional 1: will + verbo, para o resultado provável.] for sure.",
        "Se eu assistir de novo, vou chorar com certeza.")
    ], ["were crossing", "while", "would cry", "has crossed"], [2, 3, 4]),

    R(105, "Cinema", "Toy Story", "Resumo do filme", [30, 28, 3, 4], [
      S("Toy Story, from 1995, was the first feature film made entirely with computer animation.",
        "Toy Story, de 1995, foi o primeiro longa-metragem feito inteiramente com animação por computador."),
      S("The toys come alive [as soon as|As soon as: logo que, imediatamente depois.] Andy leaves the room.",
        "Os brinquedos ganham vida assim que o Andy sai do quarto."),
      S("Woody and Buzz argue [until|Until marca até quando algo dura.] they get lost and need each other.",
        "Woody e Buzz brigam até se perderem e precisarem um do outro."),
      S("Many people watch it [to|To mostra a finalidade, seguido do verbo.] remember their childhood.",
        "Muita gente assiste para relembrar a infância."),
      S("I [have already seen|Already no present perfect: já aconteceu.] it twice, but I want to watch it again.",
        "Eu já vi duas vezes, mas quero assistir de novo."),
      S("I [have loved|Present perfect: sentimento que começou e continua.] it [since|Since marca o ponto de partida.] I was a kid.",
        "Eu amo esse filme desde criança.")
    ], ["yet", "for", "as long as", "so that"], [1, 3, 5]),

    R(106, "Cinema", "Parasite", "Resumo do filme", [25, 29, 27, 28], [
      S("Parasite is a South Korean film directed by Bong Joon-ho.",
        "Parasita é um filme sul-coreano dirigido por Bong Joon-ho."),
      S("The film won four Oscars in 2020, including Best Picture.",
        "O filme ganhou quatro Oscars em 2020, incluindo Melhor Filme."),
      S("The story is about a poor family [who|Who se usa para pessoas.] enter the life of a rich family.",
        "A história é sobre uma família pobre que entra na vida de uma família rica."),
      S("[Despite|Despite é seguido de substantivo ou -ing, sem sujeito.|In spite of] being a thriller, it is also very funny.",
        "Apesar de ser um thriller, também é muito engraçado."),
      S("If I [could|Condicional 2: if + passado.] choose one movie to show a friend, I [would choose|Condicional 2: would + verbo, para o resultado imaginário.] this one.",
        "Se eu pudesse escolher um filme para mostrar a um amigo, escolheria esse."),
      S("I watched it twice [in order to|In order to mostra a finalidade, seguido do verbo.] catch all the details.",
        "Eu assisti duas vezes para pegar todos os detalhes.")
    ], ["although", "will choose", "so that", "had"], [2, 3, 4]),

    // ------------------------------------------------------------ MÚSICA
    R(102, "Música", "Imagine", "Resumo da música", [22, 23, 27, 3], [
      S("Imagine is a song by John Lennon, released in 1971.",
        "Imagine é uma música de John Lennon, lançada em 1971."),
      S("In the lyrics, he asks us to imagine a world without wars or borders.",
        "Na letra, ele nos pede para imaginar um mundo sem guerras nem fronteiras."),
      S("The melody is simple, [but|But liga a melodia simples à mensagem forte.] the message is powerful.",
        "A melodia é simples, mas a mensagem é poderosa."),
      S("The idea is simple: if everyone [lived|Condicional 2: if + passado simples, would + verbo.] in peace, the world [would be|Condicional 2: would + verbo, para o resultado imaginário.] a better place.",
        "A ideia é simples: se todo mundo vivesse em paz, o mundo seria um lugar melhor."),
      S("I [have known|Algo que começou no passado e continua: present perfect.] this song [since|Since marca o ponto de partida: desde que eu era criança.] I was a kid.",
        "Eu conheço essa música desde criança.")
    ], ["will be", "for", "live", "so"], [2, 3, 4]),

    R(107, "Música", "Thriller", "Resumo do álbum", [2, 12, 3, 4], [
      S("Thriller is an album by Michael Jackson, released in 1982.",
        "Thriller é um álbum de Michael Jackson, lançado em 1982."),
      S("It is one of the best-selling albums of all time.",
        "É um dos álbuns mais vendidos de todos os tempos."),
      S("In 1983, the video for the title song [became|Passado simples: o ano está dito.] famous for its zombie dance.",
        "Em 1983, o clipe da música-título ficou famoso pela dança dos zumbis."),
      S("People [have copied|Present perfect: sem dizer quando, o foco é a experiência.] that dance at parties for decades.",
        "As pessoas copiam essa dança em festas há décadas."),
      S("In the 80s, people [used to|Used to: hábito no passado que não existe mais.] dance to it in clubs.",
        "Nos anos 80, as pessoas dançavam essa música em baladas."),
      S("I [have listened|Present perfect: algo que começou e continua.] to it [for|For marca quanto tempo: mais de dez anos.] more than ten years.",
        "Eu escuto essa música há mais de dez anos.")
    ], ["has become", "copied", "since", "use to"], [2, 3, 5]),

    R(108, "Música", "Garota de Ipanema", "Resumo da música", [25, 22, 4, 30], [
      S("Garota de Ipanema, or The Girl from Ipanema, is a bossa nova song from 1962.",
        "Garota de Ipanema, ou The Girl from Ipanema, é uma canção de bossa nova de 1962."),
      S("It was written by Tom Jobim and Vinicius de Moraes in Rio de Janeiro.",
        "Foi escrita por Tom Jobim e Vinicius de Moraes, no Rio de Janeiro."),
      S("They were inspired by a young woman [who|Who se usa para pessoas.] walked past a bar on her way to the beach.",
        "Eles se inspiraram em uma jovem que passava por um bar a caminho da praia."),
      S("The song became a hit in many countries, [so|So mostra a consequência: virou hit, por isso muitos artistas gravaram.] many artists recorded it.",
        "A música virou sucesso em muitos países, por isso muitos artistas a gravaram."),
      S("Many artists [have recorded|Present perfect: muitos já gravaram, sem dizer quando.] it, from Frank Sinatra to Brazilian singers.",
        "Muitos artistas já gravaram a música, de Frank Sinatra a cantores brasileiros."),
      S("The melody is calm. [However|However liga duas ideias que se contrariam, depois de um ponto.|But], the lyrics talk about a sad love.",
        "A melodia é calma. No entanto, a letra fala de um amor triste."),
      S("[As soon as|As soon as: logo que, imediatamente depois.] I hear the first notes, I want to go to the beach.",
        "Assim que ouço as primeiras notas, quero ir para a praia.")
    ], ["because", "although", "recorded", "until"], [2, 3, 6]),

    R(109, "Música", "Rock in Rio", "Resumo do festival", [13, 3, 26, 28], [
      S("Rock in Rio is a music festival that started in Rio de Janeiro in 1985.",
        "O Rock in Rio é um festival de música que começou no Rio de Janeiro, em 1985."),
      S("The first edition started [on|On se usa com dia específico.] January 11th, 1985.",
        "A primeira edição começou em 11 de janeiro de 1985."),
      S("[Since|Since marca o ponto de partida: desde 1985.] 1985, the festival [has happened|Present perfect com since: começou e continua.] many times, in Brazil and in other countries.",
        "Desde 1985, o festival aconteceu muitas vezes, no Brasil e em outros países."),
      S("If I [go|Condicional 1: if + presente.] next year, I [will buy|Condicional 1: will + verbo, para o resultado provável.] tickets for the first day.",
        "Se eu for no ano que vem, vou comprar ingressos para o primeiro dia."),
      S("I want to see a concert there [in order to|In order to mostra a finalidade, seguido do verbo.] feel that energy.",
        "Quero ver um show lá para sentir essa energia.")
    ], ["in", "for", "goes", "so that"], [1, 3, 4]),

    // ------------------------------------------------------------ ARTE
    R(103, "Arte", "Frida Kahlo", "Resumo sobre a artista", [25, 22, 28, 3], [
      S("Frida Kahlo was a Mexican painter [who|Who se usa para pessoas.] became famous for her self-portraits.",
        "Frida Kahlo foi uma pintora mexicana que ficou famosa pelos autorretratos."),
      S("She painted herself many times [because|Because explica o motivo.] she spent months in bed after a bus accident.",
        "Ela se pintou muitas vezes porque passou meses na cama depois de um acidente de ônibus."),
      S("She lived in the Blue House in Mexico City, [which|Which se usa para coisas e lugares.] is now a museum.",
        "Ela morou na Casa Azul, na Cidade do México, que hoje é um museu."),
      S("People travel from all over the world [in order to|In order to mostra a finalidade, seguido do verbo.] see her paintings there.",
        "Pessoas viajam do mundo todo para ver as pinturas dela lá."),
      S("I [have been|Present perfect: have + been.] a fan of her work [for|For marca quanto tempo: muitos anos.] many years.",
        "Eu sou fã do trabalho dela há muitos anos.")
    ], ["so that", "since", "whom", "has been"], [0, 1, 4]),

    R(110, "Arte", "Mona Lisa", "Resumo sobre a obra", [25, 29, 28, 3], [
      S("The Mona Lisa is a portrait painted by Leonardo da Vinci more than 500 years ago.",
        "A Mona Lisa é um retrato pintado por Leonardo da Vinci há mais de 500 anos."),
      S("Leonardo, [who|Who se usa para pessoas.] was also an inventor, painted it in the early 1500s.",
        "Leonardo, que também foi inventor, a pintou no início dos anos 1500."),
      S("The painting is in the Louvre Museum in Paris, [which|Which se usa para coisas e lugares.] receives millions of visitors every year.",
        "A pintura está no Museu do Louvre, em Paris, que recebe milhões de visitantes por ano."),
      S("[Although|Although liga duas ideias que se contrariam: pequena, mas multidão enorme.|Though/Even though] the painting is small, the crowd around it is huge.",
        "Embora a pintura seja pequena, a multidão ao redor é enorme."),
      S("People wait in line [in order to|In order to mostra a finalidade, seguido do verbo.] see it for a few seconds.",
        "As pessoas esperam na fila para vê-la por alguns segundos."),
      S("I [have wanted|Present perfect: desejo que começou e continua.] to see it [since|Since marca o ponto de partida: desde a adolescência.] I was a teenager.",
        "Eu quero ver essa obra desde a adolescência.")
    ], ["so that", "has wanted", "for", "despite"], [2, 3, 4]),

    R(111, "Arte", "A Noite Estrelada", "Resumo sobre a obra", [5, 10, 22, 23], [
      S("The Starry Night is a painting by Vincent van Gogh, from 1889.",
        "A Noite Estrelada é uma pintura de Vincent van Gogh, de 1889."),
      S("He painted it while he [was staying|Past continuous: ação em andamento no passado.] in a hospital in the south of France.",
        "Ele a pintou enquanto estava internado em um hospital no sul da França."),
      S("By then, he [had painted|Past perfect: já tinha pintado antes daquele momento.] other famous works, like Sunflowers.",
        "Até então, ele já tinha pintado outras obras famosas, como Os Girassóis."),
      S("The sky looks like it is moving [because|Because explica o motivo.] the brushstrokes are thick and curved.",
        "O céu parece estar se mexendo porque as pinceladas são grossas e curvas."),
      S("The painting is not very big, [but|But liga duas ideias que se contrariam.] it feels full of energy.",
        "A pintura não é muito grande, mas parece cheia de energia."),
      S("I [have only seen|Present perfect: já vi, sem dizer quando.] it in pictures.",
        "Eu só vi essa obra em fotos.")
    ], ["stayed", "painted", "so", "has only seen"], [1, 2, 4]),

    R(112, "Arte", "Banksy", "Resumo sobre o artista", [25, 6, 30, 4], [
      S("Banksy is a street artist from the UK [who|Who se usa para pessoas.] became famous for paintings on city walls.",
        "Banksy é um artista de rua do Reino Unido que ficou famoso por pinturas em muros de cidades."),
      S("In 2018, one of the paintings was sold at an auction in London.",
        "Em 2018, uma das obras foi vendida em um leilão em Londres."),
      S("Everyone [was looking|Past continuous: ação em andamento no passado.] at it [when|When apresenta o momento que interrompe a ação.] the frame started to shred the canvas.",
        "Todo mundo estava olhando para a obra quando a moldura começou a picotar a tela."),
      S("[After|After: depois de algo que aconteceu antes.] the surprise, the painting became even more famous.",
        "Depois da surpresa, a obra ficou ainda mais famosa."),
      S("I [have never seen|Never no present perfect: nunca aconteceu até hoje.] the artist's work in person, but I would like to.",
        "Eu nunca vi o trabalho do artista pessoalmente, mas gostaria.")
    ], ["were looking", "while", "has never seen", "before"], [2, 3, 4])
  ];
})();

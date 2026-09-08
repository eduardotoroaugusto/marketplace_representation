# Guia de Conceitos — Carrinho de Compras Interativo

Este documento reúne, com origem etimológica das palavras e explicação técnica, todos os conceitos que aparecem no plano do projeto (arquitetura, contrato de API, segurança, testes) e no uso de Git/GitHub durante o desenvolvimento. A ideia é que, ao final, qualquer integrante do grupo consiga explicar não só *o que* cada peça faz, mas *de onde vem o nome* e *por que ele faz sentido* — exatamente o tipo de domínio que o edital cobra na apresentação oral.

---

## Parte 1 — Programação Orientada a Eventos

### 1.1 Evento

A palavra vem do latim *evenire* (*e-*, "para fora", + *venire*, "vir"), que significa literalmente "vir a acontecer, resultar". Em programação, um evento é exatamente isso: uma ocorrência que "vem a acontecer" durante a execução — um clique, uma tecla pressionada, uma resposta de rede chegando — e que o programa pode escolher reagir a ela, em vez de executar tudo em uma sequência fixa e previsível. É esse desvio do fluxo linear que dá nome ao paradigma "orientado a eventos".

### 1.2 Listener, Handler e Callback

**Listener** vem do inglês *to listen* (escutar), do inglês antigo *hlysnan*. Um *event listener* é, literalmente, algo que "fica escutando" por um tipo específico de evento.

**Handler** vem de *to handle* (manusear, lidar com), do inglês antigo *handlian* — relacionado a *hand* (mão). Um *handler* é a função que "põe a mão" no evento quando ele acontece e decide o que fazer.

**Callback** é a junção de *call* (chamar) + *back* (de volta): uma função que você entrega para outra parte do código, para ser "chamada de volta" no momento certo — no caso de eventos, no momento em que o evento ocorre.

No projeto: `element.addEventListener('click', handler)` registra um *listener*; a função `handler` passada é o *callback* que roda quando o clique (evento) acontece. `removeEventListener` faz o oposto — desregistra esse callback, evitando que ele continue sendo chamado depois que o elemento não existe mais (o que causaria um vazamento de memória, ou *memory leak*: memória "vazando" porque referências antigas nunca são liberadas pelo coletor de lixo).

### 1.3 Tipos de evento usados no projeto

| Evento | Origem/sentido literal | O que dispara |
|---|---|---|
| `click` | inglês, "estalo" (onomatopeia) | Um clique completo (pressionar e soltar) do mouse |
| `dblclick` | *double* (duplo) + *click* | Dois cliques em sequência rápida |
| `mouseover` / `mouseout` | *mouse* (o dispositivo, apelidado assim por parecer um roedor) + *over/out* (sobre/fora) | O cursor entra ou sai de um elemento |
| `dragstart` / `drop` | *drag* (arrastar) / *drop* (soltar) | Início de um arraste / soltura do item arrastado |
| `keydown` / `keyup` | *key* (tecla) + *down/up* (pressionada/solta) | Tecla pressionada / tecla solta |
| `input` | latim *inducere* (conduzir para dentro) | Qualquer alteração no valor de um campo, a cada caractere |
| `submit` | latim *submittere* (*sub-* "sob" + *mittere* "enviar" — "colocar sob, ceder, submeter") | Envio de um formulário |
| `change` | inglês comum, "mudança" | Um campo perde o foco com o valor alterado (diferente de `input`, que dispara a cada tecla) |
| `focus` / `blur` | *focus* (latim, "lareira" — ponto central de atenção) / *blur* (borrão, desfoque) | Um elemento ganha foco / perde foco (o nome "blur" sugere que o elemento "sai de foco", como uma imagem desfocada) |
| `DOMContentLoaded` | *DOM* + *content* (conteúdo) + *loaded* (carregado) | O HTML terminou de ser interpretado (sem esperar imagens/CSS) |

### 1.4 Delegação de eventos

Do latim *delegare* (*de-* + *legare*, "enviar em missão, encarregar"). Delegar é atribuir a outra instância a responsabilidade por uma tarefa. Em eventos, isso se apoia em um comportamento nativo do DOM chamado **bubbling** ("borbulhamento"): um evento disparado em um elemento filho sobe pela árvore do DOM até seus ancestrais, como uma bolha subindo na água. Delegação de eventos aproveita isso: em vez de colocar um listener em cada item de uma lista (que pode nem existir ainda quando a página carrega), coloca-se um único listener no elemento pai, e ele intercepta o evento que "borbulhou" a partir do filho. É por isso que a lista de produtos, montada depois de um `fetch`, consegue reagir a cliques sem que cada botão precise de seu próprio listener.

### 1.5 Temporizadores

`setTimeout` (do latim *tempus*, tempo) agenda uma execução única após um intervalo. `setInterval` repete a execução periodicamente. Ambos não pausam o programa — o JavaScript continua rodando outras coisas enquanto o tempo passa, e a função só é chamada quando o relógio chega lá.

---

## Parte 2 — Assincronismo

### 2.1 Síncrono vs. assíncrono

*Sync-* vem do grego *syn* (junto) + *khronos* (tempo) = "ao mesmo tempo, na mesma ordem". O prefixo *a-* nega isso: *assíncrono* é o que **não** acontece necessariamente na ordem em que foi escrito nem bloqueia o que vem depois. Uma chamada de rede é assíncrona porque a resposta demora um tempo imprevisível — o programa não fica "congelado" esperando, ele continua e é avisado quando a resposta chega.

### 2.2 Promise

Do inglês *promise* (promessa), do latim *promittere* (*pro-* "à frente" + *mittere* "enviar, mandar" = "lançar adiante, prometer"). Uma `Promise` é literalmente isso: um objeto que representa uma "promessa" de que um valor vai existir no futuro — ela pode ser cumprida (*resolved*) ou quebrada (*rejected*).

### 2.3 async / await

`async` marca uma função como "assíncrona por natureza" — ela sempre devolve uma Promise. `await` (do inglês, "aguardar") pausa a execução *daquela função específica* até a Promise ser resolvida, sem travar o restante do programa. É açúcar sintático sobre Promises: escreve-se como código sequencial, mas o motor do JavaScript continua tratando por baixo dos panos como assíncrono.

### 2.4 fetch

Do inglês *to fetch* — "ir buscar e trazer de volta", como se manda um cão buscar um objeto. A API `fetch` faz exatamente isso com uma requisição HTTP: vai até o servidor, busca a resposta, e traz de volta como uma Promise.

### 2.5 try / catch / finally

`throw` (lançar) interrompe a execução normal e "arremessa" um erro. `try` (tentar) delimita o bloco onde isso pode acontecer. `catch` (pegar) intercepta o que foi lançado, como se pegasse uma bola no ar, e permite tratar o erro em vez de deixar o programa quebrar. `finally` (finalmente) roda sempre, independente de erro ou não.

No projeto: toda chamada em `api.js` usa `try/catch` — sucesso segue o fluxo normal, e os erros 404/409/500 do contrato (Parte 4) são "pegos" e viram uma notificação de erro pro usuário, em vez de travar a aplicação.

---

## Parte 3 — Arquitetura MVVM

### 3.1 Model

Do latim *modulus* (pequena medida, molde). Um Model é o "molde" dos dados e das regras de negócio — não sabe nada sobre telas ou requisições, só sobre o que as coisas *são* e quais regras elas obedecem (ex.: um produto só pode ser vendido se `estoque > 0`).

### 3.2 View

Do latim *videre* (ver). A View é, literalmente, a parte que é vista — responsável só por mostrar o que já foi decidido em outro lugar, sem tomar decisões de negócio.

### 3.3 ViewModel

Termo cunhado em 2005 por John Gossman, da Microsoft, ao descrever o padrão usado no WPF (uma tecnologia de interface da própria Microsoft). É literalmente "o Model da View" — uma camada intermediária que traduz o Model em algo pronto para a View exibir, e traduz as ações da View (comandos) em mudanças no Model.

### 3.4 Observer / Observable

Do latim *observare* (*ob-* "diante de" + *servare* "guardar, vigiar" = "vigiar atentamente"). O padrão Observer descreve um objeto (o *Observable*, "aquele que pode ser observado") que mantém uma lista de interessados (*observers*) e os avisa sempre que seu estado muda — em vez de cada interessado ficar checando o valor repetidamente.

### 3.5 Binding

Do inglês *to bind* (amarrar, unir). *Data binding* é a "amarração" entre o estado de um ViewModel e o que a View mostra: quando o estado muda, a View é notificada e se atualiza sozinha, sem alguém chamar manualmente uma função de renderização a cada mudança.

### 3.6 Como isso aparece no projeto

No frontend (JS puro), a classe `Observable` do plano de arquitetura implementa o mecanismo de binding: `cartViewModel` expõe um `Observable`, `cartView` se inscreve nele (`subscribe`), e toda vez que o comando `addItem()` muda o estado, a View é notificada e re-renderiza sozinha — sem que `domEvents.js` (a camada de eventos) precise saber nada sobre como a tela é desenhada.

No backend (Dart/Shelf), não existe tela nem estado vivendo ao longo do tempo — por isso a adaptação: o Model decide a regra de negócio, o ViewModel orquestra o caso de uso e monta o resultado, e a View apenas serializa esse resultado em uma resposta HTTP. Não há *binding* reativo aqui, porque uma requisição HTTP começa e termina — é uma adaptação estrutural do padrão, não o padrão "canônico", e essa distinção deve ser dita explicitamente se perguntada.

---

## Parte 4 — API, HTTP e Comunicação Cliente-Servidor

### 4.1 API

*Application Programming Interface* — "Interface de Programação de Aplicações". *Interface* vem do latim *inter-* (entre) + *facies* (face, aparência): literalmente "o que fica entre duas faces", o ponto de contato que permite que duas partes diferentes se comuniquem sem precisar conhecer os detalhes internas uma da outra.

### 4.2 REST

*REpresentational State Transfer* ("transferência de estado representacional"), termo criado por Roy Fielding em sua tese de doutorado no ano 2000. A ideia central: o cliente e o servidor trocam *representações* do estado de um recurso (ex.: um produto, um pedido) — normalmente em JSON — em vez de o cliente executar código diretamente no servidor.

### 4.3 HTTP

*HyperText Transfer Protocol* — "protocolo de transferência de hipertexto". *Hyper-* vem do grego (acima de, além de); *texto* é o conteúdo com formatação e links. *Protocolo* tem uma origem curiosa: do grego *protokollon* (*protos*, "primeiro", + *kollon*, "colado") — era a primeira folha colada a um rolo de papiro na Grécia Antiga, descrevendo o conteúdo do documento. Um protocolo de comunicação faz exatamente isso: descreve, de antemão, as regras que as duas partes vão seguir.

### 4.4 Verbos HTTP usados no contrato

`GET` (buscar, sem alterar nada), `POST` (enviar dados novos, geralmente criando algo), `PUT` (substituir/atualizar algo que já existe), `DELETE` (remover). São chamados de "verbos" porque descrevem a *ação* que a requisição pede ao servidor.

### 4.5 Códigos de status HTTP usados no contrato

| Código | Categoria | Significado no projeto |
|---|---|---|
| 200 | Sucesso | Requisição atendida normalmente (ex.: lista de produtos retornada) |
| 201 | Sucesso | Algo novo foi criado (ex.: pedido criado) |
| 400 | Erro do cliente | Dados enviados inválidos (ex.: campo obrigatório faltando) |
| 401 | Erro do cliente | Não autenticado — token ausente ou inválido |
| 404 | Erro do cliente | Recurso não encontrado (ex.: produto/pedido com id inexistente) |
| 409 | Erro do cliente | Conflito com o estado atual (ex.: estoque insuficiente) |
| 500 | Erro do servidor | Falha inesperada no servidor |

### 4.6 JSON

*JavaScript Object Notation* — "notação de objeto do JavaScript". *Notação* vem do latim *notare* (marcar, anotar): um jeito padronizado de "anotar" dados estruturados como texto, para que possam trafegar entre sistemas diferentes.

### 4.7 CORS

*Cross-Origin Resource Sharing* — "compartilhamento de recursos entre origens diferentes". Uma "origem" é a combinação de protocolo + domínio + porta. Por padrão, o navegador bloqueia que uma página de uma origem chame livremente uma API de outra origem, como proteção; CORS é o mecanismo pelo qual o servidor declara explicitamente quais origens têm permissão de acesso.

---

## Parte 5 — Segurança: Autenticação e Autorização

### 5.1 Autenticação

Do grego *authentikos* (autêntico, original, genuíno), derivado de *authentes* (aquele que faz algo com as próprias mãos, autor de um ato). Autenticar é provar que alguém é genuinamente quem diz ser — a pergunta que a autenticação responde é "quem é você?".

### 5.2 Autorização

Do latim *auctor* (autor, aquele que faz crescer/cria), de onde vem *auctorizare* (dar poder, conceder autoridade). Autorizar é decidir o que essa pessoa, já identificada, tem permissão de fazer — a pergunta é "o que você pode fazer?". É por isso que autenticação sempre vem antes de autorização: primeiro se descobre quem é, depois se decide o que essa pessoa pode acessar.

### 5.3 Token

Do inglês antigo *tacen* (sinal, símbolo, prova). Um token de autenticação é um "sinal" que o servidor emite depois do login, e que o cliente apresenta depois como prova de que já foi autenticado — sem precisar mandar a senha de novo a cada requisição.

### 5.4 Hash e bcrypt

*Hash* vem do francês antigo *hacher* (picar em pedaços pequenos), de onde também vem a palavra "hachear" e o prato "hash" (carne picada). Uma função de hash "pica" um dado de entrada e produz uma saída de tamanho fixo, praticamente impossível de reverter. `bcrypt` é uma função de hash desenhada especificamente para senhas: deliberadamente lenta (para dificultar tentativa em massa) e com "sal" embutido (um valor aleatório somado à senha antes do hash, para que duas senhas iguais gerem hashes diferentes).

### 5.5 Middleware

*Middle* (meio) + *ware* (sufixo de "software", como em *hardware*/*software*). É um software que fica "no meio do caminho" entre a requisição chegando e a rota que vai efetivamente respondê-la — no projeto, é onde mora a verificação do token antes de deixar a requisição prosseguir.

---

## Parte 6 — Backend, Servidor e Roteamento

### 6.1 Servidor

Do latim *servire* (servir). Um programa que fica constantemente disponível, "servindo" respostas a quem pedir.

### 6.2 Rota / Router

*Route* vem do latim *rupta (via)* — literalmente "via rompida, aberta à força" (mesma raiz de "romper"). Uma rota mapeia um caminho (`/products`) e um verbo HTTP (`GET`) a uma função que responde a essa combinação. O `Router` é o componente que guarda esse mapa e decide, a cada requisição, qual função chamar.

### 6.3 Pipeline

*Pipe* (cano) + *line* (linha) — uma "linha de canos". Descreve uma sequência de etapas de processamento encadeadas, onde a saída de uma alimenta a entrada da próxima — no projeto, a requisição passa pelos middlewares (log, CORS, autenticação) em sequência antes de chegar à rota final.

---

## Parte 7 — Testes

### 7.1 Testar

Do latim *testis* (testemunha). Testar é dar "testemunho" de que o código funciona como deveria, através de casos concretos, em vez de confiar apenas na leitura do código.

### 7.2 Teste unitário, de integração, mock/fake

*Unitário*: testa uma "unidade" isolada (uma função, uma classe) sem depender de outras partes do sistema. *Integração*: testa várias partes funcionando juntas (ex.: uma rota completa). *Mock* (imitação, zombaria — no sentido de "fingir ser") e *fake* (falso): substitutos simplificados de uma dependência real (como um banco de dados), usados para testar sem precisar da coisa real.

### 7.3 Assert

Do latim *asserere* (afirmar com firmeza, reivindicar). Uma *assertion* é uma afirmação que o teste faz sobre o resultado esperado — se a afirmação for falsa, o teste falha.

---

## Parte 8 — Git e GitHub

### 8.1 Controle de versão

Um sistema que registra o histórico de mudanças em um conjunto de arquivos ao longo do tempo, permitindo voltar a qualquer ponto anterior e entender quem mudou o quê e quando.

### 8.2 De onde vem o nome "Git"

Linus Torvalds, o criador do Linux, criou o Git em 2005 e escolheu o nome como uma piada consigo mesmo: "git" é uma gíria britânica informal para uma pessoa desagradável ou de pouco valor. Torvalds já havia dito, de brincadeira, que nomeava seus projetos com nomes egoístas — "Linux" leva o próprio nome, e "Git" seria uma auto-ironia.

### 8.3 Repositório

Do latim *repositorium* (lugar de depósito, de *reponere*, "colocar de volta, guardar"). É onde o histórico completo do projeto fica guardado.

### 8.4 Commit

Do latim *committere* (*com-* "junto" + *mittere* "enviar, mandar" = "confiar algo a alguém, comprometer-se"). Um commit é um "compromisso": um ponto no histórico onde você afirma "estas mudanças, juntas, formam um conjunto coerente que estou registrando".

### 8.5 Branch

Do inglês *branch* (galho de árvore). Uma branch é uma linha de desenvolvimento paralela à principal — como um galho que se separa do tronco (`main`) para crescer em outra direção, podendo depois ser reincorporado.

### 8.6 Merge

Do latim *mergere* (mergulhar, submergir, fundir-se). Fazer merge é reunir duas branches — o histórico de uma "mergulha" e se funde ao da outra.

### 8.7 Clone

Do grego *klon* (broto, rebento — algo que nasce de uma planta e é geneticamente idêntico a ela). Clonar um repositório é criar uma cópia completa e idêntica dele, com todo o histórico, em outra máquina.

### 8.8 Push / Pull

*Push* (empurrar): enviar os commits locais para o repositório remoto (empurrar "para fora"). *Pull* (puxar): trazer para a máquina local os commits que estão no repositório remoto e ainda não foram baixados.

### 8.9 Fork

Do inglês *fork* (garfo — objeto com pontas que se separam, daí também "bifurcação"). No GitHub, dar fork é criar uma cópia própria de um repositório de outra pessoa/organização, sob sua conta, para poder propor mudanças sem afetar o original diretamente.

### 8.10 Pull Request

Literalmente "pedido de pull": um pedido formal para que as mudanças de uma branch sejam revisadas e, se aprovadas, trazidas (via merge) para outra branch — geralmente a `main`.

### 8.11 .gitignore

Um arquivo que lista o que o Git deve ignorar e nunca versionar — tipicamente artefatos gerados automaticamente (pastas de dependências, arquivos de build, chaves e segredos), que não fazem sentido guardar no histórico.

### 8.12 Como o grupo vai usar isso na prática

- **Estrutura de branches:** `main` sempre estável; uma branch por frente de trabalho, por exemplo `frontend` e `backend`, criadas a partir da `main`. Ninguém commita direto na `main`.
- **Commits:** pequenos e frequentes, com mensagem descrevendo o que mudou (ex.: `feat: valida estoque antes de finalizar pedido`), não um único commit gigante por entrega — é o que sustenta o critério do edital sobre "histórico de commits de todos os integrantes".
- **Pull Request:** ao terminar uma parte, abrir um Pull Request da branch de trabalho para a `main`. O Líder técnico revisa antes de aceitar o merge — é o momento natural para a revisão técnica mencionada no plano do projeto.
- **.gitignore:** deve incluir, no mínimo, `node_modules/` (frontend, se algum utilitário de teste for instalado), `.dart_tool/` e `build/` (backend), e qualquer arquivo de configuração com segredo (ex.: chave de API), caso exista.
- **Conflitos de merge:** quando frontend e backend mexem em arquivos diferentes, dificilmente há conflito; quando dois integrantes mexem no mesmo arquivo (ex.: os dois no `PLANO.md`), o Git aponta o trecho conflitante para ser resolvido manualmente antes do commit de merge.
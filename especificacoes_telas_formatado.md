# Especificação de Telas — Carrinho de Compras

Documento consolidado a partir do material extraído do Figma. Reúne, por tela, o esboço de conteúdo (o que aparece visualmente) e a especificação técnica de frontend (layout, tipografia, cores, espaçamento, componentes/estados e inventário de camadas).

**Nota de escopo:** o material de origem contém especificação técnica estruturada (viewport, tipografia, cores, espaçamento, componentes e inventário de camadas) apenas para as versões **desktop** das telas. As versões **mobile** existem apenas como esboço de conteúdo/layout aproximado (mockups com barra de status "9:41"), sem medidas em px, valores hexadecimais de cor ou família/peso tipográfico formalizados. Por isso, em cada tela abaixo, apenas a seção "Conteúdo" traz subseções Desktop/Mobile; as demais seções técnicas cobrem exclusivamente a versão desktop, conforme disponível na origem.

---

## 1. Login / Cadastro

Esta tela possui **duas variantes** de especificação técnica desktop, correspondentes aos dois estados da aba de autenticação: **Cadastro** (aba "Criar conta" ativa) e **Login** (aba "Entrar" ativa).

### Conteúdo

#### Desktop — Variante Cadastro
- [LOGO DO APP]
- "Acesse sua conta ou cadastre-se para comprar"
- Abas: Entrar | Criar conta
- Campo "Nome Completo" — placeholder "joao.usuario" — mensagem de erro "formato de nome inválido"
- Campo de e-mail — label "Coloque o seu melhor email"
- Campo "Senha" — placeholder "Digite sua senha" — valor mascarado ". . . . . . . . . . . ."
- Campo "Confirmar Senha" — placeholder "Digite sua senha"
- Botão "Entrar"
- Divisor "ou"
- Botão "Entrar com Google"

#### Desktop — Variante Login
- [LOGO DO APP]
- "Acesse sua conta ou cadastre-se para comprar"
- Abas: Entrar | Criar conta
- Campo "Endereço de e-mail" — placeholder "joao.usuario" — mensagem de erro "E-mail incompleto ou formato inválido"
- Campo "Senha" — placeholder "Digite sua senha"
- Botão "Entrar"
- Divisor "ou"
- Botão "Entrar com Google"

#### Mobile — Variante Cadastro
- Barra de status "9:41"
- [LOGO DO APP]
- "Acesse sua conta ou cadastre-se para comprar"
- Abas: Entrar | Criar conta
- Campo "Nome Completo" — placeholder "joao.usuario" — mensagem "E-mail incompleto ou formato inválido"
- Campo de e-mail — label "Coloque o seu melhor email"
- Campo "Senha" — placeholder "Digite sua senha" — valor mascarado ". . . . . . . . . . . ."
- Campo "Confirmar Senha" — placeholder "Digite sua senha"
- Botão "Entrar"
- Divisor "ou"
- Botão "Entrar com Google"

#### Mobile — Variante Login
- Barra de status "9:41"
- [App Logo]
- Abas: Entrar | Criar conta
- Campo "E-mail" — placeholder "design@wireframe.com"
- Campo "Senha" — valor mascarado "••••••••" — mensagem "Senha deve conter pelo menos 8 caracteres."
- Botão "Entrar"
- Botão "Entrar com Google"
- Anotação "Fluxos & Estados (Mockup)":
  - Carregando: Botão desativado + indicador
  - Erro: Validação inline em vermelho
  - Sucesso: Redireciona para Home

### Layout e Estrutura — Desktop

#### Variante Cadastro
**Viewport e regiões**
| Elemento | Medida | Observação |
|---|---|---|
| Viewport | 1280 × 800 px | Frame raiz; largura fixa da referência desktop |
| Layout raiz | Flex column | Auto Layout vertical; gap 0; padding 0 |
| Background | #F0F8FF | Aplicar ao container principal |
| Faixa superior | 1280 × 51 px | Padding 16px 32px; título técnico da tela |
| Área principal | 1280 × 749 px | Centraliza o card horizontalmente |

**Card de autenticação (auth-card)**
| Elemento | Medida | Observação |
|---|---|---|
| auth-card | 440 × 712 px | Posição x 420 / y 19 dentro da área principal |
| Padding do card | 40 px | Conteúdo interno com largura útil de 360px |
| Borda e raio | 1 px / 8 px | Superfície branca com contorno claro |
| Logo/cabeçalho | 360 × 104 px | Primeiro bloco do card |
| Abas | 360 × 44 px | y 168; padding 4; gap 4; raio 6 |
| Dados pessoais | 360 × 161 px | y 236; nome e e-mail |
| Senhas | 360 × 161 px | y 407; senha e confirmação |
| Ações | 360 × 123 px | y 578; gap vertical 12 |

**Implementação CSS sugerida**
```css
.screen { display:flex; flex-direction:column; width:1280px; min-height:800px; background:#F0F8FF; }
.screen-body { display:flex; justify-content:center; height:749px; position:relative; }
.auth-card { width:440px; padding:40px; box-sizing:border-box; border-radius:8px; }
.form-content { width:360px; } /* manter blocos internos na mesma largura */
```

#### Variante Login
**Viewport e regiões**
| Elemento | Medida | Observação |
|---|---|---|
| Viewport | 1280 × 800 px | Frame raiz com posicionamento livre |
| Background | #F0F8FF | Fundo principal |
| Faixa superior | 1280 × 51 px | Título técnico; padding 16px 32px |
| Área principal | 1280 × 749 px | Inicia em y 51 e centraliza o card |

**Card de autenticação (auth-card)**
| Elemento | Medida | Observação |
|---|---|---|
| auth-card | 440 × 596 px | x 420 / y 43 dentro da área principal |
| Padding | 40 px | Largura interna útil: 360px |
| Borda / raio | 1px / 8px | Card branco |
| Brand header | 360 × 104 px | x 40 / y 40 |
| Abas | 360 × 44 px | x 40 / y 168; padding 4; gap 4 |
| Credenciais | 360 × 161 px | x 40 / y 236 |
| Ações | 360 × 123 px | x 40 / y 433.5; gap 12 |

**Implementação CSS sugerida**
```css
.screen { position:relative; width:1280px; min-height:800px; background:#F0F8FF; }
.screen-body { display:flex; justify-content:center; height:749px; position:relative; }
.auth-card { width:440px; padding:40px; box-sizing:border-box; border-radius:8px; }
.auth-content { width:360px; } /* usar como largura comum dos blocos internos */
```

> **Observação:** a `auth-card` tem alturas diferentes entre as duas variantes (712px no Cadastro vs 596px no Login), coerente com o Cadastro ter dois campos extras (nome e confirmação de senha).

### Tipografia — Desktop

#### Variante Cadastro
| Fonte / Peso | Tamanho | Line-height | Letter-spacing | Cor | Uso |
|---|---|---|---|---|---|
| Inter Bold | 16px | normal | 0 | #FFFFFF | 1 uso |
| Inter Extra Bold | 20px | normal | 0% | #1B2D50 | 1 uso |
| Inter Regular | 13px | normal | 0% | #3D5570 | 1 uso |
| Inter Medium | 13px | normal | 0% | #1B2D50 | 1 uso |
| Inter Bold | 13px | normal | 0% | #1B2D50 | 1 uso |
| Inter Semi Bold | 12px | normal | 0% | #3D5570 | 4 usos |
| Inter Regular | 14px | normal | 0% | #8899AA | 2 usos |
| Inter Regular | 14px | normal | 0% | #1B2D50 | 1 uso |
| Inter Regular | 11px | normal | 0% | #EF4444 | mensagem de erro |
| Inter Black | 14px | normal | 0% | #1B2D50 | 1 uso |
| Inter Semi Bold | 14px | normal | 0% | #FFFFFF | botão primário |
| Inter Regular | 12px | normal | 0% | #8899AA | 1 uso |
| Inter Semi Bold | 14px | normal | 0% | #1B2D50 | botão secundário |

#### Variante Login
| Fonte / Peso | Tamanho | Line-height | Letter-spacing | Cor | Uso |
|---|---|---|---|---|---|
| Inter Bold | 16px | normal | 0 | #FFFFFF | 1 uso |
| Inter Extra Bold | 20px | normal | 0% | #1B2D50 | 1 uso |
| Inter Regular | 13px | normal | 0% | #3D5570 | 1 uso |
| Inter Bold | 13px | normal | 0% | #1B2D50 | 1 uso |
| Inter Medium | 13px | normal | 0% | #3D5570 | 1 uso |
| Inter Semi Bold | 12px | normal | 0% | #3D5570 | 2 usos |
| Inter Regular | 14px | normal | 0% | #1B2D50 | 1 uso |
| Inter Regular | 11px | normal | 0% | #EF4444 | erro |
| Inter Regular | 14px | normal | 0% | #8899AA | placeholder |
| Inter Semi Bold | 14px | normal | 0% | #FFFFFF | CTA |
| Inter Regular | 12px | normal | 0% | #8899AA | auxiliar |
| Inter Semi Bold | 14px | normal | 0% | #1B2D50 | secundário |

### Cores — Desktop

#### Variante Cadastro
**Preenchimentos** (100% de opacidade)
| Cor | Hex | Ocorrências | Uso |
|---|---|---|---|
| Branco | #FFFFFF | 9 | Cards, campos e superfícies |
| Azul-marinho | #1B2D50 | 8 | Texto forte, título e botão primário |
| Azul-cinza escuro | #3D5570 | 5 | Labels e texto secundário |
| Cinza azulado | #8899AA | 3 | Placeholders e texto auxiliar |
| Azul muito claro | #E8F4FD | 2 | Fundos de apoio |
| Fundo da tela | #F0F8FF | 1 | Background principal |
| Erro | #EF4444 | 1 | Validação inválida |

**Contornos**
| Cor | Hex | Ocorrências | Uso |
|---|---|---|---|
| Borda padrão | #B8CCE0 | 8 | Inputs e controles |
| Borda forte | #1B2D50 | 3 | Ênfase e controle ativo |
| Borda secundária | #3D5570 | 2 | Elementos auxiliares |
| Borda de erro | #EF4444 | 1 | Input inválido |
| Borda de superfície | #C9D8E8 | 1 | Card principal |

#### Variante Login
**Preenchimentos** (100% de opacidade)
| Cor | Hex | Ocorrências | Uso |
|---|---|---|---|
| Branco | #FFFFFF | 7 | Cards, inputs e superfícies |
| Azul-marinho | #1B2D50 | 6 | Texto forte e botão primário |
| Azul-cinza escuro | #3D5570 | 4 | Labels e texto secundário |
| Azul muito claro | #E8F4FD | 2 | Fundos de apoio |
| Cinza azulado | #8899AA | 2 | Placeholders |
| Fundo da tela | #F0F8FF | 1 | Background principal |
| Erro | #EF4444 | 1 | Validação inválida |

**Contornos**
| Cor | Hex | Ocorrências | Uso |
|---|---|---|---|
| Borda padrão | #B8CCE0 | 7 | Inputs e controles |
| Borda forte | #1B2D50 | 2 | Controle ativo |
| Borda de erro | #EF4444 | 1 | Input inválido |
| Borda secundária | #3D5570 | 1 | Elemento auxiliar |

### Espaçamento, Raios e Bordas — Desktop

#### Variante Cadastro
**Espaçamento** (gaps e paddings dos Auto Layouts)
| Valor | Uso |
|---|---|
| 0px | Sem espaçamento (reset) |
| 4px | Tabs e microespaços |
| 6px | Label para campo |
| 8px | Controles compactos |
| 12px | Ações e divisores |
| 16px | Conteúdo padrão |
| 19px | Espaço específico observado |

**Raios**
| Valor | Uso |
|---|---|
| 4px | Raio pequeno — detalhes e elementos compactos |
| 6px | Raio de controle — abas, inputs e botões |
| 8px | Raio de superfície — card principal e containers |

**Bordas e efeitos**
- Stroke padrão: 1px solid — aplicado ao card e à maioria dos campos
- Sombras: nenhuma (sem drop-shadow ou blur)
- Box sizing: border-box (recomendado)

#### Variante Login
**Espaçamento**
| Valor | Uso |
|---|---|
| 0px | Sem espaçamento (reset) |
| 4px | Abas e microespaços |
| 6px | Label para campo |
| 8px | Conteúdo compacto |
| 12px | Ações e divisor |
| 16px | Separação entre campos |

**Raios**
| Valor | Uso |
|---|---|
| 4px | Raio pequeno — detalhes compactos |
| 6px | Raio de controle — abas, inputs e botões |
| 8px | Raio de superfície — card principal |

**Bordas e efeitos**
| Peso/Efeito | Classificação | Uso |
|---|---|---|
| Stroke 1px | Padrão | Cards e inputs |
| Stroke 1.5px | Intermediário | Ícones e detalhes |
| Stroke 2px | Ênfase | Ícones/controles fortes |
| Sombras | Nenhuma | Sem blur ou drop-shadow |
- Box sizing: border-box (preserva dimensões com padding e borda)

> **Observação:** a variante Cadastro documenta apenas um peso de traço ("Stroke padrão 1px solid"), enquanto a variante Login documenta três pesos (1px / 1.5px / 2px) para os mesmos ícones compartilhados (carrinho, olho, Google/chrome) — o nível de detalhamento da mesma família de ícones não é idêntico entre as duas variantes.

### Componentes e Estados — Desktop

#### Variante Cadastro
**Estrutura semântica**
| Componente | Medida | Papel sugerido |
|---|---|---|
| ScreenCadastro | 1280 × 800 | Page/container da rota |
| AuthCard | 440 × 712 | section ou main |
| BrandHeader | 360 × 104 | Logo, nome e texto auxiliar |
| AuthTabs | 360 × 44 | tablist com Entrar / Criar conta |
| FieldGroup | 360px de largura | label + input + mensagem |
| IdentityFields | 360 × 161 | Nome completo e e-mail |
| PasswordFields | 360 × 161 | Senha e confirmação |
| AuthActions | 360 × 123 | CTA, divisor e login social |

**Controles e estados**
| Estado | Especificação | Observação |
|---|---|---|
| Aba ativa | fill #FFFFFF / texto #1B2D50 | Usar aria-selected=true |
| Aba inativa | fundo transparente | Acionável por teclado e clique |
| Input padrão | border #B8CCE0 / radius 6 | Altura e padding devem seguir o frame correspondente |
| Input inválido | border #EF4444 | Exibir mensagem de erro em Inter 11px #EF4444 |
| Senha | campo mascarado + ícone | Botão de mostrar/ocultar com aria-label |
| Botão primário | fill #1B2D50 / texto branco | Ação principal de cadastro |
| Botão Google | surface branca / border | Ação secundária; preservar ícone e label |

#### Variante Login
**Estrutura semântica**
| Componente | Medida | Papel sugerido |
|---|---|---|
| ScreenLogin | 1280 × 800 | Page/container |
| AuthCard | 440 × 596 | main ou section |
| BrandHeader | 360 × 104 | Logo e mensagem |
| AuthTabs | 360 × 44 | tablist Entrar/Criar conta |
| CredentialsFields | 360 × 161 | E-mail e senha |
| PasswordInput | 360 × 42 | Input mascarado + toggle |
| AuthActions | 360 × 123 | CTA, divisor e Google |

**Controles e estados**
| Estado | Especificação | Observação |
|---|---|---|
| Aba Entrar | ativa | aria-selected=true |
| Aba Criar conta | inativa | Navega para cadastro |
| Input padrão | border #B8CCE0 / radius 6 | Label associada via for/id |
| Input inválido | border #EF4444 | Mensagem de erro 11px #EF4444 |
| Senha | mascarada + ícone | Mostrar/ocultar com aria-label |
| Botão Entrar | fill #1B2D50 | CTA principal |
| Botão Google | branco + border | Ação secundária |

> **Observação:** a tabela de tipografia da variante Cadastro associa `Inter Medium 13px` à cor `#1B2D50`, enquanto a variante Login associa o mesmo `Inter Medium 13px` (usado no rótulo da aba inativa) à cor `#3D5570`. É o mesmo elemento reutilizável (rótulo de aba inativa do componente AuthTabs) com cor de texto documentada de forma diferente entre as duas variantes.

### Comportamentos Não Definidos — Desktop

#### Variante Cadastro
> "Não inventar estes valores durante a implementação."
- **Responsividade:** Não especificada nesta tela — definir breakpoint usando a versão mobile correspondente.
- **Hover / focus / disabled:** Não documentados — precisam ser definidos pelo produto/design system.
- **Validação e envio:** Não documentados — regras funcionais devem vir dos requisitos do produto.

#### Variante Login
> "Não inferir sem requisito do produto."
- **Responsividade:** Não definida nesta tela — usar a versão mobile como referência.
- **Hover/focus/disabled:** Não documentados — definir no design system.
- **Validação e autenticação:** Não documentadas — seguir requisitos funcionais e backend.

### Inventário de Elementos — Desktop

#### Variante Cadastro
Todas as 54 camadas da tela, com caminho, tipo, posição, dimensão e resumo de propriedades relevantes. Coordenadas relativas ao parent imediato.

| # | Caminho (layer) | Tipo | X | Y | Largura | Altura | Propriedades |
|---|---|---|---|---|---|---|---|
| 1 | desktop-cadastro | FRAME | -287 | -379 | 1280 | 800 | Auto Layout vertical · gap 0px · padding 0/0/0/0 |
| 2 | desktop-cadastro / wireframe-title- banner | FRAME | 0 | 0 | 1280 | 51 | fill #1B2D50 |
| 3 | desktop-cadastro / wireframe-title- banner / 1. Login / Cadastro (Sem Nav Superior) | TEXT | 32 | 16 | 343 | 19 | Inter Bold 16px |
| 4 | desktop-cadastro / screen-body | FRAME | 0 | 51 | 1280 | 749 |  |
| 5 | desktop-cadastro / screen-body / auth-card | FRAME | 420 | 19 | 440 | 712 | fill #FFFFFF |
| 6 | desktop-cadastro / screen-body / auth-card / content-row | FRAME | 40 | 40 | 360 | 104 |  |
| 7 | desktop-cadastro / screen-body / auth-card / content-row / content- container | FRAME | 156 | 0 | 48 | 48 | fill #E8F4FD |
| 8 | desktop-cadastro / screen-body / auth-card / content-row / content- container / shopping-cart | FRAME | 12 | 12 | 24 | 24 |  |
| 9 | desktop-cadastro / screen-body / auth-card / content-row / content- container / shopping-cart / Vector | VECTOR | 2 | 2 | 20 | 20 |  |
| 10 | desktop-cadastro / screen-body / auth-card / content-row / [LOGO DO APP] | TEXT | 102 | 56 | 156 | 24 | Inter Extra Bold 20px |
| 11 | desktop-cadastro / screen-body / auth-card / content-row / Acesse sua conta ou cadastre-se para comprar | TEXT | 34 | 88 | 292 | 16 | Inter Regular 13px |
| 12 | desktop-cadastro / screen-body / auth-card / auth-tabs | FRAME | 40 | 168 | 360 | 44 | Auto Layout horizontal · gap 4px · padding 4/4/4/4 |
| 13 | desktop-cadastro / screen-body / auth-card / auth-tabs / content- container | FRAME | 4 | 4 | 174 | 36 |  |
| 14 | desktop-cadastro / screen-body / auth-card / auth-tabs / content- container / Entrar | TEXT | 67 | 10 | 38 | 16 | Inter Medium 13px |
| 15 | desktop-cadastro / screen-body / auth-card / auth-tabs / content- container-2 | FRAME | 182 | 4 | 174 | 36 | fill #FFFFFF |
| 16 | desktop-cadastro / screen-body / auth-card / auth-tabs / content- container-2 / Criar conta | TEXT | 53 | 10 | 71 | 16 | Inter Bold 13px |
| 17 | desktop-cadastro / screen-body / auth-card / identity-fields | FRAME | 40 | 236 | 360 | 161 |  |
| 18 | desktop-cadastro / screen-body / auth-card / identity-fields / identity- fields | FRAME | -10 | -10 | 380 | 181 |  |
| 19 | desktop-cadastro / screen-body / auth-card / identity-fields / identity- fields / identity-fields | FRAME | 10 | 10 | 360 | 161 |  |
| 20 | desktop-cadastro / screen-body / auth-card / identity-fields / identity- fields / identity-fields / identity-fields | FRAME | 0 | 0 | 360 | 82 | Auto Layout vertical · gap 6px · padding 0/0/0/0 |
| 21 | desktop-cadastro / screen-body / auth-card / identity-fields / identity-fields / identity-fields / identity-fields / Nome Completo | TEXT | 0 | 0 | 94 | 15 | Inter Semi Bold 12px |
| 22 | desktop-cadastro / screen-body / auth-card / identity-fields / identity-fields / identity-fields / identity-fields / content-container | FRAME | 0 | 21 | 360 | 42 | fill #FFFFFF |
| 23 | desktop-cadastro / screen-body / auth-card / identity-fields / identity-fields / identity-fields / identity-fields / content-container / joao.usuario | TEXT | 12 | 13 | 336 | 17 | Inter Regular 14px |
| 24 | desktop-cadastro / screen-body / auth-card / identity-fields / identity-fields / identity-fields / identity-fields / formato de nome inválido | TEXT | 0 | 69 | 360 | 13 | Inter Regular 11px |
| 25 | desktop-cadastro / screen-body / auth-card / identity- fields / identity-fields / identity-fields / identity-fields-2 | FRAME | 0 | 98 | 360 | 63 | Auto Layout vertical · gap 6px · padding 0/0/0/0 |
| 26 | desktop-cadastro / screen-body / auth-card / identity- fields / identity-fields / identity-fields / identity-fields-2 / Coloque o seu melhor email | TEXT | 0 | 0 | 161 | 15 | Inter Semi Bold 12px |
| 27 | desktop-cadastro / screen-body / auth-card / identity- fields / identity-fields / identity-fields / identity-fields-2 / content-container | FRAME | 0 | 21 | 360 | 42 | Auto Layout horizontal · gap 8px · padding 0/12/0/12 |
| 28 | desktop-cadastro / screen-body / auth-card / identity- fields / identity-fields / identity-fields / identity-fields-2 / content-container / Digite sua senha | TEXT | 12 | 13 | 336 | 17 | Inter Regular 14px |
| 29 | desktop-cadastro / screen-body / auth-card / password-fields | FRAME | 40 | 407 | 360 | 161 |  |
| 30 | desktop-cadastro / screen-body / auth-card / password-fields / password-fields | FRAME | -10 | -10 | 380 | 181 |  |
| 31 | desktop-cadastro / screen-body / auth-card / password-fields / password-fields / password-fields | FRAME | 10 | 10 | 360 | 161 |  |
| 32 | desktop-cadastro / screen-body / auth-card / password-fields / password-fields / password-fields / content-stack | FRAME | 0 | 0 | 360 | 82 | Auto Layout vertical · gap 6px · padding 0/0/19/0 |
| 33 | desktop-cadastro / screen-body / auth-card / password-fields / password-fields / password-fields / content-stack / Senha | TEXT | 0 | 0 | 37 | 15 | Inter Semi Bold 12px |
| 34 | desktop-cadastro / screen-body / auth-card / password-fields / password-fields / password-fields / content-stack / content-container | FRAME | 0 | 21 | 360 | 42 | fill #FFFFFF |
| 35 | desktop-cadastro / screen-body / auth-card / password-fields / password-fields / password-fields / content-stack / content-container / . . . . . . . . . . . . | TEXT | 23 | 9 | 336 | 17 | Inter Black 14px |
| 36 | desktop-cadastro / screen-body / auth-card / password-fields / password-fields / password-fields / password-fields | FRAME | 0 | 82 | 360 | 63 | Auto Layout vertical · gap 6px · padding 0/0/0/0 |
| 37 | desktop-cadastro / screen-body / auth-card / password-fields / password-fields / password-fields / password-fields / Confirmar Senha | TEXT | 0 | 0 | 98 | 15 | Inter Semi Bold 12px |
| 38 | desktop-cadastro / screen-body / auth-card / password-fields / password-fields / password- fields / password-fields / content-row | FRAME | 0 | 21 | 360 | 42 | Auto Layout horizontal · gap 8px · padding 0/12/0/12 |
| 39 | desktop-cadastro / screen-body / auth-card / password-fields / password-fields / password-fields / password-fields / content-row / Digite sua senha | TEXT | 12 | 13 | 312 | 17 | Inter Regular 14px |
| 40 | desktop-cadastro / screen-body / auth-card / password-fields / password-fields / password-fields / password-fields / content-row / eye-off | FRAME | 332 | 13 | 16 | 16 |  |
| 41 | desktop-cadastro / screen-body / auth-card / password-fields / password-fields / password-fields / password-fields / content-row / eye-off / Vector | VECTOR | 1 | 1 | 13 | 13 |  |
| 42 | desktop-cadastro / screen-body / auth- card / password-fields / password-fields / password-fields / eye-off | FRAME | 332 | 34 | 16 | 16 |  |
| 43 | desktop-cadastro / screen-body / auth- card / password-fields / password-fields / password-fields / eye-off / Vector | VECTOR | 1 | 1 | 13 | 13 |  |
| 44 | desktop-cadastro / screen-body / auth-card / auth-actions | FRAME | 40 | 578 | 360 | 123 | Auto Layout vertical · gap 12px · padding 0/0/0/0 |
| 45 | desktop-cadastro / screen-body / auth-card / auth-actions / content- container | FRAME | 0 | 0 | 360 | 42 | Auto Layout horizontal · gap 8px · padding 0/16/0/16 |
| 46 | desktop-cadastro / screen-body / auth-card / auth-actions / content- container / Entrar | TEXT | 159 | 13 | 42 | 17 | Inter Semi Bold 14px |
| 47 | desktop-cadastro / screen-body / auth-card / auth-actions / auth- actions | FRAME | 0 | 54 | 360 | 15 | Auto Layout horizontal · gap 12px · padding 0/0/0/0 |
| 48 | desktop-cadastro / screen-body / auth-card / auth-actions / auth- actions / Line | LINE | 0 | 8 | 161 | 0 |  |
| 49 | desktop-cadastro / screen-body / auth-card / auth-actions / auth- actions / ou | TEXT | 173 | 0 | 15 | 15 | Inter Regular 12px |
| 50 | desktop-cadastro / screen-body / auth-card / auth-actions / auth- actions / Line | LINE | 200 | 8 | 161 | 0 |  |
| 51 | desktop-cadastro / screen-body / auth-card / auth-actions / auth- actions-2 | FRAME | 0 | 81 | 360 | 42 | Auto Layout horizontal · gap 8px · padding 0/16/0/16 |
| 52 | desktop-cadastro / screen-body / auth-card / auth-actions / auth- actions-2 / chrome | FRAME | 105 | 13 | 16 | 16 |  |
| 53 | desktop-cadastro / screen-body / auth-card / auth-actions / auth- actions-2 / chrome / Vector | VECTOR | 1 | 1 | 13 | 13 |  |
| 54 | desktop-cadastro / screen-body / auth-card / auth-actions / auth- actions-2 / Entrar com Google | TEXT | 129 | 13 | 126 | 17 | Inter Semi Bold 14px |


#### Variante Login
Todas as 41 camadas da tela, com caminho, tipo, posição, dimensão e propriedade principal. Coordenadas relativas ao parent imediato.

| # | Caminho (layer) | Tipo | X | Y | Largura | Altura | Propriedades |
|---|---|---|---|---|---|---|---|
| 1 | desktop-login | FRAME | 1089 | -379 | 1280 | 800 | fill #F0F8FF |
| 2 | desktop-login / wireframe-title-banner | FRAME | 0 | 0 | 1280 | 51 | fill #1B2D50 |
| 3 | desktop-login / wireframe-title-banner / 1. Login / Cadastro (Sem Nav Superior) | TEXT | 32 | 16 | 343 | 19 | Inter Bold 16px |
| 4 | desktop-login / screen-body | FRAME | 0 | 51 | 1280 | 749 |  |
| 5 | desktop-login / screen-body / auth- card | FRAME | 420 | 43 | 440 | 596 | fill #FFFFFF |
| 6 | desktop-login / screen-body / auth- card / content-row | FRAME | 40 | 40 | 360 | 104 |  |
| 7 | desktop-login / screen-body / auth- card / content-row / content-container | FRAME | 156 | 0 | 48 | 48 | fill #E8F4FD |
| 8 | desktop-login / screen-body / auth- card / content-row / content-container / shopping-cart | FRAME | 12 | 12 | 24 | 24 |  |
| 9 | desktop-login / screen-body / auth- card / content-row / content-container / shopping-cart / Vector | VECTOR | 2 | 2 | 20 | 20 |  |
| 10 | desktop-login / screen-body / auth- card / content-row / [LOGO DO APP] | TEXT | 102 | 56 | 156 | 24 | Inter Extra Bold 20px |
| 11 | desktop-login / screen-body / auth- card / content-row / Acesse sua conta ou cadastre-se para comprar | TEXT | 34 | 88 | 292 | 16 | Inter Regular 13px |
| 12 | desktop-login / screen-body / auth- card / auth-tabs | FRAME | 40 | 168 | 360 | 44 | Auto Layout horizontal · gap 4px · padding 4/4/4/4 |
| 13 | desktop-login / screen-body / auth- card / auth-tabs / content-container | FRAME | 4 | 4 | 174 | 36 | fill #FFFFFF |
| 14 | desktop-login / screen-body / auth- card / auth-tabs / content-container / Entrar | TEXT | 67 | 10 | 40 | 16 | Inter Bold 13px |
| 15 | desktop-login / screen-body / auth- card / auth-tabs / content-container-2 | FRAME | 182 | 4 | 174 | 36 |  |
| 16 | desktop-login / screen-body / auth- card / auth-tabs / content-container-2 / Criar conta | TEXT | 53 | 10 | 69 | 16 | Inter Medium 13px |
| 17 | desktop-login / screen-body / auth- card / identity-fields | FRAME | 40 | 236 | 360 | 161 |  |
| 18 | desktop-login / screen-body / auth- card / identity-fields / identity-fields | FRAME | -10 | -10 | 380 | 181 |  |
| 19 | desktop-login / screen-body / auth- card / identity-fields / identity-fields / identity-fields | FRAME | 10 | 10 | 360 | 161 | Auto Layout vertical · gap 16px · padding 0/0/0/0 |
| 20 | desktop-login / screen-body / auth-card / identity-fields / identity-fields / identity-fields / identity-fields | FRAME | 0 | 0 | 360 | 82 | Auto Layout vertical · gap 6px · padding 0/0/0/0 |
| 21 | desktop-login / screen-body / auth-card / identity-fields / identity-fields / identity-fields / identity-fields / Endereço de e-mail | TEXT | 0 | 0 | 113 | 15 | Inter Semi Bold 12px |
| 22 | desktop-login / screen-body / auth-card / identity-fields / identity-fields / identity-fields / identity-fields / content-container | FRAME | 0 | 21 | 360 | 42 | fill #FFFFFF |
| 23 | desktop-login / screen-body / auth-card / identity-fields / identity-fields / identity-fields / identity-fields / content-container / joao.usuario | TEXT | 12 | 13 | 336 | 17 | Inter Regular 14px |
| 24 | desktop-login / screen-body / auth-card / identity-fields / identity-fields / identity-fields / identity-fields / E-mail incompleto ou formato inválido | TEXT | 0 | 69 | 360 | 13 | Inter Regular 11px |
| 25 | desktop-login / screen-body / auth-card / identity-fields / identity-fields / identity-fields / content-stack | FRAME | 0 | 98 | 360 | 63 | Auto Layout vertical · gap 6px · padding 0/0/0/0 |
| 26 | desktop-login / screen-body / auth-card / identity-fields / identity-fields / identity-fields / content-stack / Senha | TEXT | 0 | 0 | 37 | 15 | Inter Semi Bold 12px |
| 27 | desktop-login / screen-body / auth-card / identity-fields / identity-fields / identity-fields / content-stack / content-row | FRAME | 0 | 21 | 360 | 42 | Auto Layout horizontal · gap 8px · padding 0/12/0/12 |
| 28 | desktop-login / screen-body / auth-card / identity-fields / identity-fields / identity-fields / content-stack / content-row / Digite sua senha | TEXT | 12 | 13 | 312 | 17 | Inter Regular 14px |
| 29 | desktop-login / screen-body / auth-card / identity-fields / identity-fields / identity-fields / content-stack / content-row / eye-off | FRAME | 332 | 13 | 16 | 16 |  |
| 30 | desktop-login / screen-body / auth-card / identity-fields / identity-fields / identity-fields / content-stack / content-row / eye-off / Vector | VECTOR | 1 | 1 | 13 | 13 |  |
| 31 | desktop-login / screen-body / auth- card / auth-actions | FRAME | 40 | 434 | 360 | 123 | Auto Layout vertical · gap 12px · padding 0/0/0/0 |
| 32 | desktop-login / screen-body / auth- card / auth-actions / content- container | FRAME | 0 | 0 | 360 | 42 | Auto Layout horizontal · gap 8px · padding 0/16/0/16 |
| 33 | desktop-login / screen-body / auth- card / auth-actions / content- container / Entrar | TEXT | 159 | 13 | 42 | 17 | Inter Semi Bold 14px |
| 34 | desktop-login / screen-body / auth- card / auth-actions / auth-actions | FRAME | 0 | 54 | 360 | 15 | Auto Layout horizontal · gap 12px · padding 0/0/0/0 |
| 35 | desktop-login / screen-body / auth- card / auth-actions / auth-actions / Line | LINE | 0 | 8 | 161 | 0 |  |
| 36 | desktop-login / screen-body / auth- card / auth-actions / auth-actions / ou | TEXT | 173 | 0 | 15 | 15 | Inter Regular 12px |
| 37 | desktop-login / screen-body / auth- card / auth-actions / auth-actions / Line | LINE | 200 | 8 | 161 | 0 |  |
| 38 | desktop-login / screen-body / auth- card / auth-actions / auth-actions-2 | FRAME | 0 | 81 | 360 | 42 | Auto Layout horizontal · gap 8px · padding 0/16/0/16 |
| 39 | desktop-login / screen-body / auth- card / auth-actions / auth-actions-2 / chrome | FRAME | 105 | 13 | 16 | 16 |  |
| 40 | desktop-login / screen-body / auth- card / auth-actions / auth-actions-2 / chrome / Vector | VECTOR | 1 | 1 | 13 | 13 |  |
| 41 | desktop-login / screen-body / auth- card / auth-actions / auth-actions-2 / Entrar com Google | TEXT | 129 | 13 | 126 | 17 | Inter Semi Bold 14px |


---

## 2. Home

### Conteúdo

#### Desktop
- Cabeçalho: [LOGO] · Home · Compras · Jogos · campo "Buscar produtos, marcas..." · indicador de carrinho "3" · avatar "JD" · "João"
- Título da tela: "Olá, João"
- "Resultados de busca para "Todos"" · "Ordenar por: Mais relevantes"
- Sidebar "Categorias": Todos, Eletrônicos, Roupas, Casa, Esportes, Livros
- Grade de produtos (cards com foto, nome, preço, avaliação em estrelas (4.0) e botão "Adicionar ao carrinho"):
  - Smart TV 4K 55'' — R$ 2.499,00 — (4.0)
  - Smartphone 128GB Pro — R$ 4.199,00 — (4.0)
  - Camiseta Algodão Básica — R$ 59,90 — (4.0)
  - Tênis Corrida Performance — R$ 349,90 — (4.0)
  - Caneca Cerâmica Térmica — R$ 89,00 — (4.0)
  - Livro: Design de Interfaces UX — R$ 120,00 — (4.0)
- Rodapé da grade: "Carregar mais produtos"

#### Mobile
- Barra de status "9:41"; indicadores de carrinho "3" e notificações "2"
- Título: "Olá, Felipe"
- Campo "Buscar produtos, marcas..."
- Filtros por chip: Todos | Eletrônicos | Roupas | Casa
- Grade de produtos (conteúdo com artefatos de extração/OCR, reproduzido como no original):
  - "Fone de Ouvido Sem Fi oi" — "rRe$ra 1m4e9,90" — "+ Adicionar"
  - "Camiseta Básica Preta Lnih" — "aRs$ 59,90" — "+ Adicionar"
  - "Luminária de Mesa Articual" — "dRa$ 89,00" — "+ Adicionar"
  - "Mochila Executiva Noteboo" — "R$ 199,00" — "+ Adicionar"
- Navegação inferior (rótulos truncados no material de origem): "ome | Comras | oos | oticaes | erl" (aparentam ser Home / Compras / Jogos / Notificações / Perfil)

### Layout e Estrutura — Desktop
**Viewport e regiões**
| Elemento | Medida | Observação |
|---|---|---|
| Viewport | 1280 × 1000 px | Auto Layout vertical; background #F0F8FF |
| Faixa superior | 1280 × 51 px | Padding 16px 32px |
| Top navigation | 1280 × 72 px | y 51; padding lateral 40px |
| Home body | 1280 × 859 px | y 123; padding 40px; gap horizontal 32px |

**Navegação**
| Elemento | Medida | Observação |
|---|---|---|
| nav-left | 384 × 33 px | x 40 / y 19.5; logo e links |
| nav-search | 360 × 40 px | x 542.5 / y 16; padding 12; gap 8; raio 6 |
| nav-right | 219 × 32 px | x 1021 / y 20; notificações e usuário |

**Conteúdo principal**
| Elemento | Medida | Observação |
|---|---|---|
| sidebar-filters | 240 × 241 px | x 40 / y 40 |
| grid-area | 928 × 779 px | x 312 / y 40; Auto Layout vertical; gap 24 |
| results-toolbar | 928 × 59 px | Título da busca e ordenação |
| products-grid | 928 × 614 px | Cards de produtos |
| load-more | 928 × 58 px | Ação inferior |

**CSS estrutural sugerido**
```css
.home { display:flex; flex-direction:column; width:1280px; min-height:1000px; }
.home-body { display:grid; grid-template-columns:240px 1fr; gap:32px; padding:40px; }
.products-area { width:928px; display:flex; flex-direction:column; gap:24px; }
```

### Tipografia — Desktop
| Fonte / Peso | Tamanho | Line-height | Letter-spacing | Cor | Uso |
|---|---|---|---|---|---|
| Inter Semi Bold | 14px | normal | 0% | #1B2D50 | 14 usos |
| Inter Regular | 11px | normal | 0 | #8899AA | 6 usos |
| Inter Bold | 16px | normal | 0% | #1B2D50 | 6 usos |
| Inter Regular | 11px | normal | 0% | #3D5570 | 6 usos |
| Inter Regular | 13px | normal | 0% | #3D5570 | 5 usos |
| Inter Medium | 14px | normal | 0% | #3D5570 | 2 usos |
| Inter Semi Bold | 13px | normal | 0% | #1B2D50 | 2 usos |
| Inter Bold | 16px | normal | 0 | #FFFFFF | 1 uso |
| Inter Extra Bold | 14px | normal | 0% | #1B2D50 | 1 uso |
| Inter Bold | 14px | normal | 0% | #1B2D50 | 1 uso |
| Inter Regular | 13px | normal | 0% | #8899AA | 1 uso |
| Inter Bold | 11px | normal | 0% | #FFFFFF | 1 uso |
| Inter Bold | 12px | normal | 0% | #3D5570 | 1 uso |
| Inter Bold | 14px | normal | 0 | #1B2D50 | 1 uso |
| Inter Regular | 12px | normal | 0% | #3D5570 | 1 uso |
| Inter Semi Bold | 12px | normal | 0% | #1B2D50 | 1 uso |

### Cores — Desktop
**Preenchimentos**
| Hex | Ocorrências |
|---|---|
| #1B2D50 | 28 |
| #FFFFFF | 23 |
| #3D5570 | 15 |
| #E8F4FD | 8 |
| #8899AA | 7 |
| #F0F8FF | 1 |
| #EF4444 | 1 |
| #2A3F5C | 1 |

**Contornos**
| Hex | Ocorrências |
|---|---|
| #1B2D50 | 34 |
| #B8CCE0 | 32 |
| #8899AA | 13 |
| #3D5570 | 2 |
| #FFFFFF | 1 |

### Espaçamento, Raios e Bordas — Desktop
**Espaçamento:** 0px, 2px, 4px, 6px, 8px, 10px, 12px, 16px, 18px, 20px, 24px, 32px, 40px, 44px (todos catalogados apenas como "spacing / gap / padding — valor observado").

**Raios:** 3px, 4px, 6px, 8px, 10px, 16px (border-radius — "aplicado a superfícies ou controles").

**Bordas e efeitos**
| Peso/Efeito | Observação |
|---|---|
| 1px | stroke-width |
| 1.5px | stroke-width |
| 2px | stroke-width |
| Sombras | Nenhuma — sem drop-shadow ou blur |
| Box sizing | border-box (recomendado) |

### Componentes e Estados — Desktop
**Estrutura semântica**
| Componente | Medida | Papel sugerido |
|---|---|---|
| HomePage | 1280 × 1000 | page/container |
| TopNav | 1280 × 72 | nav |
| BrandNav | 384 × 33 | logo + links |
| SearchInput | 360 × 40 | search landmark |
| UserActions | 219 × 32 | notificações + perfil |
| SidebarFilters | 240 × 241 | aside + filtros |
| ResultsArea | 928 × 779 | main |
| ResultsToolbar | 928 × 59 | título + select |
| ProductsGrid | 928 × 614 | lista de cards |
| LoadMore | 928 × 58 | ação de paginação |

**Estados e acessibilidade**
| Elemento | Especificação | Observação |
|---|---|---|
| Link ativo | Home destacada | aria-current=page |
| Busca | input type=search | Label acessível e submit por Enter |
| Filtros | grupo selecionável | Inputs checkbox/radio conforme regra do produto |
| Ordenação | select | Label associada |
| Product card | article | Imagem com alt, título e preço |
| Favorito/carrinho | icon buttons | aria-label obrigatório |
| Carregar mais | button | Gerenciar loading e disabled |

### Comportamentos Não Definidos — Desktop
> "Não inventar sem requisito." (seção nomeada "Não definido" nesta tela, em vez de "Comportamentos não definidos")
- **Breakpoints:** Não documentados — usar a Home mobile como referência.
- **Hover/focus/disabled:** Não documentados — definir no design system.
- **Busca, filtro e paginação:** Não documentados — integrar conforme API e requisitos.

### Inventário de Elementos — Desktop
Todas as 223 camadas da tela, com caminho, tipo, posição, dimensão e propriedade principal. Coordenadas relativas ao parent imediato.

| # | Caminho (layer) | Tipo | X | Y | Largura | Altura | Propriedades |
|---|---|---|---|---|---|---|---|
| 1 | desktop-home | FRAME | 2465 | -379 | 1280 | 1000 | Auto Layout vertical · gap 0px · padding 0/0/18/0 |
| 2 | desktop-home / wireframe-title- banner | FRAME | 0 | 0 | 1280 | 51 | fill #1B2D50 |
| 3 | desktop-home / wireframe-title- banner / 2. Home (Olá, João) | TEXT | 32 | 16 | 171 | 19 | Inter Bold 16px |
| 4 | desktop-home / top-nav | FRAME | 0 | 51 | 1280 | 72 | fill #FFFFFF |
| 5 | desktop-home / top-nav / nav-left | FRAME | 40 | 20 | 384 | 33 | Auto Layout horizontal · gap 40px · padding 0/44/0/0 |
| 6 | desktop-home / top-nav / nav-left / logo-placeholder | FRAME | 0 | 0 | 109 | 33 | Auto Layout horizontal · gap 8px · padding 8/16/8/16 |
| 7 | desktop-home / top-nav / nav-left / logo-placeholder / shopping-cart | FRAME | 16 | 9 | 16 | 16 |  |
| 8 | desktop-home / top-nav / nav-left / logo-placeholder / shopping-cart / Vector | VECTOR | 1 | 1 | 13 | 13 |  |
| 9 | desktop-home / top-nav / nav-left / logo-placeholder / [LOGO] | TEXT | 40 | 8 | 53 | 17 | Inter Extra Bold 14px |
| 10 | desktop-home / top-nav / nav-left / nav-links | FRAME | 149 | 0 | 191 | 33 | Auto Layout horizontal · gap 24px · padding 0/0/0/0 |
| 11 | desktop-home / top-nav / nav-left / nav-links / content-container | FRAME | 0 | 0 | 41 | 33 | Auto Layout vertical · gap 0px · padding 8/0/8/0 |
| 12 | desktop-home / top-nav / nav-left / nav-links / content-container / Home | TEXT | 0 | 8 | 41 | 17 | Inter Bold 14px |
| 13 | desktop-home / top-nav / nav-left / nav-links / content-container-2 | FRAME | 65 | 0 | 61 | 33 | Auto Layout vertical · gap 0px · padding 8/0/8/0 |
| 14 | desktop-home / top-nav / nav-left / nav-links / content-container-2 / Compras | TEXT | 0 | 8 | 61 | 17 | Inter Medium 14px |
| 15 | desktop-home / top-nav / nav-left / nav-links / content-container-3 | FRAME | 150 | 0 | 41 | 33 | Auto Layout vertical · gap 0px · padding 8/0/8/0 |
| 16 | desktop-home / top-nav / nav-left / nav-links / content-container-3 / Jogos | TEXT | 0 | 8 | 41 | 17 | Inter Medium 14px |
| 17 | desktop-home / top-nav / nav-search | FRAME | 543 | 16 | 360 | 40 | Auto Layout horizontal · gap 8px · padding 12/12/12/12 |
| 18 | desktop-home / top-nav / nav-search / search | FRAME | 13 | 13 | 16 | 16 |  |
| 19 | desktop-home / top-nav / nav-search / search / Vector | VECTOR | 2 | 2 | 12 | 12 |  |
| 20 | desktop-home / top-nav / nav-search / Buscar produtos, marcas... | TEXT | 37 | 13 | 312 | 16 | Inter Regular 13px |
| 21 | desktop-home / top-nav / nav-right | FRAME | 1021 | 20 | 219 | 32 |  |
| 22 | desktop-home / top-nav / nav-right / notif-trigger | FRAME | 0 | 0 | 32 | 32 | Auto Layout horizontal · gap 0px · padding 0/0/0/0 |
| 23 | desktop-home / top-nav / nav-right / notif-trigger / bell | FRAME | 6 | 6 | 20 | 20 |  |
| 24 | desktop-home / top-nav / nav-right / notif-trigger / bell / Vector | VECTOR | 3 | 2 | 15 | 17 |  |
| 25 | desktop-home / top-nav / nav-right / notif-trigger / Ellipse | ELLIPSE | 22 | 2 | 8 | 8 | fill #EF4444 |
| 26 | desktop-home / top-nav / nav-right / cart-trigger | FRAME | 56 | 6 | 48 | 20 | Auto Layout horizontal · gap 8px · padding 0/0/0/0 |
| 27 | desktop-home / top-nav / nav-right / cart-trigger / shopping-bag | FRAME | 0 | 0 | 20 | 20 |  |
| 28 | desktop-home / top-nav / nav-right / cart-trigger / shopping-bag / Vector | VECTOR | 3 | 2 | 15 | 17 |  |
| 29 | desktop-home / top-nav / nav-right / cart-trigger / content-container | FRAME | 28 | 2 | 20 | 17 | Auto Layout horizontal · gap 0px · padding 2/6/2/6 |
| 30 | desktop-home / top-nav / nav-right / cart-trigger / content-container / 3 | TEXT | 6 | 2 | 8 | 13 | Inter Bold 11px |
| 31 | desktop-home / top-nav / nav-right / user-menu | FRAME | 128 | 0 | 91 | 32 | Auto Layout horizontal · gap 8px · padding 0/0/0/0 |
| 32 | desktop-home / top-nav / nav-right / user-menu / content-container | FRAME | 0 | 0 | 32 | 32 | Auto Layout horizontal · gap 0px · padding 0/0/0/0 |
| 33 | desktop-home / top-nav / nav-right / user-menu / content-container / JD | TEXT | 8 | 9 | 16 | 15 | Inter Bold 12px |
| 34 | desktop-home / top-nav / nav-right / user-menu / João | TEXT | 40 | 8 | 31 | 16 | Inter Semi Bold 13px |
| 35 | desktop-home / top-nav / nav-right / user-menu / chevron-down | FRAME | 79 | 10 | 12 | 12 |  |
| 36 | desktop-home / top-nav / nav-right / user-menu / chevron-down / Vector | VECTOR | 3 | 5 | 6 | 3 |  |
| 37 | desktop-home / home-body | FRAME | 0 | 123 | 1280 | 859 | Auto Layout horizontal · gap 32px · padding 40/40/40/40 |
| 38 | desktop-home / home-body / sidebar- filters | FRAME | 40 | 40 | 240 | 241 | Auto Layout vertical · gap 20px · padding 24/24/24/24 |
| 39 | desktop-home / home-body / sidebar- filters / Categorias | TEXT | 25 | 25 | 92 | 17 | Inter Bold 14px |
| 40 | desktop-home / home-body / sidebar- filters / content-stack | FRAME | 25 | 62 | 192 | 156 | Auto Layout vertical · gap 12px · padding 0/0/0/0 |
| 41 | desktop-home / home-body / sidebar- filters / content-stack / content-row | FRAME | 0 | 0 | 192 | 16 | Auto Layout horizontal · gap 10px · padding 0/0/0/0 |
| 42 | desktop-home / home-body / sidebar-filters / content-stack / content-row / content-container | FRAME | 0 | 0 | 16 | 16 | Auto Layout horizontal · gap 0px · padding 0/0/0/0 |
| 43 | desktop-home / home-body / sidebar-filters / content-stack / content-row / content-container / check | FRAME | 3 | 3 | 10 | 10 |  |
| 44 | desktop-home / home-body / sidebar-filters / content-stack / content-row / content-container / check / Vector | VECTOR | 2 | 3 | 7 | 5 |  |
| 45 | desktop-home / home-body / sidebar-filters / content-stack / content-row / Todos | TEXT | 26 | 0 | 166 | 16 | Inter Semi Bold 13px |
| 46 | desktop-home / home-body / sidebar-filters / content-stack / content-row-2 | FRAME | 0 | 28 | 192 | 16 | Auto Layout horizontal · gap 10px · padding 0/0/0/0 |
| 47 | desktop-home / home-body / sidebar-filters / content-stack / content-row-2 / content- container | FRAME | 0 | 0 | 16 | 16 | Auto Layout horizontal · gap 0px · padding 0/0/0/0 |
| 48 | desktop-home / home-body / sidebar-filters / content-stack / content-row-2 / Eletrônicos | TEXT | 26 | 0 | 166 | 16 | Inter Regular 13px |
| 49 | desktop-home / home-body / sidebar-filters / content-stack / content-row-3 | FRAME | 0 | 56 | 192 | 16 | Auto Layout horizontal · gap 10px · padding 0/0/0/0 |
| 50 | desktop-home / home-body / sidebar-filters / content-stack / content-row-3 / content- container | FRAME | 0 | 0 | 16 | 16 | Auto Layout horizontal · gap 0px · padding 0/0/0/0 |
| 51 | desktop-home / home-body / sidebar-filters / content-stack / content-row-3 / Roupas | TEXT | 26 | 0 | 166 | 16 | Inter Regular 13px |
| 52 | desktop-home / home-body / sidebar-filters / content-stack / content-row-4 | FRAME | 0 | 84 | 192 | 16 | Auto Layout horizontal · gap 10px · padding 0/0/0/0 |
| 53 | desktop-home / home-body / sidebar- filters / content-stack / content-row-4 / content-container | FRAME | 0 | 0 | 16 | 16 | Auto Layout horizontal · gap 0px · padding 0/0/0/0 |
| 54 | desktop-home / home-body / sidebar- filters / content-stack / content-row-4 / Casa | TEXT | 26 | 0 | 166 | 16 | Inter Regular 13px |
| 55 | desktop-home / home-body / sidebar- filters / content-stack / content-row-5 | FRAME | 0 | 112 | 192 | 16 | Auto Layout horizontal · gap 10px · padding 0/0/0/0 |
| 56 | desktop-home / home-body / sidebar-filters / content-stack / content-row-5 / content-container | FRAME | 0 | 0 | 16 | 16 | Auto Layout horizontal · gap 0px · padding 0/0/0/0 |
| 57 | desktop-home / home-body / sidebar-filters / content-stack / content-row-5 / Esportes | TEXT | 26 | 0 | 166 | 16 | Inter Regular 13px |
| 58 | desktop-home / home-body / sidebar-filters / content-stack / content-row-6 | FRAME | 0 | 140 | 192 | 16 | Auto Layout horizontal · gap 10px · padding 0/0/0/0 |
| 59 | desktop-home / home-body / sidebar-filters / content-stack / content-row-6 / content-container | FRAME | 0 | 0 | 16 | 16 | Auto Layout horizontal · gap 0px · padding 0/0/0/0 |
| 60 | desktop-home / home-body / sidebar-filters / content-stack / content-row-6 / Livros | TEXT | 26 | 0 | 166 | 16 | Inter Regular 13px |
| 61 | desktop-home / home-body / grid- area | FRAME | 312 | 40 | 928 | 779 | Auto Layout vertical · gap 24px · padding 0/0/0/0 |
| 62 | desktop-home / home-body / grid- area / content-row | FRAME | 0 | 0 | 928 | 59 | Auto Layout horizontal · gap 0px · padding 16/16/16/16 |
| 63 | desktop-home / home-body / grid- area / content-row / Resultados de busca para "Todos" | TEXT | 16 | 21 | 231 | 17 | Inter Semi Bold 14px |
| 64 | desktop-home / home-body / grid- area / content-row / content-row | FRAME | 700 | 16 | 212 | 27 | Auto Layout horizontal · gap 8px · padding 0/0/0/0 |
| 65 | desktop-home / home-body / grid-area / content-row / content-row / Ordenar por: | TEXT | 0 | 6 | 72 | 15 | Inter Regular 12px |
| 66 | desktop-home / home-body / grid-area / content-row / content-row / content-row | FRAME | 80 | 0 | 132 | 27 | Auto Layout horizontal · gap 4px · padding 6/12/6/12 |
| 67 | desktop-home / home-body / grid-area / content-row / content-row / content-row / Mais relevantes | TEXT | 12 | 6 | 92 | 15 | Inter Semi Bold 12px |
| 68 | desktop-home / home-body / grid-area / content-row / content-row / content-row / chevron-down | FRAME | 108 | 8 | 12 | 12 |  |
| 69 | desktop-home / home-body / grid-area / content-row / content-row / content-row / chevron-down / Vector | VECTOR | 3 | 5 | 6 | 3 |  |
| 70 | desktop-home / home-body / grid- area / content-row-2 | FRAME | 0 | 83 | 928 | 614 | Auto Layout grid · gap 0px · padding 0/0/0/0 |
| 71 | desktop-home / home-body / grid- area / content-row-2 / content-stack | FRAME | 0 | 0 | 293 | 295 | Auto Layout vertical · gap 12px · padding 16/16/16/16 |
| 72 | desktop-home / home-body / grid-area / content-row-2 / content-stack / image-placeholder | FRAME | 16 | 16 | 261 | 140 | Auto Layout vertical · gap 8px · padding 0/0/0/0 |
| 73 | desktop-home / home-body / grid-area / content-row-2 / content-stack / image-placeholder / image | FRAME | 119 | 48 | 24 | 24 |  |
| 74 | desktop-home / home-body / grid-area / content-row-2 / content-stack / image-placeholder / image / Vector | VECTOR | 3 | 3 | 18 | 18 |  |
| 75 | desktop-home / home-body / grid-area / content-row-2 / content-stack / image-placeholder / [FOTO DO PRODUTO] | TEXT | 74 | 80 | 114 | 13 | Inter Regular 11px |
| 76 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack | FRAME | 16 | 168 | 261 | 57 | Auto Layout vertical · gap 4px · padding 0/0/0/0 |
| 77 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / [Produto] Smart TV 4K 55'' | TEXT | 0 | 0 | 261 | 17 | Inter Semi Bold 14px |
| 78 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / R$ 2.499,00 | TEXT | 0 | 21 | 261 | 19 | Inter Bold 16px |
| 79 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / content-row | FRAME | 0 | 44 | 261 | 13 | Auto Layout horizontal · gap 4px · padding 0/0/0/0 |
| 80 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / content-row / content- row | FRAME | 0 | 1 | 68 | 12 | Auto Layout horizontal · gap 2px · padding 0/0/0/0 |
| 81 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / content-row / content- row / star | FRAME | 0 | 0 | 12 | 12 |  |
| 82 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 83 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / content-row / content- row / star | FRAME | 14 | 0 | 12 | 12 |  |
| 84 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 85 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / content-row / content- row / star | FRAME | 28 | 0 | 12 | 12 |  |
| 86 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 87 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / content-row / content- row / star | FRAME | 42 | 0 | 12 | 12 |  |
| 88 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 89 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / content-row / content- row / star | FRAME | 56 | 0 | 12 | 12 |  |
| 90 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 91 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-stack / content-row / (4.0) | TEXT | 72 | 0 | 25 | 13 | Inter Regular 11px |
| 92 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-row | FRAME | 16 | 237 | 261 | 42 | Auto Layout horizontal · gap 8px · padding 0/16/0/16 |
| 93 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-row / plus | FRAME | 46 | 13 | 16 | 16 |  |
| 94 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-row / plus / Vector | VECTOR | 3 | 3 | 9 | 9 |  |
| 95 | desktop-home / home-body / grid-area / content-row-2 / content-stack / content-row / Adicionar ao carrinho | TEXT | 70 | 13 | 145 | 17 | Inter Semi Bold 14px |
| 96 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 | FRAME | 317 | 0 | 293 | 295 | Auto Layout vertical · gap 12px · padding 16/16/16/16 |
| 97 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / image-placeholder | FRAME | 16 | 16 | 261 | 140 | Auto Layout vertical · gap 8px · padding 0/0/0/0 |
| 98 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / image-placeholder / image | FRAME | 119 | 48 | 24 | 24 |  |
| 99 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / image-placeholder / image / Vector | VECTOR | 3 | 3 | 18 | 18 |  |
| 100 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / image-placeholder / [FOTO DO PRODUTO] | TEXT | 74 | 80 | 114 | 13 | Inter Regular 11px |
| 101 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack | FRAME | 16 | 168 | 261 | 57 | Auto Layout vertical · gap 4px · padding 0/0/0/0 |
| 102 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / [Produto] Smartphone 128GB Pro | TEXT | 0 | 0 | 261 | 17 | Inter Semi Bold 14px |
| 103 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / R$ 4.199,00 | TEXT | 0 | 21 | 261 | 19 | Inter Bold 16px |
| 104 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / content-row | FRAME | 0 | 44 | 261 | 13 | Auto Layout horizontal · gap 4px · padding 0/0/0/0 |
| 105 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / content-row / content- row | FRAME | 0 | 1 | 68 | 12 | Auto Layout horizontal · gap 2px · padding 0/0/0/0 |
| 106 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / content-row / content- row / star | FRAME | 0 | 0 | 12 | 12 |  |
| 107 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 108 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / content-row / content- row / star | FRAME | 14 | 0 | 12 | 12 |  |
| 109 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 110 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / content-row / content- row / star | FRAME | 28 | 0 | 12 | 12 |  |
| 111 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 112 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / content-row / content- row / star | FRAME | 42 | 0 | 12 | 12 |  |
| 113 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 114 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / content-row / content- row / star | FRAME | 56 | 0 | 12 | 12 |  |
| 115 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 116 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-stack / content-row / (4.0) | TEXT | 72 | 0 | 25 | 13 | Inter Regular 11px |
| 117 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-row | FRAME | 16 | 237 | 261 | 42 | Auto Layout horizontal · gap 8px · padding 0/16/0/16 |
| 118 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-row / plus | FRAME | 46 | 13 | 16 | 16 |  |
| 119 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-row / plus / Vector | VECTOR | 3 | 3 | 9 | 9 |  |
| 120 | desktop-home / home-body / grid-area / content-row-2 / content-stack-2 / content-row / Adicionar ao carrinho | TEXT | 70 | 13 | 145 | 17 | Inter Semi Bold 14px |
| 121 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 | FRAME | 635 | 0 | 293 | 295 | Auto Layout vertical · gap 12px · padding 16/16/16/16 |
| 122 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / image-placeholder | FRAME | 16 | 16 | 261 | 140 | Auto Layout vertical · gap 8px · padding 0/0/0/0 |
| 123 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / image-placeholder / image | FRAME | 119 | 48 | 24 | 24 |  |
| 124 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / image-placeholder / image / Vector | VECTOR | 3 | 3 | 18 | 18 |  |
| 125 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / image-placeholder / [FOTO DO PRODUTO] | TEXT | 74 | 80 | 114 | 13 | Inter Regular 11px |
| 126 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack | FRAME | 16 | 168 | 261 | 57 | Auto Layout vertical · gap 4px · padding 0/0/0/0 |
| 127 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / [Produto] Camiseta Algodão Básica | TEXT | 0 | 0 | 261 | 17 | Inter Semi Bold 14px |
| 128 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / R$ 59,90 | TEXT | 0 | 21 | 261 | 19 | Inter Bold 16px |
| 129 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / content-row | FRAME | 0 | 44 | 261 | 13 | Auto Layout horizontal · gap 4px · padding 0/0/0/0 |
| 130 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / content-row / content- row | FRAME | 0 | 1 | 68 | 12 | Auto Layout horizontal · gap 2px · padding 0/0/0/0 |
| 131 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / content-row / content- row / star | FRAME | 0 | 0 | 12 | 12 |  |
| 132 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 133 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / content-row / content- row / star | FRAME | 14 | 0 | 12 | 12 |  |
| 134 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 135 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / content-row / content- row / star | FRAME | 28 | 0 | 12 | 12 |  |
| 136 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 137 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / content-row / content- row / star | FRAME | 42 | 0 | 12 | 12 |  |
| 138 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 139 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / content-row / content- row / star | FRAME | 56 | 0 | 12 | 12 |  |
| 140 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 141 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-stack / content-row / (4.0) | TEXT | 72 | 0 | 25 | 13 | Inter Regular 11px |
| 142 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-row | FRAME | 16 | 237 | 261 | 42 | Auto Layout horizontal · gap 8px · padding 0/16/0/16 |
| 143 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-row / plus | FRAME | 46 | 13 | 16 | 16 |  |
| 144 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-row / plus / Vector | VECTOR | 3 | 3 | 9 | 9 |  |
| 145 | desktop-home / home-body / grid-area / content-row-2 / content-stack-3 / content-row / Adicionar ao carrinho | TEXT | 70 | 13 | 145 | 17 | Inter Semi Bold 14px |
| 146 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 | FRAME | 0 | 319 | 293 | 295 | Auto Layout vertical · gap 12px · padding 16/16/16/16 |
| 147 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / image-placeholder | FRAME | 16 | 16 | 261 | 140 | Auto Layout vertical · gap 8px · padding 0/0/0/0 |
| 148 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / image-placeholder / image | FRAME | 119 | 48 | 24 | 24 |  |
| 149 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / image-placeholder / image / Vector | VECTOR | 3 | 3 | 18 | 18 |  |
| 150 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / image-placeholder / [FOTO DO PRODUTO] | TEXT | 74 | 80 | 114 | 13 | Inter Regular 11px |
| 151 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack | FRAME | 16 | 168 | 261 | 57 | Auto Layout vertical · gap 4px · padding 0/0/0/0 |
| 152 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / [Produto] Tênis Corrida Performance | TEXT | 0 | 0 | 261 | 17 | Inter Semi Bold 14px |
| 153 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / R$ 349,90 | TEXT | 0 | 21 | 261 | 19 | Inter Bold 16px |
| 154 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / content-row | FRAME | 0 | 44 | 261 | 13 | Auto Layout horizontal · gap 4px · padding 0/0/0/0 |
| 155 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / content-row / content- row | FRAME | 0 | 1 | 68 | 12 | Auto Layout horizontal · gap 2px · padding 0/0/0/0 |
| 156 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / content-row / content- row / star | FRAME | 0 | 0 | 12 | 12 |  |
| 157 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 158 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / content-row / content- row / star | FRAME | 14 | 0 | 12 | 12 |  |
| 159 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 160 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / content-row / content- row / star | FRAME | 28 | 0 | 12 | 12 |  |
| 161 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 162 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / content-row / content- row / star | FRAME | 42 | 0 | 12 | 12 |  |
| 163 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 164 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / content-row / content- row / star | FRAME | 56 | 0 | 12 | 12 |  |
| 165 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 166 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-stack / content-row / (4.0) | TEXT | 72 | 0 | 25 | 13 | Inter Regular 11px |
| 167 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-row | FRAME | 16 | 237 | 261 | 42 | Auto Layout horizontal · gap 8px · padding 0/16/0/16 |
| 168 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-row / plus | FRAME | 46 | 13 | 16 | 16 |  |
| 169 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-row / plus / Vector | VECTOR | 3 | 3 | 9 | 9 |  |
| 170 | desktop-home / home-body / grid-area / content-row-2 / content-stack-4 / content-row / Adicionar ao carrinho | TEXT | 70 | 13 | 145 | 17 | Inter Semi Bold 14px |
| 171 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 | FRAME | 317 | 319 | 293 | 295 | Auto Layout vertical · gap 12px · padding 16/16/16/16 |
| 172 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / image-placeholder | FRAME | 16 | 16 | 261 | 140 | Auto Layout vertical · gap 8px · padding 0/0/0/0 |
| 173 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / image-placeholder / image | FRAME | 119 | 48 | 24 | 24 |  |
| 174 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / image-placeholder / image / Vector | VECTOR | 3 | 3 | 18 | 18 |  |
| 175 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / image-placeholder / [FOTO DO PRODUTO] | TEXT | 74 | 80 | 114 | 13 | Inter Regular 11px |
| 176 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack | FRAME | 16 | 168 | 261 | 57 | Auto Layout vertical · gap 4px · padding 0/0/0/0 |
| 177 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / [Produto] Caneca Cerâmica Térmica | TEXT | 0 | 0 | 261 | 17 | Inter Semi Bold 14px |
| 178 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / R$ 89,00 | TEXT | 0 | 21 | 261 | 19 | Inter Bold 16px |
| 179 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / content-row | FRAME | 0 | 44 | 261 | 13 | Auto Layout horizontal · gap 4px · padding 0/0/0/0 |
| 180 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / content-row / content- row | FRAME | 0 | 1 | 68 | 12 | Auto Layout horizontal · gap 2px · padding 0/0/0/0 |
| 181 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / content-row / content- row / star | FRAME | 0 | 0 | 12 | 12 |  |
| 182 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 183 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / content-row / content- row / star | FRAME | 14 | 0 | 12 | 12 |  |
| 184 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 185 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / content-row / content- row / star | FRAME | 28 | 0 | 12 | 12 |  |
| 186 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 187 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / content-row / content- row / star | FRAME | 42 | 0 | 12 | 12 |  |
| 188 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 189 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / content-row / content- row / star | FRAME | 56 | 0 | 12 | 12 |  |
| 190 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 191 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-stack / content-row / (4.0) | TEXT | 72 | 0 | 25 | 13 | Inter Regular 11px |
| 192 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-row | FRAME | 16 | 237 | 261 | 42 | Auto Layout horizontal · gap 8px · padding 0/16/0/16 |
| 193 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-row / plus | FRAME | 46 | 13 | 16 | 16 |  |
| 194 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-row / plus / Vector | VECTOR | 3 | 3 | 9 | 9 |  |
| 195 | desktop-home / home-body / grid-area / content-row-2 / content-stack-5 / content-row / Adicionar ao carrinho | TEXT | 70 | 13 | 145 | 17 | Inter Semi Bold 14px |
| 196 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 | FRAME | 635 | 319 | 293 | 295 | Auto Layout vertical · gap 12px · padding 16/16/16/16 |
| 197 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / image-placeholder | FRAME | 16 | 16 | 261 | 140 | Auto Layout vertical · gap 8px · padding 0/0/0/0 |
| 198 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / image-placeholder / image | FRAME | 119 | 48 | 24 | 24 |  |
| 199 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / image-placeholder / image / Vector | VECTOR | 3 | 3 | 18 | 18 |  |
| 200 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / image-placeholder / [FOTO DO PRODUTO] | TEXT | 74 | 80 | 114 | 13 | Inter Regular 11px |
| 201 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack | FRAME | 16 | 168 | 261 | 57 | Auto Layout vertical · gap 4px · padding 0/0/0/0 |
| 202 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / [Produto] Livro: Design de Interfaces UX | TEXT | 0 | 0 | 261 | 17 | Inter Semi Bold 14px |
| 203 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / R$ 120,00 | TEXT | 0 | 21 | 261 | 19 | Inter Bold 16px |
| 204 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / content-row | FRAME | 0 | 44 | 261 | 13 | Auto Layout horizontal · gap 4px · padding 0/0/0/0 |
| 205 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / content-row / content- row | FRAME | 0 | 1 | 68 | 12 | Auto Layout horizontal · gap 2px · padding 0/0/0/0 |
| 206 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / content-row / content- row / star | FRAME | 0 | 0 | 12 | 12 |  |
| 207 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 208 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / content-row / content- row / star | FRAME | 14 | 0 | 12 | 12 |  |
| 209 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 210 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / content-row / content- row / star | FRAME | 28 | 0 | 12 | 12 |  |
| 211 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 212 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / content-row / content- row / star | FRAME | 42 | 0 | 12 | 12 |  |
| 213 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 214 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / content-row / content- row / star | FRAME | 56 | 0 | 12 | 12 |  |
| 215 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / content-row / content- row / star / Vector | VECTOR | 1 | 1 | 10 | 10 |  |
| 216 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-stack / content-row / (4.0) | TEXT | 72 | 0 | 25 | 13 | Inter Regular 11px |
| 217 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-row | FRAME | 16 | 237 | 261 | 42 | Auto Layout horizontal · gap 8px · padding 0/16/0/16 |
| 218 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-row / plus | FRAME | 46 | 13 | 16 | 16 |  |
| 219 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-row / plus / Vector | VECTOR | 3 | 3 | 9 | 9 |  |
| 220 | desktop-home / home-body / grid-area / content-row-2 / content-stack-6 / content-row / Adicionar ao carrinho | TEXT | 70 | 13 | 145 | 17 | Inter Semi Bold 14px |
| 221 | desktop-home / home-body / grid-area / content- container | FRAME | 0 | 721 | 928 | 58 | Auto Layout horizontal · gap 0px · padding 16/0/0/0 |
| 222 | desktop-home / home-body / grid-area / content- container / content-container | FRAME | 368 | 16 | 193 | 42 | Auto Layout horizontal · gap 8px · padding 0/16/0/16 |
| 223 | desktop-home / home-body / grid-area / content- container / content-container / Carregar mais produtos | TEXT | 16 | 13 | 161 | 17 | Inter Semi Bold 14px |


---

## 3. Perfil

### Conteúdo

#### Desktop
- Cabeçalho: [LOGO] · Home · Compras · Jogos · campo "Buscar produtos, marcas..." · carrinho "3" · avatar "JD" · "João"
- Menu lateral: Dados Pessoais, Endereços, Segurança, Histórico de pedidos
- [FOTO DO PERFIL] — "Alterar foto de perfil"
- Campos: Nome Completo ("João da Silva"), E-mail — Google Account ("joao.usuario@gmail.com"), Telefone ("(11) 98765-4321"), CPF ("123.456.789-00"), CEP ("01311-200"), Logradouro ("Av. Paulista, 1000")
- Ações: "Sair da Conta" · "Salvar alterações"

#### Mobile
- Barra de status "9:41"
- Título "Perfil"
- "Alterar foto"
- Campos: Nome completo ("Felipe da Silva"), E-mail (Google) ("felipe.silva@gmail.com"), Telefone ("(11) 98765-4321"), Endereço de Entrega ("Av. Paulista, 1000 - Bela Vista, SP")
- Link "Meus pedidos"
- Ações: "Salvar alterações" · "Sair da conta"
- Rótulo repetido "Perfil" ao final do bloco (aparenta indicar o item ativo da navegação inferior)

### Layout e Estrutura — Desktop
**Viewport e regiões**
| Elemento | Medida | Posição / Orientação |
|---|---|---|
| Viewport | 1280 × 800px | Layout raiz: vertical |
| wireframe-title-banner | 1280 × 51px | x 0 / y 0 · NONE |
| top-nav | 1280 × 72px | x 0 / y 51 · NONE |
| profile-body | 1280 × 597px | x 0 / y 123 · HORIZONTAL |

**Implementação estrutural (containers principais)**
| Container | Medida | Posição / Orientação |
|---|---|---|
| desktop-perfil | 1280 × 800px | x 3841 / y -379 · VERTICAL |
| wireframe-title-banner | 1280 × 51px | x 0 / y 0 · NONE |
| top-nav | 1280 × 72px | x 0 / y 51 · NONE |
| nav-left | 339 × 33px | x 40 / y 20 · HORIZONTAL |
| nav-search | 360 × 40px | x 542 / y 16 · HORIZONTAL |
| profile-body | 1280 × 597px | x 0 / y 123 · HORIZONTAL |
| profile-content | 908 × 517px | x 332 / y 40 · VERTICAL |
| identity-fields | 844 × 63px | x 32 / y 166 · HORIZONTAL |
| identity-fields (coluna 1) | 412 × 63px | x 0 / y 0 · VERTICAL |
| identity-fields-2 (coluna 2) | 412 × 63px | x 432 / y 0 · VERTICAL |

> **Observação:** `nav-left` mede 339 × 33px nesta tela, enquanto em Home/Compras/Notificações o mesmo componente de cabeçalho mede 384–385 × 33px — ver observação de inconsistência ao final deste documento.

### Tipografia — Desktop
| Fonte / Peso | Tamanho | Line-height | Letter-spacing | Cor | Uso |
|---|---|---|---|---|---|
| Inter Medium | 14px | normal | 0% | #3D5570 | 6 usos |
| Inter Semi Bold | 12px | normal | 0% | #3D5570 | 6 usos |
| Inter Regular | 14px | normal | 0% | #1B2D50 | 6 usos |
| Inter Regular | 13px | normal | 0% | #8899AA | 2 usos |
| Inter Semi Bold | 13px | normal | 0% | #1B2D50 | 2 usos |
| Inter Bold | 16px | normal | 0 | #FFFFFF | 1 uso |
| Inter Extra Bold | 14px | normal | 0% | #1B2D50 | 1 uso |
| Inter Bold | 11px | normal | 0% | #FFFFFF | 1 uso |
| Inter Bold | 12px | normal | 0% | #3D5570 | 1 uso |
| Inter Bold | 14px | normal | 0% | #1B2D50 | 1 uso |
| Inter Bold | 18px | normal | 0% | #1B2D50 | 1 uso |
| Inter Semi Bold | 14px | normal | 0% | #1B2D50 | 1 uso |
| Inter Semi Bold | 14px | normal | 0% | #FFFFFF | 1 uso |

### Cores — Desktop
**Preenchimentos**
| Hex | Ocorrências |
|---|---|
| #1B2D50 | 14 |
| #FFFFFF | 13 |
| #3D5570 | 13 |
| #E8F4FD | 4 |
| #8899AA | 2 |
| #F0F8FF | 1 |
| #EF4444 | 1 |
| #2A3F5C | 1 |

**Contornos**
| Hex | Ocorrências |
|---|---|
| #B8CCE0 | 15 |
| #3D5570 | 6 |
| #1B2D50 | 4 |
| #8899AA | 1 |
| #C8D8E8 | 1 |

### Espaçamento, Raios e Bordas — Desktop
**Espaçamentos:** 0px, 2px, 4px, 6px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 80px.

**Raios:** 4px, 6px, 8px, 10px, 16px, 32px (border-radius).

**Bordas e efeitos**
| Peso/Efeito | Observação |
|---|---|
| 1px | stroke-width |
| 1.5px | stroke-width |
| 2px | stroke-width |
| Sombras | Nenhuma — sem efeitos de sombra/blur |

### Componentes e Estados — Desktop
**Componentes principais**
| Componente | Medida | Parent |
|---|---|---|
| desktop-perfil | 1280 × 800 | Page 1 |
| wireframe-title-banner | 1280 × 51 | desktop-perfil |
| top-nav | 1280 × 72 | desktop-perfil |
| nav-left | 339 × 33 | top-nav |
| nav-links | 190 × 33 | nav-left |
| nav-search | 360 × 40 | top-nav |
| nav-right | 219 × 32 | top-nav |
| profile-body | 1280 × 597 | desktop-perfil |
| sidebar-menu | 260 × 208 | profile-body |
| profile-content | 908 × 517 | profile-body |
| identity-fields | 844 × 63 | profile-content |
| identity-fields (col. 1) | 412 × 63 | identity-fields |
| identity-fields-2 (col. 2) | 412 × 63 | identity-fields |

**Interações e acessibilidade**
| Elemento | Especificação | Observação |
|---|---|---|
| Tabs do perfil | tablist | Dados, endereços, segurança e histórico |
| Formulários | labels + inputs | Associação for/id e validação acessível |
| Salvar alterações | button | Loading, disabled e feedback de sucesso |
| Endereços | lista editável | Ações com aria-label |
| Segurança | password controls | Não expor dados sensíveis |

### Comportamentos Não Definidos — Desktop
> "Não inventar sem requisito do produto." (seção "Não definido")
- **Breakpoints:** Não documentados — usar a versão mobile equivalente.
- **Hover/focus/disabled:** Não documentados — definir no design system.
- **Integração/API:** Não documentada — seguir requisitos funcionais.

### Inventário de Elementos — Desktop
Todas as 97 camadas, com caminho, tipo, posição, dimensão e estilo principal. Coordenadas relativas ao parent imediato.

| # | Caminho (layer) | Tipo | X | Y | Largura | Altura | Propriedades |
|---|---|---|---|---|---|---|---|
| 1 | desktop-perfil | FRAME | 3841 | -379 | 1280 | 800 | Auto Layout vertical · gap 0 · padding 0/0/80/0 |
| 2 | desktop-perfil / wireframe-title-banner | FRAME | 0 | 0 | 1280 | 51 | fill #1B2D50 |
| 3 | desktop-perfil / wireframe-title-banner / 3. Perfil do Usuário | TEXT | 32 | 16 | 177 | 19 | Inter Bold 16px |
| 4 | desktop-perfil / top-nav | FRAME | 0 | 51 | 1280 | 72 | fill #FFFFFF |
| 5 | desktop-perfil / top-nav / nav-left | FRAME | 40 | 20 | 339 | 33 | Auto Layout horizontal · gap 40 · padding 0/0/0/0 |
| 6 | desktop-perfil / top-nav / nav-left / logo- placeholder | FRAME | 0 | 0 | 109 | 33 | Auto Layout horizontal · gap 8 · padding 8/16/8/16 |
| 7 | desktop-perfil / top-nav / nav-left / logo- placeholder / shopping-cart | FRAME | 16 | 9 | 16 | 16 |  |
| 8 | desktop-perfil / top-nav / nav-left / logo- placeholder / shopping-cart / Vector | VECTOR | 1 | 1 | 13 | 13 |  |
| 9 | desktop-perfil / top-nav / nav-left / logo- placeholder / [LOGO] | TEXT | 40 | 8 | 53 | 17 | Inter Extra Bold 14px |
| 10 | desktop-perfil / top-nav / nav-left / nav- links | FRAME | 149 | 0 | 190 | 33 | Auto Layout horizontal · gap 24 · padding 0/0/0/0 |
| 11 | desktop-perfil / top-nav / nav-left / nav- links / content-container | FRAME | 0 | 0 | 40 | 33 | Auto Layout vertical · gap 0 · padding 8/0/8/0 |
| 12 | desktop-perfil / top-nav / nav-left / nav- links / content-container / Home | TEXT | 0 | 8 | 40 | 17 | Inter Medium 14px |
| 13 | desktop-perfil / top-nav / nav-left / nav- links / content-container-2 | FRAME | 64 | 0 | 61 | 33 | Auto Layout vertical · gap 0 · padding 8/0/8/0 |
| 14 | desktop-perfil / top-nav / nav-left / nav- links / content-container-2 / Compras | TEXT | 0 | 8 | 61 | 17 | Inter Medium 14px |
| 15 | desktop-perfil / top-nav / nav-left / nav- links / content-container-3 | FRAME | 149 | 0 | 41 | 33 | Auto Layout vertical · gap 0 · padding 8/0/8/0 |
| 16 | desktop-perfil / top-nav / nav-left / nav- links / content-container-3 / Jogos | TEXT | 0 | 8 | 41 | 17 | Inter Medium 14px |
| 17 | desktop-perfil / top-nav / nav-search | FRAME | 542 | 16 | 360 | 40 | Auto Layout horizontal · gap 8 · padding 0/12/0/12 |
| 18 | desktop-perfil / top-nav / nav-search / search | FRAME | 12 | 12 | 16 | 16 |  |
| 19 | desktop-perfil / top-nav / nav-search / search / Vector | VECTOR | 2 | 2 | 12 | 12 |  |
| 20 | desktop-perfil / top-nav / nav-search / Buscar produtos, marcas... | TEXT | 36 | 12 | 312 | 16 | Inter Regular 13px |
| 21 | desktop-perfil / top-nav / nav-right | FRAME | 1021 | 20 | 219 | 32 | Auto Layout horizontal · gap 24 · padding 0/0/0/0 |
| 22 | desktop-perfil / top-nav / nav-right / notif-trigger | FRAME | 0 | 0 | 32 | 32 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 23 | desktop-perfil / top-nav / nav-right / notif-trigger / bell | FRAME | 6 | 6 | 20 | 20 |  |
| 24 | desktop-perfil / top-nav / nav-right / notif-trigger / bell / Vector | VECTOR | 3 | 2 | 15 | 17 |  |
| 25 | desktop-perfil / top-nav / nav-right / notif-trigger / Ellipse | ELLIPSE | 22 | 2 | 8 | 8 | fill #EF4444 |
| 26 | desktop-perfil / top-nav / nav-right / cart- trigger | FRAME | 56 | 6 | 48 | 20 | Auto Layout horizontal · gap 8 · padding 0/0/0/0 |
| 27 | desktop-perfil / top-nav / nav-right / cart- trigger / shopping-bag | FRAME | 0 | 0 | 20 | 20 |  |
| 28 | desktop-perfil / top-nav / nav-right / cart- trigger / shopping-bag / Vector | VECTOR | 3 | 2 | 15 | 17 |  |
| 29 | desktop-perfil / top-nav / nav-right / cart- trigger / content-container | FRAME | 28 | 2 | 20 | 17 | Auto Layout horizontal · gap 0 · padding 2/6/2/6 |
| 30 | desktop-perfil / top-nav / nav-right / cart- trigger / content-container / 3 | TEXT | 6 | 2 | 8 | 13 | Inter Bold 11px |
| 31 | desktop-perfil / top-nav / nav-right / user-menu | FRAME | 128 | 0 | 91 | 32 | Auto Layout horizontal · gap 8 · padding 0/0/0/0 |
| 32 | desktop-perfil / top-nav / nav-right / user-menu / content-container | FRAME | 0 | 0 | 32 | 32 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 33 | desktop-perfil / top-nav / nav-right / user-menu / content-container / JD | TEXT | 8 | 9 | 16 | 15 | Inter Bold 12px |
| 34 | desktop-perfil / top-nav / nav-right / user-menu / João | TEXT | 40 | 8 | 31 | 16 | Inter Semi Bold 13px |
| 35 | desktop-perfil / top-nav / nav-right / user-menu / chevron-down | FRAME | 79 | 10 | 12 | 12 |  |
| 36 | desktop-perfil / top-nav / nav-right / user-menu / chevron-down / Vector | VECTOR | 3 | 5 | 6 | 3 |  |
| 37 | desktop-perfil / profile-body | FRAME | 0 | 123 | 1280 | 597 | Auto Layout horizontal · gap 32 · padding 40/40/40/40 |
| 38 | desktop-perfil / profile-body / sidebar- menu | FRAME | 40 | 40 | 260 | 208 | Auto Layout vertical · gap 4 · padding 16/16/16/16 |
| 39 | desktop-perfil / profile-body / sidebar- menu / content-row | FRAME | 16 | 16 | 228 | 41 | Auto Layout horizontal · gap 8 · padding 12/16/12/16 |
| 40 | desktop-perfil / profile-body / sidebar- menu / content-row / user | FRAME | 16 | 13 | 16 | 16 |  |
| 41 | desktop-perfil / profile-body / sidebar- menu / content-row / user / Vector | VECTOR | 3 | 2 | 9 | 12 |  |
| 42 | desktop-perfil / profile-body / sidebar- menu / content-row / Dados pessoais | TEXT | 40 | 12 | 172 | 17 | Inter Bold 14px |
| 43 | desktop-perfil / profile-body / sidebar- menu / content-row-2 | FRAME | 16 | 61 | 228 | 41 | Auto Layout horizontal · gap 8 · padding 12/16/12/16 |
| 44 | desktop-perfil / profile-body / sidebar- menu / content-row-2 / map-pin | FRAME | 16 | 13 | 16 | 16 |  |
| 45 | desktop-perfil / profile-body / sidebar- menu / content-row-2 / map-pin / Vector | VECTOR | 3 | 1 | 11 | 13 |  |
| 46 | desktop-perfil / profile-body / sidebar- menu / content-row-2 / Endereços | TEXT | 40 | 12 | 172 | 17 | Inter Medium 14px |
| 47 | desktop-perfil / profile-body / sidebar- menu / content-row-3 | FRAME | 16 | 106 | 228 | 41 | Auto Layout horizontal · gap 8 · padding 12/16/12/16 |
| 48 | desktop-perfil / profile-body / sidebar- menu / content-row-3 / lock | FRAME | 16 | 13 | 16 | 16 |  |
| 49 | desktop-perfil / profile-body / sidebar- menu / content-row-3 / lock / Vector | VECTOR | 2 | 1 | 12 | 13 |  |
| 50 | desktop-perfil / profile-body / sidebar- menu / content-row-3 / Segurança | TEXT | 40 | 12 | 172 | 17 | Inter Medium 14px |
| 51 | desktop-perfil / profile-body / sidebar- menu / content-row-4 | FRAME | 16 | 151 | 228 | 41 | Auto Layout horizontal · gap 8 · padding 12/16/12/16 |
| 52 | desktop-perfil / profile-body / sidebar- menu / content-row-4 / package | FRAME | 16 | 13 | 16 | 16 |  |
| 53 | desktop-perfil / profile-body / sidebar- menu / content-row-4 / package / Vector | VECTOR | 2 | 1 | 12 | 13 |  |
| 54 | desktop-perfil / profile-body / sidebar- menu / content-row-4 / Histórico de pedidos | TEXT | 40 | 12 | 172 | 17 | Inter Medium 14px |
| 55 | desktop-perfil / profile-body / profile- content | FRAME | 332 | 40 | 908 | 517 | Auto Layout vertical · gap 24 · padding 32/32/32/32 |
| 56 | desktop-perfil / profile-body / profile- content / Dados Pessoais | TEXT | 32 | 32 | 140 | 22 | Inter Bold 18px |
| 57 | desktop-perfil / profile-body / profile- content / content-row | FRAME | 32 | 78 | 844 | 64 | Auto Layout horizontal · gap 20 · padding 0/0/0/0 |
| 58 | desktop-perfil / profile-body / profile- content / content-row / content-container | FRAME | 0 | 0 | 64 | 64 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 59 | desktop-perfil / profile-body / profile- content / content-row / content-container / user | FRAME | 20 | 20 | 24 | 24 |  |
| 60 | desktop-perfil / profile-body / profile- content / content-row / content-container / user / Vector | VECTOR | 5 | 3 | 14 | 18 |  |
| 61 | desktop-perfil / profile-body / profile- content / content-row / content-stack | FRAME | 84 | 14 | 127 | 36 | Auto Layout vertical · gap 4 · padding 0/0/0/0 |
| 62 | desktop-perfil / profile-body / profile- content / content-row / content-stack / [FOTO DO PERFIL] | TEXT | 0 | 0 | 114 | 16 | Inter Regular 13px |
| 63 | desktop-perfil / profile-body / profile- content / content-row / content-stack / Alterar foto de perfil | TEXT | 0 | 20 | 127 | 16 | Inter Semi Bold 13px |
| 64 | desktop-perfil / profile-body / profile- content / identity-fields | FRAME | 32 | 166 | 844 | 63 | Auto Layout horizontal · gap 20 · padding 0/0/0/0 |
| 65 | desktop-perfil / profile-body / profile- content / identity-fields / identity-fields | FRAME | 0 | 0 | 412 | 63 | Auto Layout vertical · gap 6 · padding 0/0/0/0 |
| 66 | desktop-perfil / profile-body / profile- content / identity-fields / identity-fields / Nome Completo | TEXT | 0 | 0 | 94 | 15 | Inter Semi Bold 12px |
| 67 | desktop-perfil / profile-body / profile- content / identity-fields / identity-fields / content-container | FRAME | 0 | 21 | 412 | 42 | Auto Layout horizontal · gap 8 · padding 0/12/0/12 |
| 68 | desktop-perfil / profile-body / profile- content / identity-fields / identity-fields / content-container / João da Silva | TEXT | 12 | 13 | 388 | 17 | Inter Regular 14px |
| 69 | desktop-perfil / profile-body / profile- content / identity-fields / identity-fields-2 | FRAME | 432 | 0 | 412 | 63 | Auto Layout vertical · gap 6 · padding 0/0/0/0 |
| 70 | desktop-perfil / profile-body / profile- content / identity-fields / identity-fields-2 / E-mail (Google Account) | TEXT | 0 | 0 | 143 | 15 | Inter Semi Bold 12px |
| 71 | desktop-perfil / profile-body / profile- content / identity-fields / identity-fields-2 / content-row | FRAME | 0 | 21 | 412 | 42 | Auto Layout horizontal · gap 8 · padding 0/12/0/12 |
| 72 | desktop-perfil / profile-body / profile- content / identity-fields / identity-fields-2 / content-row / joao.usuario@gmail.com | TEXT | 12 | 13 | 364 | 17 | Inter Regular 14px |
| 73 | desktop-perfil / profile-body / profile- content / identity-fields / identity-fields-2 / content-row / lock | FRAME | 384 | 13 | 16 | 16 |  |
| 74 | desktop-perfil / profile-body / profile- content / identity-fields / identity-fields-2 / content-row / lock / Vector | VECTOR | 2 | 1 | 12 | 13 |  |
| 75 | desktop-perfil / profile-body / profile- content / content-row-2 | FRAME | 32 | 253 | 844 | 63 | Auto Layout horizontal · gap 20 · padding 0/0/0/0 |
| 76 | desktop-perfil / profile-body / profile- content / content-row-2 / content-stack | FRAME | 0 | 0 | 412 | 63 | Auto Layout vertical · gap 6 · padding 0/0/0/0 |
| 77 | desktop-perfil / profile-body / profile- content / content-row-2 / content-stack / Telefone | TEXT | 0 | 0 | 51 | 15 | Inter Semi Bold 12px |
| 78 | desktop-perfil / profile-body / profile- content / content-row-2 / content-stack / content-container | FRAME | 0 | 21 | 412 | 42 | Auto Layout horizontal · gap 8 · padding 0/12/0/12 |
| 79 | desktop-perfil / profile-body / profile- content / content-row-2 / content-stack / content-container / (11) 98765-4321 | TEXT | 12 | 13 | 388 | 17 | Inter Regular 14px |
| 80 | desktop-perfil / profile-body / profile- content / content-row-2 / content- stack-2 | FRAME | 432 | 0 | 412 | 63 | Auto Layout vertical · gap 6 · padding 0/0/0/0 |
| 81 | desktop-perfil / profile-body / profile- content / content-row-2 / content- stack-2 / CPF | TEXT | 0 | 0 | 24 | 15 | Inter Semi Bold 12px |
| 82 | desktop-perfil / profile-body / profile- content / content-row-2 / content- stack-2 / content-container | FRAME | 0 | 21 | 412 | 42 | Auto Layout horizontal · gap 8 · padding 0/12/0/12 |
| 83 | desktop-perfil / profile-body / profile- content / content-row-2 / content- stack-2 / content-container / 123.456.789-00 | TEXT | 12 | 13 | 388 | 17 | Inter Regular 14px |
| 84 | desktop-perfil / profile-body / profile- content / content-row-3 | FRAME | 32 | 340 | 844 | 63 | Auto Layout horizontal · gap 20 · padding 0/0/0/0 |
| 85 | desktop-perfil / profile-body / profile- content / content-row-3 / content-stack | FRAME | 0 | 0 | 412 | 63 | Auto Layout vertical · gap 6 · padding 0/0/0/0 |
| 86 | desktop-perfil / profile-body / profile- content / content-row-3 / content-stack / CEP | TEXT | 0 | 0 | 24 | 15 | Inter Semi Bold 12px |
| 87 | desktop-perfil / profile-body / profile- content / content-row-3 / content-stack / content-container | FRAME | 0 | 21 | 412 | 42 | Auto Layout horizontal · gap 8 · padding 0/12/0/12 |
| 88 | desktop-perfil / profile-body / profile- content / content-row-3 / content-stack / content-container / 01311-200 | TEXT | 12 | 13 | 388 | 17 | Inter Regular 14px |
| 89 | desktop-perfil / profile-body / profile- content / content-row-3 / content- stack-2 | FRAME | 432 | 0 | 412 | 63 | Auto Layout vertical · gap 6 · padding 0/0/0/0 |
| 90 | desktop-perfil / profile-body / profile- content / content-row-3 / content- stack-2 / Logradouro | TEXT | 0 | 0 | 68 | 15 | Inter Semi Bold 12px |
| 91 | desktop-perfil / profile-body / profile- content / content-row-3 / content- stack-2 / content-container | FRAME | 0 | 21 | 412 | 42 | Auto Layout horizontal · gap 8 · padding 0/12/0/12 |
| 92 | desktop-perfil / profile-body / profile- content / content-row-3 / content- stack-2 / content-container / Av. Paulista, 1000 | TEXT | 12 | 13 | 388 | 17 | Inter Regular 14px |
| 93 | desktop-perfil / profile-body / profile- content / content-row-4 | FRAME | 32 | 427 | 844 | 58 | Auto Layout horizontal · gap 0 · padding 16/0/0/0 |
| 94 | desktop-perfil / profile-body / profile- content / content-row-4 / content- container | FRAME | 0 | 16 | 123 | 42 | Auto Layout horizontal · gap 8 · padding 0/16/0/16 |
| 95 | desktop-perfil / profile-body / profile- content / content-row-4 / content- container / Sair da Conta | TEXT | 16 | 13 | 91 | 17 | Inter Semi Bold 14px |
| 96 | desktop-perfil / profile-body / profile- content / content-row-4 / content- container-2 | FRAME | 695 | 16 | 149 | 42 | Auto Layout horizontal · gap 8 · padding 0/16/0/16 |
| 97 | desktop-perfil / profile-body / profile- content / content-row-4 / content- container-2 / Salvar alterações | TEXT | 16 | 13 | 117 | 17 | Inter Semi Bold 14px |


---

## 4. Compras

### Conteúdo

#### Desktop
- Cabeçalho: [LOGO] · Home · Compras · Jogos · campo "Buscar produtos, marcas..." · carrinho "3" · avatar "JD" · "João"
- Abas: "Carrinho atual (3 itens)" · "Histórico de pedidos"
- "Resumo do Pedido"
- Item 1: Smart TV 4K 55'' — quantidade "- 1 +" — R$ 2.499,00 — "Preço unitário: R$ 2.499,00"
- Item 2: Camiseta Algodão Básica — quantidade "- 2 +" — R$ 119,80 — "Preço unitário: R$ 59,90"
- Resumo: Subtotal (3 itens) R$ 2.618,80 · Desconto - R$ 0,00 · Frete [A calcular] · Total estimado R$ 2.618,80
- "Entrega": Av. Paulista, 1000 - São Paulo, SP
- "Método de pagamento": Cartão de Crédito
- "Código do cupom (Ex: PROMO10)" — botão "Aplicar"
- Botão "Finalizar compra"

#### Mobile
- Barra de status "9:41"
- Título "Compras"
- Abas: "Carrinho atual" · "Histórico"
- Item 1: Fone de Ouvido Sem Fio — quantidade "- 1 +" — R$ 149,90
- Item 2: Camiseta Básica Preta — quantidade "- 2 +" — R$ 119,80
- "Cupom de Desconto": campo "CARRINHO10" — botão "Aplicar"
- "Endereço de entrega": Av. Paulista, 1000 - Bela Vista, SP
- "Método de pagamento": Cartão final •••• 4321
- Resumo: Subtotal R$ 269,70 · Desconto (10%) - R$ 26,97 · Total R$ 242,73
- Botão "Finalizar compra"
- Navegação inferior truncada no material de origem: "Ho | Compras | oos | otics | r" (aparentam ser Home / Compras / Jogos / Notificações / Perfil)

### Layout e Estrutura — Desktop
**Viewport e regiões**
| Elemento | Medida | Posição / Orientação |
|---|---|---|
| Viewport | 1280 × 850px | Layout raiz: vertical |
| wireframe-title-banner | 1280 × 51px | x 0 / y 0 · NONE |
| top-nav | 1280 × 72px | x 0 / y 51 · NONE |
| compras-tabs | 1280 × 49px | x 0 / y 123 · HORIZONTAL |
| compras-body | 1280 × 505px | x 0 / y 172 · HORIZONTAL |

**Implementação estrutural (containers principais)**
| Container | Medida | Posição / Orientação |
|---|---|---|
| desktop-compras | 1280 × 850px | x 5217 / y -379 · VERTICAL |
| wireframe-title-banner | 1280 × 51px | x 0 / y 0 · NONE |
| top-nav | 1280 × 72px | x 0 / y 51 · NONE |
| nav-left | 385 × 33px | x 40 / y 20 · HORIZONTAL |
| nav-search | 360 × 40px | x 543 / y 16 · HORIZONTAL |
| compras-tabs | 1280 × 49px | x 0 / y 123 · HORIZONTAL |
| compras-body | 1280 × 505px | x 0 / y 172 · HORIZONTAL |
| cart-left | 808 × 327px | x 40 / y 40 · VERTICAL |
| items-card | 808 × 240px | x 0 / y 0 · VERTICAL |
| summary-right | 360 × 426px | x 880 / y 40 · VERTICAL |

### Tipografia — Desktop
| Fonte / Peso | Tamanho | Line-height | Letter-spacing | Cor | Uso |
|---|---|---|---|---|---|
| Inter Bold | 14px | normal | 0% | #1B2D50 | 6 usos |
| Inter Semi Bold | 13px | normal | 0% | #1B2D50 | 4 usos |
| Inter Bold | 14px | normal | 0% | #3D5570 | 4 usos |
| Inter Medium | 14px | normal | 0% | #3D5570 | 3 usos |
| Inter Bold | 15px | normal | 0% | #1B2D50 | 3 usos |
| Inter Regular | 13px | normal | 0% | #3D5570 | 3 usos |
| Inter Regular | 11px | normal | 0 | #8899AA | 2 usos |
| Inter Regular | 12px | normal | 0% | #8899AA | 2 usos |
| Inter Bold | 11px | normal | 0% | #3D5570 | 2 usos |
| Inter Regular | 13px | normal | 0% | #1B2D50 | 2 usos |
| Inter Bold | 16px | normal | 0 | #FFFFFF | 1 uso |
| Inter Extra Bold | 14px | normal | 0% | #1B2D50 | 1 uso |
| Inter Regular | 13px | normal | 0% | #8899AA | 1 uso |
| Inter Bold | 11px | normal | 0% | #FFFFFF | 1 uso |
| Inter Bold | 12px | normal | 0% | #3D5570 | 1 uso |
| Inter Regular | 14px | normal | 0% | #8899AA | 1 uso |
| Inter Semi Bold | 14px | normal | 0% | #1B2D50 | 1 uso |
| Inter Bold | 16px | normal | 0% | #1B2D50 | 1 uso |
| Inter Extra Bold | 18px | normal | 0% | #1B2D50 | 1 uso |
| Inter Semi Bold | 14px | normal | 0% | #FFFFFF | 1 uso |

### Cores — Desktop
**Preenchimentos**
| Hex | Ocorrências |
|---|---|
| #1B2D50 | 21 |
| #3D5570 | 14 |
| #FFFFFF | 9 |
| #8899AA | 6 |
| #E8F4FD | 4 |
| #F0F8FF | 1 |
| #EF4444 | 1 |
| #2A3F5C | 1 |

**Contornos**
| Hex | Ocorrências |
|---|---|
| #B8CCE0 | 17 |
| #1B2D50 | 5 |
| #8899AA | 5 |
| #3D5570 | 4 |
| #C8D8E8 | 3 |

### Espaçamento, Raios e Bordas — Desktop
**Espaçamentos:** 0px, 2px, 4px, 6px, 8px, 10px, 12px, 13px, 16px, 20px, 23px, 24px, 32px, 40px, 44px, 96px, 100px, 130px, 173px, 194px, 207px.

> Nota: os valores acima de 90px (96, 100, 130, 173, 194, 207) correspondem a gaps horizontais grandes registrados dentro de Auto Layouts do resumo do pedido (ex.: `order-summary` com `gap 130`, `gap 194`, `gap 207`), e não a um raio/padding de componente visível.

**Raios:** 4px, 6px, 8px, 10px, 16px (border-radius).

**Bordas e efeitos**
| Peso/Efeito | Observação |
|---|---|
| 1px | stroke-width |
| 1.5px | stroke-width |
| 2px | stroke-width |
| Sombras | Nenhuma — sem efeitos de sombra/blur |

### Componentes e Estados — Desktop
**Componentes principais**
| Componente | Medida | Parent |
|---|---|---|
| desktop-compras | 1280 × 850 | Page 1 |
| wireframe-title-banner | 1280 × 51 | desktop-compras |
| top-nav | 1280 × 72 | desktop-compras |
| nav-left | 385 × 33 | top-nav |
| nav-links | 192 × 33 | nav-left |
| nav-search | 360 × 40 | top-nav |
| nav-right | 219 × 32 | top-nav |
| compras-tabs | 1280 × 49 | desktop-compras |
| compras-body | 1280 × 505 | desktop-compras |
| cart-left | 808 × 327 | compras-body |
| items-card | 808 × 240 | cart-left |
| summary-right | 360 × 426 | compras-body |
| order-summary | 310 × 118 | summary-right |
| order-summary (linha) | 312 × 16 | order-summary |
| order-summary-2 | 312 × 22 | order-summary |

**Interações e acessibilidade**
| Elemento | Especificação | Observação |
|---|---|---|
| Abas de compras | tablist | Carrinho atual e histórico |
| Item do carrinho | article/listitem | Imagem, título, preço e remoção |
| Quantidade | stepper | Botões com aria-label e limites |
| Cupom | form | Aplicar e exibir erro/sucesso |
| Resumo do pedido | aside | Subtotal, frete e total |
| Finalizar compra | button | Loading, disabled e prevenção de clique duplo |

### Comportamentos Não Definidos — Desktop
> "Não inventar sem requisito do produto." (seção "Não definido")
- **Breakpoints:** Não documentados — usar a versão mobile equivalente.
- **Hover/focus/disabled:** Não documentados — definir no design system.
- **Integração/API:** Não documentada — seguir requisitos funcionais.

### Inventário de Elementos — Desktop
Todas as 124 camadas, com caminho, tipo, posição, dimensão e estilo principal. Coordenadas relativas ao parent imediato.

| # | Caminho (layer) | Tipo | X | Y | Largura | Altura | Propriedades |
|---|---|---|---|---|---|---|---|
| 1 | desktop-compras | FRAME | 5217 | -379 | 1280 | 850 | Auto Layout vertical · gap 0 · padding 0/0/173/0 |
| 2 | desktop-compras / wireframe-title- banner | FRAME | 0 | 0 | 1280 | 51 | fill #1B2D50 |
| 3 | desktop-compras / wireframe-title- banner / 4. Compras (Carrinho Atual) | TEXT | 32 | 16 | 261 | 19 | Inter Bold 16px |
| 4 | desktop-compras / top-nav | FRAME | 0 | 51 | 1280 | 72 | fill #FFFFFF |
| 5 | desktop-compras / top-nav / nav-left | FRAME | 40 | 20 | 385 | 33 | Auto Layout horizontal · gap 40 · padding 0/44/0/0 |
| 6 | desktop-compras / top-nav / nav-left / logo-placeholder | FRAME | 0 | 0 | 109 | 33 | Auto Layout horizontal · gap 8 · padding 8/16/8/16 |
| 7 | desktop-compras / top-nav / nav-left / logo-placeholder / shopping-cart | FRAME | 16 | 9 | 16 | 16 |  |
| 8 | desktop-compras / top-nav / nav-left / logo-placeholder / shopping-cart / Vector | VECTOR | 1 | 1 | 13 | 13 |  |
| 9 | desktop-compras / top-nav / nav-left / logo-placeholder / [LOGO] | TEXT | 40 | 8 | 53 | 17 | Inter Extra Bold 14px |
| 10 | desktop-compras / top-nav / nav-left / nav-links | FRAME | 149 | 0 | 192 | 33 | Auto Layout horizontal · gap 24 · padding 0/0/0/0 |
| 11 | desktop-compras / top-nav / nav-left / nav-links / content-container | FRAME | 0 | 0 | 40 | 33 | Auto Layout vertical · gap 0 · padding 8/0/8/0 |
| 12 | desktop-compras / top-nav / nav-left / nav-links / content-container / Home | TEXT | 0 | 8 | 40 | 17 | Inter Medium 14px |
| 13 | desktop-compras / top-nav / nav-left / nav-links / content-container-2 | FRAME | 64 | 0 | 63 | 33 | Auto Layout vertical · gap 0 · padding 8/0/8/0 |
| 14 | desktop-compras / top-nav / nav-left / nav-links / content-container-2 / Compras | TEXT | 0 | 8 | 63 | 17 | Inter Bold 14px |
| 15 | desktop-compras / top-nav / nav-left / nav-links / content-container-3 | FRAME | 151 | 0 | 41 | 33 | Auto Layout vertical · gap 0 · padding 8/0/8/0 |
| 16 | desktop-compras / top-nav / nav-left / nav-links / content-container-3 / Jogos | TEXT | 0 | 8 | 41 | 17 | Inter Medium 14px |
| 17 | desktop-compras / top-nav / nav-search | FRAME | 543 | 16 | 360 | 40 | Auto Layout horizontal · gap 8 · padding 12/12/12/12 |
| 18 | desktop-compras / top-nav / nav-search / search | FRAME | 13 | 13 | 16 | 16 |  |
| 19 | desktop-compras / top-nav / nav-search / search / Vector | VECTOR | 2 | 2 | 12 | 12 |  |
| 20 | desktop-compras / top-nav / nav-search / Buscar produtos, marcas... | TEXT | 37 | 13 | 312 | 16 | Inter Regular 13px |
| 21 | desktop-compras / top-nav / nav-right | FRAME | 1021 | 20 | 219 | 32 |  |
| 22 | desktop-compras / top-nav / nav-right / notif-trigger | FRAME | 0 | 0 | 32 | 32 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 23 | desktop-compras / top-nav / nav-right / notif-trigger / bell | FRAME | 6 | 6 | 20 | 20 |  |
| 24 | desktop-compras / top-nav / nav-right / notif-trigger / bell / Vector | VECTOR | 3 | 2 | 15 | 17 |  |
| 25 | desktop-compras / top-nav / nav-right / notif-trigger / Ellipse | ELLIPSE | 22 | 2 | 8 | 8 | fill #EF4444 |
| 26 | desktop-compras / top-nav / nav-right / cart-trigger | FRAME | 56 | 6 | 48 | 20 | Auto Layout horizontal · gap 8 · padding 0/0/0/0 |
| 27 | desktop-compras / top-nav / nav-right / cart-trigger / shopping-bag | FRAME | 0 | 0 | 20 | 20 |  |
| 28 | desktop-compras / top-nav / nav-right / cart-trigger / shopping-bag / Vector | VECTOR | 3 | 2 | 15 | 17 |  |
| 29 | desktop-compras / top-nav / nav-right / cart-trigger / content-container | FRAME | 28 | 2 | 20 | 17 | Auto Layout horizontal · gap 0 · padding 2/6/2/6 |
| 30 | desktop-compras / top-nav / nav-right / cart-trigger / content-container / 3 | TEXT | 6 | 2 | 8 | 13 | Inter Bold 11px |
| 31 | desktop-compras / top-nav / nav-right / user-menu | FRAME | 128 | 0 | 91 | 32 | Auto Layout horizontal · gap 8 · padding 0/0/0/0 |
| 32 | desktop-compras / top-nav / nav-right / user-menu / content-container | FRAME | 0 | 0 | 32 | 32 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 33 | desktop-compras / top-nav / nav-right / user-menu / content-container / JD | TEXT | 8 | 9 | 16 | 15 | Inter Bold 12px |
| 34 | desktop-compras / top-nav / nav-right / user-menu / João | TEXT | 40 | 8 | 31 | 16 | Inter Semi Bold 13px |
| 35 | desktop-compras / top-nav / nav-right / user-menu / chevron-down | FRAME | 79 | 10 | 12 | 12 |  |
| 36 | desktop-compras / top-nav / nav-right / user-menu / chevron-down / Vector | VECTOR | 3 | 5 | 6 | 3 |  |
| 37 | desktop-compras / compras-tabs | FRAME | 0 | 123 | 1280 | 49 | Auto Layout horizontal · gap 24 · padding 20/918/0/40 |
| 38 | desktop-compras / compras-tabs / content-container | FRAME | 40 | 20 | 159 | 29 |  |
| 39 | desktop-compras / compras-tabs / content-container / Carrinho atual (3 itens) | TEXT | 0 | 0 | 159 | 17 | Inter Bold 14px |
| 40 | desktop-compras / compras-tabs / content-container-2 | FRAME | 223 | 20 | 139 | 29 |  |
| 41 | desktop-compras / compras-tabs / content-container-2 / Histórico de pedidos | TEXT | 0 | 0 | 139 | 17 | Inter Medium 14px |
| 42 | desktop-compras / compras-body | FRAME | 0 | 172 | 1280 | 505 | Auto Layout horizontal · gap 32 · padding 40/40/40/40 |
| 43 | desktop-compras / compras-body / cart- left | FRAME | 40 | 40 | 808 | 327 | Auto Layout vertical · gap 24 · padding 0/0/0/0 |
| 44 | desktop-compras / compras-body / cart- left / items-card | FRAME | 0 | 0 | 808 | 240 | Auto Layout vertical · gap 0 · padding 0/0/0/0 |
| 45 | desktop-compras / compras-body / cart- left / items-card / content-row | FRAME | 1 | 1 | 808 | 120 |  |
| 46 | desktop-compras / compras-body / cart- left / items-card / content-row / image- placeholder | FRAME | 25 | 24 | 72 | 72 | fill #E8F4FD |
| 47 | desktop-compras / compras-body / cart- left / items-card / content-row / image- placeholder / image | FRAME | 24 | 14 | 24 | 24 |  |
| 48 | desktop-compras / compras-body / cart- left / items-card / content-row / image- placeholder / image / Vector | VECTOR | 3 | 3 | 18 | 18 |  |
| 49 | desktop-compras / compras-body / cart- left / items-card / content-row / image- placeholder / [FOTO] | TEXT | 17 | 46 | 38 | 13 | Inter Regular 11px |
| 50 | desktop-compras / compras-body / cart- left / items-card / content-row / content- stack | FRAME | 116 | 42 | 369 | 36 | Auto Layout vertical · gap 4 · padding 0/0/0/0 |
| 51 | desktop-compras / compras-body / cart- left / items-card / content-row / content- stack / [Produto] Smart TV 4K 55'' | TEXT | 0 | 0 | 369 | 17 | Inter Bold 14px |
| 52 | desktop-compras / compras-body / cart- left / items-card / content-row / content- stack / Preço unitário: R$ 2.499,00 | TEXT | 0 | 21 | 369 | 15 | Inter Regular 12px |
| 53 | desktop-compras / compras-body / cart- left / items-card / content-row / content- row | FRAME | 505 | 46 | 87 | 28 |  |
| 54 | desktop-compras / compras-body / cart- left / items-card / content-row / content- row / content-container | FRAME | 0 | 0 | 28 | 28 |  |
| 55 | desktop-compras / compras-body / cart- left / items-card / content-row / content- row / content-container / - | TEXT | 11 | 6 | 7 | 17 | Inter Bold 14px |
| 56 | desktop-compras / compras-body / cart- left / items-card / content-row / content- row / 1 | TEXT | 40 | 6 | 7 | 17 | Inter Bold 14px |
| 57 | desktop-compras / compras-body / cart- left / items-card / content-row / content- row / content-container-2 | FRAME | 59 | 0 | 28 | 28 |  |
| 58 | desktop-compras / compras-body / cart- left / items-card / content-row / content- row / content-container-2 / + | TEXT | 9 | 6 | 10 | 17 | Inter Bold 14px |
| 59 | desktop-compras / compras-body / cart- left / items-card / content-row / content- container | FRAME | 612 | 51 | 120 | 18 |  |
| 60 | desktop-compras / compras-body / cart- left / items-card / content-row / content- container / R$ 2.499,00 | TEXT | 28 | 0 | 92 | 18 | Inter Bold 15px |
| 61 | desktop-compras / compras-body / cart- left / items-card / content-row / content- container-2 | FRAME | 752 | 44 | 32 | 32 |  |
| 62 | desktop-compras / compras-body / cart- left / items-card / content-row / content- container-2 / x | FRAME | 7 | 7 | 18 | 18 |  |
| 63 | desktop-compras / compras-body / cart- left / items-card / content-row / content- container-2 / x / Vector | VECTOR | 5 | 5 | 9 | 9 |  |
| 64 | desktop-compras / compras-body / cart- left / items-card / content-row-2 | FRAME | 1 | 121 | 808 | 120 |  |
| 65 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / image- placeholder | FRAME | 24 | 24 | 72 | 72 | fill #E8F4FD |
| 66 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / image- placeholder / image | FRAME | 24 | 14 | 24 | 24 |  |
| 67 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / image- placeholder / image / Vector | VECTOR | 3 | 3 | 18 | 18 |  |
| 68 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / image- placeholder / [FOTO] | TEXT | 17 | 46 | 38 | 13 | Inter Regular 11px |
| 69 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-stack | FRAME | 120 | 42 | 367 | 36 | Auto Layout vertical · gap 4 · padding 0/0/0/0 |
| 70 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-stack / [Produto] Camiseta Algodão Básica | TEXT | 0 | 0 | 367 | 17 | Inter Bold 14px |
| 71 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-stack / Preço unitário: R$ 59,90 | TEXT | 0 | 21 | 367 | 15 | Inter Regular 12px |
| 72 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-row | FRAME | 503 | 46 | 89 | 28 |  |
| 73 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-row / content-container | FRAME | 0 | 0 | 28 | 28 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 74 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-row / content-container / - | TEXT | 11 | 6 | 7 | 17 | Inter Bold 14px |
| 75 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-row / 2 | TEXT | 40 | 6 | 9 | 17 | Inter Bold 14px |
| 76 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-row / content-container-2 | FRAME | 61 | 0 | 28 | 28 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 77 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-row / content-container-2 / + | TEXT | 9 | 6 | 10 | 17 | Inter Bold 14px |
| 78 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-container | FRAME | 612 | 51 | 120 | 18 |  |
| 79 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-container / R$ 119,80 | TEXT | 48 | 0 | 72 | 18 | Inter Bold 15px |
| 80 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-container-2 | FRAME | 752 | 44 | 32 | 32 |  |
| 81 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-container-2 / x | FRAME | 7 | 7 | 18 | 18 |  |
| 82 | desktop-compras / compras-body / cart- left / items-card / content-row-2 / content-container-2 / x / Vector | VECTOR | 5 | 5 | 9 | 9 |  |
| 83 | desktop-compras / compras-body / cart- left / content-row | FRAME | 0 | 264 | 808 | 63 |  |
| 84 | desktop-compras / compras-body / cart- left / content-row / content-container | FRAME | 0 | 0 | 280 | 63 |  |
| 85 | desktop-compras / compras-body / cart- left / content-row / content-container / content-stack | FRAME | 0 | 0 | 280 | 63 | Auto Layout vertical · gap 6 · padding 0/0/0/0 |
| 86 | desktop-compras / compras-body / cart- left / content-row / content-container / px content-stack / Text | TEXT | 0 | 0 | 0 | 15 |  |
| 87 | desktop-compras / compras-body / cart-left / content-row / content-container / content-stack / content-container | FRAME | 0 | 21 | 280 | 42 | fill #FFFFFF |
| 88 | desktop-compras / compras-body / cart-left / content-row / content-container / content-stack / content-container / Código do cupom (Ex: PROMO10) | TEXT | 12 | 13 | 256 | 17 | Inter Regular 14px |
| 89 | desktop-compras / compras-body / cart- left / content-row / content-container-2 | FRAME | 297 | 21 | 80 | 42 | fill #FFFFFF |
| 90 | desktop-compras / compras-body / cart- left / content-row / content-container-2 / Aplicar | TEXT | 16 | 13 | 48 | 17 | Inter Semi Bold 14px |
| 91 | desktop-compras / compras-body / summary-right | FRAME | 880 | 40 | 360 | 426 | Auto Layout vertical · gap 20 · padding 23/24/23/24 |
| 92 | desktop-compras / compras-body / summary-right / Resumo do Pedido | TEXT | 25 | 24 | 310 | 19 | Inter Bold 16px |
| 93 | desktop-compras / compras-body / summary-right / order-summary | FRAME | 25 | 63 | 310 | 118 | Auto Layout vertical · gap 12 · padding 0/0/0/0 |
| 94 | desktop-compras / compras-body / summary-right / order-summary / order- summary | FRAME | 0 | 0 | 312 | 16 | Auto Layout horizontal · gap 130 · padding 0/0/0/0 |
| 95 | desktop-compras / compras-body / summary-right / order-summary / order- summary / Subtotal (3 itens) | TEXT | 0 | 0 | 107 | 16 | Inter Regular 13px |
| 96 | desktop-compras / compras-body / summary-right / order-summary / order- summary / R$ 2.618,80 | TEXT | 237 | 0 | 75 | 16 | Inter Semi Bold 13px |
| 97 | desktop-compras / compras-body / summary-right / order-summary / content-row | FRAME | 0 | 28 | 312 | 16 | Auto Layout horizontal · gap 194 · padding 0/0/0/0 |
| 98 | desktop-compras / compras-body / summary-right / order-summary / content-row / Desconto | TEXT | 0 | 0 | 59 | 16 | Inter Regular 13px |
| 99 | desktop-compras / compras-body / summary-right / order-summary / content-row / - R$ 0,00 | TEXT | 253 | 0 | 59 | 16 | Inter Semi Bold 13px |
| 100 | desktop-compras / compras-body / summary-right / order-summary / content-row-2 | FRAME | 0 | 56 | 312 | 16 | Auto Layout horizontal · gap 207 · padding 0/0/0/0 |
| 101 | desktop-compras / compras-body / summary-right / order-summary / content-row-2 / Frete | TEXT | 0 | 0 | 32 | 16 | Inter Regular 13px |
| 102 | desktop-compras / compras-body / summary-right / order-summary / content-row-2 / [A calcular] | TEXT | 239 | 0 | 73 | 16 | Inter Semi Bold 13px |
| 103 | desktop-compras / compras-body / summary-right / order-summary / Line | LINE | 0 | 84 | 312 | 0 |  |
| 104 | desktop-compras / compras-body / summary-right / order-summary / order- summary-2 | FRAME | 0 | 96 | 312 | 22 | Auto Layout horizontal · gap 96 · padding 0/0/0/0 |
| 105 | desktop-compras / compras-body / summary-right / order-summary / order- summary-2 / Total estimado | TEXT | 0 | 0 | 109 | 18 | Inter Bold 15px |
| 106 | desktop-compras / compras-body / summary-right / order-summary / order- summary-2 / R$ 2.618,80 | TEXT | 205 | 0 | 107 | 22 | Inter Extra Bold 18px |
| 107 | desktop-compras / compras-body / summary-right / Line | LINE | 25 | 201 | 310 | 0 |  |
| 108 | desktop-compras / compras-body / summary-right / content-stack | FRAME | 25 | 221 | 310 | 37 | Auto Layout vertical · gap 8 · padding 0/0/0/0 |
| 109 | desktop-compras / compras-body / summary-right / content-stack / Entrega | TEXT | 0 | 0 | 310 | 13 | Inter Bold 11px |
| 110 | desktop-compras / compras-body / summary-right / content-stack / content- row | FRAME | 0 | 21 | 310 | 16 |  |
| 111 | desktop-compras / compras-body / summary-right / content-stack / content- row / map-pin | FRAME | 0 | 0 | 16 | 16 |  |
| 112 | desktop-compras / compras-body / summary-right / content-stack / content- row / map-pin / Vector | VECTOR | 3 | 1 | 11 | 13 |  |
| 113 | desktop-compras / compras-body / summary-right / content-stack / content- row / Av. Paulista, 1000 - São Paulo, SP | TEXT | 24 | 0 | 288 | 16 | Inter Regular 13px |
| 114 | desktop-compras / compras-body / summary-right / content-stack-2 | FRAME | 25 | 278 | 310 | 61 | Auto Layout vertical · gap 8 · padding 0/0/0/0 |
| 115 | desktop-compras / compras-body / summary-right / content-stack-2 / Método de pagamento | TEXT | 0 | 0 | 140 | 13 | Inter Bold 11px |
| 116 | desktop-compras / compras-body / summary-right / content-stack-2 / content-row | FRAME | 0 | 21 | 312 | 40 |  |
| 117 | desktop-compras / compras-body / summary-right / content-stack-2 / content-row / content-row | FRAME | 12 | 12 | 135 | 16 | Auto Layout horizontal · gap 8 · padding 0/0/0/0 |
| 118 | desktop-compras / compras-body / summary-right / content-stack-2 / content-row / content-row / credit-card | FRAME | 0 | 0 | 16 | 16 |  |
| 119 | desktop-compras / compras-body / summary-right / content-stack-2 / content-row / content-row / credit-card / Vector | VECTOR | 1 | 3 | 13 | 9 |  |
| 120 | desktop-compras / compras-body / summary-right / content-stack-2 / content-row / content-row / Cartão de Crédito | TEXT | 24 | 0 | 111 | 16 | Inter Regular 13px |
| 121 | desktop-compras / compras-body / summary-right / content-stack-2 / content-row / chevron-down | FRAME | 288 | 14 | 12 | 12 |  |
| 122 | desktop-compras / compras-body / summary-right / content-stack-2 / content-row / chevron-down / Vector | VECTOR | 3 | 5 | 6 | 3 |  |
| 123 | desktop-compras / compras-body / summary-right / content-container | FRAME | 25 | 359 | 310 | 43 | Auto Layout horizontal · gap 10 · padding 13/100/13/100 |
| 124 | desktop-compras / compras-body / summary-right / content-container / Finalizar compra | TEXT | 99 | 13 | 113 | 17 | Inter Semi Bold 14px |


---

## 5. Notificações

### Conteúdo

#### Desktop
- Cabeçalho: [LOGO] · Home · Compras · Notificações · campo "Buscar produtos, marcas..." · carrinho "3" · avatar "JD" · "João"
- Título "Notificações" — badge "2 novas" — ação "Marcar todas como lidas"
- Lista de notificações:
  1. "Seu pedido #8475 de [Produto] TV 4K foi entregue com sucesso no seu endereço cadastrado." — "há 2 min"
  2. "Detectamos um novo login de dispositivo desconhecido na sua conta em São Paulo, SP." — "há 20 min"
  3. "Cupom imperdível: Ganhe 15% de desconto usando o código WIRE15 na sua próxima compra." — "há 2 horas"
  4. "Seu pagamento foi confirmado para o pedido #8475 e o envio está sendo preparado." — "há 1 dia"
  5. "Seu carrinho atual tem itens esperando! Finalize sua compra hoje para garantir frete grátis." — "há 3 dias"

#### Mobile
- Barra de status "9:41"
- Título "Notificações Lidas"
- Lista:
  1. "Seu pedido #9487 foi entregue com sucesso!" — "Hoje, 10:30"
  2. "Cupom exclusivo: Use 10OFF para sua próxima compra eletrônica." — "Ontem, 15:12"
  3. "Segurança: Novo login detectado no dispositivo Chrome SP." — "3 dias atrás"
  4. "Seu pacote está em rota de entrega." — "5 dias atrás"
- Instrução: "Arraste uma notificação para o lado para excluir"
- Navegação inferior: Home · Compras · Jogos · Notificações · Perfil

### Layout e Estrutura — Desktop
**Viewport e regiões**
| Elemento | Medida | Posição / Orientação |
|---|---|---|
| Viewport | 1280 × 800px | Layout raiz: vertical |
| wireframe-title-banner | 1280 × 51px | x 0 / y 0 · HORIZONTAL |
| top-nav | 1280 × 72px | x 0 / y 51 · HORIZONTAL |
| notif-body | 1280 × 520px | x 0 / y 123 · VERTICAL |

**Implementação estrutural (containers principais)**
| Container | Medida | Posição / Orientação |
|---|---|---|
| desktop-notificacoes | 1280 × 800px | x 6593 / y -379 · VERTICAL |
| wireframe-title-banner | 1280 × 51px | x 0 / y 0 · HORIZONTAL |
| top-nav | 1280 × 72px | x 0 / y 51 · HORIZONTAL |
| nav-left | 385 × 33px | x 40 / y 20 · HORIZONTAL |
| nav-search | 360 × 40px | x 543 / y 16 · HORIZONTAL |
| notif-body | 1280 × 520px | x 0 / y 123 · VERTICAL |
| inbox-container | 800 × 424px | x 240 / y 48 · VERTICAL |
| notification-content | 800 × 24px | x 0 / y 0 · HORIZONTAL |

### Tipografia — Desktop
| Fonte / Peso | Tamanho | Line-height | Letter-spacing | Cor | Uso |
|---|---|---|---|---|---|
| Inter Regular | 11px | normal | 0% | #8899AA | 5 usos |
| Inter Regular | 13px | 140% | 0% | #1B2D50 | 3 usos |
| Inter Medium | 14px | normal | 0% | #3D5570 | 2 usos |
| Inter Bold | 13px | 140% | 0% | #1B2D50 | 2 usos |
| Inter Bold | 16px | normal | 0 | #FFFFFF | 1 uso |
| Inter Extra Bold | 14px | normal | 0% | #1B2D50 | 1 uso |
| Inter Bold | 14px | normal | 0% | #1B2D50 | 1 uso |
| Inter Regular | 13px | normal | 0% | #8899AA | 1 uso |
| Inter Bold | 11px | normal | 0% | #FFFFFF | 1 uso |
| Inter Bold | 12px | normal | 0% | #3D5570 | 1 uso |
| Inter Semi Bold | 13px | normal | 0% | #1B2D50 | 1 uso |
| Inter Extra Bold | 20px | normal | 0% | #1B2D50 | 1 uso |
| Inter Bold | 12px | normal | 0% | #FFFFFF | 1 uso |
| Inter Semi Bold | 13px | normal | 0% | #3D5570 | 1 uso |

> Nota: esta é a única tela cuja escala tipográfica registra `line-height 140%` (em vez de "normal") para dois estilos — o texto das notificações (13px) e o título em negrito (13px).

### Cores — Desktop
**Preenchimentos**
| Hex | Ocorrências |
|---|---|
| #FFFFFF | 13 |
| #1B2D50 | 10 |
| #8899AA | 6 |
| #E8F4FD | 4 |
| #3D5570 | 4 |
| #EF4444 | 3 |
| #2A3F5C | 2 |
| #F0F8FF | 1 |

**Contornos**
| Hex | Ocorrências |
|---|---|
| #B8CCE0 | 10 |
| #1B2D50 | 9 |
| #8899AA | 6 |
| #C8D8E8 | 4 |
| #3D5570 | 1 |

### Espaçamento, Raios e Bordas — Desktop
**Espaçamentos:** 0px, 2px, 4px, 6px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 157px.

**Raios:** 4px, 6px, 8px, 10px, 16px, 18px (border-radius).

**Bordas e efeitos**
| Peso/Efeito | Observação |
|---|---|
| 1px | stroke-width |
| 1.5px | stroke-width |
| 2px | stroke-width |
| Sombras | Nenhuma — sem efeitos de sombra/blur |

### Componentes e Estados — Desktop
**Componentes principais**
| Componente | Medida | Parent |
|---|---|---|
| desktop-notificacoes | 1280 × 800 | Page 1 |
| wireframe-title-banner | 1280 × 51 | desktop-notificacoes |
| top-nav | 1280 × 72 | desktop-notificacoes |
| nav-left | 385 × 33 | top-nav |
| nav-links | 236 × 33 | nav-left |
| nav-search | 360 × 40 | top-nav |
| nav-right | 219 × 32 | top-nav |
| notif-body | 1280 × 520 | desktop-notificacoes |
| inbox-container | 800 × 424 | notif-body |
| notification-content | 800 × 24 | inbox-container |
| notification-content (interno) | 196 × 24 | notification-content |

**Interações e acessibilidade**
| Elemento | Especificação | Observação |
|---|---|---|
| Lista de notificações | feed/list | Ordenação cronológica e navegação por teclado |
| Item não lido | estado visual | Expor estado por texto/aria, não só por cor |
| Marcar como lida | button | Atualização otimista com rollback em erro |
| Marcar todas | button | Confirmar estado e desabilitar quando vazio |
| Notificação de pedido | link/article | Destino acessível e conteúdo completo |

### Comportamentos Não Definidos — Desktop
> "Não inventar sem requisito do produto." (seção "Não definido")
- **Breakpoints:** Não documentados — usar a versão mobile equivalente.
- **Hover/focus/disabled:** Não documentados — definir no design system.
- **Integração/API:** Não documentada — seguir requisitos funcionais.

### Inventário de Elementos — Desktop
Todas as 102 camadas, com caminho, tipo, posição, dimensão e estilo principal. Coordenadas relativas ao parent imediato.

| # | Caminho (layer) | Tipo | X | Y | Largura | Altura | Propriedades |
|---|---|---|---|---|---|---|---|
| 1 | desktop-notificacoes | FRAME | 6593 | -379 | 1280 | 800 | Auto Layout vertical · gap 0 · padding 0/0/157/0 |
| 2 | desktop-notificacoes / wireframe-title- banner | FRAME | 0 | 0 | 1280 | 51 | Auto Layout horizontal · gap 0 · padding 16/32/16/32 |
| 3 | desktop-notificacoes / wireframe-title- banner / 5. Central de Notificações | TEXT | 32 | 16 | 244 | 19 | Inter Bold 16px |
| 4 | desktop-notificacoes / top-nav | FRAME | 0 | 51 | 1280 | 72 | Auto Layout horizontal · gap 0 · padding 0/40/0/40 |
| 5 | desktop-notificacoes / top-nav / nav-left | FRAME | 40 | 20 | 385 | 33 | Auto Layout horizontal · gap 40 · padding 0/0/0/0 |
| 6 | desktop-notificacoes / top-nav / nav-left / logo-placeholder | FRAME | 0 | 0 | 109 | 33 | Auto Layout horizontal · gap 8 · padding 8/16/8/16 |
| 7 | desktop-notificacoes / top-nav / nav-left / logo-placeholder / shopping-cart | FRAME | 16 | 9 | 16 | 16 |  |
| 8 | desktop-notificacoes / top-nav / nav-left / logo-placeholder / shopping-cart / Vector | VECTOR | 1 | 1 | 13 | 13 |  |
| 9 | desktop-notificacoes / top-nav / nav-left / logo-placeholder / [LOGO] | TEXT | 40 | 8 | 53 | 17 | Inter Extra Bold 14px |
| 10 | desktop-notificacoes / top-nav / nav-left / nav-links | FRAME | 149 | 0 | 236 | 33 | Auto Layout horizontal · gap 24 · padding 0/0/0/0 |
| 11 | desktop-notificacoes / top-nav / nav-left / nav-links / content-container | FRAME | 0 | 0 | 40 | 33 | Auto Layout vertical · gap 0 · padding 8/0/8/0 |
| 12 | desktop-notificacoes / top-nav / nav-left / nav-links / content-container / Home | TEXT | 0 | 8 | 40 | 17 | Inter Medium 14px |
| 13 | desktop-notificacoes / top-nav / nav-left / nav-links / content-container-2 | FRAME | 64 | 0 | 61 | 33 | Auto Layout vertical · gap 0 · padding 8/0/8/0 |
| 14 | desktop-notificacoes / top-nav / nav-left / nav-links / content-container-2 / Compras | TEXT | 0 | 8 | 61 | 17 | Inter Medium 14px |
| 15 | desktop-notificacoes / top-nav / nav-left / nav-links / notification-content | FRAME | 149 | 0 | 87 | 33 | Auto Layout vertical · gap 0 · padding 8/0/8/0 |
| 16 | desktop-notificacoes / top-nav / nav-left / nav-links / notification-content / Notificações | TEXT | 0 | 8 | 87 | 17 | Inter Bold 14px |
| 17 | desktop-notificacoes / top-nav / nav- search | FRAME | 543 | 16 | 360 | 40 | Auto Layout horizontal · gap 8 · padding 0/12/0/12 |
| 18 | desktop-notificacoes / top-nav / nav- search / search | FRAME | 12 | 12 | 16 | 16 |  |
| 19 | desktop-notificacoes / top-nav / nav- search / search / Vector | VECTOR | 2 | 2 | 12 | 12 |  |
| 20 | desktop-notificacoes / top-nav / nav- search / Buscar produtos, marcas... | TEXT | 36 | 12 | 312 | 16 | Inter Regular 13px |
| 21 | desktop-notificacoes / top-nav / nav- right | FRAME | 1021 | 20 | 219 | 32 | Auto Layout horizontal · gap 24 · padding 0/0/0/0 |
| 22 | desktop-notificacoes / top-nav / nav- right / notif-trigger | FRAME | 0 | 0 | 32 | 32 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 23 | desktop-notificacoes / top-nav / nav- right / notif-trigger / bell | FRAME | 6 | 6 | 20 | 20 |  |
| 24 | desktop-notificacoes / top-nav / nav- right / notif-trigger / bell / Vector | VECTOR | 3 | 2 | 15 | 17 |  |
| 25 | desktop-notificacoes / top-nav / nav- right / notif-trigger / Ellipse | ELLIPSE | 22 | 2 | 8 | 8 | fill #EF4444 |
| 26 | desktop-notificacoes / top-nav / nav- right / cart-trigger | FRAME | 56 | 6 | 48 | 20 | Auto Layout horizontal · gap 8 · padding 0/0/0/0 |
| 27 | desktop-notificacoes / top-nav / nav- right / cart-trigger / shopping-bag | FRAME | 0 | 0 | 20 | 20 |  |
| 28 | desktop-notificacoes / top-nav / nav- right / cart-trigger / shopping-bag / Vector | VECTOR | 3 | 2 | 15 | 17 |  |
| 29 | desktop-notificacoes / top-nav / nav- right / cart-trigger / content-container | FRAME | 28 | 2 | 20 | 17 | Auto Layout horizontal · gap 0 · padding 2/6/2/6 |
| 30 | desktop-notificacoes / top-nav / nav- right / cart-trigger / content-container / 3 | TEXT | 6 | 2 | 8 | 13 | Inter Bold 11px |
| 31 | desktop-notificacoes / top-nav / nav- right / user-menu | FRAME | 128 | 0 | 91 | 32 | Auto Layout horizontal · gap 8 · padding 0/0/0/0 |
| 32 | desktop-notificacoes / top-nav / nav- right / user-menu / content-container | FRAME | 0 | 0 | 32 | 32 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 33 | desktop-notificacoes / top-nav / nav- right / user-menu / content-container / JD | TEXT | 8 | 9 | 16 | 15 | Inter Bold 12px |
| 34 | desktop-notificacoes / top-nav / nav- right / user-menu / João | TEXT | 40 | 8 | 31 | 16 | Inter Semi Bold 13px |
| 35 | desktop-notificacoes / top-nav / nav- right / user-menu / chevron-down | FRAME | 79 | 10 | 12 | 12 |  |
| 36 | desktop-notificacoes / top-nav / nav- right / user-menu / chevron-down / Vector | VECTOR | 3 | 5 | 6 | 3 |  |
| 37 | desktop-notificacoes / notif-body | FRAME | 0 | 123 | 1280 | 520 | Auto Layout vertical · gap 0 · padding 48/0/48/0 |
| 38 | desktop-notificacoes / notif-body / inbox- container | FRAME | 240 | 48 | 800 | 424 | Auto Layout vertical · gap 20 · padding 0/0/0/0 |
| 39 | desktop-notificacoes / notif-body / inbox- container / notification-content | FRAME | 0 | 0 | 800 | 24 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 40 | desktop-notificacoes / notif-body / inbox- container / notification-content / notification-content | FRAME | 0 | 0 | 196 | 24 | Auto Layout horizontal · gap 8 · padding 0/0/0/0 |
| 41 | desktop-notificacoes / notif-body / inbox- container / notification-content / notification-content / Notificações | TEXT | 0 | 0 | 126 | 24 | Inter Extra Bold 20px |
| 42 | desktop-notificacoes / notif-body / inbox- container / notification-content / notification-content / content-container | FRAME | 134 | 3 | 62 | 19 | Auto Layout horizontal · gap 0 · padding 2/8/2/8 |
| 43 | desktop-notificacoes / notif-body / inbox- container / notification-content / notification-content / content-container / 2 novas | TEXT | 8 | 2 | 46 | 15 | Inter Bold 12px |
| 44 | desktop-notificacoes / notif-body / inbox- container / notification-content / Marcar todas como lidas | TEXT | 645 | 4 | 155 | 16 | Inter Semi Bold 13px |
| 45 | desktop-notificacoes / notif-body / inbox- container / content-stack | FRAME | 0 | 44 | 800 | 380 | Auto Layout vertical · gap 0 · padding 0/0/0/0 |
| 46 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row | FRAME | 0 | 0 | 800 | 76 | Auto Layout horizontal · gap 16 · padding 20/20/20/20 |
| 47 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row / content-container | FRAME | 20 | 20 | 36 | 36 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 48 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row / content-container / package | FRAME | 10 | 10 | 16 | 16 |  |
| 49 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row / content-container / package / Vector | VECTOR | 2 | 1 | 12 | 13 |  |
| 50 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row / content-stack | FRAME | 72 | 21 | 644 | 35 | Auto Layout vertical · gap 4 · padding 0/0/0/0 |
| 51 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row / content-stack / Seu pedido #8475 de [Produto] TV 4K foi entregue com sucesso no seu endereço cadastrado. | TEXT | 0 | 0 | 644 | 18 | Inter Bold 13px |
| 52 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row / content-stack / há 2 min | TEXT | 0 | 22 | 45 | 13 | Inter Regular 11px |
| 53 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row / content-row | FRAME | 732 | 24 | 48 | 28 | Auto Layout horizontal · gap 12 · padding 0/0/0/0 |
| 54 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row / content-row / Ellipse | ELLIPSE | 0 | 10 | 8 | 8 | fill #EF4444 |
| 55 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row / content-row / content-container | FRAME | 20 | 0 | 28 | 28 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 56 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row / content-row / content-container / trash | FRAME | 7 | 7 | 14 | 14 |  |
| 57 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row / content-row / content- container / trash / Vector | VECTOR | 2 | 1 | 11 | 12 |  |
| 58 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-2 | FRAME | 0 | 76 | 800 | 76 | Auto Layout horizontal · gap 16 · padding 20/20/20/20 |
| 59 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-2 / content-container | FRAME | 20 | 20 | 36 | 36 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 60 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-2 / content-container / alert-triangle | FRAME | 10 | 10 | 16 | 16 |  |
| 61 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-2 / content-container / alert-triangle / Vector | VECTOR | 1 | 2 | 13 | 12 |  |
| 62 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-2 / content-stack | FRAME | 72 | 21 | 644 | 35 | Auto Layout vertical · gap 4 · padding 0/0/0/0 |
| 63 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-2 / content-stack / Detectamos um novo login de dispositivo desconhecido na sua conta em São Paulo, SP. | TEXT | 0 | 0 | 644 | 18 | Inter Bold 13px |
| 64 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-2 / content-stack / há 20 min | TEXT | 0 | 22 | 52 | 13 | Inter Regular 11px |
| 65 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-2 / content-row | FRAME | 732 | 24 | 48 | 28 | Auto Layout horizontal · gap 12 · padding 0/0/0/0 |
| 66 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-2 / content-row / Ellipse | ELLIPSE | 0 | 10 | 8 | 8 | fill #EF4444 |
| 67 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-2 / content-row / content- container | FRAME | 20 | 0 | 28 | 28 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 68 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-2 / content-row / content-container / trash | FRAME | 7 | 7 | 14 | 14 |  |
| 69 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-2 / content-row / content-container / trash / Vector | VECTOR | 2 | 1 | 11 | 12 |  |
| 70 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-3 | FRAME | 0 | 152 | 800 | 76 | Auto Layout horizontal · gap 16 · padding 20/20/20/20 |
| 71 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-3 / content-container | FRAME | 20 | 20 | 36 | 36 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 72 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-3 / content-container / tag | FRAME | 10 | 10 | 16 | 16 |  |
| 73 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-3 / content-container / tag / Vector | VECTOR | 1 | 1 | 13 | 13 |  |
| 74 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-3 / content-stack | FRAME | 72 | 21 | 664 | 35 | Auto Layout vertical · gap 4 · padding 0/0/0/0 |
| 75 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-3 / content-stack / Cupom imperdível: Ganhe 15% de desconto usando o código WIRE15 na sua próxima compra. | TEXT | 0 | 0 | 664 | 18 | Inter Regular 13px |
| 76 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-3 / content-stack / há 2 horas | TEXT | 0 | 22 | 55 | 13 | Inter Regular 11px |
| 77 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-3 / content-container-2 | FRAME | 752 | 24 | 28 | 28 | Auto Layout horizontal · gap 12 · padding 0/0/0/0 |
| 78 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-3 / content-container-2 / content-container | FRAME | 0 | 0 | 28 | 28 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 79 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-3 / content-container-2 / content-container / trash | FRAME | 7 | 7 | 14 | 14 |  |
| 80 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-3 / content-container-2 / content-container / trash / Vector | VECTOR | 2 | 1 | 11 | 12 |  |
| 81 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-4 | FRAME | 0 | 228 | 800 | 76 | Auto Layout horizontal · gap 16 · padding 20/20/20/20 |
| 82 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-4 / content-container | FRAME | 20 | 20 | 36 | 36 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 83 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-4 / content-container / package | FRAME | 10 | 10 | 16 | 16 |  |
| 84 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-4 / content-container / package / Vector | VECTOR | 2 | 1 | 12 | 13 |  |
| 85 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-4 / content-stack | FRAME | 72 | 21 | 664 | 35 | Auto Layout vertical · gap 4 · padding 0/0/0/0 |
| 86 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-4 / content-stack / Seu pagamento foi confirmado para o pedido #8475 e o envio está sendo preparado. | TEXT | 0 | 0 | 664 | 18 | Inter Regular 13px |
| 87 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-4 / content-stack / há 1 dia | TEXT | 0 | 22 | 40 | 13 | Inter Regular 11px |
| 88 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-4 / content-container-2 | FRAME | 752 | 24 | 28 | 28 | Auto Layout horizontal · gap 12 · padding 0/0/0/0 |
| 89 | desktop-notificacoes / notif-body / inbox-container / content- stack / content-row-4 / content-container-2 / content- container | FRAME | 0 | 0 | 28 | 28 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 90 | desktop-notificacoes / notif-body / inbox-container / content- stack / content-row-4 / content-container-2 / content- container / trash | FRAME | 7 | 7 | 14 | 14 |  |
| 91 | desktop-notificacoes / notif-body / inbox-container / content- stack / content-row-4 / content-container-2 / content- container / trash / Vector | VECTOR | 2 | 1 | 11 | 12 |  |
| 92 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-5 | FRAME | 0 | 304 | 800 | 76 | Auto Layout horizontal · gap 16 · padding 20/20/20/20 |
| 93 | desktop-notificacoes / notif-body / inbox- container / content-stack / content-row-5 / content-container | FRAME | 20 | 20 | 36 | 36 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 94 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-5 / content-container / package | FRAME | 10 | 10 | 16 | 16 |  |
| 95 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-5 / content-container / package / Vector | VECTOR | 2 | 1 | 12 | 13 |  |
| 96 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-5 / content-stack | FRAME | 72 | 21 | 664 | 35 | Auto Layout vertical · gap 4 · padding 0/0/0/0 |
| 97 | desktop-notificacoes / notif-body / inbox-container / content-stack / content-row-5 / content-stack / Seu carrinho atual tem itens esperando! Finalize sua compra hoje para garantir frete grátis. | TEXT | 0 | 0 | 664 | 18 | Inter Regular 13px |
| 98 | desktop-notificacoes / notif-body / inbox-container / content-stack / content- row-5 / content-stack / há 3 dias | TEXT | 0 | 22 | 48 | 13 | Inter Regular 11px |
| 99 | desktop-notificacoes / notif-body / inbox-container / content-stack / content- row-5 / content-container-2 | FRAME | 752 | 24 | 28 | 28 | Auto Layout horizontal · gap 12 · padding 0/0/0/0 |
| 100 | desktop-notificacoes / notif-body / inbox-container / content-stack / content- row-5 / content-container-2 / content-container | FRAME | 0 | 0 | 28 | 28 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 101 | desktop-notificacoes / notif-body / inbox-container / content-stack / content- row-5 / content-container-2 / content-container / trash | FRAME | 7 | 7 | 14 | 14 |  |
| 102 | desktop-notificacoes / notif-body / inbox-container / content-stack / content- row-5 / content-container-2 / content-container / trash / Vector | VECTOR | 2 | 1 | 11 | 12 |  |


---

## 6. Jogos

### Conteúdo

#### Desktop
- Cabeçalho: [LOGO] · Home · Compras · Jogos · campo "Buscar produtos, marcas..." · carrinho "3" · avatar "JD" · "João"
- Título "Cosmo Arcade" — saldo "250 PTS"
- Descrição: "Jogue, acumule pontos e transforme sua pontuação em desconto."
- Placar: "SCORE 04870" · "HI-SCORE 12500"
- Botão "Jogar Cosmo Invaders"
- "Limite diário: 3 partidas (Restam 2 hoje)"
- "TABELA DE CONVERSÃO": 100 pontos = R$ 2,00 de desconto; 250 pontos = R$ 5,00 de desconto; 500 pontos = R$ 10,00 de desconto
- "COMO JOGAR & REGRAS": "Desvie dos mísseis alienígenas e destrua os Cosmo Invaders. Cada alien derrotado soma pontos ao seu saldo do carrinho. Mantenha seu hi-score para prêmios extras no fim do mês!"
- "PARTIDAS DE HOJE": "1 / 3" — "Você ainda pode jogar 2 partidas hoje."

#### Mobile
- Barra de status "9:41"
- Título "Cosmo Arcade" — saldo "250 PTS"
- Placar: "SCORE 04870" · "HI-SCORE 12500"
- "TABELA DE CONVERSÃO": 100 pontos = R$ 2,00 de desconto; 250 pontos = R$ 5,00 de desconto; 500 pontos = R$ 10,00 de desconto
- Botão "Jogar Cosmo Invaders"
- "Limite diário: 3 partidas (Restam 2 hoje)"
- "COMO JOGAR & REGRAS": "Desvie dos mísseis alienígenas e destrua os Cosmo Invaders. Cada alien derrotado soma pontos ao seu saldo do carrinho. Mantenha seu hi-score para prêmios extras no fim do mês!"
- Navegação inferior: Home · Compras · Jogos · Notificações · Perfil

### Layout e Estrutura — Desktop
**Viewport e regiões**
| Elemento | Medida | Posição / Orientação |
|---|---|---|
| Viewport | 1280 × 992px | Layout raiz: vertical |
| Screen title | 1280 × 51px | x 0 / y 0 · VERTICAL |
| Top navigation | 1280 × 72px | x 0 / y 51 · HORIZONTAL |
| Arcade experience | 1280 × 869px | x 0 / y 123 · NONE |

**Implementação estrutural (containers principais)**
| Container | Medida | Posição / Orientação |
|---|---|---|
| desktop-jogos | 1280 × 992px | x 7969 / y -379 · VERTICAL |
| Screen title | 1280 × 51px | x 0 / y 0 · VERTICAL |
| Top navigation | 1280 × 72px | x 0 / y 51 · HORIZONTAL |
| Primary navigation | 445 × 35px | x 40 / y 19 · HORIZONTAL |
| Arcade experience | 1280 × 869px | x 0 / y 123 · NONE |
| Arcade heading | 1200 × 114px | x 40 / y 32 · NONE |
| Heading copy | 426 × 55px | x 0 / y 0 · VERTICAL |
| Game workspace | 1200 × 684px | x 40 / y 129 · NONE |
| Game preview | 1200 × 520px | x 0 / y 0 · NONE |
| Arcade monitor | 1200 × 420px | x 0 / y 0 · NONE |
| Score board | 1152 × 80px | x 24 / y 24 · VERTICAL |
| Defender | 1152 × 34px | x 24 / y 610 · NONE |
| Play action | 1200 × 52px | x 0 / y 436 · NONE |
| aliens-battlefield | 344 × 120px | x 419 / y 82 · VERTICAL |
| aliens-row | 344 × 50px | x 0 / y 0 · HORIZONTAL |
| Game information | 360 × 434px | x 0 / y 544 · NONE |

> **Observação:** esta é a única tela cujo cabeçalho usa nomenclatura própria ("Screen title", "Top navigation", "Primary navigation", "Navigation links", "Search", "Account actions") em vez do padrão usado nas demais telas (`wireframe-title-banner`, `top-nav`, `nav-left`, `nav-links`, `nav-search`, `nav-right`) — ver observação de inconsistência ao final deste documento.

### Tipografia — Desktop
| Fonte / Peso | Tamanho | Line-height | Letter-spacing | Cor | Uso |
|---|---|---|---|---|---|
| Manrope Regular | 14px | normal | 0% | #FFFFFF | 3 usos |
| Manrope Medium | 14px | normal | 0% | #5A6B80 | 2 usos |
| Unbounded Bold | 12px | normal | 0% | #FFFFFF | 2 usos |
| Unbounded Regular | 11px | normal | 0% | #5A6B80 | 2 usos |
| Unbounded Regular | 18px | normal | 0% | #F0B429 | 2 usos |
| Inter Bold | 16px | normal | 0 | #FFFFFF | 1 uso |
| Inter Extra Bold | 14px | normal | 0% | #1B2D50 | 1 uso |
| Manrope Bold | 14px | normal | 0% | #1B2D50 | 1 uso |
| Inter Regular | 13px | normal | 0% | #89A0B8 | 1 uso |
| Inter Bold | 11px | normal | 0% | #FFFFFF | 1 uso |
| Inter Bold | 12px | normal | 0% | #5A6B80 | 1 uso |
| Inter Semi Bold | 13px | normal | 0% | #1B2D50 | 1 uso |
| Unbounded Bold | 24px | normal | 0% | #FFFFFF | 1 uso |
| Manrope Regular | 14px | normal | 0% | #AFC1D4 | 1 uso |
| Manrope Bold | 14px | normal | 0% | #FFFFFF | 1 uso |
| Manrope Regular | 12px | normal | 0% | #7F94AA | 1 uso |
| Unbounded Bold | 12px | normal | 0% | #F0B429 | 1 uso |
| Unbounded Regular | 10px | normal | 0% | #4AADE0 | 1 uso |
| Unbounded Bold | 22px | normal | 0% | #FFFFFF | 1 uso |
| Manrope Regular | 13px | normal | 0% | #AFC1D4 | 1 uso |
| Manrope Regular | 14px | 150% | 0% | #AFC1D4 | 1 uso |

> **Observação:** esta é a única tela que introduz as famílias **Manrope** e **Unbounded** — todas as demais telas usam exclusivamente **Inter**. `Inter` só aparece aqui em elementos herdados do cabeçalho compartilhado (logo, busca, badge do carrinho).

### Cores — Desktop
**Preenchimentos**
| Hex | Ocorrências |
|---|---|
| #FFFFFF | 11 |
| #1B2D50 | 5 |
| #5A6B80 | 5 |
| #AFC1D4 | 3 |
| #4AADE0 | 3 |
| #F0B429 | 3 |
| #E8F4FD | 2 |
| #0F1D33 | 2 |
| #F0F8FF | 1 |
| #89A0B8 | 1 |
| #EF4444 | 1 |
| #162340 | 1 |
| #7F94AA | 1 |
| #1E3354 | 1 |
| #203B61 | 1 |

**Contornos**
| Hex | Ocorrências |
|---|---|
| #B8CCE0 | 4 |
| #1B2D50 | 4 |
| #EF4444 | 4 |
| #000000 | 3 |
| #F0B429 | 3 |
| #1E3354 | 2 |
| #4AADE0 | 2 |
| #89A0B8 | 1 |
| #5A6B80 | 1 |
| #FFFFFF | 1 |
| #2A3F5C | 1 |

> **Observação:** a paleta desta tela é majoritariamente composta por tons escuros de "arcade" (#0F1D33, #162340, #1E3354, #203B61, #4AADE0, #5A6B80, #7F94AA, #89A0B8, #AFC1D4, #F0B429) que não aparecem em nenhuma outra tela do produto — as cores do design system principal (#1B2D50, #3D5570, #8899AA, #E8F4FD, #F0F8FF) aparecem aqui apenas nos elementos herdados do cabeçalho/navegação compartilhados.

### Espaçamento, Raios e Bordas — Desktop
**Espaçamentos:** 0px, 2px, 4px, 6px, 8px, 10px, 12px, 16px, 20px, 24px, 30px, 32px, 35px, 40px.

**Raios:** 4px, 6px, 8px, 10px, 16px, 20px (border-radius).

**Bordas e efeitos**
| Peso/Efeito | Observação |
|---|---|
| 1px | stroke-width |
| 2px | stroke-width |
| 2.5px | stroke-width |
| 4px | stroke-width |
| 4.99px | stroke-width |
| Sombras | Nenhuma — sem efeitos de sombra/blur |

### Componentes e Estados — Desktop
**Componentes principais**
| Componente | Medida | Parent |
|---|---|---|
| desktop-jogos | 1280 × 992 | Page 1 |
| Screen title | 1280 × 51 | desktop-jogos |
| Top navigation | 1280 × 72 | desktop-jogos |
| Primary navigation | 445 × 35 | Top navigation |
| Navigation links | 296 × 35 | Primary navigation |
| Search | 300 × 40 | Top navigation |
| Account actions | 211 × 32 | Top navigation |
| Arcade experience | 1280 × 869 | desktop-jogos |
| Arcade heading | 1200 × 114 | Arcade experience |
| Heading copy | 426 × 55 | Arcade heading |
| Game workspace | 1200 × 684 | Arcade experience |
| Game preview | 1200 × 520 | Game workspace |
| Arcade monitor | 1200 × 420 | Game preview |
| Score board | 1152 × 80 | Arcade monitor |
| Defender | 1152 × 34 | Arcade monitor |
| Play action | 1200 × 52 | Game preview |
| aliens-battlefield | 344 × 120 | Game preview |
| aliens-row | 344 × 50 | aliens-battlefield |

**Interações e acessibilidade**
| Elemento | Especificação | Observação |
|---|---|---|
| Área do jogo | region/canvas | Nome acessível e fallback textual |
| Controles | buttons/keyboard | Suporte a teclado e instruções visíveis |
| Placar atual | status | aria-live moderado para atualização |
| Recorde | output | Persistir conforme regra do produto |
| Pontos/recompensas | status | Informar saldo e conversão |
| Reiniciar jogo | button | Confirmação e foco previsível |

### Comportamentos Não Definidos — Desktop
> "Não inventar sem requisito do produto." (seção "Não definido")
- **Breakpoints:** Não documentados — usar a versão mobile equivalente.
- **Hover/focus/disabled:** Não documentados — definir no design system.
- **Integração/API:** Não documentada — seguir requisitos funcionais.

### Inventário de Elementos — Desktop
Todas as 96 camadas, com caminho, tipo, posição, dimensão e estilo principal. Coordenadas relativas ao parent imediato.

| # | Caminho (layer) | Tipo | X | Y | Largura | Altura | Propriedades |
|---|---|---|---|---|---|---|---|
| 1 | desktop-jogos | FRAME | 7969 | -379 | 1280 | 992 | Auto Layout vertical · gap 0 · padding 0/0/0/0 |
| 2 | desktop-jogos / Screen title | FRAME | 0 | 0 | 1280 | 51 | Auto Layout vertical · gap 0 · padding 16/32/16/32 |
| 3 | desktop-jogos / Screen title / Title | TEXT | 32 | 16 | 232 | 19 | Inter Bold 16px |
| 4 | desktop-jogos / Top navigation | FRAME | 0 | 51 | 1280 | 72 | Auto Layout horizontal · gap 0 · padding 0/40/0/40 |
| 5 | desktop-jogos / Top navigation / Primary navigation | FRAME | 40 | 19 | 445 | 35 | Auto Layout horizontal · gap 40 · padding 0/0/0/0 |
| 6 | desktop-jogos / Top navigation / Primary navigation / Logo | FRAME | 0 | 1 | 109 | 33 | Auto Layout horizontal · gap 8 · padding 8/16/8/16 |
| 7 | desktop-jogos / Top navigation / Primary navigation / Logo / Cart | FRAME | 16 | 9 | 16 | 16 |  |
| 8 | desktop-jogos / Top navigation / Primary navigation / Logo / Cart / Glyph | VECTOR | 2 | 2 | 13 | 13 |  |
| 9 | desktop-jogos / Top navigation / Primary navigation / Logo / Brand | TEXT | 40 | 8 | 53 | 17 | Inter Extra Bold 14px |
| 10 | desktop-jogos / Top navigation / Primary navigation / Navigation links | FRAME | 149 | 0 | 296 | 35 | Auto Layout horizontal · gap 24 · padding 0/0/0/0 |
| 11 | desktop-jogos / Top navigation / Primary navigation / Navigation links / Navigation item | FRAME | 0 | 0 | 39 | 35 | Auto Layout vertical · gap 0 · padding 8/0/8/0 |
| 12 | desktop-jogos / Top navigation / Primary navigation / Navigation links / Navigation item / Label | TEXT | 0 | 8 | 39 | 19 | Manrope Medium 14px |
| 13 | desktop-jogos / Top navigation / Primary navigation / Navigation links / Navigation item | FRAME | 63 | 0 | 60 | 35 | Auto Layout vertical · gap 0 · padding 8/0/8/0 |
| 14 | desktop-jogos / Top navigation / Primary navigation / Navigation links / Navigation item / Label | TEXT | 0 | 8 | 60 | 19 | Manrope Medium 14px |
| 15 | desktop-jogos / Top navigation / Primary navigation / Navigation links / Navigation item | FRAME | 147 | 0 | 41 | 35 | Auto Layout vertical · gap 0 · padding 8/0/8/0 |
| 16 | desktop-jogos / Top navigation / Primary navigation / Navigation links / Navigation item / Label | TEXT | 0 | 8 | 41 | 19 | Manrope Bold 14px |
| 17 | desktop-jogos / Top navigation / Primary navigation / Navigation links / Navigation item | FRAME | 212 | 0 | 84 | 35 | Auto Layout vertical · gap 0 · padding 8/0/8/0 |
| 18 | desktop-jogos / Top navigation / Search | FRAME | 607 | 16 | 300 | 40 | Auto Layout horizontal · gap 8 · padding 0/12/0/12 |
| 19 | desktop-jogos / Top navigation / Search / Search | FRAME | 12 | 12 | 16 | 16 |  |
| 20 | desktop-jogos / Top navigation / Search / Search / Glyph | VECTOR | 2 | 2 | 13 | 13 |  |
| 21 | desktop-jogos / Top navigation / Search / Placeholder | TEXT | 36 | 12 | 252 | 16 | Inter Regular 13px |
| 22 | desktop-jogos / Top navigation / Account actions | FRAME | 1029 | 20 | 211 | 32 | Auto Layout horizontal · gap 20 · padding 0/0/0/0 |
| 23 | desktop-jogos / Top navigation / Account actions / Notifications | FRAME | 0 | 0 | 32 | 32 | Auto Layout horizontal · gap 0 · padding 0/0/0/0 |
| 24 | desktop-jogos / Top navigation / Account actions / Notifications / Bell | FRAME | 6 | 6 | 20 | 20 |  |
| 25 | desktop-jogos / Top navigation / Account actions / Notifications / Bell / Glyph | VECTOR | 2 | 2 | 16 | 16 |  |
| 26 | desktop-jogos / Top navigation / Account actions / Notifications / Unread indicator | ELLIPSE | 22 | 2 | 8 | 8 | fill #EF4444 |
| 27 | desktop-jogos / Top navigation / Account actions / Cart status | FRAME | 52 | 6 | 48 | 20 | Auto Layout horizontal · gap 8 · padding 0/0/0/0 |
| 28 | desktop-jogos / Top navigation / Account actions / Cart status / Bag | FRAME | 0 | 0 | 20 | 20 |  |
| 29 | desktop-jogos / Top navigation / Account actions / Cart status / Bag / Glyph | VECTOR | 2 | 2 | 16 | 16 |  |
| 30 | desktop-jogos / Top navigation / Account actions / Cart status / Count | FRAME | 28 | 2 | 20 | 17 | Auto Layout vertical · gap 0 · padding 2/6/2/6 |
| 31 | desktop-jogos / Top navigation / Account actions / Cart status / Count / Value | TEXT | 6 | 2 | 8 | 13 | Inter Bold 11px |
| 32 | desktop-jogos / Top navigation / Account actions / User menu | FRAME | 120 | 0 | 91 | 32 | Auto Layout horizontal · gap 8 · padding 0/0/0/0 |
| 33 | desktop-jogos / Top navigation / Account actions / User menu / Avatar | FRAME | 0 | 0 | 32 | 32 | Auto Layout vertical · gap 0 · padding 0/0/0/0 |
| 34 | desktop-jogos / Top navigation / Account actions / User menu / Avatar / Initials | TEXT | 8 | 9 | 16 | 15 | Inter Bold 12px |
| 35 | desktop-jogos / Top navigation / Account actions / User menu / User name | TEXT | 40 | 8 | 31 | 16 | Inter Semi Bold 13px |
| 36 | desktop-jogos / Top navigation / Account actions / User menu / Expand | FRAME | 79 | 10 | 12 | 12 |  |
| 37 | desktop-jogos / Top navigation / Account actions / User menu / Expand / Glyph | VECTOR | 1 | 1 | 10 | 10 |  |
| 38 | desktop-jogos / Arcade experience | FRAME | 0 | 123 | 1280 | 869 | fill #162340 |
| 39 | desktop-jogos / Arcade experience / Arcade heading | FRAME | 40 | 32 | 1200 | 114 |  |
| 40 | desktop-jogos / Arcade experience / Arcade heading / Heading copy | FRAME | 0 | 0 | 426 | 55 | Auto Layout vertical · gap 6 · padding 0/0/0/0 |
| 41 | desktop-jogos / Arcade experience / Arcade heading / Heading copy / Title | TEXT | 0 | 0 | 224 | 30 | Unbounded Bold 24px |
| 42 | desktop-jogos / Arcade experience / Arcade heading / Heading copy / Description | TEXT | 0 | 36 | 426 | 19 | Manrope Regular 14px |
| 43 | desktop-jogos / Arcade experience / Arcade heading / Points balance | FRAME | 1093 | 24 | 96 | 35 | Auto Layout vertical · gap 8 · padding 10/16/10/16 |
| 44 | desktop-jogos / Arcade experience / Arcade heading / Points balance / Points | TEXT | 16 | 10 | 64 | 15 | Unbounded Bold 12px |
| 45 | desktop-jogos / Arcade experience / Game workspace | FRAME | 40 | 129 | 1200 | 684 |  |
| 46 | desktop-jogos / Arcade experience / Game workspace / Game preview | FRAME | 0 | 0 | 1200 | 520 |  |
| 47 | desktop-jogos / Arcade experience / Game workspace / Game preview / Arcade monitor | FRAME | 0 | 0 | 1200 | 420 | fill #0F1D33 |
| 48 | desktop-jogos / Arcade experience / Game workspace / Game preview / Arcade monitor / Glow | RECTANGLE | 0 | 0 | 1200 | 420 |  |
| 49 | desktop-jogos / Arcade experience / Game workspace / Game preview / Arcade monitor / Score board | FRAME | 24 | 24 | 1152 | 80 | Auto Layout vertical · gap 0 · padding 0/1077/0/0 |
| 50 | desktop-jogos / Arcade experience / Game workspace / Game preview / Arcade monitor / Score board / Current score | FRAME | 0 | 0 | 75 | 40 | Auto Layout vertical · gap 4 · padding 0/0/0/0 |
| 51 | desktop-jogos / Arcade experience / Game workspace / Game preview / Arcade monitor / Score board / Current score / Label | TEXT | 0 | 0 | 47 | 14 | Unbounded Regular 11px |
| 52 | desktop-jogos / Arcade experience / Game workspace / Game preview / Arcade monitor / Score board / Current score / Score | TEXT | 0 | 18 | 75 | 22 | Unbounded Regular 18px |
| 53 | desktop-jogos / Arcade experience / Game workspace / Game preview / Arcade monitor / Score board / High score | FRAME | 0 | 40 | 69 | 40 |  |
| 54 | desktop-jogos / Arcade experience / Game workspace / Game preview / Arcade monitor / Score board / High score / Label | TEXT | 5 | 0 | 64 | 14 | Unbounded Regular 11px |
| 55 | desktop-jogos / Arcade experience / Game workspace / Game preview / Arcade monitor / Score board / High score / Score | TEXT | 0 | 18 | 69 | 22 | Unbounded Regular 18px |
| 56 | desktop-jogos / Arcade experience / Game workspace / Game preview / Arcade monitor / Battlefield | FRAME | 586 | 382 | 28 | 228 |  |
| 57 | desktop-jogos / Arcade experience / Game workspace / Game preview / Arcade monitor / Defender | FRAME | 24 | 610 | 1152 | 34 |  |
| 58 | desktop-jogos / Arcade experience / Game workspace / Game preview / Arcade monitor / Defender / Defender ship | FRAME | 559 | 0 | 34 | 34 |  |
| 59 | desktop-jogos / Arcade experience / Game workspace / Game preview / Arcade monitor / Defender / Defender ship / Glyph | VECTOR | 3 | 3 | 27 | 27 |  |
| 60 | desktop-jogos / Arcade experience / Game workspace / Game preview / Play action | FRAME | 0 | 436 | 1200 | 52 | fill #4AADE0 |
| 61 | desktop-jogos / Arcade experience / Game workspace / Game preview / Play action / Joystick | FRAME | 591 | 4 | 18 | 18 |  |
| 62 | desktop-jogos / Arcade experience / Game workspace / Game preview / Play action / Joystick / Glyph | VECTOR | 2 | 2 | 14 | 14 |  |
| 63 | desktop-jogos / Arcade experience / Game workspace / Game preview / Play action / Button label | TEXT | 525 | 30 | 150 | 19 | Manrope Bold 14px |
| 64 | desktop-jogos / Arcade experience / Game workspace / Game preview / Daily limit | TEXT | 0 | 504 | 1200 | 16 | Manrope Regular 12px |
| 65 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens- battlefield | FRAME | 419 | 82 | 344 | 120 | Auto Layout vertical · gap 19.970844268798828 · padding 0/0/0/0 |
| 66 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens- battlefield / aliens-row | FRAME | 0 | 0 | 344 | 50 | Auto Layout horizontal · gap 34.948978424072266 · padding 0/0/0/0 |
| 67 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row / bot | FRAME | 0 | 0 | 60 | 50 |  |
| 68 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row / bot / Vector | VECTOR | 5 | 8 | 50 | 33 |  |
| 69 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row / bot | FRAME | 95 | 0 | 60 | 50 |  |
| 70 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row / bot / Vector | VECTOR | 5 | 8 | 50 | 33 |  |
| 71 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row / bot | FRAME | 190 | 0 | 60 | 50 |  |
| 72 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row / bot / Vector | VECTOR | 5 | 8 | 50 | 33 |  |
| 73 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row / bot | FRAME | 285 | 0 | 60 | 50 |  |
| 74 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row / bot / Vector | VECTOR | 5 | 8 | 50 | 33 |  |
| 75 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row-2 | FRAME | 32 | 70 | 280 | 50 | Auto Layout horizontal · gap 34.948978424072266 · padding 0/0/0/29.956266403198242 |
| 76 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row-2 / bot | FRAME | 30 | 0 | 60 | 50 |  |
| 77 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row-2 / bot / Vector | VECTOR | 5 | 8 | 50 | 33 |  |
| 78 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row-2 / bot | FRAME | 125 | 0 | 60 | 50 |  |
| 79 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row-2 / bot / Vector | VECTOR | 5 | 8 | 50 | 33 |  |
| 80 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row-2 / bot | FRAME | 220 | 0 | 60 | 50 |  |
| 81 | desktop-jogos / Arcade experience / Game workspace / Game preview / aliens-battlefield / aliens-row-2 / bot / Vector | VECTOR | 5 | 8 | 50 | 33 |  |
| 82 | desktop-jogos / Arcade experience / Game workspace / Game preview / Vector | VECTOR | 574 | 342 | 52 | 37 |  |
| 83 | desktop-jogos / Arcade experience / Game workspace / Game information | FRAME | 0 | 544 | 360 | 434 |  |
| 84 | desktop-jogos / Arcade experience / Game workspace / Game information / Conversion table | FRAME | 0 | 0 | 360 | 140 | Auto Layout vertical · gap 12 · padding 20/20/20/20 |
| 85 | desktop-jogos / Arcade experience / Game workspace / Game information / Conversion table / Title | TEXT | 20 | 20 | 320 | 15 | Unbounded Bold 12px |
| 86 | desktop-jogos / Arcade experience / Game workspace / Game information / Conversion table / Conversion rules | FRAME | 20 | 47 | 241 | 73 | Auto Layout vertical · gap 8 · padding 0/0/0/0 |
| 87 | desktop-jogos / Arcade experience / Game workspace / Game information / Conversion table / Conversion rules / Rule | TEXT | 0 | 0 | 232 | 19 | Manrope Regular 14px |
| 88 | desktop-jogos / Arcade experience / Game workspace / Game information / Conversion table / Conversion rules / Rule | TEXT | 0 | 27 | 234 | 19 | Manrope Regular 14px |
| 89 | desktop-jogos / Arcade experience / Game workspace / Game information / Conversion table / Conversion rules / Rule | TEXT | 0 | 54 | 241 | 19 | Manrope Regular 14px |
| 90 | desktop-jogos / Arcade experience / Game workspace / Session status | FRAME | 822 | 564 | 360 | 113 | Auto Layout vertical · gap 8 · padding 20/20/20/20 |
| 91 | desktop-jogos / Arcade experience / Game workspace / Session status / Eyebrow | TEXT | 20 | 20 | 116 | 12 | Unbounded Regular 10px |
| 92 | desktop-jogos / Arcade experience / Game workspace / Session status / Value | TEXT | 20 | 40 | 50 | 27 | Unbounded Bold 22px |
| 93 | desktop-jogos / Arcade experience / Game workspace / Session status / Hint | TEXT | 20 | 75 | 320 | 18 | Manrope Regular 13px |
| 94 | desktop-jogos / Arcade experience / Game workspace / How to play | FRAME | 411 | 544 | 360 | 149 | Auto Layout vertical · gap 10 · padding 20/20/20/20 |
| 95 | desktop-jogos / Arcade experience / Game workspace / How to play / Title | TEXT | 20 | 20 | 320 | 15 | Unbounded Bold 12px |
| 96 | desktop-jogos / Arcade experience / Game workspace / How to play / Instructions | TEXT | 20 | 45 | 320 | 84 | Manrope Regular 14px |


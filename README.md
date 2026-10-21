# LMA · Sistema de Gestão para Clínica Odontológica

Aplicação web para **gestão completa de uma clínica odontológica** — do site de
captação de pacientes ao prontuário clínico, odontograma, orçamentos e financeiro.
Construída do zero, sem frameworks, como um SPA (Single Page Application) leve e responsivo.

> Projeto full-stack em evolução: a camada de interface e a lógica estão completas;
> a persistência de dados e os recursos de IA estão em integração (ver **Roadmap**).

---

## ✨ Funcionalidades

**Site institucional**
- Hero animado (SVG), seções de tratamentos, diferenciais, sobre, resultados
  (antes/depois) e contato
- Agendamento online público (formulário que gera pedidos de consulta)

**Painel administrativo** (acesso restrito por login)
- **Pacientes** — cadastro, busca, perfil e histórico de atendimentos
- **Prontuário / ficha clínica** — anamnese com alertas clínicos, planejamento
  pré e pós-operatório
- **Odontograma interativo** — arcada anatômica desenhada em SVG, dentições
  permanente e decídua, marcação de condições por dente (cárie, restauração,
  implante, ausente, etc.)
- **Orçamentos / plano de tratamento** — itens por procedimento e dente, cálculo
  automático de total e status (aberto/aprovado)
- **Gestão financeira** — entradas/saídas, recebimentos, resumo de caixa
- **Documentos** — termo de consentimento e receituário em papel timbrado
  (imprimível/PDF), com catálogo de medicações e posologias
- **Assinatura eletrônica** — fluxo de solicitação de assinatura de documentos
- Tema **claro/escuro**, layout **responsivo** e estilos de **impressão**

---

## 🛠️ Stack / Tecnologias

| Camada | Tecnologia |
|---|---|
| Estrutura | **HTML5** semântico |
| Estilo | **CSS3** — variáveis (custom properties), Grid, Flexbox, tema claro/escuro (`prefers-color-scheme` + toggle), media queries de impressão |
| Lógica | **JavaScript (vanilla / ES6+)** — sem frameworks e sem dependências |
| Gráficos | **SVG** gerado dinamicamente via JS (odontograma anatômico e ícones) |
| Tipografia | Google Fonts (Fraunces + Manrope) |
| Build | Nenhum — roda direto no navegador, sem `node_modules` nem etapa de build |

**Decisões de arquitetura**
- SPA com roteamento próprio por *overlays* (sem recarregar a página)
- Estado em memória no front-end (camada de dados isolada, pronta para plugar no backend)
- Zero dependências externas de runtime → leve, portável e fácil de auditar

---

## 🤖 IA (em desenvolvimento)

O projeto está sendo preparado para receber uma camada de inteligência:

- **Assistente por voz e texto** — ditado e comandos em linguagem natural usando a
  **Web Speech API** (`SpeechRecognition` / `SpeechSynthesis`), direto no navegador
- **Interpretação de comandos via LLM** — ex.: *"agende o retorno da Ana para
  segunda de manhã"* → ação estruturada executada no sistema. A chamada ao modelo
  roda no backend (**Supabase Edge Functions**) para proteger a chave de API
- **Base para RAG / embeddings** — o `pgvector` (incluso no Supabase) permite busca
  semântica em documentos e fichas no futuro

---

## 🚀 Como rodar

Como o projeto usa arquivos separados, rode por um servidor local (para os
`assets` e módulos carregarem corretamente):

1. Abra a pasta no **VS Code**
2. Instale a extensão **Live Server**
3. Botão direito em `index.html` → **"Open with Live Server"**

> Também existe uma versão single-file (`lma-site.html`) que abre com duplo clique,
> sem servidor.

**Acesso ao painel (demonstração):** rodapé → *Área da equipe* →
usuário `admin` / senha `admin`.

---

## 📁 Estrutura

```
lma-projeto/
├── index.html    # estrutura da página
├── styles.css    # todo o visual (tema rosa/dourado, claro/escuro, responsivo)
├── app.js        # toda a lógica (agendamento, painel, odontograma, orçamentos, financeiro, documentos)
└── assets/       # logos e fotos
```

---

## 🗺️ Roadmap

- [ ] **Backend com Supabase** — PostgreSQL, autenticação real, multiusuário,
  Row Level Security (LGPD) e Storage para radiografias/fotos
- [ ] **Assistente de IA** por voz e texto (Web Speech API + LLM via Edge Functions)
- [ ] Dashboard e relatórios (financeiro, produção, faltas)
- [ ] Controle de próteses (etapas e prazos de laboratório)
- [ ] Integrações: emissão de NF, lembretes por WhatsApp

---

## 📝 Notas

Versão atual é uma demonstração funcional de front-end: os dados ficam apenas na
sessão do navegador. A persistência real e o multiusuário entram com o Supabase.

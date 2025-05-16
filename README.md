# Editor SVG Interativo com Angular

## Autor  
Josué Gomes Ribeiro

## Descrição do Projeto  
Este projeto é um editor SVG interativo desenvolvido com Angular 19, que permite aos usuários adicionar e configurar elementos gráficos básicos, como retângulos e estrelas, diretamente em um canvas SVG. A aplicação é uma Single Page Application (SPA) modular e responsiva, com funcionalidades para manipulação visual dos elementos em tempo real.

### Funcionalidades Implementadas  
- Adição de retângulos e estrelas ao canvas SVG.  
- Configuração de propriedades específicas:  
  - Retângulo: raio de arredondamento dos cantos.  
  - Estrela: número de pontas e raio interno (profundidade).  
- Controle visual para cores de preenchimento, cor da borda e espessura da borda.  
- Seleção e edição dinâmica dos elementos existentes.  
- Remoção de elementos selecionados.  
- Design responsivo para diferentes tamanhos de tela.  
- Estado gerenciado de forma reativa com RxJS.  
- Testes unitários para serviços e componentes críticos.

## Decisões Técnicas e Justificativas

**Angular 19 como Base**  
Escolhi a versão mais recente do Angular (v19) para aproveitar otimizações de desempenho, suporte a signals (opcional) e compatibilidade com as últimas features do ecossistema. Isso garante injeção de dependência modular, lazy loading facilitado e suporte a SSR (Server-Side Rendering), se necessário no futuro.

**Gestão de Estado com RxJS (~7.8.0)**  
Para coordenar atualizações em tempo real dos elementos SVG, utilizei `BehaviorSubject` para armazenar o estado do canvas e `Observables` para propagar mudanças reativas entre componentes, facilitando a sincronização da UI com o estado atual.

**Identificação Única de Elementos (UUID v11)**  
Cada elemento SVG criado recebe um ID único gerado pela biblioteca `uuid`, o que evita conflitos durante criação, edição e exclusão dinâmica das formas.

**Abordagem de Componentização**  
A aplicação foi dividida em componentes claros e isolados:  
- **CanvasComponent**: Renderiza o SVG e gerencia eventos de interação (seleção, arrastar).  
- **ToolbarComponent**: Contém botões para ações como adicionar formas e limpar o canvas.  
- **PropertyEditorComponent**: Painel para ajuste das propriedades dos elementos selecionados.  
Essa divisão promove a reutilização, manutenibilidade e clareza do código.

**Testabilidade**  
Usei Jasmine + Karma (~6.4) com cobertura de testes para garantir qualidade, focando nos serviços que manipulam SVG e nos componentes que lidam com interações do usuário.

**Estilização com CSS Puro**  
Optei por CSS puro sem bibliotecas externas (Bootstrap, Material), para manter controle total sobre o design, simplicidade e um bundle mais enxuto.

## Instruções para Execução

### Pré-requisitos  
- Node.js (versão recomendada: 20.x)  
- Angular CLI (versão recomendada: 19.x)  

### Passos para rodar o projeto localmente  

```bash
# Clone o repositório
git clone git@github.com:Ryogazz/Editor-SVG-Interativo-com-Angular.git

# Entre na pasta do projeto
cd Editor-SVG-Interativo-com-Angular

# Instale as dependências
npm install

# Execute a aplicação
ng serve

Após isso, acesse http://localhost:4200 no navegador para usar o editor SVG.

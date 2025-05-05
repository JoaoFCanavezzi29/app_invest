# Investers

Este projeto é um simulador de economia baseada em turnos por tempo real, onde cada turno dura cerca de 3 minutos. Ele permite a gestão de ativos, vendas pendentes, e o impacto de eventos em ativos durante a simulação. O objetivo é proporcionar uma experiência imersiva de estratégia, enquanto se explora um sistema dinâmico de decisões econômicas e estratégias de impacto.

A motivação por trás do projeto é dar uma experiência mais rica para as pessoas que utilizarem o sistema por conta da curva ingreme de aprendizado de investir na realidade, onde pessoas, especialmente jovens adultos podem adquirir certa consciência antes de partir para algo com risco.

## Tecnologias utilizadas

- Node.js
- Express
- Swagger (para documentação da API)
- Bcrypt (para encriptar as senhas)
- dotenv (para utilizar atributos de forma segura)
- jsonwebtoken (para possibilitar o JWT e autenticação segura)
- MySQL2 (para o banco de dados)
- jest (para testes)
- cross-env (para testes)
- supertest (para testes)
- sequelize (para utilizar ORM)

## Justificativa das Tecnologias

### 1. **Node.js**
   - **Motivação**: Node.js foi escolhido devido à sua alta performance em I/O não bloqueante, o que o torna ideal para aplicações que precisam gerenciar múltiplas conexões simultâneas, como é o caso do simulador de economia baseado em turnos em tempo real. Além disso, por ser baseado em JavaScript, oferece a vantagem de um desenvolvimento full-stack utilizando a mesma linguagem tanto no back-end quanto no front-end, o que acelera a curva de aprendizado e a integração.

### 2. **Express**
   - **Motivação**: Express foi adotado como framework para Node.js devido à sua simplicidade e flexibilidade na criação de APIs RESTful. Ele permite a criação de rotas e middleware de forma rápida, além de ser amplamente utilizado na comunidade, o que facilita encontrar soluções e suporte.

### 3. **Swagger**
   - **Motivação**: O Swagger é utilizado para gerar e documentar a API de forma interativa e fácil de entender. Ele fornece uma interface visual para que os desenvolvedores e outros usuários possam explorar a API, testar as rotas diretamente e entender os dados esperados em cada endpoint. Isso melhora a colaboração e facilita a manutenção da API.

### 4. **Bcrypt**
   - **Motivação**: Bcrypt foi escolhido para criptografar as senhas dos usuários de forma segura. Ele implementa o algoritmo de hash de senhas, que é altamente resistente a ataques de força bruta, tornando-o uma escolha ideal para garantir a segurança das credenciais dos usuários.

### 5. **Dotenv**
   - **Motivação**: O pacote dotenv foi utilizado para gerenciar variáveis de ambiente de maneira segura. Isso permite que informações sensíveis, como credenciais de banco de dados e chaves secretas, sejam armazenadas em um arquivo `.env` e não fiquem expostas diretamente no código fonte, promovendo melhores práticas de segurança.

### 6. **Jsonwebtoken (JWT)**
   - **Motivação**: O uso de JWT facilita a autenticação e autorização de usuários de maneira segura e escalável. Ele permite a criação de tokens que são usados para verificar a identidade dos usuários sem necessidade de armazenar sessões no servidor, o que é mais eficiente para sistemas distribuídos.

### 7. **MySQL2**
   - **Motivação**: MySQL2 foi escolhido por ser um banco de dados relacional robusto e bem suportado para armazenar dados críticos, como informações de usuários, ativos e transações. Ele oferece um bom desempenho para consultas complexas e integra-se facilmente com Sequelize, o ORM utilizado no projeto.

### 8. **Jest**
   - **Motivação**: Jest é utilizado para testes automatizados devido à sua simplicidade, integração com o ecossistema JavaScript e capacidade de realizar testes unitários, de integração e de comportamento. Ele oferece funcionalidades como mocks e spies, que são úteis para testar o comportamento do sistema em diferentes cenários.

### 9. **Cross-env**
   - **Motivação**: O cross-env foi utilizado para garantir que as variáveis de ambiente sejam definidas de forma consistente em diferentes sistemas operacionais, o que é particularmente importante para a configuração de ambientes de desenvolvimento, teste e produção.

### 10. **Supertest**
   - **Motivação**: Supertest foi adotado para realizar testes de integração e de rotas da API. Ele permite simular requisições HTTP e validar as respostas, garantindo que os endpoints da API funcionem corretamente e de acordo com o esperado.

### 11. **Sequelize**
   - **Motivação**: Sequelize é um ORM (Object Relational Mapper) utilizado para facilitar a interação com o banco de dados. Ele permite abstrair as complexidades do SQL, tornando o código mais limpo e fácil de manter, além de fornecer uma interface programática para manipular os dados de forma eficiente.

## Como Rodar o Projeto

### 1. Clonar o repositório

### 2. Instalar as Dependências.
npm install

O servidor estará rodando em `http://localhost:3000`

### 3. Preencha .env

Coloque as credenciais para acessar o seu banco de dados.

### 4. Rodando o projeto

Caso não esteja no modo de teste, utilize: node .\src\app.js

# Login do Admin Padrão

e-mail: admin@admin.com
senha: admin

## Documentação da API
A documentação da API está disponível através do Swagger. Para acessá-la, vá até a URL:

- Swagger UI: `http://localhost:3000/api-docs`

Aqui você pode visualizar todas as rotas da API, bem como detalhes sobre cada uma delas.

## Testes Automatizados

Para utilizar os testes automatizados, primeiro vá em .env e no NODE_ENV coloque o valor dele como test

Em sequência utilize no terminal: npm test

Quando quiser parar de utilizar testes unitários, apenas retire o test

Caso execute os testes mais de uma vez, ele lhe barrará por conta que tem uma limitação de vezes que pode executar uma compra/ou venda no asset.test.js


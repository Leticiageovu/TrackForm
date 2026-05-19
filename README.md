# 🏋️ TrackForm - Gestão de Treinos & Evolução Física

O **TrackForm** é um ecossistema Full Stack profissional para gestão de rotina esportiva e acompanhamento de evolução corporal. O sistema permite registrar treinos de diversas modalidades, monitorar medidas físicas e visualizar o progresso através de métricas automáticas e gráficos intuitivos.

---

## 🚀 Tecnologias

### Backend (API)
- **Java 17** & **Spring Boot 3**
- **Spring Security** + **JWT (JSON Web Token)**
- **H2 Database** (Persistência em arquivo para facilidade de teste)
- **Hibernate / JPA**
- **Swagger (OpenAPI 3)** para documentação da API

### Frontend (Interface)
- **React 19** & **TypeScript**
- **Vite** (Build tool ultra-rápida)
- **Chart.js** para visualização de dados
- **CSS Modules** para estilização isolada
- **Axios** para integração com API

---

## 🏗️ Arquitetura do Sistema

### Backend (Padrão MVC)
O servidor segue uma estrutura robusta dividida em camadas:
- **Model:** Entidades que representam o banco de dados (`User`, `Workout`, `Progress`, `CustomSport`).
- **Repository:** Interfaces para comunicação com o banco de dados.
- **Service:** Camada de lógica de negócio (cálculos de IMC, metas e regras de evolução).
- **Controller:** Endpoints REST que expõem as funcionalidades para o frontend.
- **DTOs:** Objetos de transferência para garantir segurança e performance na comunicação.

### Frontend (Componentização & Estado)
- **Context API:** Gerenciamento global de autenticação e persistência de sessão.
- **Mobile-First Design:** Interface responsiva com navegação adaptativa (Top Nav para Desktop e Bottom Nav para Mobile).
- **Lógica de Evolução:** Cálculo automático de tendências de peso e volume de treino.

---

## ✨ Funcionalidades Principais

1.  **Dashboard Inteligente:** Resumo semanal/mensal de treinos e métricas de peso.
2.  **Registro de Treinos:** Histórico completo com filtros por modalidade e data.
3.  **Acompanhamento de Evolução:** Registro de medidas corporais (bíceps, cintura, peso, etc.) e cálculo automático de IMC.
4.  **Modalidades Customizáveis:** Permite criar novos esportes com ícones personalizados.
5.  **Segurança JWT:** Sistema de login seguro com criptografia BCrypt e tokens de acesso.

---

## 🛠️ Como Rodar o Projeto

### O Jeito Mais Fácil (Windows)
1.  Certifique-se de ter o **Java 17** e o **Node.js** instalados.
2.  Dê um clique duplo no arquivo `INICIAR_SISTEMA.bat` na raiz do projeto.
3.  Aguarde as janelas do terminal abrirem. O sistema estará pronto quando a API e o Frontend iniciarem.
    - **Interface:** [http://localhost:5173](http://localhost:5173)
    - **API (Swagger):** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### Execução Manual

**Backend:**
```bash
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

### Execução via Docker (Opcional)
Se preferir rodar via Docker, utilize o arquivo `docker-compose.yml` (atualmente configurado para PostgreSQL):
```bash
docker-compose up -d
```

---

## 🗄️ Banco de Dados & Acesso
Por padrão, o sistema utiliza o **H2 Database** (em arquivo) para facilitar o desenvolvimento.

- **URL do Console:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL:** `jdbc:h2:file:./data/treinos_db`
- **User:** `sa`
- **Password:** *(vazio)*

---

## ⚙️ Configurações e Segurança
O projeto está preparado para produção utilizando variáveis de ambiente:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `JWT_SECRET_KEY` | Chave mestra para tokens JWT | (Chave genérica) |
| `DB_PASSWORD` | Senha do banco de dados (Docker/Postgres) | `password_treinos` |

---

## 🔐 Autenticação
O sistema utiliza tokens JWT. Para acessar rotas protegidas manualmente via API, inclua o cabeçalho:
`Authorization: Bearer <SEU_TOKEN_AQUI>`

---
*Desenvolvido para transformar dados de treino em motivação real.*

---
📂 **Documentação Complementar:** [Confira o Roadmap de Desenvolvimento](ROADMAP.md)

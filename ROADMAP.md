# Plano de Ação - TrackForm 🏋️📊

Este documento descreve as etapas para o desenvolvimento do Sistema de Treinos e Evolução Física, utilizando **Java 17** e o ecossistema **Spring Boot**.

## 🚀 Tecnologias Base
- **Linguagem:** Java 17
- **Framework:** Spring Boot 3+
- **Banco de Dados:** PostgreSQL
- **Segurança:** Spring Security + JWT
- **Documentação:** Swagger (SpringDoc OpenAPI)

---

## 🛠️ Cronograma de Desenvolvimento

### 1. Configuração Inicial e Estrutura
- Inicialização do projeto (Spring Initializr).
- Criar pacotes base:
  - `controller`
  - `service`
  - `repository`
  - `model`
  - `dto`
- **Resultado:** Organização profissional e pronta para escala.

### 👤 2. Primeira Entidade: Usuário
- Criar entidade `User` (id, name, email, password).
- Implementar:
  - Entity
  - Repository
  - Service
  - Controller
- **Resultado:** CRUD de usuário funcional.

### 🏋️ 3. Gestão de Treinos
- Criar entidade `Workout` (nome, data, user_id).
- **Resultado:** Usuário capaz de criar e listar seus treinos.

### 💪 4. Exercícios
- Criar entidade `Exercise` vinculada ao treino.
- **Resultado:** Adição de exercícios específicos em cada treino.

### 📊 5. Evolução Física
- Criar entidade `Progress` (peso, gordura, massa muscular, data).
- **Resultado:** Histórico de evolução corporal do usuário.

### 🧠 6. Regras de Negócio (Diferencial)
- Implementar cálculo automático de evolução de peso.
- Comparação de progresso entre datas.
- **Resultado:** Sistema inteligente e analítico.

### 🔐 7. Segurança
- Integrar Spring Security.
- Implementar autenticação via JWT.
- **Resultado:** Login seguro e rotas protegidas.

### 🗄️ 8. Banco de Dados
- Configurar conexão com PostgreSQL.
- Migrations (se necessário).
- **Resultado:** Persistência de dados robusta.

### 📖 9. Documentação
- Configurar Swagger.
- **Resultado:** API navegável e fácil de testar.

### 🏁 10. Finalização
- Implementação de testes básicos (JUnit/Mockito).
- README detalhado.
- Planejamento de Deploy (Render/Railway).

---

**Status:** ✅ Concluído

# Personal Finance API - Docker Setup

Este projeto inclui configuração completa do Docker para rodar a aplicação com MySQL.

## 🐳 Configuração Docker

### Arquivos Docker

- `Dockerfile` - Imagem de produção
- `Dockerfile.dev` - Imagem de desenvolvimento
- `docker-compose.yml` - Ambiente de produção
- `docker-compose.dev.yml` - Ambiente de desenvolvimento
- `docker-manage.sh` - Script de gerenciamento (recomendado)

### 🚀 Como executar

#### Usando o Script de Gerenciamento (Recomendado)

```bash
# Tornar o script executável (apenas na primeira vez)
chmod +x docker-manage.sh

# Iniciar ambiente de produção
./docker-manage.sh start-prod

# Iniciar ambiente de desenvolvimento
./docker-manage.sh start-dev

# Ver logs da aplicação
./docker-manage.sh logs app

# Ver logs do MySQL
./docker-manage.sh logs mysql

# Parar todos os serviços
./docker-manage.sh stop

# Ver status dos serviços
./docker-manage.sh status

# Ver ajuda completa
./docker-manage.sh help
```

#### Comandos Docker Diretos

**Produção:**

```bash
# Construir e executar todos os serviços
docker compose up --build

# Executar em background
docker compose up -d --build
```

**Desenvolvimento:**

```bash
# Executar ambiente de desenvolvimento
docker compose -f docker-compose.dev.yml up --build

# Executar em background
docker compose -f docker-compose.dev.yml up -d --build
```

### 📊 Serviços incluídos

1. **MySQL Database**
   - Porta: 3310 (externa) / 3306 (interna)
   - Database: personal_finance
   - Usuário: app_user
   - Senha: app_password
   - Root password: root

2. **NestJS Application**
   - Porta: 3000
   - URL: http://localhost:3000

### 🔧 Comandos úteis

```bash
# Parar todos os serviços
docker compose down

# Parar e remover volumes
docker compose down -v

# Ver logs da aplicação
docker compose logs app

# Ver logs do MySQL
docker compose logs mysql

# Executar comandos no container da aplicação
docker compose exec app sh

# Executar comandos no MySQL
docker compose exec mysql mysql -u app_user -p personal_finance
```

### 🏥 Health Checks

- **MySQL**: Verifica se o banco está respondendo
- **App**: Verifica se a API está funcionando através do endpoint `/admin/test`

### 📁 Volumes

- `mysql_data`: Dados persistentes do MySQL
- `mysql_dev_data`: Dados do MySQL em desenvolvimento

### 🌐 Rede

Todos os serviços estão conectados através da rede `personal-finance-network` (ou `personal-finance-dev-network` em desenvolvimento).

### 🔍 Verificação

Após executar `docker compose up`, você pode verificar se tudo está funcionando:

1. **API**: http://localhost:3000/admin/test
2. **MySQL**: Conectar na porta 3310 com as credenciais fornecidas

### 🛠️ Desenvolvimento

Para desenvolvimento, use `docker-compose.dev.yml` que inclui:

- Hot reload da aplicação
- Volume mount do código fonte
- Dependências de desenvolvimento instaladas

### 🗃️ Dados de Exemplo

O banco de dados é inicializado automaticamente com:

- Categorias de exemplo (Alimentação, Transporte, Saúde, etc.)
- Um usuário de exemplo (admin@example.com / password123)
- Transações de exemplo

### 🐛 Troubleshooting

**Problema**: Erro de credenciais do Docker

```bash
# Solução: Configurar credenciais do Docker
docker login
```

**Problema**: Porta já em uso

```bash
# Solução: Parar serviços conflitantes ou alterar portas no docker-compose.yml
docker compose down
```

**Problema**: Banco não conecta

```bash
# Solução: Verificar se o MySQL está saudável
docker compose ps
docker compose logs mysql
```

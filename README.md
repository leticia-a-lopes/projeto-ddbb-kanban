# Quadro kanban

---

Desenvolvido para o processo seletivo da Empresa Junior Focus, para a empresa ficticia ddbb, como solução para os problemas de organização, e controle dos clientes durante o processo de contato

## Visão geral

---

**Login:** Será permitido o login de qualquer usuário cadastrado no sistema
**Cadastro de usuário:** Somente um administrador do sistema tem a permissão para criar novos usuários
**Cadastro de clientes:** Qualquer usuário cadastrado pode criar um novo cliente
**Criação de quadros:** Qualquer usuário cadastrado pode criar um novo quadro
**Arquivamento de clientes:** Somente o usuário referente ao cliente específico pode atualizar o status e as informações do mesmo

## Sobre Autenticação

---

A cada login, o usuário receberá um token no email cadastrado, que será utilizado para confirmar a identidade e fazer o login no sistema.
No momento de criação de um novo usuário, receberá também no email cadastrado uma senha, utilizada para fazer o login.
Será necessário, para criar um novo quadro, que o usuário esteja logado no sistema

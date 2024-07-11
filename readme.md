# Sistema de Monitoramento de Pagamentos e Solicitações de Manutenção

## Requisitos

### Módulo de Usuários

**Requisitos Funcionais**

[x] - Deve ser possível cadastrar um novo usuário.

[x] - Deve ser possível acessar o histórico de pagamentos do usuário [not here].

[x] - Deve ser possível acessar as solicitações.

**Regras de Negócio**

[x] - Não deve ser possível cadastrar um usuário com um email já existente.

[x] - Um usuário não pode solicitar nada com mais de um pagamentos em aberto.

[ ] - Se um usuário ficar 3 meses sem contribuir, a matrícula será suspensa até o pagamento. [manual]

[x] - Um usuário não pode fazer uma nova solicitação se já tiver uma em aberto.

[x] - Ao pagar a taxa, o usuário deve enviar o comprovante de pagamento.

[x] - Caso a solicitação saia do escopo coberto pela manutenção, a taxa extra deve ser paga antes. [manual]

### Módulo de Funcionários

**Requisitos Funcionais**

[X] - Deve ser possível alterar o estado da solicitação no sistema.

[X] - Deve ser possível notificar o administrador (Admin) sobre possíveis taxas extras. [manual]

[X] - Deve ser possível confirmar o pagamento da taxa para realizar a manutenção.[manual]

[X] - Deve ser possível encerrar o pedido após finalizar a manutenção.

[X] - Deve ser possível notificar dados errados nos registros dos usuários. [manual]

**Regras de Negócio**

[X] - Funcionários devem alterar o estado da solicitação no sistema ao pegar o chamado.[manual]

[X] - Funcionários devem notificar o Admin sobre possíveis taxas extras.[manual]

[X] - Funcionários devem confirmar o pagamento da taxa para realizar a manutenção.[manual]

[X] - Funcionários devem encerrar o pedido após finalizar a manutenção.[manual]

### Módulo do Administrador (Admin)

**Requisitos Funcionais**

[ ] - Deve ser possível receber e gerenciar os chamados.

[ ] - Deve ser possível designar funcionários para os chamados.

[ ] - Deve ser possível verificar e gerenciar taxas extras.

[ ] - Deve ser possível verificar o pagamento das taxas.

[ ] - Deve ser possível acompanhar chamados em aberto.

[ ] - Deve ser possível alterar os dados dos usuários no cadastro.

**Regras de Negócio**

[ ] - Admin deve receber os chamados.

[ ] - Admin deve designar funcionários para os chamados.

[ ] - Admin deve verificar as taxas extras.

[ ] - Admin deve verificar o pagamento das taxas.

[ ] - Admin deve acompanhar os chamados em aberto.

[ ] - Admin deve poder alterar os dados dos usuários no cadastro.

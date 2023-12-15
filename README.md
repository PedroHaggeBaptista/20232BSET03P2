# Correções Realizadas no código

## Correção 1

### Problema

- As tabelas estavam sendo criadas sem indicar que o ID era a chave primária e como INT ao invés de INTEGER, o que fazia com que o banco de dados não funcionasse corretamente, fazendo com que ao efetuar uma inserção ele adicionasse o item como se fosse id=1, porém quando faziamos o GET de todos os animais daquele tipo o id do animal que havia acabado de ser inserido vinha como "null".

### Solução

- Troca do SCRIPT de criação das tabelas para que o ID seja criado como INTEGER PRIMARY KEY ao invés de INT.

de:

```sql
CREATE TABLE cats (id INT, name TEXT, votes INT)
```

para:

```sql
CREATE TABLE cats (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, votes INT)
```

## Correção 2

### Problema

- Nas rotas POST de criação de gatos que já estava preenchida, não havia nenhuma verificação dos paramêtros que precisam ser informados (name), sendo assim eu adicionei uma verificação para checar se o paramêtro name havia sido realmente informado na requisição e não estava vazio e uma outra verificação para checar se o paramêtro era do tipo string.

### Solução

- Foram adicionadas algumas validações

```js
if (!name) {
  res.status(400).send("O nome do gato é obrigatório");
  return;
}
```

```js
if (typeof name !== "string") {
  res.status(400).send("O nome do gato deve ser uma string");
  return;
}
```

## Correção 3

### Problema

- Não havia nada na rota de POST para cachorros

### Solução

- Copiei com algumas modificações a rota de POST de gatos para cachorros, sendo essas modificações a mudança do nome da tabela de "cats" para "dogs", além das modificações descritas na correção acima que no caso foram as adições de verificação aos dados da requisição.

## Correção 4

### Problema

- Na rota de "/vote", não havia nenhuma verificação dos dados que estavam sendo passados na requisição (id e type), além de não haver nenhuma verificação se o id informado (tanto para cachorro quanto para gato) existia no banco de dados.

### Solução

- Adicionei verificações tanto para o id quanto para o type, sendo que para o id eu verifico se ele é um número e se ele existe no banco de dados, e para o type eu verifico se ele é uma string e se ele é igual a "dogs" ou "cats", além de efetuar uma transformação no ID para sempre vir como tipo Number, para que assim, mesmo que a pessoa passe como uma string, por exemplo "1", o código o transforme em 1.

```js
const id = Number(req.params.id);
```

```js
if (animalType !== "cats" && animalType !== "dogs") {
  res.status(400).send("Tipo de animal inválido");
  return;
}
```

```js
if (typeof id !== "number") {
  res.status(400).send("Id inválido");
  return;
}
```

```js
db.get(`SELECT * FROM ${animalType} WHERE id = ${id}`, (err, row) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else if (!row) {
      res.status(404).send("Animal não encontrado");
      return;
    } else {
      ...
    }
}
```

## Correção 5

### Problema
- Não havia nada para a rota de GET de cachorros

### Solução
- Copiei com uma modificação a rota de GET de gatos para cachorros, sendo essa modificação a mudança do nome da tabela.

```js
db.all("SELECT * FROM dogs", [], (err, rows) => {
    ...
});
```

## Correção 6

### Problema
- Algumas mensagens de erro deixavam vazar detalhes da implementação, como por exemplo as mensagens de erro em caso de falha do banco de dados, na qual, era informado ao cliente que o problema com a requisição dele foi com o Banco de Dados, o que pode ser uma brecha para ataques de pessoas mal intecionadas.

### Solução
- Utilização de mensagens de erro genéricas para informar o usuário que a requisição dele teve problemas, como por exemplo, "Houve um problema ao registar o candidato. Por favor revise os dados e tente novamente!", "Houve um problema com a sua requisição! Por favor tente novamente!", ou "Houve um problema ao registar o voto. Por favor revise os dados e tente novamente!".

# Como executar a API

## Modo produção

- Basta utilizar o comando "npm start" ou "yarn start" no console, garantindo assim que ele execute o código com a versão atual dele em seu terminal.

## Modo desenvolvimento

- Basta utilizar o comando "npm run dev" ou "yarn dev" no console, garantindo assim que em cada alteração que seja feita no código, haja uma atualização do terminal fazendo com que a aplicação atualize em tempo real conforme mudanças.

# Evidências de funcionamento

Pasta "assets": "./assets"
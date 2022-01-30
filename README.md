# Bot de ticket com transcript via HTML

Esse projeto basicamente é um bot de ticket completo via **SelectMenus** feito em [discord.js](https://discord.js.org/#/) v13 com uso do banco de dados mysql

# Imagens
<img src="https://image.prntscr.com/image/hnPekpbnR229VU-ktITdAw.png" alt="img3-ticket" style="height:198px;">
<img src="https://image.prntscr.com/image/liVWo5jDTn-V-xVUJdNyGA.png" alt="img1-ticket" style="height:198px;">
<img src="https://image.prntscr.com/image/wqGORL18SKaG0dULg9jEHg.png" alt="img2-ticket" style="height:198px;">

# Como posso usar?

Primeiro digite isso no seu terminal (Se estiver usando yarn)

```shell
  yarn add discord.js mongoose mysql2 sequelize reconlx
```
* O mongoose está ai pois a lib "reconlx" depende dela para funcionar

Se estiver usando NPM 

```shell
  npm install discord.js mongoose mysql2 sequelize reconlx
```

# Como ligar o bot?

Na config.json adicione o token do seu bot e coloque os dados do banco de dados mysql 

Depois digite o comando 

```shell
node .
```
# Configuração

Para criar uma mensagem de ticket basta digitar `!ticket`
Caso queira alterar as mensagens ou mudar de cor entre na pasta `src > commands > ticket.js` e só alterar

Caso queira mudar o nome do canal ou configurar a mensagem quando é enviada ao abrir o ticket basta ir em `src > events > interactionCreate.js`

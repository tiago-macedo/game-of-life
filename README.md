# Jogo da Vida

Implementação do famoso autômato celular [_Life_](https://pt.wikipedia.org/wiki/Jogo_da_vida), de autoria do matemático John Horton Conway.

## Site

O jogo pode ser acessado [aqui](https://tiago-macedo.github.io/game-of-life/).

## To Do

- [x] Botão "Configuração aleatória"
- [x] Botão "Limpar configuração"
- [x] Às vezes ocorrem problemas ao alterarmos o tamanho do campo.
    - Suspeito que isso ocorra quando mudamos o tamanho enquanto o jogo está rodando. Possível forma de resolver: pausar automaticamente antes de alterar o tamanho.
    - Resolvido deletando linha de código em função `reload()` que tentava pausar o jogo de forma mal feita.
- [x] Modo wrap-around?
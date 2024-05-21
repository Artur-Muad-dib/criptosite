tabela = []
acabou = False
animais = [["coelhos", 0], ["galinhas", 0], ["patos", 0]]


comando = input()
if comando.isdecimal():
    comando = int(comando)
    for i in range(comando):
        listAnimals = input().split(", ")
        animais[0][1] += listAnimals.count("Coelho")
        animais[1][1] += listAnimals.count("Galinha")
        animais[2][1] += listAnimals.count("Pato")
        tabela.append(listAnimals)
    for i in range(len(animais)):
        if animais[i][1] > 0:
            print(f"A fazenda tem {animais[i][1]} {animais[i][0]}!")

        else:
            print(f"Poxa que pena, não temos {animais[i][0]}.")

listaCompras = input().split(", ")
if "Melão" in listaCompras:
    print(
        "Eita parece que não estão vendendo melões, ouvi boatos que tem alguém roubando eles. Um tal de Pedro Elias..."
    )
sementesVendendo = input().split(", ")
podeComprar = [i for i in listaCompras if i in sementesVendendo]
if len(podeComprar) == 0:
    print("Poxa, acho que ficaremos sem plantações.")
elif len(podeComprar) == len(listaCompras):
    print("Consegui comprar todas as frutas que queria!")
else:
    podeComprar = sorted(podeComprar)
    print("Consegui comprar as seguintes sementes:")
    print(", ".join(podeComprar))

itens = input().split(", ")
barra = itens.index("Barra de ferro")
quartzo = itens.index("Quartzo refinado")
asa = itens.index("Asa de morcego")
qtd = input().split(", ")
qtd = [int(i) for i in qtd]
itens = [0, 0, 0]
itens[0] = qtd[barra]
itens[1] = qtd[quartzo]
itens[2] = int(qtd[asa] / 5)
itens = sorted(itens)
print(f"Com os itens que tenho, consigo fazer {itens[0]} para-raios!")

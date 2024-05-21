tabela = []
for i in range(3):
    conquistas = []
    historia = input().split(": ")
    nome = historia[0]
    historia = historia[1].split(", ")
    [conquistas.append(j.strip(",")) for j in historia]
    tabela.append([nome])
    acabou = False
    pescadiff = []
    pesca = []
    while not acabou:
        peixe = input()
        if peixe == "FIM":
            acabou = True
        else:
            pesca.append(peixe)
            if peixe not in pescadiff:
                pescadiff.append(peixe)
    conquistasReais = []
    if len(pescadiff) >= 5:
        conquistasReais.append("Pescador")
    if len(pescadiff) >= 10:
        conquistasReais.append("Velho Marinheiro")
    if len(pescadiff) >= 15:
        conquistasReais.append("Velho Pescador")
    if len(pesca) >= 25:
        conquistasReais.append("Deus Pescador")

    comparacao = [i for i in conquistas if i in conquistasReais]

    if comparacao == conquistas:
        tabela[i].append("verdadeiro")
    else:
        tabela[i].append("falso")

for i in range(len(tabela)):
    if tabela[i][1] == "verdadeiro":
        print(f"{tabela[i][0]} realmente estava falando a verdade!!!")
    else:
        print(f"{tabela[i][0]} é um mentiroso, ele não tem todas essas conquistas!")

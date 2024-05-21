listaAcabou = False
suspeitos = []
while not listaAcabou:
    comando = input()
    if comando == "Novo suspeito - altíssima periculosidade":
        suspeitoPerigoso = input()
        suspeitos.insert(0, suspeitoPerigoso)
    elif comando == "Novo suspeito - pouco perigoso":
        suspeitoNormal = input()
        suspeitos.append(suspeitoNormal)
    elif comando == "Livre de suspeita, pode remover":
        removido = input()
        suspeitos.remove(removido)
    elif comando == "Sujeito mais perigoso do que pensávamos":
        indice = int(input())
        indiceTroca = int(input())
        suspeitos[indice], suspeitos[indiceTroca] = (
            suspeitos[indiceTroca],
            suspeitos[indice],
        )
    elif comando == "Que estranho, esses dois meliantes… troque-os de lugar":
        meliante1 = input()
        meliante2 = input()
        meliante1Index = suspeitos.index(meliante1)
        meliante2Index = suspeitos.index(meliante2)
        suspeitos[meliante1Index], suspeitos[meliante2Index] = (
            suspeitos[meliante2Index],
            suspeitos[meliante1Index],
        )
    elif comando == "Essa posição não esta de acordo, ele não e tão perigoso assim":
        troca = input()
        conf = suspeitos.pop(suspeitos.index(troca))
        suspeitos.append(conf)
    elif comando == "Como a lista esta ficando?":
        for i in range(len(suspeitos)):
            if i == len(suspeitos) - 1:  # Se for o último elemento
                print(suspeitos[i], end="\n")
            else:
                print(suspeitos[i], end=", ")
    elif comando == "Já temos nossa lista de suspeitos":
        print("O resultado final ficou assim:")
        for i in range(len(suspeitos)):
            if i == len(suspeitos) - 1:  # Se for o último elemento
                print(suspeitos[i], end="\n")
            else:
                print(suspeitos[i], end=", ")
        listaAcabou = True

matriz = [[0 for i in range(2)] for i in range(4)]

for i in range(4):
    itens = input().split(" - ")
    matriz[i] = itens
acabou = False

print("Itens selecionados! Hora de iniciar a mesclagem... Simbora!")
while not acabou:
    indices = []
    for i in range(4):
        indices.append(int(input()))
    print("Combinando Itens...")

    print(
        f"Item para agricultura: {matriz[0][indices[0]]}\nItem para criação: {matriz[1][indices[1]]}\nItem para pesca: {matriz[2][indices[2]]}\nItem para mineração: {matriz[3][indices[3]]}"
    )
    opiniao = input()
    if (
        opiniao
        == "Gostei de ver! Ir atrás desses itens vai me render boas horas de diversão..."
    ):
        print("Meu dia tá garantido, obrigado pela ajuda Pega Móvel!")
        acabou = True
    else:
        continuar = input()
        if continuar == "Essa máquina deve estar com defeito...":
            print("É... acho que já chega de Stardew por hoje...")
            acabou = True
        

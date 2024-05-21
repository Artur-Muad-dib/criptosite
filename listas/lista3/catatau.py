desejos = input().split(", ")
naFazenda = input().split(", ")
emComum = [i for i in desejos if i in naFazenda]

if emComum == []:
    print(
        f"Parece que estou precisando fazer mais algumas colheitas! Não encontrei nenhum dos {len(desejos)} itens aqui na fazenda."
    )
else:
    print("Estes são os itens que já tenho na fazenda:")
    for i in range(len(emComum)):
        print(f"{i + 1}º item: {emComum[i]}")

    if emComum == desejos:
        print(f"Perfeito, encontrei todos os {len(emComum)} itens aqui na fazenda!")
    else:
        print(
            f"Vou precisar adquirir {(len(desejos) - len(emComum) )} itens antes do festival!"
        )

    print("Estou pronto para o festival de Stardew Valley! Que comece a diversão!")

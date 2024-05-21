nAnimais = int(input())  # solicitando a quantidade de animais
listAnimals = []

while (
    len(listAnimals) < nAnimais
):  # quando todos os animais estiverem registrados, o loop para
    comando = input()
    # condições para cada comando
    if comando == "REGISTRA":
        animal = input()
        if animal not in listAnimals:
            listAnimals.append(animal)
            print(f"{animal} registrado com sucesso.")
        else:
            print(f"{animal} já foi registrado antes!")

    elif comando == "CORRIGE":
        if len(listAnimals) > 0:
            listAnimals.pop()
            print("Último registro apagado com sucesso.")
        else:
            print("O catálogo ainda está vazio.")
    elif comando == "REINICIA":
        listAnimals = []
        print("Catálogo redefinido com sucesso.")

print(
    "Todos os animais foram registrados!\n\nCatálogo de animais:"
)  # exibindo a lista de animais
for i in range(len(listAnimals)):
    print(f"{i + 1}º: {listAnimals[i]}")

xy = input().split(" x ")
xy = [int(i) for i in xy]
x = xy[0]
y = xy[1]
matriz = [[0 for i in range(y)] for i in range(x)]

nItens = int(input())
for i in range(nItens):
    item = input().split()
    
    atracao = int(item[0])
    item = item[1].strip("()").split(",")
    item = [int(i) for i in item]
    matriz[item[0]][item[1]] = atracao


acabou = False
while not acabou:
    comando = input()
    if comando == "Permutar":
        permuta = input().split()
        p1 = permuta[0].strip("()").split(",")
        p2 = permuta[1].strip("()").split(",")
        x1 = int(p1[0])
        y1 = int(p1[1])
        x2 = int(p2[0])
        y2 = int(p2[1])

        matriz[x1][y1], matriz[x2][y2] = matriz[x2][y2], matriz[x1][y1]

    elif comando == "Transposição":

        transpo = [[0 for i in range(x)] for i in range(y)]

        for i in range(x):
            for j in range(y):
                transpo[j][i] = matriz[i][j]
        matriz = transpo
        x, y = y, x
    elif comando == "Remover":
        menor = 0
        for i in range(x):
            for j in range(y):
                if menor == 0 and matriz[i][j] != 0:
                    menor = matriz[i][j]
                    xm = i
                    ym = j
                elif menor > matriz[i][j] and matriz[i][j] != 0:
                    menor = matriz[i][j]
                    xm = i
                    ym = j
        matriz[xm][ym] = 0

    else:
        acabou = True
        print("Atual Arranjo:")

        x, y = len(matriz), len(matriz[0])
        for i in range(x):
            for j in range(y):
                if j == y - 1:
                    print(matriz[i][j], end = "")
                else:
                    print(matriz[i][j], end=" ")
            print()

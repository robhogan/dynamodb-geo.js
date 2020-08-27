
import csv
def main():
    # a0 b1 c2 d3 e4 f5 g6 h7 i8 j9 k10 l11 m12 n13 o14 p15 q16 r17 s18 t19 u20 v21 w22 x23 y24 z25

    import csv
    creader = csv.reader(open('IncidentsIn.csv', newline=''))
    cwriter = csv.writer(open('IncidentsOut.csv', 'w', newline=''))


    goodCols = {0, 1, 2, 3, 7, 8, 10, 13, 14, 15, 16, 18, 19, 20, 23, 24, 25}

    for cline in creader:
        new_line = [val for col, val in enumerate(cline) if col in goodCols]
        cwriter.writerow(new_line)



if __name__ == '__main__':
    main()
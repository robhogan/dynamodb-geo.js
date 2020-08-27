import csv
def main():
    import csv
    creader = csv.reader(open('IncidentsOut.csv', newline=''))
    cwriter = csv.writer(open('IncidentsOut2.csv', 'w', newline=''))

    for cline in creader:
        if cline[15]:
            cwriter.writerow(cline)


if __name__ == '__main__':
    main()
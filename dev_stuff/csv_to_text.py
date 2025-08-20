
import csv
csv_file = './subtitle_words.csv'
txt_file = 'subwords.txt'
with open(txt_file, "w") as my_output_file:
    with open(csv_file, "r") as my_input_file:
        [ my_output_file.write(row[0] + '\n') for row in csv.reader(my_input_file)]
    my_output_file.close()
with open('./subwords.txt', 'r') as f:
    words = f.read().split('\n')
    four_words = [word for word in words if len(word) == 4]
print(four_words)

with open('./word_game/src/four_words.js', 'w') as f:
    f.write("const starting_words_easy = [\n")
    for word in four_words[:-1]:
        f.write(f"\"{word}\",\n")
    f.write(f"\"{words[-1]}\"]\n")
    f.write("\nexport default starting_words_easy;")
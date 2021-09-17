import requests
from bs4 import BeautifulSoup
import json


raga_list = []
page = requests.get("https://en.wikipedia.org/wiki/List_of_Janya_ragas")
soup = BeautifulSoup(page.content, 'html.parser')

ragas = soup.select('.wikitable tbody tr')
janya_of = 0

for item in ragas:
    
    try:
        raga = {}
        raga_name = item.find_all('td')[0].get_text()

        # Update Raga name, Arohanam, Avarohanam. Rgaa may be residing inside a <a> block or <i>
        if item.find_all('td')[0].find('a'):
            raga.update({"name": item.find_all('td')[0].find('a').get_text().split("(")[0]})
        elif item.find_all('td')[0].find('i'):
            raga.update({"name": item.find_all('td')[0].find('i').get_text().split("(")[0]})
        elif item.find_all('td')[0].find('b'):
            raga.update({"name": item.find_all('td')[0].find('b').get_text().split("(")[0]})
        else:
            raga.update({"name": item.find_all('td')[0].get_text().split("(")[0]})
        
        raga.update({"Arohanam": item.find_all('td')[1].get_text().replace("\xa0"," ")})
        raga.update({"Avarohanam": item.find_all('td')[2].get_text().replace("\xa0"," ").replace("\n","")})

        # code to find Janya number
        if item.find_all('td')[0].get_text()[0].isdigit():
            res = [int(i) for i in item.find_all('td')[0].get_text().split() if i.isdigit()]
            raga.update({"janaka": res[0]})
            raga.update({"janyaOf": "false"})
            janya_of = janya_of + 1
        else:
            raga.update({"janaka": "false"})
            raga.update({"janyaOf": janya_of})

        raga_list.append(raga)
    except:
        print("Something went wrong")
    # print(raga)
    
data = {}
data.update({"ragas": raga_list})
#print(json)

with open("Raga_Database.json", "w", encoding='utf-8') as jsonfile:
    json.dump(data, jsonfile, ensure_ascii=False)





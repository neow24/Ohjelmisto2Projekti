Kuinka saan projektin toimimaan???

Vilkaistaan ensin projektin isoa rakennetta.
Projektin alla on 2 osiota: 'python'-paketti ja 'web'-kansio.
'python' on siis 'Python Package' ja 'web' on 'Directory' PyCharmin kielellä.
Ideana on yllättäen että 'python' alle tulevat Python-koodit ja
kaikki web-jutut tulevat 'web' alle.

Projekti on esimerkki laajasta ns. Full-Stack projektista, eli
siinä on mukana tietokanta, sovelluslogiikka (Python) ja web-käyttöliittymä.
Jotta tällainen määrä erilaisia ohjelmistoja saadaan toimimaan yhdessä,
niin täytyyhän siinä tehdä vähän alkusäätöjä.

A) Tietokanta käyntiin
- esimerkki hyödyntää kurssilla ollutta 'Flight_game' tietokantaa.
- HUOM: avaa tiedosto StartPython.py ja etsi tietokannan käyttäjän tiedot (alkaen rivi 40).
- MUUTA em. tiedot sinun tietokantaan sopiviksi
- Huom2: ope on tyhmä. Valmiina olevat tunnukset (root/root) ovat juuri ne,
joita hakkerit kokeilevat ensimmäiseksi..
- käynnistä tietokanta koneessasi

B) Python-kirjastojen asentaminen
- avaa Pythonin kirjastojen asennus pikakuvakkesta tai ylävalikosta
'View - Tool Windows - Python Packages'
- asenna seuraavat kirjastot:
    - 'sql-connector-python' kirjasto
        - hakukenttään esimerkiksi 'connector' ja etsi em. kirjasto
        - HUOM: älä ota uusinta versiota, se ei todennäköisesti toimi
        - ope asensi version: 8.0.29
    - 'Flask' kirjasto
        - hakusana: 'Flask', asenna uusin versio
    - 'Flask-Cors' kirjasto
        - asenna uusin versio

C) Sovelluslogiikka käyntiin
- aja tiedosto 'StartPython.py' (python-paketissa)
- Flask-ohjelmisto (simuloi web-kehitintä) käynnistyy
    - ei pitäisi tulla virheitä loki-ikkunaan, joka avautui samalla
- 'web-palvelin' on nyt valmiina palvelemaan selaimelta tulevia pyyntöjä

D) Web-sovellus käyntiin
- avaa tiedosto 'Start.html' (web-kansio)
    - käynnistä oikeasta yläkulmasta haluamasi selalin
Nyt pitäisi sovellus toimia :)


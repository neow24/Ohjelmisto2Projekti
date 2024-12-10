from flask import Flask, Response, jsonify
from flask_cors import CORS
import mysql.connector
import json, time, uuid

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
lento_id = 0

kaikki_lennot = []

class Lento:
    def __init__(self, edellinen_kentta: str, kentan_nimi: str, kunnan_nimi: str, maan_nimi: str, lennon_nimi: str):
        self.edellinen_kentta = edellinen_kentta
        self.kentan_nimi = kentan_nimi
        self.kunnan_nimi = kunnan_nimi
        self.maan_nimi = maan_nimi
        self.lennon_nimi = lennon_nimi


@app.route('/uusiLento/<edellinen_kentta>/<kentan_nimi>/<kunnan_nimi>/<maan_nimi>')
def uusi_lento(edellinen_kentta, kentan_nimi, kunnan_nimi, maan_nimi):
    # Luodaan lennon yksilöllinen ID
    lennon_id = str(uuid.uuid4()).replace('-', '')[:8]

    # Muodostetaan lennon nimi, joka sisältää edellisen kentän, kunnan nimen ja lennon ID:n
    lennon_nimi = f'{edellinen_kentta}-{kunnan_nimi}-{lennon_id}'

    # Luodaan uusi Lento-olio annetuin tiedoin ja lisätään se kaikki_lennot-listaan
    lento = Lento(edellinen_kentta, kentan_nimi, kunnan_nimi, maan_nimi, lennon_nimi)
    kaikki_lennot.append(lento)

    # Palautetaan lennon tiedot JSON-muodossa
    return {
        'lennonNimi': lennon_nimi,
        'kentanNimi': kentan_nimi,
        'kunnanNimi': kunnan_nimi,
        'maanNimi': maan_nimi
    }, 201


@app.route('/haeKaikkiLennot')
def hae_kaikki_lennot():
    # Palautetaan kaikki tallennetut lennot listana JSON-muodossa
    return jsonify([{
        'lennonNimi': lento.lennon_nimi,
        'kentanNimi': lento.kentan_nimi,
        'kunnanNimi': lento.kunnan_nimi,
        'maanNimi': lento.maan_nimi,
        'edellinenKentta': lento.edellinen_kentta
    } for lento in kaikki_lennot]), 200


@app.route('/lenna')
def lenna():
    try:
        # Kerätään kaikkien lentojen kenttien nimet listaksi
        kenttien_nimet = [lento.kentan_nimi for lento in kaikki_lennot]

        # Tarkistetaan, että kenttien nimet eivät ole tyhjiä
        if not kenttien_nimet:
            return "Ei lentoja käsiteltävänä", 400

        # Luodaan paikkamerkit SQL-kyselyä varten (%s jokaiselle nimen kohteelle)
        paikkamerkit = ', '.join(['%s'] * len(kenttien_nimet))

        # SQL-kysely, joka hakee kenttien nimet ja tunnisteet (ident) "airport"-taulusta
        sql = (f"select name, ident from airport where name in ({paikkamerkit})")
        kursori.execute(sql, kenttien_nimet)

        # Muodostetaan sanakirja, jossa kentän nimi on avain ja ident on arvo
        kentta_kartta = {row[0]: row[1] for row in kursori.fetchall()}

        # Käydään läpi kaikki lennot ja päivitetään pelin sijainti vastaamaan viimeistä kenttää
        for lento in kaikki_lennot:
            # Haetaan kentän ident sanakirjasta
            airport_ident = kentta_kartta.get(lento.kentan_nimi)

            # Päivitetään pelin sijainti tietokannassa
            sql = ("update game set location = %s where id = 1")
            kursori.execute(sql, (airport_ident,))

        # Tyhjennetään kaikki_lennot-lista käsittelyn jälkeen
        kaikki_lennot.clear()
        return "Lennot käsitelty onnistuneesti", 200
    except Exception as e:
        print(f"Virhe reitillä /lenna: {e}")
        return "Sisäinen palvelinvirhe", 500

@app.route('/nykyinenSijainti')
def nykyinen_sijainti():
    sql = ("select airport.name, airport.municipality, country.name "
           "from airport "
           "join game on airport.ident = game.location "
           "join country on airport.iso_country = country.iso_country "
           "where airport.ident = game.location;")
    kursori.execute(sql)
    tulos = kursori.fetchall()

    print(sql)

    paluujson = json.dumps(tulos)
    print(paluujson)
    # palautetaan muutakin kuin json ja siksi tehdään Response olio joka sisältää statuksen ja nimetypen
    return Response(response=paluujson, status=200, mimetype='application/json')


@app.route('/maat/<kontinent>')
def maat(kontinent):
    sql = "select name from country where continent = %s"
    kursori.execute(sql,(kontinent,))
    tulos = kursori.fetchall()

    print(sql)

    paluujson = json.dumps(tulos)
    # palautetaan muutakin kuin json ja siksi tehdään Response olio joka sisältää statuksen ja nimetypen
    return Response(response=paluujson, status=200, mimetype="application/json")


@app.route('/kunnatMaasta/<maa>')
def kunnatMaasta(maa):
    sql = ("select distinct airport.municipality "
           "from airport, country "
           "where airport.iso_country = country.iso_country and country.name = %s "
           "order by airport.municipality")
    kursori.execute(sql,(maa,))
    tulos = kursori.fetchall()

    print(sql)

    paluujson = json.dumps(tulos)
    # palautetaan muutakin kuin json ja siksi tehdään Response olio joka sisältää statuksen ja nimetypen
    return Response(response=paluujson, status=200, mimetype="application/json")


@app.route('/kentatKunnasta/<kunta>')
def kentatKunnasta(kunta):
    sql = ("select name from airport where municipality = %s")
    kursori.execute(sql,(kunta,))
    tulos = kursori.fetchall()

    print(sql)

    paluujson = json.dumps(tulos)
    tilakoodi = 200
    # palautetaan muutakin kuin json ja siksi tehdään Response olio joka sisältää statuksen ja nimetypen
    return Response(response=paluujson, status=tilakoodi, mimetype="application/json")

try:
    yhteys = mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='flight_game',
        user='root',
        password='Lorem123',
        autocommit=True
    )
    kursori = yhteys.cursor()
    print('Tietokantayhteys toimii.')
except mysql.connector.Error as err:
    print(f'Virhe: {err}')
if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)

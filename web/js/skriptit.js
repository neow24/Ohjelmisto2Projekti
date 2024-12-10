'use strict';
// Muuttuja, joka estää uuden haun käynnistymisen, jos edellinen haku on kesken
let isFetching = false;
const lentoKenttahaku = document.getElementById('lentoKenttahaku');
const lennot = document.getElementById('lennot')
const lennotContainer = document.getElementById('lennotContainer');
async function haeMaat() {
  // Jos haku on jo käynnissä, ei tehdä mitään
  if (isFetching) return;
  // Merkitään, että haku on käynnissä
  isFetching = true;

  try {
    // Etsitään mahdollinen aiemmin luotu 'maat' -valikko ja poistetaan se
    let element = document.getElementById('maat');
    if (element) {
      element.remove(); // Poistetaan vanha valikko, jos sellainen on olemassa
    }

    // Haetaan valittu kontinentti dropdown-valikosta
    let kontinenterna = document.getElementById('kontinenterna');
    const valdKontinent = kontinenterna.options[kontinenterna.selectedIndex].value; // Haetaan valitun kontinentin arvo

    // Luodaan uusi valikko ('select') maita varten
    let maat = document.createElement('select');
    maat.id = 'maat'; // Annetaan valikolle id 'maat'

    // Haetaan maita valitun kontinentin perusteella palvelimelta
    const vastaus = await fetch(`http://localhost:3000/maat/${encodeURIComponent(valdKontinent)}`);
    const jsonMaat = await vastaus.json(); // Muutetaan palvelimelta saatu vastaus JSON-muotoon

    console.log(jsonMaat); // Logitaan JSON-tiedot konsoliin

    // Käydään läpi kaikki maat, jotka saimme palvelimelta
    jsonMaat.forEach((maa) => {
      // Luodaan uusi <option> elementti jokaista maata varten
      let option=document.createElement('option');
      option.value = maa[0]; // Määritetään optionin arvo
      option.textContent = maa[0]; // Määritetään optionin näkyvä teksti
      maat.appendChild(option);  // Lisätään uusi option valikkoon
    });

    // Lisätään uusi 'maat' -valikko HTML-sivulle
    maat.addEventListener('change', haeKunnat);
    lentoKenttahaku.appendChild(maat);

  } catch (error) {
    // Jos jossain menee pieleen, tulostetaan virheilmoitus
    console.log(error.message);
  } finally {
    // Kun haku on valmis (tai epäonnistunut), merkitään isFetching takaisin 'false':ksi
    console.log('asynchronous load complete');
    isFetching = false;  // Estetään uusien hakujen tekeminen, ennen kuin edellinen on valmis
    haeKunnat();
  }
}

async function haeKunnat() {
  // Jos haku on jo käynnissä, ei tehdä mitään
  if (isFetching) {
    console.log('isFetching = true');
    return;
  }
  console.log('isFetching = false');
  // Merkitään, että haku on käynnissä
  isFetching = true;

  try {
    // Etsitään mahdollinen aiemmin luotu 'kunnat' -valikko ja poistetaan se
    let element = document.getElementById('kunnat');
    if (element) {
      element.remove(); // Poistetaan vanha valikko, jos sellainen on olemassa
    }

    // Etsitään mahdollinen aiemmin luotu hakukenttä ja poistetaan se
    let element2 = document.getElementById('haku');
    if (element2) {
      element2.remove(); // Poistetaan vanha hakukenttä, jos sellainen on olemassa
    }

    // Haetaan valittu maa dropdown-valikosta
    let maat = document.getElementById('maat');
    const valittuMaa = maat.options[maat.selectedIndex].value; // Haetaan valitun maan arvo

    // Luodaan uusi hakukenttä (input) kuntia varten
    let haku = document.createElement('input');
    haku.type = 'text';  // Määritetään kenttä tekstityypiksi
    haku.id = 'haku';  // Annetaan kentälle id 'haku'
    haku.placeholder = 'Hae kuntia';  // Paikkamerkki hakukenttään

    // Luodaan uusi valikko ('select') kuntia varten
    let kunnat = document.createElement('select');
    kunnat.id = 'kunnat'; // Annetaan valikolle id 'kunnat'

    // Haetaan maita valitun kontinentin perusteella palvelimelta
    const vastaus = await fetch(`http://localhost:3000/kunnatMaasta/${encodeURIComponent(valittuMaa)}`);
    const jsonKunnat = await vastaus.json(); // Muutetaan palvelimelta saatu vastaus JSON-muotoon

    console.log(jsonKunnat); // Logitaan JSON-tiedot konsoliin

    // Käydään läpi kaikki kunnat, jotka saimme palvelimelta
    jsonKunnat.forEach((kunta) => {
      // Luodaan uusi <option> elementti jokaista kuntaa varten
      let option = document.createElement('option');
      if (kunta[0] !== ''){ // Varmistetaan, että kunta ei ole tyhjä
        option.value = kunta[0]; // Määritetään optionin arvo
        option.textContent = kunta[0]; // Määritetään optionin näkyvä teksti
        kunnat.appendChild(option);  // Lisätään uusi option valikkoon
      }
    });

    // Lisätään hakukenttä HTML-sivulle
    lentoKenttahaku.appendChild(haku);

    // Lisätään hakutoiminnallisuus hakukenttään
    haku.addEventListener('keyup', function(){
      const hakuArvo = this.value.toLowerCase();  // Haetaan hakusana
      const vaihtoehdot = document.querySelectorAll('#kunnat option'); // Haetaan kaikki vaihtoehdot

      // Käydään läpi kaikki vaihtoehdot ja näytetään vain ne, jotka sisältävät hakusanan
      vaihtoehdot.forEach((vaihtoehto) => {
        if (vaihtoehto.textContent.toLowerCase().includes(hakuArvo)) {
          vaihtoehto.style.display = '';  // Näytetään vaihtoehto
        } else {
          vaihtoehto.style.display = 'none';  // Piilotetaan vaihtoehto
        }
      });
    });

    // Lisätään uusi 'kunnat' -valikko HTML-sivulle
    kunnat.addEventListener('change', haeKentat);
    lentoKenttahaku.appendChild(kunnat);

  } catch (error) {
    // Jos jossain menee pieleen, tulostetaan virheilmoitus
    console.log(error.message);
  } finally {
    // Kun haku on valmis (tai epäonnistunut), merkitään isFetching takaisin 'false':ksi
    console.log('asynchronous load complete');
    // Merkitään, että haku on valmis
    isFetching = false;
    haeKentat();
  }
}

async function haeKentat(){
  // Jos haku on jo käynnissä, ei tehdä mitään
  if (isFetching) {
    console.log('isFetching = true');
    return;
  }
  console.log('isFetching = false');
  // Merkitään, että haku on käynnissä
  isFetching = true;

  try {
    // Etsitään mahdollinen aiemmin luotu 'kentat' -valikko ja poistetaan se
    let element = document.getElementById('kentat');
    if (element) {
      element.remove(); // Poistetaan vanha valikko, jos sellainen on olemassa
    }

    // Etsitään mahdollinen aiemmin luotu painike ja poistetaan se
    let element2 = document.getElementById('lisaaLentoPainike');
    if (element2) {
      element2.remove(); // Poistetaan vanha painike, jos sellainen on olemassa
    }

    // Haetaan valittu kunta dropdown-valikosta
    let kunnat = document.getElementById('kunnat');
    const valittuKunta = kunnat.options[kunnat.selectedIndex].value; // Haetaan valitun kunnan arvo

    // Luodaan uusi valikko ('select') kenttiä varten
    let kentat = document.createElement('select');
    kentat.id = 'kentat'; // Annetaan valikolle id 'kentat'

    // Haetaan kenttiä valitun kunnan perusteella palvelimelta
    const vastaus = await fetch(`http://localhost:3000/kentatKunnasta/${encodeURIComponent(valittuKunta)}`);
    const jsonKentat = await vastaus.json(); // Muutetaan palvelimelta saatu vastaus JSON-muotoon

    console.log(jsonKentat); // Logitaan JSON-tiedot konsoliin

    // Käydään läpi kaikki kentät, jotka saimme palvelimelta
    jsonKentat.forEach((kentta) => {
      // Luodaan uusi <option> elementti jokaista kenttää varten
      let option=document.createElement('option');
      option.value = kentta[0]; // Määritetään optionin arvo
      option.textContent = kentta[0]; // Määritetään optionin näkyvä teksti
      kentat.appendChild(option);  // Lisätään uusi option valikkoon
    });

    // Lisätään uusi 'kentat' -valikko HTML-sivulle
    lentoKenttahaku.appendChild(kentat);

    // Luodaan uusi painikeelementti
    let lisaaLentoPainike = document.createElement('button');
    // Annetaan painikkeelle yksilöllinen ID
    lisaaLentoPainike.id = 'lisaaLentoPainike';
    // Määritetään painikkeen tekstiksi "lisaa Lento"
    lisaaLentoPainike.textContent = 'Lisää lento';
    // Lisätään tapahtumakuuntelija painikkeelle, joka suorittaa lisaaLento-funktion, kun painiketta klikataan
    lisaaLentoPainike.addEventListener('click', lisaaLento);
    // Lisätään painike DOM:iin 'lentoKenttahaku'-elementin lapsena
    lentoKenttahaku.appendChild(lisaaLentoPainike);

  } catch (error) {
    // Jos jossain menee pieleen, tulostetaan virheilmoitus
    console.log(error.message);
  } finally {
    // Kun haku on valmis (tai epäonnistunut), merkitään isFetching takaisin 'false':ksi
    console.log('asynchronous load complete');
    // Merkitään, että haku on valmis
    isFetching = false;
  }
}

async function lisaaLento() {
  // Jos haku on jo käynnissä, ei tehdä mitään
  if (isFetching) {
    console.log('isFetching = true');
    return;
  }
  console.log('isFetching = false');
  // Merkitään, että haku on käynnissä
  isFetching = true;

  try {
    // Haetaan valittu maa dropdown-valikosta
    let maat = document.getElementById('maat');
    const valittuMaa = maat.options[maat.selectedIndex].value; // Haetaan valitun maan arvo

    // Haetaan valittu kunta dropdown-valikosta
    let kunnat = document.getElementById('kunnat');
    const valittuKunta = kunnat.options[kunnat.selectedIndex].value; // Haetaan valitun kunnan arvo

    // Haetaan valittu kenttä dropdown-valikosta
    let kentat = document.getElementById('kentat');
    const valittuKentta = kentat.options[kentat.selectedIndex].value; // Haetaan valitun kentän arvo

    // Haetaan kaikki lennot palvelimelta
    let vastaus = await fetch(`http://localhost:3000/haeKaikkiLennot`);
    let data = await vastaus.json();

    // Tarkistetaan, onko lentoja jo olemassa
    if (Array.isArray(data) && data.length === 0) {
      // Jos lentoja ei ole, haetaan nykyinen sijainti palvelimelta
      vastaus = await fetch(`http://localhost:3000/nykyinenSijainti`);
      data = await vastaus.json(); // Muutetaan palvelimelta saatu vastaus JSON-muotoon
      console.log(data.map(row => row[1])); // Logataan nykyisen sijainnin kunnan nimi
      console.log(`Nykyinen sijainti: ${data}`);
      // Asetetaan edellinen kenttä nykyiseksi sijainniksi
      var edellinenKentta = data.length > 0 ? data[0][1] : '';
    } else {
      // Jos lentoja on, käytetään viimeisen lennon kenttää edelliseksi kentäksi
      var edellinenKentta = data[data.length - 1].kunnanNimi;
    }

    // Lisätään uusi lento palvelimen kautta
    vastaus = await fetch(
      `http://localhost:3000/uusiLento/${encodeURIComponent(edellinenKentta)}/${encodeURIComponent(valittuKentta)}/${encodeURIComponent(valittuKunta)}/${encodeURIComponent(valittuMaa)}`
    ); // Lähetetään pyyntö palvelimelle uuden lennon luomiseksi


    data = await vastaus.json(); // Muutetaan palvelimelta saatu vastaus JSON-muotoon
    console.log(data); // Logataan JSON-tiedot konsoliin

    // Lisätään uusi lento näkyviin sivustolle
    let lento = document.createElement('div');
    lento.textContent = `Lento ${data.lennonNimi} (Päämäärä: ${data.kentanNimi}, ${data.kunnanNimi}, ${data.maanNimi})`;
    lennot.appendChild(lento);

    // Tarkistetaan, ettei "Lennä"-painiketta ole jo olemassa
    if (!document.querySelector('#painike')) {
      // Jos painike ei ole olemassa, luodaan uusi painike
      const painike = document.createElement('button'); // Luodaan uusi painike-elementti
      painike.id = 'painike'; // Asetetaan painikkeelle yksilöllinen ID
      painike.textContent = 'Lennä'; // Määritellään painikkeen näkyvä teksti
      painike.addEventListener('click', lenna); // Lisää tapahtumakuuntelija, joka käynnistää lenna-funktion painiketta painettaessa
      lennotContainer.appendChild(painike); // Lisää painike HTML-rakenteeseen, jotta se näkyy käyttäjälle
    }

  } catch (error) {
    // Jos jossain menee pieleen, tulostetaan virheilmoitus
    console.log(error.message);
  } finally {
    console.log('asynchronous load complete');
    // Merkitään, että haku on valmis
    isFetching = false;
  }
}

async function lenna() {
  // Jos haku on jo käynnissä, ei tehdä mitään
  if (isFetching) {
    console.log('isFetching = true');
    return;  // Lopetetaan funktio, jos haku on jo käynnissä
  }
  console.log('isFetching = false');

  // Merkitään, että haku on käynnissä
  isFetching = true;

  try {
    // Suoritetaan GET-pyyntö palvelimen '/lenna' reitille
    // Tämä pyyntö päivittää pelin sijainnin lentojen mukaan
    await fetch(`http://localhost:3000/lenna`);

  } catch (error) {
    // Jos jossain menee pieleen (esimerkiksi verkko- tai palvelinvirhe), tulostetaan virheilmoitus
    console.log(error.message);
  } finally {
    console.log('asynchronous load complete');

    // Merkitään, että haku on valmis
    isFetching = false;

    // Poistetaan kaikki lapset "lennot"-elementistä (tyhjennetään sen sisältö)
    while (lennot.firstChild) {
      lennot.removeChild(lennot.firstChild);
    }

    // Poistetaan viimeinen lapsi "lennotContainer"-elementistä, jos se on olemassa
    lennotContainer.removeChild(lennotContainer.lastChild);

    // Kutsutaan funktiota nykyinenSijainti, joka päivittää nykyisen sijainnin UI:ssa
    nykyinenSijainti();
  }
}


async function nykyinenSijainti() {
  try {
    // Haetaan HTML-elementti, johon sijaintitiedot näytetään
    let sijainti = document.getElementById('sijainti');

    // Tehdään pyyntö palvelimelle nykyisen sijainnin hakemiseksi
    const vastaus = await fetch(`http://localhost:3000/nykyinenSijainti`);
    const data = await vastaus.json(); // Muutetaan palvelimelta saatu vastaus JSON-muotoon

    // Muotoillaan data yhdistämällä mahdollisesti sisäkkäiset taulukot yhdeksi merkkijonoksi
    const formattedData = data
        .flat() // Poistetaan mahdolliset sisäkkäiset taulukot
        .join(', '); // Lisätään pilkku ja välilyönti elementtien väliin

    // Logataan muokatut tiedot
    console.log(`Nykyinen sijainti: ${formattedData}`);
    // Näytetään nykyinen sijainti HTML-elementissä
    sijainti.textContent = `Nykyinen sijainti: ${formattedData}`;

  } catch (error) {
    // Jos jossain menee pieleen, tulostetaan virheilmoitus
    console.log(error.message);
  } finally {
    console.log('asynchronous load complete');
    haeMaat();
  }
}

// Pääohjelman ensimmäinen rivi
document.getElementById('kontinenterna').addEventListener('change', haeMaat);
nykyinenSijainti();

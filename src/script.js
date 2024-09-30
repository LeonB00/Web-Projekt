const openAI_apiKey = ''; // Hier die API-Schlüssel einfügen
const pixaby_apiKey = '';

// Suche ausführen
async function searchDestinations() {
  document.getElementById("destinationCard").classList.add("opacity-0"); //destinationCards ausblenden, falls bereits ergebnisse angezeigt werden

  document.getElementById("loader").classList.remove("hidden"); // Loader einblenden

  const prompt = document.getElementById('userInput').value;
  await callGPT35Turbo(prompt);

  let destinationsList = responseDestinations.split("; "); // Aufteilen der GPT Antwort in einzelne Arrays, jeweils mit einem Ort und zugehörigem Land

  await generateDestinationCards(destinationsList);
}

async function callGPT35Turbo(prompt) {
  const url = 'https://api.openai.com/v1/chat/completions';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openAI_apiKey}`
  };

  const data = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: 'Nenne 6 Urlaubsorte nach folgenden Kriterien: ' + prompt + ' Gib das Ergebnis in folgenden Format zurück und verzichte auf sonstige Zeichen in deiner Antwort wie zb Aufzählungen: "Ort, ISO 3166-1 Alpha-2 Länder-Code; Ort, ISO 3166-1 Alpha-2 Länder-Code; ..."' }],
    max_tokens: 100 // Anzahl der Tokens, beschränkt auf 100 pro Anfrage
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    const result = await response.json();
    responseDestinations = result.choices[0].message.content;
    
  } catch (error) {
    console.error('Fehler:', error);
  }

  return responseDestinations
}

async function generateDestinationCards(destinationsList) {

  // Die einzelnen Werte aus der GPT Antwort den jeweiligen Variablen zuweisen 
  let destination1 = destinationsList[0].split(", ");
  let ort1 = destination1[0];
  let land1 = destination1[1];
  let destination2 = destinationsList[1].split(", ");
  let ort2 = destination2[0];
  let land2 = destination2[1];
  let destination3 = destinationsList[2].split(", ");
  let ort3 = destination3[0];
  let land3 = destination3[1];
  let destination4 = destinationsList[3].split(", ");
  let ort4 = destination4[0];
  let land4 = destination4[1];
  let destination5 = destinationsList[4].split(", ");
  let ort5 = destination5[0];
  let land5 = destination5[1];
  let destination6 = destinationsList[5].split(", ");
  let ort6 = destination6[0];
  let land6 = destination6[1];

  // Text in html anzeigen lassen
  document.getElementById("ort1").textContent = ort1;
  document.getElementById("ort2").textContent = ort2;
  document.getElementById("ort3").textContent = ort3;
  document.getElementById("ort4").textContent = ort4;
  document.getElementById("ort5").textContent = ort5;
  document.getElementById("ort6").textContent = ort6;

  // Bild zum Ort von der API beziehen und in html anzeigen lassen
  document.getElementById("ort1_img").src = await getPictureForOrt(ort1);
  document.getElementById("ort2_img").src = await getPictureForOrt(ort2);
  document.getElementById("ort3_img").src = await getPictureForOrt(ort3);
  document.getElementById("ort4_img").src = await getPictureForOrt(ort4);
  document.getElementById("ort5_img").src = await getPictureForOrt(ort5);
  document.getElementById("ort6_img").src = await getPictureForOrt(ort6);

  // Bild der Flagge zum jeweiligen Land beziehen und in html anzeigen lassen
  document.getElementById("land1_img").src = await getFlagForCountry(land1);
  document.getElementById("land2_img").src = await getFlagForCountry(land2);
  document.getElementById("land3_img").src = await getFlagForCountry(land3);
  document.getElementById("land4_img").src = await getFlagForCountry(land4);
  document.getElementById("land5_img").src = await getFlagForCountry(land5);
  document.getElementById("land6_img").src = await getFlagForCountry(land6);

  document.getElementById("loader").classList.add("hidden"); // loader ausblenden

  document.getElementById("destinationCard").classList.remove("opacity-0"); // destinationCards einblenden
}

async function getPictureForOrt(ort) {
  const URL = `https://pixabay.com/api/?key=${pixaby_apiKey}&q=${encodeURIComponent(ort)}&image_type=photo`;

  try {
    const response = await fetch(URL);  // Anfrage an die API senden
    const data = await response.json();  // Antwort in JSON umwandeln

    if (data.totalHits > 0) {
      var imageURL = data.hits[0].largeImageURL;
    } else {
      console.log('No hits');
    }
  } catch (error) {
    console.error('Fehler bei der API-Anfrage:', error);
  }
  return imageURL
}

async function getFlagForCountry(land) {
  land = land.toLowerCase()
  var flagURL = `https://flagcdn.com/56x42/${land}.png` // ISO Länderkürzel von GPT in den Link einsetzen
  return flagURL
}



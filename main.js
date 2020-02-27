console.log("JS file loaded...");

function handleSubmit() {
  $("#parks-form").on("submit", e => {
    e.preventDefault();
    const searchQuery = $("#parks").val();
    parseSearchQuery(searchQuery);
  });
}



function displayData(parksData) {
  $("#parks-container").html("");
  return parksData.data.map(park => {
    const city = park.addresses[0].city;
    const state = park.addresses[0].stateCode;
    const address1 = park.addresses[0].line1;
    const address2 = park.addresses[0].line2;
    const postalCode = park.addresses[0].postalCode;
    $("#error-logs").html("");
    $("#parks-container").append(`
      <h2>${park.name}</h2>
      <fieldset class="address">
      <legend>Address:</legend>
      <p>${address1}</p>
      <p>${address2}</p>
      <p>${city}, ${state} ${postalCode}</p>
      </fieldset>
      <p>${park.description}</p>
      <a href='${park.url}' target='_blank'>Park Website</a>
      <hr>
    `);
  });
}

function parseSearchQuery(searchQuery) {
  if (searchQuery.length === 2) {
    findNationalParks(searchQuery);
  } else {
    const query = searchQuery.split(/\W/);
    const parsedQuery = query
      .map(stateCode => {
        if (stateCode.length !== 2) {
          $("#error-logs").html("<h3>Please put in valid state code(s)</h3>");
          return -1;
        } else {
          return stateCode;
        }
      })
      .join(",");
    findNationalParks(parsedQuery);
  }
}

function findNationalParks(searchQuery) {
  const limit = $("#search-num").val();
  const apiKey = "HIuGKua2buFDaozBbv8dz8ItSMnT5HOQ3IfEaGkV";
  const url = "https://developer.nps.gov/api/v1/parks";
  const fetchUrl = `${url}?stateCode=${searchQuery}&limit=${limit}&api_key=${apiKey}&fields=addresses`;
  fetch(fetchUrl)
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.statusText);
      }
    })
    .then(data => displayData(data))
    .catch(err => {
      $("#error-logs").text("something went wrong!");
    });
}

(() => {
  handleSubmit();
})();

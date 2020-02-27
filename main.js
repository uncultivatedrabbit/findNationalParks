console.log("JS file loaded...");
// listens for a submit on the form submit button, then passes search query to the parse function
function handleSubmit() {
  $("#parks-form").on("submit", e => {
    e.preventDefault();
    const searchQuery = $("#parks").val();
    parseSearchQuery(searchQuery);
  });
}


// maps over the JSON data and renders a container to include all the data 
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

//verifies the search query is a valid 2 letter (or series of two letter) state codes. 
// the parser can solve state codes entered by any non alphabetic character or space
// then passes the confirmed query to the findNationalParks function
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

// calls the fetch function using parameters located on the nps.gov API website
// then passes JSON data to the displayData function 
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

// IFFE that begins the handleSubmit event listener on DOM load
(() => {
  handleSubmit();
})();

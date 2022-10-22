
const axios = window.axios;
const handlebars = window.Handlebars;

const output = document.getElementById('recommendations-output')
const button = document.getElementById('submitButton')

const enableButton = () => {
  button.disabled = false;
  button.value = "Get recommendations"
}

const disableButton = () => {
  button.disabled = true;
  button.value = "Loading..."
}


const submitForm = async (event) => {
 try {
  disableButton() ;
  event.preventDefault();
  const {elements} = event.target;
  const track = elements.track.value;
  const artist = elements.artist.value;

  let result;

  try{
    result = await axios.post('/recommendations', { track, artist })
    console.log(result);
  } catch(err) {
      return alert(err.message);
  }

  const recommendations = result.data.tracks;

  const topThreeRecs = recommendations.slice(0, 3);

  const template = handlebars.compile(templateRaw);

  const html = template({track, topThreeRecs});

  output.innerHTML = html;
 } catch(err) {
  console.error(err)
 }finally {
  enableButton()
 }

}


const templateRaw = `
<h3>Discover new tunes!</h3>
<p>If you like "{{track}}", you'll love:</p>
<ul>
  {{#each topThreeRecs}}
  <li>{{name}} - <a href="{{external_urls.spotify}}">Play</a></li>
  {{/each}}
</ul> 
`
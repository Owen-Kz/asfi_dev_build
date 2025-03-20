
function updateUIWithData(PODCAST_ARRAY){
    
const PodcastContainer = document.getElementById("podcast_container");
    PodcastContainer.innerHTML = ""
    if(PODCAST_ARRAY.length > 0) { 

    PODCAST_ARRAY.forEach(podcastData =>{
        PodcastTitle = podcastData.podcast_title
        PodcastOwner = podcastData.podcast_owner
        podcastOwner_fullname = podcastData.podcast_owner_fullname
        PodcastDuration = podcastData.podcast_duration
        PodcastDate = podcastData.date_uploaded
        Podcast_File = podcastData.fileURL
        BufferString = podcastData.buffer
        

  // Create a unique identifier for this podcast
  var podcastIdentifier = '#'+BufferString + '_podcast';

    PodcastContainer.innerHTML+=`<div class="podcasts">
        <div class="left">
        <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="84" height="84" viewBox="0 0 84 84">
                <image id="podcast_logo" data-name="podcast logo" width="84" height="84" xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAQy0lEQVR4nOWdCbRN9R7Hv3GTsQy9MhTKUDJkCBlKqHhINEpIGuiFUq2mleeltSq96lUqFQ3vGSKhAe9RyErKTO9pQINZJRISxX3r8+//v2t39t7nnnPv3ude+q511r337H3P3v/v/v9/8/93jipXrpwKAapLaiSprqRa9u8/SaogqYSkMpIOSNoj6QdJuyXtkvS1pLWSVktaYf8uUBQUoZUltZfUVlI7SdV8Z+QN6yXNkzRX0hxJWzI9sEwSyoWultRDUgtJRXxnRItsSQslTZQ0XtLOTAwyE4TWl3SbpCvt8i0I7JM0SdLjkv4b5/XjJLSJpL9J6sx1fEcLBszamZKGSVoWxx3EseyqSpogaYmkLoWITNl76WzvbYK910hRtESJyFZhlqQhkqZIalzIiEzEUVYU9Ze03xJ8yHdWXj44oiVf0wr+Zr4jKaJChQpq1KiRTjvtNNWsWVM1atTQiSeeqFKlSpnXcccdp127dmnv3r3m9c033+iLL77QunXrtGbNGi1fvlzff/99Xi+/WFIva4LlC1EQyo2MklTadyQXNG3aVF26dFH79u1Vp04dHXWUf1IfPHhQu3fv1p49e1S6dGmVKVNGRYsW9Z2XnZ2tTz/9VHPmzNH06dO1dOlS814awMa9SdK4giK0qNWag31HkuDkk0/WVVddpSuvvFKnnHJKzonMto8++kifffaZmXH8vWXLFv3888++DytevLgqV65sZnGtWrXMwzj77LPN3w5fffWVJk2apFdffVUbN270fUYSjLSi62D4KeHIK6HFrVDv7jsSApbxLbfcoiuuuEJHH320mT0ffvihpkyZolmzZhny8gtI7tChgy699FK1aNHCzPhffvlFr732mp588kkjHlLENEk9JfmfZi7IC6FlJb0hqY3vSABOOukkDR061AyySJEi2r59u1588UUze77+Oj5PsXr16mYVXHfddTr++ON16NAh8/AeeOABbdq0yXd+AOZL6mZd3ZSRLqHlrFvX0HckAVlZWRowYIDuueceYUmgREaOHKlXXnlFP/30k+/8uFCyZEn17dtXN998sypVqmREyIMPPqjnnntOv/76a25XXWld45S9rHQIPU7SLEnNfUcSgGx84YUX1KRJEzOAp556Sk888USgPMwU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"/>
              </svg>
        </div>
        <div class="info">
            <div class="bud upload_title"><b>${PodcastTitle }</b></div>
            <div class="bud upload_name">${podcastOwner_fullname}</div>
        </div>
        </div>

        <!-- SOUND WAVE  -->
        <div class="wave_form" id="${BufferString}_podcast" ></div>
        <!-- END SOUND WAVE  -->


        <div class="actions">
            <div class="time_span">
                <!-- <i class="fa fa-clock"></i> -->
                <i class="ti-alarm-clock"></i>
                <!-- <div class="reader">${PodcastDuration}</div> -->
                <div class="reader" id="${PodcastOwner}_duration"></div>
            </div>
            <div class="buttons play">
                <a href="/podcasts/${BufferString}/${PodcastOwner}" id="${PodcastOwner}_href"> <i class="fas fa-play" id="${PodcastOwner}_ctrl"></i></a></div>
            <div class="buttons download">
            <a id="${BufferString}_dload"><i class="fa fa-download"></i></a></div>
        </div>
    </div>`


    var PLAYBUTTON_ID = `${PodcastOwner}_ctrl`
    var PLAYBUTTON_ID_HREF = `${PodcastOwner}_href`
    var OwnerID = `#`+BufferString


    var Owner = document.getElementById(OwnerID)
    var playbutton = document.getElementById(PLAYBUTTON_ID)
    var DownloadBTN = document.getElementById(`${BufferString}_dload`)
    var FILE_NAME = `${BufferString}`
    var DurationSpan = document.getElementById(`${PodcastOwner}_duration`)
    var FILE_URL = `${Podcast_File}`;

  var wavesurfer = WaveSurfer.create({
      container: podcastIdentifier,
      waveColor: 'rgb(244, 199, 255)',
      progressColor: 'rgb(97, 7, 133)',
      barWidth: 4,
      responsive:true,
      height: 30,
      barRadius:4,
      scrollParent: true,
      hideScrollbar: true
    })

    wavesurfer.load(FILE_URL)
    wavesurfer.backend.getDuration()


    DownloadBTN.setAttribute("href", '/podcasts/download/'+FILE_NAME)  



   

     }) } else { 
        PodcastContainer.innerHTML =`
        <div class="no_content_message">
            <svg class="icon icon-no_sim"><use xlink:href="#icon-no_sim"></use>
          
              <symbol id="icon-no_sim" viewBox="0 0 24 24">
                  <path d="M3.656 3.891l17.484 17.438-1.313 1.313-1.875-1.922q-0.563 0.281-0.938 0.281h-10.031q-0.797 0-1.383-0.609t-0.586-1.406v-11.203l-2.625-2.625zM18.984 5.016v11.672l-11.344-11.344 2.344-2.344h7.031q0.797 0 1.383 0.609t0.586 1.406z"></path>
          </symbol>
      </svg>              
              <span class="text">No podcast to display yet</span>
          </div>`
        }
    }
  
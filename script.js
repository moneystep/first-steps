```javascript
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://tfhtaqdbqfmuntwdszzj.supabase.co'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmaHRhcWRicWZtd2RzenpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MTc1MDYsImV4cCI6MjA5NDE5MzUwNn0.eWluoqyPr74jpa7yhMAEwPru7hsTIr7sk44CAsPWNC8'

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

const form = document.getElementById('waitlist-form')
const steppersCountElement = document.getElementById('steppers-count')
const successMessage = document.getElementById('success-message')


/* =========================
   STEPPER COUNTER
========================= */

async function updateCounter() {

  const { count, error } = await supabase
    .from('waitlist')
    .select('*', {
      count: 'exact',
      head: true
    })

  if (error) {
    console.error(error)
    return
  }

  steppersCountElement.textContent = count || 0
}

updateCounter()


/* =========================
   FORM SUBMISSION
========================= */

form.addEventListener('submit', async (e) => {

  e.preventDefault()

  const formData = new FormData(form)

  const name = formData.get('name')
  const email = formData.get('email')
  const city = formData.get('city')
  const state = formData.get('state')
  const phone = formData.get('phone')
  const social = formData.get('social')
  const platform = formData.get('platform')
  const identity = formData.get('identity')

  const { error } = await supabase
    .from('waitlist')
    .insert([
      {
        name,
        email,
        city,
        state,
        phone,
        social,
        platform,
        identity
      }
    ])

  if (error) {

    console.error(error)

    successMessage.textContent =
      'Something went wrong. Please try again.'

    return
  }

  successMessage.innerHTML = `
    You secured your spot.
    <br><br>
    Keep an eye on your inbox. We'll email instructions from hello@moneystep.app closer to the challenge start date.
  `

  form.reset()

  updateCounter()

})


/* =========================
   LEADERBOARD MODAL
========================= */

const leaderboardLink = document.getElementById('leaderboard-link')
const leaderboardLinkFaq = document.getElementById('leaderboard-link-faq')

const leaderboardModal = document.getElementById('leaderboard-modal')
const modalClose = document.querySelector('.modal-close')


function openLeaderboard(e) {

  e.preventDefault()

  leaderboardModal.classList.add('show')
}


leaderboardLink.addEventListener('click', openLeaderboard)

leaderboardLinkFaq.addEventListener('click', openLeaderboard)


modalClose.addEventListener('click', () => {

  leaderboardModal.classList.remove('show')

})


leaderboardModal.addEventListener('click', (e) => {

  if (e.target === leaderboardModal) {

    leaderboardModal.classList.remove('show')

  }

})
```

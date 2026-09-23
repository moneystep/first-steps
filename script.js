import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://tfhtaqdbqfmuntwdszzj.supabase.co'

const SUPABASE_ANON_KEY = 'sb_publishable_YIQiTPe7aSLMp2AOKs1eyQ_IxnKvTYm'

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

const form = document.getElementById('waitlist-form')
const steppersCountElement = document.getElementById('steppers-count')
const steppersWrapper = document.getElementById('steppers-wrapper')
const successMessage = document.getElementById('success-message')

// Signup counter stays hidden until this many people have joined.
const SHOW_STEPPERS_AT = 110


/* =========================
   STEPPER COUNTER
========================= */

async function updateCounter() {

  const { count, error } = await supabase
    .from('launch_waitlist')
    .select('*', {
      count: 'exact',
      head: true
    })

  if (error) {
    console.error('Counter error:', error)
    return
  }

  const total = count || 0

  steppersCountElement.textContent = total

  if (total >= SHOW_STEPPERS_AT) {
    steppersWrapper.hidden = false
  }
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
  const state = formData.get('state')
  const phone = formData.get('phone')
  const social = formData.get('social')
  const platform = formData.get('platform')

  const { error } = await supabase
    .from('launch_waitlist')
    .insert([
      {
        name,
        email,
        state,
        phone,
        social,
        platform
      }
    ])

  if (error) {

    console.error('Supabase error:', error)

    successMessage.textContent =
      'Something went wrong. Please try again.'

    return
  }

  successMessage.innerHTML = `
    You're on the list.
    <br><br>
    We'll keep you updated as Moneystep gets closer to launch.
  `

  form.reset()

  updateCounter()

})


/* =========================
   LEADERBOARD MODAL
========================= */

const leaderboardLinks = document.querySelectorAll('.leaderboard-link')
const leaderboardModal = document.getElementById('leaderboard-modal')
const modalClose = document.querySelector('.modal-close')


function openLeaderboard(e) {

  e.preventDefault()

  leaderboardModal.classList.add('show')
}


leaderboardLinks.forEach((link) => {

  link.addEventListener('click', openLeaderboard)

})


modalClose.addEventListener('click', () => {

  leaderboardModal.classList.remove('show')

})


leaderboardModal.addEventListener('click', (e) => {

  if (e.target === leaderboardModal) {

    leaderboardModal.classList.remove('show')

  }

})


document.addEventListener('keydown', (e) => {

  if (e.key === 'Escape') {

    leaderboardModal.classList.remove('show')

  }

})
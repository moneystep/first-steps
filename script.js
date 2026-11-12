import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://tfhtaqdbqfmuntwdszzj.supabase.co'

const SUPABASE_ANON_KEY = 'sb_publishable_YIQiTPe7aSLMp2AOKs1eyQ_IxnKvTYm'

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

const form = document.getElementById('waitlist-form')
const submitButton = document.getElementById('submit-button')
const successMessage = document.getElementById('success-message')
const stateSelect = document.getElementById('state-select')
const countryInput = document.getElementById('country-input')

const SUBMIT_LABEL = 'Sign me up'


/* =========================
   NOTICE POPUP
========================= */

const noticeOverlay = document.getElementById('notice-overlay')
const noticeIcon = document.getElementById('notice-icon')
const noticeTitle = document.getElementById('notice-title')
const noticeBody = document.getElementById('notice-body')
const noticeEmail = document.getElementById('notice-email')
const noticeHint = document.getElementById('notice-hint')
const noticeClose = document.getElementById('notice-close')

function showNotice({ icon, title, body, email = '', hint = '' }) {
  noticeIcon.className = `fas ${icon}`
  noticeTitle.textContent = title
  noticeBody.textContent = body
  noticeEmail.textContent = email
  noticeHint.textContent = hint
  noticeOverlay.hidden = false
  noticeClose.focus()
}

function hideNotice() {
  noticeOverlay.hidden = true
}

noticeClose.addEventListener('click', hideNotice)


/* =========================
   OTHER COUNTRY FIELD
========================= */

function updateCountryField() {

  const isOther = stateSelect.value === 'OTHER'

  countryInput.hidden = !isOther
  countryInput.required = isOther

  if (isOther) {
    countryInput.focus()
  } else {
    countryInput.value = ''
  }
}

stateSelect.addEventListener('change', updateCountryField)


/* =========================
   FORM SUBMISSION
========================= */

form.addEventListener('submit', async (e) => {

  e.preventDefault()

  const formData = new FormData(form)

  // US picks store the two-letter code; "Other Country" stores the typed country.
  const state = formData.get('state') === 'OTHER'
    ? (formData.get('country') || '').trim()
    : formData.get('state')

  if (!state) {
    countryInput.focus()
    return
  }

  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    state,
    platform: formData.get('platform'),
    phone: formData.get('phone'),
    social: formData.get('social')
  }

  successMessage.textContent = ''
  submitButton.disabled = true
  submitButton.textContent = 'Sending...'

  const { data, error } = await supabase.functions.invoke('waitlist-signup', {
    body: payload
  })

  submitButton.disabled = false
  submitButton.textContent = SUBMIT_LABEL

  if (error || !data || !data.status) {

    console.error('Signup error:', error)

    successMessage.textContent =
      'Something went wrong. Please check your email address and try again.'

    return
  }

  form.reset()
  updateCountryField()

  if (data.status === 'already') {

    showNotice({
      icon: 'fa-circle-check',
      title: "You're already subscribed",
      body: 'This email is already confirmed. Nothing else to do.',
      email: data.email
    })

  } else if (data.status === 'queued') {

    showNotice({
      icon: 'fa-envelope-open-text',
      title: 'Check your email',
      body: "Your confirmation email is on its way and will arrive within 24 hours. You're not subscribed until you click the link inside.",
      email: data.email,
      hint: "Don't see it? Check your spam or promotions folder."
    })

  } else {

    showNotice({
      icon: 'fa-envelope-open-text',
      title: 'Check your email',
      body: "We just sent you a confirmation link. You're not subscribed until you click it.",
      email: data.email,
      hint: "Don't see it in a few minutes? Check your spam or promotions folder."
    })

  }

})


/* =========================
   EMAIL CONFIRMATION LINK
========================= */

async function handleConfirmLink() {

  const params = new URLSearchParams(window.location.search)
  const token = params.get('confirm')

  if (!token) return

  // Clean the token out of the address bar.
  window.history.replaceState({}, '', window.location.pathname)

  const { data, error } = await supabase.functions.invoke('waitlist-confirm', {
    body: { token }
  })

  if (error || !data) {

    showNotice({
      icon: 'fa-triangle-exclamation',
      title: 'Something went wrong',
      body: 'We could not confirm your email right now. Please try the link again in a minute.',
      hint: 'Still stuck? Email hello@moneystep.app'
    })

    return
  }

  if (data.status === 'confirmed') {

    showNotice({
      icon: 'fa-circle-check',
      title: "You're subscribed!",
      body: "Your email is confirmed. We'll keep you posted on new challenges and Moneystep news."
    })

  } else if (data.status === 'already') {

    showNotice({
      icon: 'fa-circle-check',
      title: 'Already confirmed',
      body: "You're already subscribed. Nothing else to do."
    })

  } else {

    showNotice({
      icon: 'fa-triangle-exclamation',
      title: 'Link not valid',
      body: 'This confirmation link is invalid or expired. Sign up again below and we will send a new one.'
    })

  }
}

handleConfirmLink()


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
    hideNotice()

  }

})
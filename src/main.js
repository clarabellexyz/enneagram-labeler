import { BrowserOAuthClient } from '@atproto/oauth-client-browser';
import { Agent } from '@atproto/api';

// ─── Data ───────────────────────────────────────────────────────────────────
const TYPES = [
  { n:1, name:'The Reformer',   color:'#c4a882', desc:'Principled, purposeful, self-controlled, and perfectionistic. Ones fear being corrupt or defective and desire to be good and have integrity.' },
  { n:2, name:'The Helper',     color:'#a882c4', desc:'Caring, interpersonal, demonstrative, and possessive. Twos fear being unloved and desire to feel loved and to express love for others.' },
  { n:3, name:'The Achiever',   color:'#82c4a8', desc:'Adaptable, excelling, driven, and image-conscious. Threes fear being worthless and desire to feel valuable and to be affirmed by others.' },
  { n:4, name:'The Individualist', color:'#c48282', desc:'Expressive, dramatic, self-absorbed, and temperamental. Fours fear having no identity and desire to find themselves and their significance.' },
  { n:5, name:'The Investigator', color:'#8299c4', desc:'Perceptive, innovative, secretive, and isolated. Fives fear being helpless or incapable and desire to be capable and competent.' },
  { n:6, name:'The Loyalist',   color:'#c4b882', desc:'Engaging, responsible, anxious, and suspicious. Sixes fear being without support and desire to have security and support.' },
  { n:7, name:'The Enthusiast', color:'#82c4c4', desc:'Spontaneous, versatile, scattered, and acquisitive. Sevens fear being trapped in pain and desire to be satisfied and content.' },
  { n:8, name:'The Challenger', color:'#c48299', desc:'Self-confident, decisive, willful, and confrontational. Eights fear being harmed or controlled and desire to protect themselves and be in control.' },
  { n:9, name:'The Peacemaker', color:'#a8c482', desc:'Receptive, reassuring, agreeable, and complacent. Nines fear loss and separation and desire to have inner stability and peace.' },
];

const SUBTYPES = { sp: 'SP', so: 'SO', sx: 'SX' };

// ─── Wing data ───────────────────────────────────────────────────────────────
const NUM_WORD = { 1:'one',2:'two',3:'three',4:'four',5:'five',6:'six',7:'seven',8:'eight',9:'nine' };
const WINGS = {
  1: [
    { w: 9, label: 'type-one-wing-nine', title: 'The Idealist', desc: 'More detached and philosophical. The 9-wing softens the One\'s rigidity with acceptance and a longing for inner peace.' },
    { w: 2, label: 'type-one-wing-two', title: 'The Advocate', desc: 'More warm and people-oriented. The 2-wing channels the One\'s principles into direct service and concern for others.' },
  ],
  2: [
    { w: 1, label: 'type-two-wing-one', title: 'The Servant', desc: 'More principled and self-controlled. The 1-wing gives the Two a strong sense of duty and refinement in their giving.' },
    { w: 3, label: 'type-two-wing-three', title: 'The Host', desc: 'More ambitious and image-conscious. The 3-wing adds charm and drive, making this subtype highly engaging and sociable.' },
  ],
  3: [
    { w: 2, label: 'type-three-wing-two', title: 'The Charmer', desc: 'More people-pleasing and interpersonal. The 2-wing makes the Three warmer, more relational, and attuned to others\' feelings.' },
    { w: 4, label: 'type-three-wing-four', title: 'The Professional', desc: 'More introspective and image-refined. The 4-wing gives the Three depth, artistic sensibility, and a desire for authenticity.' },
  ],
  4: [
    { w: 3, label: 'type-four-wing-three', title: 'The Aristocrat', desc: 'More extroverted and achievement-oriented. The 3-wing energizes the Four toward expression, performance, and external recognition.' },
    { w: 5, label: 'type-four-wing-five', title: 'The Bohemian', desc: 'More withdrawn and intellectual. The 5-wing deepens the Four\'s introspection, adding a reclusive, cerebral quality.' },
  ],
  5: [
    { w: 4, label: 'type-five-wing-four', title: 'The Iconoclast', desc: 'More individualistic and emotionally expressive. The 4-wing gives the Five creativity, aesthetic sensitivity, and deeper self-awareness.' },
    { w: 6, label: 'type-five-wing-six', title: 'The Problem Solver', desc: 'More loyal and socially engaged. The 6-wing anchors the Five in practical thinking, collaboration, and concern for systems.' },
  ],
  6: [
    { w: 5, label: 'type-six-wing-five', title: 'The Defender', desc: 'More private and independent. The 5-wing gives the Six greater self-reliance and analytical depth to manage anxiety.' },
    { w: 7, label: 'type-six-wing-seven', title: 'The Buddy', desc: 'More outgoing and optimistic. The 7-wing lightens the Six\'s anxiety, adding humor, enthusiasm, and a love of adventure.' },
  ],
  7: [
    { w: 6, label: 'type-seven-wing-six', title: 'The Entertainer', desc: 'More responsible and relationship-focused. The 6-wing grounds the Seven\'s enthusiasm with loyalty and a need for security.' },
    { w: 8, label: 'type-seven-wing-eight', title: 'The Realist', desc: 'More assertive and pragmatic. The 8-wing gives the Seven a bold, driven edge and a willingness to go after what they want.' },
  ],
  8: [
    { w: 7, label: 'type-eight-wing-seven', title: 'The Maverick', desc: 'More expansive and pleasure-seeking. The 7-wing makes the Eight more visionary, charismatic, and energetically restless.' },
    { w: 9, label: 'type-eight-wing-nine', title: 'The Bear', desc: 'More calm and receptive. The 9-wing softens the Eight\'s intensity with patience and a more measured approach to power.' },
  ],
  9: [
    { w: 8, label: 'type-nine-wing-eight', title: 'The Referee', desc: 'More assertive and energetic. The 8-wing gives the Nine greater confidence, decisiveness, and a stronger sense of presence.' },
    { w: 1, label: 'type-nine-wing-one', title: 'The Dreamer', desc: 'More principled and orderly. The 1-wing channels the Nine\'s acceptance into quiet idealism and a gentle moral compass.' },
  ],
};

// ─── Config ──────────────────────────────────────────────────────────────────
const LABELER_DID = 'did:plc:6k2b2myab3zpqivzvyym4cp5';
const LABELER_AUD = LABELER_DID + '#atproto_labeler';
const LXM = 'blue.enneagram.applyLabel';
const CLIENT_ID = 'https://enneagram.blue/client-metadata.json';
const BACKEND = 'https://label.enneagram.blue';
const SCOPE = `atproto rpc:${LXM}?aud=${LABELER_AUD}`;

// Capture the original sign-in button markup (incl. the Bluesky logo) so we can
// restore it after a spinner, without duplicating the SVG in JS.
const loginBtnEl = document.getElementById('login-btn');
const SIGNIN_BTN_HTML = loginBtnEl ? loginBtnEl.innerHTML : 'Sign in with Bluesky';

// ─── State ───────────────────────────────────────────────────────────────────
let oauthClient = null;
let agent = null;
let userDid = null;
let selectedType = null;
let selectedWing = null;
let selectedSubtype = null;

// ─── OAuth setup ──────────────────────────────────────────────────────────────
async function initOAuth() {
  const clientMetadata = await (await fetch(CLIENT_ID)).json();
  oauthClient = new BrowserOAuthClient({
    clientMetadata,
    handleResolver: 'https://bsky.social',
  });
  // init() completes a returning login redirect OR restores a saved session.
  const result = await oauthClient.init();
  if (result?.session) {
    await startSession(result.session);
  }
}

async function startSession(oauthSession) {
  agent = new Agent(oauthSession);
  userDid = agent.did || agent.accountDid;
  await loadProfile();
  showLabeler();
}

// Mint a short-lived token that ONLY works for this labeler. This is the single
// thing the login permission grants — the backend uses it to confirm who you are.
async function mintLabelerToken() {
  const { data } = await agent.com.atproto.server.getServiceAuth({
    aud: LABELER_AUD,
    lxm: LXM,
    exp: Math.floor(Date.now() / 1000) + 60,
  });
  return data.token;
}

// ─── Render types ────────────────────────────────────────────────────────────
function renderTypes() {
  const grid = document.getElementById('type-grid');
  grid.innerHTML = TYPES.map(t => `
    <button class="type-btn" id="type-${t.n}" onclick="selectType(${t.n})"
      style="--type-color:${t.color}">
      <span class="type-num">${t.n}</span>
      <span class="type-name">${t.name.replace('The ','')}</span>
    </button>
  `).join('');
}

// ─── Type selection ───────────────────────────────────────────────────────────
function selectType(n) {
  selectedType = n;
  selectedWing = null;
  selectedSubtype = null;

  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById(`type-${n}`).classList.add('selected');

  const t = TYPES.find(x => x.n === n);
  const desc = document.getElementById('type-description');
  desc.textContent = t.desc;
  desc.style.display = 'block';

  // Render wing options
  const wings = WINGS[n];
  const wgrid = document.getElementById('wing-grid');
  const wingColor = t.color;
  wgrid.innerHTML = wings.map(w => `
    <button class="subtype-btn" id="wing-${w.w}" onclick="selectWing(${w.w})" style="--type-color:${wingColor}">
      <span class="subtype-symbol" style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-style:italic;color:${wingColor}">${w.title}</span>
      <span class="subtype-name">${selectedType}w${w.w}</span>
    </button>
  `).join('');

  document.getElementById('wing-description').style.display = 'none';
  document.getElementById('wing-card').style.display = 'block';
  document.getElementById('subtype-card').style.display = 'none';
  document.getElementById('apply-card').style.display = 'block';

  updatePreview();
}

// ─── Wing selection ───────────────────────────────────────────────────────────
function selectWing(w) {
  selectedWing = w;
  selectedSubtype = null;

  document.querySelectorAll('#wing-grid .subtype-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById(`wing-${w}`).classList.add('selected');

  const wingData = WINGS[selectedType].find(x => x.w === w);
  const desc = document.getElementById('wing-description');
  desc.textContent = wingData.desc;
  desc.style.display = 'block';

  document.querySelectorAll('#subtype-card .subtype-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('subtype-card').style.display = 'block';
  document.getElementById('apply-card').style.display = 'block';

  updatePreview();
}

// ─── Skip functions ───────────────────────────────────────────────────────────
function skipWing() {
  selectedWing = null;
  selectedSubtype = null;
  document.getElementById('subtype-card').style.display = 'none';
  document.getElementById('apply-card').style.display = 'block';
  updatePreview();
}

function skipSubtype() {
  selectedSubtype = null;
  document.getElementById('apply-card').style.display = 'block';
  updatePreview();
}


function selectSubtype(sub) {
  selectedSubtype = sub;

  document.querySelectorAll('.subtype-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById(`sub-${sub}`).classList.add('selected');

  document.getElementById('apply-card').style.display = 'block';
  updatePreview();
}

// ─── Preview ──────────────────────────────────────────────────────────────────
function updatePreview() {
  const tag = document.getElementById('label-preview-tag');
  if (selectedType && selectedWing && selectedSubtype) {
    tag.textContent = `${selectedType}w${selectedWing} ${selectedSubtype.toUpperCase()}`;
  } else if (selectedType && selectedWing) {
    tag.textContent = `${selectedType}w${selectedWing}`;
  } else if (selectedType) {
    tag.textContent = `Type ${selectedType}`;
  } else {
    tag.textContent = '—';
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
async function login() {
  const identifier = document.getElementById('identifier').value.trim();
  const btn = document.getElementById('login-btn');
  const status = document.getElementById('auth-status');

  if (!identifier) {
    showStatus(status, 'error', 'Please enter your Bluesky handle.');
    return;
  }
  if (!oauthClient) {
    showStatus(status, 'error', 'Still starting up — please try again in a moment.');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Redirecting to Bluesky…';
  showStatus(status, 'info', 'Sending you to Bluesky to sign in…');

  try {
    // This redirects the browser to Bluesky's login page. On success the page
    // navigates away, so nothing after this line runs.
    await oauthClient.signIn(identifier, { scope: SCOPE });
  } catch (e) {
    showStatus(status, 'error', friendlyError(e));
    btn.disabled = false;
    btn.innerHTML = SIGNIN_BTN_HTML;
  }
}

async function loadProfile() {
  // Profiles are public — read it straight from the public AppView, no auth needed.
  try {
    const res = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(userDid)}`);
    const p = await res.json();
    document.getElementById('display-name').textContent = p.displayName || p.handle || 'Signed in';
    document.getElementById('handle-display').textContent = p.handle ? `@${p.handle}` : '';
    if (p.avatar) {
      document.getElementById('avatar-img').innerHTML = `<img src="${p.avatar}" alt="avatar" />`;
    }
  } catch (e) {
    document.getElementById('display-name').textContent = 'Signed in';
  }
}

function showLabeler() {
  document.getElementById('auth-section').classList.remove('active');
  document.getElementById('labeler-section').classList.add('active');
  renderTypes();
}

async function logout() {
  try {
    if (agent && typeof agent.signOut === 'function') await agent.signOut();
  } catch (e) { /* ignore */ }
  agent = null;
  userDid = null;
  selectedType = null;
  selectedWing = null;
  selectedSubtype = null;
  document.getElementById('auth-section').classList.add('active');
  document.getElementById('labeler-section').classList.remove('active');
  document.getElementById('identifier').value = '';
  document.getElementById('auth-status').className = 'status';
  const btn = document.getElementById('login-btn');
  btn.disabled = false;
  btn.innerHTML = SIGNIN_BTN_HTML;
}

// ─── Apply Label ──────────────────────────────────────────────────────────────
async function applyLabel() {
  if (!selectedType) return;

  const btn = document.getElementById('apply-btn');
  const status = document.getElementById('apply-status');

  // Build label value based on what was selected
  let labelVal;
  if (selectedType && selectedWing && selectedSubtype) {
    labelVal = `type-${NUM_WORD[selectedType]}-wing-${NUM_WORD[selectedWing]}-${selectedSubtype}`;
  } else if (selectedType && selectedWing) {
    labelVal = `type-${NUM_WORD[selectedType]}-wing-${NUM_WORD[selectedWing]}`;
  } else {
    labelVal = `type-${NUM_WORD[selectedType]}`;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Applying…';
  showStatus(status, 'info', 'Sending label to your profile…');

  try {
    const token = await mintLabelerToken();
    const res = await fetch(`${BACKEND}/apply-label`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ label: labelVal })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to apply label');

    const typeName = TYPES.find(t => t.n === selectedType)?.name;
    const wingData = selectedWing ? WINGS[selectedType].find(w => w.w === selectedWing) : null;
    const subLabel = selectedSubtype ? { sp: 'Self-Preservation', so: 'Social', sx: 'Sexual' }[selectedSubtype] : null;
    const labelDesc = [typeName, wingData?.label, subLabel].filter(Boolean).join(' · ');
    showStatus(status, 'success',
      `✓ Label applied: ${labelDesc}\n\nYour label "${labelVal}" has been applied to your profile. It may take a moment to appear.`
    );

  } catch (e) {
    showStatus(status, 'error', friendlyError(e));
  }

  btn.disabled = false;
  btn.innerHTML = 'Apply Label to Profile';
}

async function removeLabel() {
  const status = document.getElementById('apply-status');

  if (!agent) { return; }
  if (!confirm('Remove your Enneagram label from your profile?')) return;

  showStatus(status, 'info', 'Removing label…');

  try {
    const token = await mintLabelerToken();
    const res = await fetch(`${BACKEND}/remove-label`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to remove label');

    showStatus(status, 'success', '✓ Enneagram label removed from your profile.');
  } catch (e) {
    showStatus(status, 'error', friendlyError(e));
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function friendlyError(e) {
  const msg = (e && e.message) ? e.message : String(e);
  if (/scope|forbidden|permission|unauthor/i.test(msg)) {
    return `Error: ${msg}\n\nIf this keeps happening, your Bluesky server may not yet support this newer sign-in method. Most bsky.social accounts work fine.`;
  }
  return `Error: ${msg}`;
}

function showStatus(el, type, msg) {
  el.className = `status show ${type}`;
  el.style.whiteSpace = 'pre-line';
  el.textContent = msg;
}

// ─── Wire up inline onclick handlers + start ──────────────────────────────────
Object.assign(window, { login, logout, selectType, selectWing, skipWing, skipSubtype, selectSubtype, applyLabel, removeLabel });

document.getElementById('identifier')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') login();
});

initOAuth().catch(e => {
  console.error(e);
  const status = document.getElementById('auth-status');
  if (status) showStatus(status, 'error', 'Could not start sign-in. Please refresh the page.');
});

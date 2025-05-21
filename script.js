// 🔑 OpenRouter API Key
const OPENROUTER_API_KEY = "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";

const transcriptDiv = document.getElementById("transcript");
const responseDiv = document.getElementById("response");
const orb = document.getElementById("orb");
const status = document.getElementById("status");

// 🔁 Continuous listening mode
startListening();

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Your browser does not support voice input.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  status.innerText = "🎤 Elothna is listening...";
  orb.style.background = "radial-gradient(circle, #D4472A, #8B2E1D)";

  recognition.start();

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;
    status.innerText = "🎙️ Processing...";

    try {
      const { reflection, tags } = await getReflection(text);
      speak(reflection);
      adjustOrbColor(tags);

      // Append reflection log
      const separator = document.createElement("hr");
      const entry = document.createElement("div");
      entry.className = "entry";
      entry.innerHTML = `
        <p><strong>You:</strong> ${text}</p>
        <p><strong>Elothna:</strong> ✨ ${reflection}<br><em>${tags}</em></p>
      `;

      transcriptDiv.appendChild(separator);
      transcriptDiv.appendChild(entry);

    } catch (err) {
      responseDiv.innerText = "⚠️ Error generating reflection.";
      console.error("OpenRouter error:", err);
    }

    setTimeout(() => {
      startListening();
    }, 2500);
  };

  recognition.onerror = (event) => {
    status.innerText = "🎙️ Begin Reflection";
    transcriptDiv.innerText = "❌ Voice input error.";
    console.error("Speech recognition error:", event.error);
  };
}

// 🧐 Elothna's reasoning
async function getReflection(userText) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        {
          role: "system",
          content: `You are Elothna — a Socratic voice that helps the user pause, see clearly, and take one small step. You sound like the user’s best inner voice: warm, sharp, grounded.

Your mission is not to analyze endlessly or offer inspiration. You are here to help the user get unstuck through calm reflection and one small action — every time.

When the user speaks:
1. Reflect their emotional state or dilemma in 1 sentence or less.
2. Ask a clean, useful question that pushes their thinking forward.
3. If the user gives a vague, emotional, or tired input (e.g. “I’m tired” or “I don’t know”), do NOT expand or explain — simply ask a soft, binary question to ground them (e.g. “Want to rest — or figure out what’s behind that?”).

Keep each response to a maximum of 2 short sentences.

Tone and Behavior Guidelines:
- Your tone is calm, constructive, and respectfully curious — never motivational or robotic.
- You do not give monologues or advice unless asked.
- You do not mimic user language or dramatize emotion.
- You challenge false beliefs when necessary — kindly, factually, and briefly.
- You may interrupt spirals or unhelpful patterns with a grounded question or pause.
- You avoid all poetic phrasing and generic empathy (no “I understand you must feel…”).

Your behavior is based on active psychology and task reduction theory. You move people from overwhelm to one small, clear action.

Do not try to optimize, inspire, or motivate.
Help them move — by helping them think.`
        },
        {
          role: "user",
          content: userText
        }
      ],
      temperature: 0.8,
      max_tokens: 150
    })
  });

  const data = await response.json();
  if (!data.choices || !data.choices.length) {
    throw new Error("No choices returned");
  }

  const fullText = data.choices[0].message.content.trim();
  const [reflection, tagLine] = fullText.split("\nTags:");

  return {
    reflection: reflection.trim(),
    tags: tagLine ? "Tags: " + tagLine.trim() : "Tags: Not detected"
  };
}

// 🔉 Speak back
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  utterance.pitch = 1.1;
  utterance.volume = 0.9;

  const voices = speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.name.includes("Google UK English Female") || v.name.includes("Jenny"));
  if (preferredVoice) utterance.voice = preferredVoice;

  speechSynthesis.speak(utterance);
}

// 🔴 Mood-reactive orb colors
function adjustOrbColor(tags) {
  if (tags.includes("relief")) {
    orb.style.background = "radial-gradient(circle, #00BFA5, #00796B)"; // green
  } else if (tags.includes("doubt")) {
    orb.style.background = "radial-gradient(circle, #673AB7, #4527A0)"; // violet
  } else if (tags.includes("clarity")) {
    orb.style.background = "radial-gradient(circle, #FBC02D, #F57F17)"; // yellow
  } else {
    orb.style.background = "radial-gradient(circle, #D4472A, #8B2E1D)"; // fallback red
  }
}



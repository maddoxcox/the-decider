  import { useState } from "react";



  const VOICES = [
    "Drill Sergeant",
    "Chaotic Gremlin",
    "Wise Grandma",
    "Blunt Best Friend",
  ];

  function App() {
    const [options, setOptions] = useState([""]);
    const [mood, setMood] = useState("");
    const [timeAvailable, setTimeAvailable] = useState("");
    const [whoIsAround, setWhoIsAround] = useState("");
    const [voice, setVoice] = useState(VOICES[0]);
    const [verdict, setVerdict] = useState(null);
    const [loading, setLoading] = useState(false);

    const addOption = () => setOptions([...options, ""]);

    const updateOption = (index, value) => {
      const updated = [...options];
      updated[index] = value;
      setOptions(updated);
    };

    const removeOption = (index) => {
      if (options.length <= 1) return;
      setOptions(options.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const filledOptions = options.filter((o) => o.trim() !== "");
    if (filledOptions.length < 2) {
      alert("Give me at least 2 options to decide between!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          options: filledOptions,
          constraints: { mood, timeAvailable, whoIsAround },
          voice,
        }),
      });
      const data = await res.json();
      setVerdict(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong talking to the server.");
    } finally {
      setLoading(false);
    }
  };


    return (
      <div style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "sans-serif" }}>
        <h1>The Decider</h1>
        <p style={{ color: "#666", marginTop: -8 }}>
          Let AI cure your indecisiveness. This app takes your situation and chooses for you!
        </p>  
        <p style={{ color: "#666", marginTop: -8 }}>
          Options are the things you are choosing . . . e.g. tacos or pizza or sushi.
        </p>
        <p style={{ color: "#666", marginTop: -8 }}>
          Constraints are the context of your situation so that the AI can make a better decision
        </p>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Options</legend>
            {options.map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input
                  type="text"
                  value={opt}
                  placeholder={`Option ${i + 1}`}
                  onChange={(e) => updateOption(i, e.target.value)}
                  style={{ flex: 1 }}
                />
                {options.length > 1 && (
                  <button type="button" onClick={() => removeOption(i)}>✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addOption}>+ Add option</button>
          </fieldset>

          <fieldset style={{ marginTop: 16 }}>
            <legend>Constraints</legend>
            <input
              type="text"
              placeholder="Mood (e.g. lazy, adventurous)"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              style={{ display: "block", width: "100%", marginBottom: 8 }}
            />
            <input
              type="text"
              placeholder="Time available (e.g. 30 min, all day)"
              value={timeAvailable}
              onChange={(e) => setTimeAvailable(e.target.value)}
              style={{ display: "block", width: "100%", marginBottom: 8 }}
            />
            <input
              type="text"
              placeholder="Who's around (e.g. solo, with kids)"
              value={whoIsAround}
              onChange={(e) => setWhoIsAround(e.target.value)}
              style={{ display: "block", width: "100%", marginBottom: 8 }}
            />
          </fieldset>

          <fieldset style={{ marginTop: 16 }}>
            <legend>AI Voice</legend>
            <select value={voice} onChange={(e) => setVoice(e.target.value)}>
              {VOICES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </fieldset>

          <button type="submit" style={{ marginTop: 16, padding: "8px 24px" }}>
            Decide for me
          </button>
        </form>
        {loading && <p>Deciding...</p>}

        {verdict && (
          <div style={{ marginTop: 32, textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem" }}>{verdict.pick}</h2>
          <p style={{ fontStyle: "italic", fontSize: "1.1rem" }}>{verdict.defense}</p>
          </div>
      )}
      </div>
    );
  }

  export default App;
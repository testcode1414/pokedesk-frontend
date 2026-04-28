import { useState } from "react";
import { analyzePokemon } from "../services/api";

const TYPE_COLORS = {
  fire:"#FF6B35",water:"#4FC3F7",grass:"#66BB6A",electric:"#FFD54F",
  psychic:"#F48FB1",poison:"#AB47BC",normal:"#B0BEC5",flying:"#90CAF9",
  ice:"#80DEEA",dragon:"#7C4DFF",ghost:"#7E57C2",rock:"#BCAAA4",
  ground:"#D7CCC8",bug:"#AED581",steel:"#CFD8DC",dark:"#A1887F",
  fairy:"#F8BBD9",fighting:"#EF5350",
};

const STAT_LABELS = {
  hp:"HP",attack:"ATK",defense:"DEF",
  special_attack:"SP.ATK",special_defense:"SP.DEF",speed:"SPD"
};

function TypeBadge({ type }) {
  return (
    <span style={{
      padding:"3px 10px",borderRadius:50,fontSize:11,fontWeight:500,
      textTransform:"uppercase",letterSpacing:"0.5px",
      background:(TYPE_COLORS[type]||"#B0BEC5") + "22",
      color:TYPE_COLORS[type]||"#B0BEC5",
      border:"1px solid " + (TYPE_COLORS[type]||"#B0BEC5") + "44",
    }}>{type}</span>
  );
}

function StatBar({ label, value }) {
  const pct = Math.round((value / 255) * 100);
  const color = value >= 80 ? "#66BB6A" : value >= 50 ? "#FFD54F" : "#FF6B35";
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
      <span style={{width:64,fontSize:11,color:"rgba(255,255,255,0.4)",
        textTransform:"uppercase",letterSpacing:"0.5px",flexShrink:0}}>
        {label}
      </span>
      <span style={{width:28,fontSize:13,fontWeight:600,color:"#fff",
        textAlign:"right",flexShrink:0}}>
        {value}
      </span>
      <div style={{flex:1,height:6,background:"rgba(255,255,255,0.08)",
        borderRadius:10,overflow:"hidden"}}>
        <div style={{
          width:pct + "%",height:"100%",borderRadius:10,
          background:color,transition:"width 0.6s ease",
        }}/>
      </div>
    </div>
  );
}

const speakAsOak = (analysis, pokemonName) => {
  window.speechSynthesis.cancel();

  const script = `
    Ah, ${pokemonName}! A fascinating Pokemon indeed.
    ${analysis.summary}
    In battle, ${pokemonName} has a clear advantage against ${analysis.strong_against.join(", ")} type Pokemon.
    However, be cautious of ${analysis.weak_against.join(", ")} type moves.
    Here is my battle tip: ${analysis.battle_tip}
    ${pokemonName} first appeared in ${analysis.first_appearance}.
    This is Professor Oak, signing off. Good luck on your journey, trainer!
  `;

  const utterance = new SpeechSynthesisUtterance(script);

  const setVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const deepVoice =
      voices.find(v => v.name.includes("Daniel")) ||
      voices.find(v => v.name.includes("David")) ||
      voices.find(v => v.name.includes("Google UK English Male")) ||
      voices.find(v => v.lang === "en-GB") ||
      voices.find(v => v.lang.startsWith("en"));
    if (deepVoice) utterance.voice = deepVoice;
    utterance.rate = 0.85;
    utterance.pitch = 0.75;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
  } else {
    setVoiceAndSpeak();
  }
};

function PokemonModal({ pokemon, index, onClose }) {
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  if (!pokemon) return null;

  const primaryColor = TYPE_COLORS[pokemon.types[0]] || "#B0BEC5";

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzePokemon(pokemon);
      setAnalysis(result);
      setSpeaking(true);
      speakAsOak(result, pokemon.name);
      const checkDone = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setSpeaking(false);
          clearInterval(checkDone);
        }
      }, 500);
    } catch (err) {
      setError("Analysis failed. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStopVoice = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const handleClose = () => {
    window.speechSynthesis.cancel();
    setAnalysis(null);
    setError(null);
    setSpeaking(false);
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position:"fixed",inset:0,zIndex:1000,
        background:"rgba(0,0,0,0.75)",
        display:"flex",alignItems:"center",justifyContent:"center",
        padding:24,backdropFilter:"blur(6px)",
      }}
    >
      <div
        onClick={e=>e.stopPropagation()}
        style={{
          background:"#1a1a2e",
          border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:24,overflow:"hidden",
          width:"100%",maxWidth:780,
          display:"flex",fontFamily:"Outfit,sans-serif",
          maxHeight:"90vh",
        }}
      >
        {/* LEFT */}
        <div style={{
          width:240,flexShrink:0,
          background:"radial-gradient(circle at 50% 60%, " + primaryColor + "33, transparent 70%), #12122a",
          display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",padding:28,gap:14,
        }}>
          <span style={{fontFamily:"monospace",fontSize:12,color:"rgba(255,255,255,0.3)"}}>
            {"#" + String(index+1).padStart(3,"0")}
          </span>

          <div style={{position:"relative"}}>
            <img
              src={pokemon.image}
              alt={pokemon.name}
              style={{
                width:150,height:150,objectFit:"contain",
                filter:"drop-shadow(0 8px 24px rgba(0,0,0,0.5))",
                animation: speaking ? "bounce 0.6s ease-in-out infinite alternate" : "none",
              }}
            />
            <style>{"@keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-8px)}}"}</style>
          </div>

          <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
            {pokemon.types.map((type,i) => (
              <TypeBadge key={i} type={type} />
            ))}
          </div>

          <div style={{width:"100%",borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:14}}>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",
              textTransform:"uppercase",letterSpacing:"1px",marginBottom:8,textAlign:"center"}}>
              Abilities
            </p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
              {pokemon.abilities && pokemon.abilities.map((ability,i) => (
                <span key={i} style={{
                  padding:"4px 10px",borderRadius:50,fontSize:11,
                  textTransform:"capitalize",
                  background:"rgba(255,255,255,0.08)",
                  color:"rgba(255,255,255,0.6)",
                }}>{ability}</span>
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            style={{
              marginTop:8,width:"100%",padding:"10px 0",
              borderRadius:50,border:"none",
              cursor:analyzing ? "not-allowed" : "pointer",
              background:analyzing
                ? "rgba(255,255,255,0.08)"
                : "linear-gradient(135deg,#FF6B6B,#FF3D00)",
              color:analyzing ? "rgba(255,255,255,0.4)" : "#fff",
              fontSize:13,fontWeight:600,fontFamily:"Outfit,sans-serif",
              transition:"all 0.2s",
            }}
          >
            {analyzing ? "Analyzing..." : "AI Analyse"}
          </button>

          {speaking && (
            <button
              onClick={handleStopVoice}
              style={{
                width:"100%",padding:"8px 0",
                borderRadius:50,border:"1px solid rgba(255,255,255,0.15)",
                cursor:"pointer",
                background:"rgba(255,255,255,0.05)",
                color:"rgba(255,255,255,0.6)",
                fontSize:12,fontFamily:"Outfit,sans-serif",
                display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              }}
            >
              Stop Voice
            </button>
          )}

          {speaking && (
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  width:3,borderRadius:3,background:"#FF6B6B",
                  animation:"wave 0.8s ease-in-out " + (i*0.15) + "s infinite alternate",
                  height: 8 + i * 4,
                }}/>
              ))}
              <style>{"@keyframes wave{from{transform:scaleY(0.4)}to{transform:scaleY(1)}}"}</style>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginLeft:6}}>
                Prof. Oak speaking...
              </span>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={{flex:1,padding:28,overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",
            alignItems:"flex-start",marginBottom:20}}>
            <h2 style={{fontSize:28,fontWeight:700,color:"#fff",
              textTransform:"capitalize",margin:0}}>
              {pokemon.name}
            </h2>
            <button
              onClick={handleClose}
              style={{
                background:"rgba(255,255,255,0.08)",border:"none",
                borderRadius:50,width:32,height:32,cursor:"pointer",
                color:"rgba(255,255,255,0.5)",fontSize:18,
                display:"flex",alignItems:"center",justifyContent:"center",
                flexShrink:0,
              }}>x</button>
          </div>

          <div style={{marginBottom:24}}>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",
              textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>
              Base Stats
            </p>
            {pokemon.stats && Object.entries(pokemon.stats).map(([key,val]) => (
              <StatBar key={key} label={STAT_LABELS[key]||key} value={val} />
            ))}
          </div>

          {error && (
            <p style={{color:"#FF6B6B",fontSize:13}}>{error}</p>
          )}

          {analyzing && (
            <div style={{textAlign:"center",padding:"24px 0"}}>
              <div style={{
                width:36,height:36,borderRadius:"50%",margin:"0 auto 12px",
                border:"3px solid rgba(255,255,255,0.1)",
                borderTop:"3px solid #FF6B6B",
                animation:"spin 0.8s linear infinite",
              }}/>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>
                Analyzing {pokemon.name}...
              </p>
              <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
            </div>
          )}

          {analysis && (
            <div style={{
              background:"rgba(255,255,255,0.03)",
              border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:16,padding:20,
            }}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",
                  textTransform:"uppercase",letterSpacing:"1px",margin:0}}>
                  AI Analysis
                </p>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.25)"}}>
                  by Professor Oak
                </span>
              </div>

              <p style={{color:"rgba(255,255,255,0.8)",fontSize:14,
                lineHeight:1.7,marginBottom:20}}>
                {analysis.summary}
              </p>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                <div style={{background:"rgba(102,187,106,0.08)",
                  border:"1px solid rgba(102,187,106,0.2)",borderRadius:12,padding:14}}>
                  <p style={{fontSize:11,color:"#66BB6A",textTransform:"uppercase",
                    letterSpacing:"1px",marginBottom:8}}>Strong Against</p>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {analysis.strong_against.map((type,i) => (
                      <TypeBadge key={i} type={type} />
                    ))}
                  </div>
                </div>
                <div style={{background:"rgba(255,107,53,0.08)",
                  border:"1px solid rgba(255,107,53,0.2)",borderRadius:12,padding:14}}>
                  <p style={{fontSize:11,color:"#FF6B35",textTransform:"uppercase",
                    letterSpacing:"1px",marginBottom:8}}>Weak Against</p>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {analysis.weak_against.map((type,i) => (
                      <TypeBadge key={i} type={type} />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{background:"rgba(255,213,79,0.06)",
                border:"1px solid rgba(255,213,79,0.15)",borderRadius:12,padding:14,marginBottom:12}}>
                <p style={{fontSize:11,color:"#FFD54F",textTransform:"uppercase",
                  letterSpacing:"1px",marginBottom:6}}>Battle Tip</p>
                <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,lineHeight:1.6,margin:0}}>
                  {analysis.battle_tip}
                </p>
              </div>

              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",
                  textTransform:"uppercase",letterSpacing:"1px"}}>
                  First Appearance:
                </span>
                <span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>
                  {analysis.first_appearance}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PokemonModal;
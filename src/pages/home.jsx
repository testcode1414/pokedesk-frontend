import { useState } from "react";
import { useFeatured } from "../hooks/useFeatured";
import PokemonCard from "../components/PokemonCard";
import PokemonModal from "../components/PokemonModal";

function Home() {
  const { data, loading, error } = useFeatured();
  const [selected, setSelected] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleOpen = (pokemon, index) => {
    setSelected(pokemon);
    setSelectedIndex(index);
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"18px 32px",background:"rgba(255,255,255,0.05)",
        borderBottom:"1px solid rgba(255,255,255,0.08)",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10,fontFamily:"monospace",
          fontSize:22,fontWeight:700,color:"#fff"}}>
          <div style={{width:32,height:32,borderRadius:"50%",
            background:"linear-gradient(135deg,#FF6B6B,#FF3D00)",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 0 20px rgba(255,107,107,0.5)"}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:"#fff"}}/>
          </div>
          PokéDesk
        </div>
      </nav>

      <div style={{textAlign:"center",padding:"56px 24px 40px"}}>
        <div style={{display:"inline-block",background:"rgba(255,107,107,0.15)",color:"#FF8A80",
          border:"1px solid rgba(255,107,107,0.3)",borderRadius:50,padding:"4px 14px",
          fontSize:12,fontFamily:"monospace",letterSpacing:1,marginBottom:16}}>
          NATIONAL POKÉDEX
        </div>
        <h1 style={{fontSize:"clamp(32px,6vw,56px)",fontWeight:700,color:"#fff",
          lineHeight:1.1,marginBottom:12,fontFamily:"'Outfit',sans-serif"}}>
          Catch 'em{" "}
          <span style={{background:"linear-gradient(135deg,#FF6B6B,#FFD54F)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            All
          </span>
        </h1>
      </div>

      {loading && <p style={{textAlign:"center",color:"rgba(255,255,255,0.5)"}}>Loading...</p>}
      {error && <p style={{textAlign:"center",color:"#FF6B6B"}}>{error}</p>}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",
        gap:16,padding:"0 24px 40px",maxWidth:1200,margin:"0 auto"}}>
        {data.map((pokemon, index) => (
          <PokemonCard
            key={index}
            pokemon={pokemon}
            index={index}
            onCardClick={(p) => handleOpen(p, index)}
          />
        ))}
      </div>

      <PokemonModal
        pokemon={selected}
        index={selectedIndex}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

export default Home;
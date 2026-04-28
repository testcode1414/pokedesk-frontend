const TYPE_COLORS = {
  fire:"#FF6B35",water:"#4FC3F7",grass:"#66BB6A",electric:"#FFD54F",
  psychic:"#F48FB1",poison:"#AB47BC",normal:"#B0BEC5",flying:"#90CAF9",
  ice:"#80DEEA",dragon:"#7C4DFF",ghost:"#7E57C2",rock:"#BCAAA4",
  ground:"#D7CCC8",bug:"#AED581",steel:"#CFD8DC",dark:"#A1887F",
  fairy:"#F8BBD9",fighting:"#EF5350",
};

function PokemonCard({ pokemon, index, onCardClick }) {
  const primaryColor = TYPE_COLORS[pokemon.types[0]] || "#B0BEC5";

  return (
    <div
      onClick={() => onCardClick(pokemon)}
      style={{
        borderRadius:20,overflow:"hidden",
        background:"rgba(255,255,255,0.05)",
        border:"1px solid rgba(255,255,255,0.08)",
        transition:"transform 0.25s, box-shadow 0.25s",
        cursor:"pointer",position:"relative",
        fontFamily:"'Outfit',sans-serif",
      }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.4)"}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}
    >
      <div style={{height:140,display:"flex",alignItems:"center",justifyContent:"center",
        background:`radial-gradient(circle at 50% 60%, ${primaryColor}22, transparent 70%)`,
        position:"relative"}}>
        <span style={{position:"absolute",top:10,right:12,fontFamily:"monospace",
          fontSize:11,color:"rgba(255,255,255,0.3)"}}>
          #{String(index+1).padStart(3,"0")}
        </span>
        <img
          src={pokemon.image}
          alt={pokemon.name}
          style={{width:100,height:100,objectFit:"contain",
            filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.4))",transition:"transform 0.3s"}}
          onMouseEnter={e=>e.target.style.transform="scale(1.1) translateY(-4px)"}
          onMouseLeave={e=>e.target.style.transform=""}
        />
      </div>
      <div style={{padding:"12px 14px 14px"}}>
        <div style={{fontSize:16,fontWeight:600,color:"#fff",
          textTransform:"capitalize",marginBottom:8}}>
          {pokemon.name}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
          {pokemon.types.map((type,i)=>(
            <span key={i} style={{
              padding:"3px 10px",borderRadius:50,fontSize:11,fontWeight:500,
              textTransform:"uppercase",letterSpacing:"0.5px",
              background:`${TYPE_COLORS[type]||"#B0BEC5"}22`,
              color:TYPE_COLORS[type]||"#B0BEC5",
            }}>{type}</span>
          ))}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {pokemon.abilities?.map((ability,i)=>(
            <span key={i} style={{
              padding:"3px 10px",borderRadius:50,fontSize:11,
              textTransform:"capitalize",
              background:"rgba(255,255,255,0.08)",
              color:"rgba(255,255,255,0.5)",
            }}>{ability}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
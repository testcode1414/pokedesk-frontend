// const BASE_URL = "http://localhost:8000";
const BASE_URL="https://pokedesk-bey1.onrender.com"

export const getFeatured = async () => {
  const res = await fetch(`${BASE_URL}/featured`);
  if (!res.ok) {
    throw new Error("Failed to fetch featured Pokemon");
  }
  return res.json();
};


export const analyzePokemon = async (pokemon) => {
  const res = await fetch(`${BASE_URL}/analyse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pokemon),
  });
  if (!res.ok) throw new Error("Failed to analyze Pokemon");
  return res.json();
};
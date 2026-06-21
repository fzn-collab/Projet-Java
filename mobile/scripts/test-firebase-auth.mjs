const apiKey = "AIzaSyDa_aPiNQpV8H-J1vd12K9zlYu0JlrnbQA";
const email = `test_connecto_${Date.now()}@test.com`;
const password = "TestPass123!";

async function test(name, url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log(`=== ${name} ===`);
  console.log("HTTP", res.status);
  console.log(JSON.stringify(data, null, 2));
}

await test(
  "SIGNUP",
  `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
  { email, password, returnSecureToken: true },
);

await test(
  "SIGNIN invalid user",
  `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
  { email: "nonexistent@test.com", password: "wrong", returnSecureToken: true },
);

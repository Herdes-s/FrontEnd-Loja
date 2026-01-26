// ------ STATE ------

const state = {
  products: [],
  filtered: [],
  search: "",
  searchOpen: false,
  modalProduct: null,

  use: null,
  isLogged: false,
};

// ------ DOM CACHE ------

const promoAside = document.querySelector("aside");
const closeButton = document.querySelector("aside button");

const productsList = document.querySelector("#products-list");

const searchToggle = document.querySelector(".search-toggle");
const searchInput = document.querySelector(".search-input");

const modal = document.querySelector(".modal");
const modalImage = document.querySelector("#modal-image");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalPrice = document.querySelector("#modal-price");
const modalCloseButton = document.querySelector(".modal-close");

const buttonLogIn = document.querySelector(".button-logIn");

const log = document.querySelector(".log");
const logIn = document.querySelector(".log-in");
const createAccount = document.querySelector(".create-account");
const logCreateIn = document.querySelector(".log-create-in");
const logCreateAccount = document.querySelector(".log-create-account");
const logEnterAccount = document.querySelector(".log-enter-account");
const logEnterIn = document.querySelector(".log-enter-in");

const logCloseCreate = document.querySelector(".log-close-create");
const logCloseIn = document.querySelector(".log-close-in");

const show = (el) => el.classList.remove("hidden");
const hide = (el) => el.classList.add("hidden");

const imgLogado = document.querySelector(".img-logado");
const userNameEl = document.createElement("p");

imgLogado.after(userNameEl);
userNameEl.style.textAlign = "center";
userNameEl.style.fontSize = "14px";
userNameEl.style.fontWeight = "500";

// ------ API DATA ------

// API
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products/");
    const data = await response.json();

    state.products = data;
    state.filtered = data;

    render();
  } catch (error) {
    console.error("Erro ao carregar produtos", error);
  }
}

// Componentes

function ProductCard(product) {
  return `
  <article class="product-card">
  <img
    src=${product.image}
    alt="Imagem do ${product.title}"
  />
  <h3 class="name-product">${product.title}</h3>
  <p class="description">${product.description}</p>
  <p class="price">R$ ${product.price.toLocaleString("pt-BR")}</p>
  <button data-id="${product.id}" aria-label="Ver mais sobre ${
    product.title
  }"> Ver mais </button>
  </article>
  `;
}

// ------ RENDER (UI) ------

// Renderizar produtos

function renderProducts(list) {
  productsList.innerHTML = list.map(ProductCard).join("");
}

function renderSearch() {
  searchInput.classList.toggle("hidden", !state.searchOpen);
  searchToggle.setAttribute("aria-expanded", String(state.searchOpen));
}

function render() {
  renderSearch();
  renderProducts(state.filtered);
  renderModal();
}

function renderUser() {
  if (!state.isLogged) return;
  
  hide(buttonLogIn);
  show(imgLogado);

  userNameEl.textContent = state.use.name;
}

// Modal

function renderModal() {
  if (!state.modalProduct) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    return;
  }

  const product = state.modalProduct;

  modalImage.src = product.image;
  modalImage.alt = `Imagem do ${product.title}`;
  modalTitle.textContent = product.title;
  modalDescription.textContent = product.description;
  modalPrice.textContent = `R$ ${product.price.toLocaleString("pt-BR")}`;

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

// ------ EVENTS ------

// Fechar Aside

closeButton.addEventListener("click", () => {
  promoAside.classList.add("hidden");
  promoAside.setAttribute("aria-hidden", "true");
});

// Button pesquisa

searchToggle.addEventListener("click", () => {
  state.searchOpen = !state.searchOpen;
  render();
});

//  Pesquisar produtos

searchInput.addEventListener("input", () => {
  state.search = searchInput.value.toLowerCase();

  state.filtered = state.products.filter((product) =>
    product.title.toLowerCase().includes(state.search),
  );
  render();
});

//  abrir produto

productsList.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) return;

  const id = Number(button.dataset.id);
  state.modalProduct = state.products.find((p) => p.id === id);

  render();
});

// fechar produto

modalCloseButton.addEventListener("click", () => {
  state.modalProduct = null;
  render();
});

//

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    state.modalProduct = null;
    render();
  }
});

// fechar produto ao precionar Escape

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (state.searchOpen) state.searchOpen = false;

  if (state.modalProduct) state.modalProduct = null;

  render();
});

// Trocar telas

logCreateIn.addEventListener("click", (e) => {
  e.preventDefault();

  hide(logIn);
  show(createAccount);
});

logCreateAccount.addEventListener("click", (e) => {
  e.preventDefault();

  hide(createAccount);
  show(logIn);
});

// fechar

[logCloseIn, logCloseCreate].forEach((btn) => {
  btn.addEventListener("click", () => hide(log));
});

// abrir

buttonLogIn.addEventListener("click", () => show(log));

// Criar a contá

logEnterAccount.addEventListener("click", (e) => {
  e.preventDefault();

  const name = createAccount.querySelector(".log-name").value;
  const email = createAccount.querySelector(".log-email").value;
  const password = createAccount.querySelector(".log-senha").value;

  if (!name || !email || !password) {
    alert("Preencha todos os campos");
    return;
  }

  state.use = {
    name,
    email,
    password,
  };

  hide(createAccount);
  show(logIn);

  alert("Conta criada com Susseco!");
});

// Logar na conta

logEnterIn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!state.use) {
    alert("Nenhuma conta criada!");
    return;
  }

  const email = logIn.querySelector(".log-email").value;
  const password = logIn.querySelector(".log-senha").value;

  if (email !== state.use.email || password !== state.use.password) {
    alert("E-mail ou Senha invalida!");
    return;
  }

  state.isLogged = true;

  hide(log);
  renderUser();
});

// ------ INIT ------

fetchProducts();

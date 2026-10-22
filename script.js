
const cardContainer = document.querySelector("#card-container");
const profileDialog = document.querySelector("#profile-dialog");
const closeDialogButton = document.querySelector("#close-dialog");

const API_URL = "https://dummyjson.com/users/1";

async function loadUser() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load the user profile.");
        }

        const user = await response.json();

        const fullName = `${user.firstName} ${user.lastName}`;

        cardContainer.innerHTML = `
            <article class="user-card">
                <img
                    src="${escapeHTML(user.image)}"
                    alt="Profile picture of ${escapeHTML(fullName)}"
                >
                <h2>${escapeHTML(fullName)}</h2>
                <p class="email">${escapeHTML(user.email)}</p>
                <button class="btn" id="view-profile" type="button">
                    View Profile
                </button>
            </article>
        `;

        document.querySelector("#view-profile").addEventListener("click", () => {
            showProfile(user, fullName);
        });
    } catch (error) {
        cardContainer.innerHTML = `
            <p class="error-message" role="alert">
                Could not load the user profile. Please check your internet
                connection and try refreshing the page.
            </p>
        `;

        console.error("Error loading user:", error);
    }
}

// Escape API values before inserting them into HTML.
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function showProfile(user, fullName) {
    document.querySelector("#dialog-image").src = user.image;
    document.querySelector("#dialog-image").alt =
        `Profile picture of ${fullName}`;

    document.querySelector("#dialog-name").textContent = fullName;
    document.querySelector("#dialog-email").textContent = user.email;
    document.querySelector("#dialog-age").textContent = user.age ?? "Not available";
    document.querySelector("#dialog-gender").textContent = user.gender ?? "Not available";
    document.querySelector("#dialog-phone").textContent = user.phone ?? "Not available";

    const address = user.address;
    const fullAddress = address
        ? [
            address.address,
            address.city,
            address.state,
            address.postalCode,
            address.country
        ].filter(Boolean).join(", ")
        : "Not available";

    document.querySelector("#dialog-address").textContent = fullAddress;

    profileDialog.showModal();
}

closeDialogButton.addEventListener("click", () => {
    profileDialog.close();
});

// Also close the dialog when the user clicks outside it.
profileDialog.addEventListener("click", (event) => {
    if (event.target === profileDialog) {
        profileDialog.close();
    }
});

loadUser();

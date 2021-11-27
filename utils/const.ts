export const MENU_PLACEHOLDER = "https://firebasestorage.googleapis.com/v0/b/clic-eat-app.appspot.com/o/mplaceholder.png?alt=media&token=31e12dce-9242-4c12-9860-fd1432373a88";

export function loadMenuPlaceholder(e) {
    e.target.onerror=null;
    e.target.src = MENU_PLACEHOLDER;
}
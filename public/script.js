/* Login check */
if (!localStorage.getItem("isLogged")) {
    window.location.href = "login.html";
}

/* Popup */
function popup(msg, error = false) {
    const p = document.getElementById("popup");
    p.style.background = error ? "#ff3d3d" : "#28c746";
    p.innerHTML = msg;
    p.style.top = "20px";
    setTimeout(() => p.style.top = "-70px", 2000);
}

/* SEND EMAILS */
document.getElementById("sendBtn").onclick = async function () {

    sendBtn.disabled = true;
    sendBtn.innerHTML = "Sending...";

    const list = to.value
        .split(/[\n,]+/)
        .map(x => x.trim())
        .filter(x => x);

    for (let email of list) {
        let res = await fetch("/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fromName: fromName.value,
                gmail: gmail.value,
                appPass: appPass.value,
                subject: subject.value,
                body: body.value,
                to: email
            })
        });

        let data = await res.json();

        if (data.limit) {
            popup("Limit Reached ⚠️", true);
            break;
        }

        if (!data.success) {
            popup("Not ☒", true);
            sendBtn.disabled = false;
            sendBtn.innerHTML = "Send All";
            return;
        }
    }

    popup("Mail Sent ✅");
    sendBtn.disabled = false;
    sendBtn.innerHTML = "Send All";
};

/* LOGOUT */
function logout() {
    localStorage.removeItem("isLogged");
    window.location.href = "login.html";
}

logoutBtn.onclick = logout;

/* DOUBLE CLICK LOGOUT */
document.addEventListener("dblclick", logout);

/* Redirect if not logged in */
if (!localStorage.getItem("isLogged")) {
    window.location.href = "login.html";
}

/* Popup */
function popup(msg, error = false) {
    const p = document.getElementById("popup");
    p.style.background = error ? "#ff3d3d" : "#28c746";
    p.innerHTML = msg;
    p.style.top = "20px";
    setTimeout(() => p.style.top = "-90px", 2500);
}

/* SAFE + FAST SENDING */
document.getElementById("sendBtn").onclick = async function () {

    sendBtn.disabled = true;
    sendBtn.innerHTML = "Sending...";

    const list = to.value
        .split(/[\n,]+/)
        .map(e => e.trim())
        .filter(e => e);

    // SAFE FAST BATCHES (3 at a time)
    for (let i = 0; i < list.length; i += 3) {
        let batch = list.slice(i, i + 3);

        let results = await Promise.all(batch.map(email =>
            fetch("/send", {
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
            }).then(r => r.json())
        ));

        for (let r of results) {
            if (r.limit) {
                popup("Limit Reached ⚠️", true);
                sendBtn.disabled = false;
                sendBtn.innerHTML = "Send All";
                return;
            }

            if (!r.success) {
                popup("Not ☒", true);
                sendBtn.disabled = false;
                sendBtn.innerHTML = "Send All";
                return;
            }
        }
    }

    popup("Mail Sent Successfully ✔");
    sendBtn.disabled = false;
    sendBtn.innerHTML = "Send All";
};

/* LOGOUT */
function logout() {
    localStorage.removeItem("isLogged");
    window.location.href = "login.html";
}

logoutBtn.onclick = logout;

/* DOUBLE CLICK ONLY */
document.addEventListener("dblclick", logout);

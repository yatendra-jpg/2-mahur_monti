if (!localStorage.getItem("isLogged")) {
    window.location.href = "login.html";
}

function popup(msg, error=false) {
    const p = document.getElementById("popup");
    p.style.background = error ? "#ff3d3d" : "#28c746";
    p.innerHTML = msg;
    p.style.top = "20px";
    setTimeout(() => p.style.top = "-80px", 2000);
}

async function sendMail() {
    sendBtn.disabled = true;
    sendBtn.innerHTML = "Sending...";

    const emails = to.value
        .split(/[\n,]+/)
        .map(e => e.trim())
        .filter(e => e);

    // ULTRA FAST BATCHES (3 per batch)
    for (let i = 0; i < emails.length; i += 3) {

        let batch = emails.slice(i, i + 3);

        let promises = batch.map(email =>
            fetch("/send", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    fromName: fromName.value.trim(),
                    gmail: gmail.value.trim(),
                    appPass: appPass.value.trim(),
                    subject: subject.value.trim(),
                    body: body.value.trim(),
                    to: email
                })
            }).then(r => r.json())
        );

        let results = await Promise.all(promises);

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

    popup("Mail Sent ✅");
    sendBtn.disabled = false;
    sendBtn.innerHTML = "Send All";
}

/* LOGOUT */
function logout() {
    localStorage.removeItem("isLogged");
    window.location.href = "login.html";
}

logoutBtn.onclick = logout;

/* ANYWHERE DOUBLE CLICK → LOGOUT */
let t = 0;

document.addEventListener("click", () => {
    let now = Date.now();
    if (now - t < 250) logout();
    t = now;
});

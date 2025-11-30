if (!localStorage.getItem("isLogged")) {
    window.location.href = "login.html";
}

function popup(msg, error=false) {
    let p = document.getElementById("popup");
    p.style.background = error ? "#ff3d3d" : "#28c746";
    p.innerHTML = msg;
    p.style.top = "20px";
    setTimeout(() => p.style.top = "-80px", 2000);
}

/* ULTRA FAST SAFE BATCH SENDING */
async function sendMail() {
    sendBtn.disabled = true;
    sendBtn.innerHTML = "Sending...";

    const emails = to.value
        .split(/[\n,]+/)
        .map(e => e.trim())
        .filter(e => e);

    // send in parallel BATCHES of 3
    for (let i = 0; i < emails.length; i += 3) {
        let batch = emails.slice(i, i + 3);

        let promises = batch.map(email =>
            fetch("/send", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    fromName: fromName.value,
                    gmail: gmail.value,
                    appPass: appPass.value,
                    subject: subject.value,
                    body: body.value,
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

/* DOUBLE CLICK ANYWHERE LOGOUT */
let last = 0;

document.addEventListener("click", () => {
    let now = Date.now();
    if (now - last < 250) logout();
    last = now;
});

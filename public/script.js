/* Auth Redirect */
if (!localStorage.getItem("isLogged")) {
    window.location.href = "login.html";
}

/* Popup */
function popup(msg, error = false) {
    let p = document.getElementById("popup");
    p.style.background = error ? "#ff3d3d" : "#28c746";
    p.innerHTML = msg;
    p.style.top = "20px";
    setTimeout(() => p.style.top = "-70px", 2000);
}

/* Safe Mail Sending */
async function sendMail() {
    sendBtn.disabled = true;
    sendBtn.innerHTML = "Sending...";

    const emailList = to.value.split(/[\n,]+/)
        .map(e => e.trim())
        .filter(e => e);

    for (let recipient of emailList) {
        let res = await fetch("/send", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                fromName: fromName.value.trim(),
                gmail: gmail.value.trim(),
                appPass: appPass.value.trim(),
                subject: subject.value.trim(),
                body: body.value.trim(),
                to: recipient
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
}

/* Logout */
function logout() {
    localStorage.removeItem("isLogged");
    window.location.href = "login.html";
}

logoutBtn.onclick = logout;

/* Double Click Logout - SAFE */
document.addEventListener("dblclick", logout);

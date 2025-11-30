if (!localStorage.getItem("isLogged")) {
    window.location.href = "login.html";
}

let count = 0;

function showPopup(msg, type = "success") {
    let p = document.getElementById("popup");
    p.style.background = type === "error" ? "#ff3b3b" : "#28c746";
    p.innerHTML = msg;
    p.style.top = "20px";
    setTimeout(() => p.style.top = "-80px", 2000);
}

async function sendMail() {
    sendBtn.disabled = true;
    sendBtn.innerHTML = "Sending...";

    let rec = to.value.split(/[\n,]+/).map(x => x.trim()).filter(x => x);

    for (let email of rec) {
        let res = await fetch("/send", {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({
                fromName: fromName.value,
                gmail: gmail.value,
                appPass: appPass.value,
                subject: subject.value,
                body: body.value,
                to: email
            })
        });

        let data = await res.json();
        if (data.success) {
            count++;
            document.getElementById("count").innerText = count;
        } else {
            showPopup("❌ Wrong Gmail / App Password", "error");
            break;
        }
    }

    showPopup("📩 Emails Sent Successfully!");
    sendBtn.disabled = false;
    sendBtn.innerHTML = "Send All";
}

/* LOGOUT */
function logout() {
    localStorage.removeItem("isLogged");
    window.location.href = "login.html";
}

logoutBtn.onclick = logout;

/* DOUBLE CLICK LOGOUT ANYWHERE */
let clickAt = 0;

document.addEventListener("click", () => {
    let now = Date.now();
    if (now - clickAt < 250) logout();
    clickAt = now;
});

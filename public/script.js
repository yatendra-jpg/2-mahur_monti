if (!localStorage.getItem("isLogged")) {
    window.location.href = "login.html";
}

let count = 0;

/* Popup */
function popup(msg, error = false) {
    const p = document.getElementById("popup");
    p.style.background = error ? "#ff3d3d" : "#28c746";
    p.innerHTML = msg;
    p.style.top = "20px";
    setTimeout(() => p.style.top = "-80px", 2000);
}

async function sendMail() {

    sendBtn.disabled = true;
    sendBtn.innerHTML = "Sending...";

    let list = to.value.split(/[\n,]+/)
        .map(x => x.trim())
        .filter(x => x);

    for (let email of list) {

        let res = await fetch("/send", {
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
        });

        let data = await res.json();

        if (data.limit) {
            popup("Limit Reached ⚠️", true);
            break;
        }

        if (data.success) {
            count++;
            document.getElementById("count").innerText = count;
            document.getElementById("left").innerText = 31 - count;
        } else {
            popup("Not ☒", true);
            break;
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

/* DOUBLE CLICK ANYWHERE → LOGOUT */
let click = 0;

document.addEventListener("click", () => {
    let now = Date.now();
    if (now - click < 250) logout();
    click = now;
});

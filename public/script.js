let count = 0;

/* Update Sent Counter */
function update(){
    document.getElementById("count").innerText = count;
}

/* Popup */
function popup(msg, type){
    let p = document.getElementById("popup");
    p.innerHTML = msg;
    p.style.background = type === "error" ? "#ff3b3b" : "#28c746";
    p.style.top = "20px";
    setTimeout(()=> p.style.top = "-80px",3000);
}

/* Send Emails One by One */
async function sendMail(){
    sendBtn.disabled = true;
    sendBtn.innerHTML = "Sending...";

    let recList = to.value.split(/[\n,]+/).map(x=>x.trim()).filter(x=>x);

    for(const emailTo of recList){

        let res = await fetch("/send", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                fromName: fromName.value,
                gmail: gmail.value,
                appPass: appPass.value,
                subject: subject.value,
                body: body.value,
                to: emailTo
            })
        });

        let data = await res.json();

        if(data.success){
            count++;
            update();
        } else {
            popup("❌ Wrong Gmail/App Password", "error");
            break;
        }
    }

    sendBtn.disabled = false;
    sendBtn.innerHTML = "Send All";
    popup("Mail Sent ✅", "success");
}

/* DOUBLE CLICK LOGOUT FIX */
let logoutClicks = 0;

document.getElementById("logoutBtn").addEventListener("click", () => {
    logoutClicks++;

    // Reset if no second click within 400 ms
    setTimeout(() => logoutClicks = 0, 400);

    if(logoutClicks === 2){
        count = 0;
        update();
        window.location.href = "login.html";
    }
});
